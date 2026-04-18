from datetime import datetime
from typing import Optional
import io
import csv

from fastapi import APIRouter, Depends, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_db
from app.core.censorship import censor_audit_log
from app.core.permissions import require_permission
from app.core.utils import fetch_users_by_ids
from app.crud import crud_audit
from app.models.user import User, UserRole
from app.schemas.audit_log import AuditLogResponse
from app.schemas.common import ok
from app.models.audit_log import AuditLog
from app.models.patient import Patient as PatientModel

router = APIRouter()


@router.get("", status_code=status.HTTP_200_OK)
async def list_audit_logs(
    include_user_ids: Optional[list[str]] = Query(default=None),
    exclude_user_ids: Optional[list[str]] = Query(default=None),
    include_resources: Optional[list[str]] = Query(default=None),
    exclude_resources: Optional[list[str]] = Query(default=None),
    include_actions: Optional[list[str]] = Query(default=None),
    exclude_actions: Optional[list[str]] = Query(default=None),
    start_date: Optional[datetime] = Query(default=None),
    end_date: Optional[datetime] = Query(default=None),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=50, ge=1, le=500),
    search: Optional[str] = Query(default=None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("canViewAuditLog")),
):
    skip = (page - 1) * limit
    
    count_query = select(func.count(AuditLog.id))
    
    if search:
        s = f"%{search}%"
        count_query = count_query.where(
            or_(
                AuditLog.action.ilike(s),
                AuditLog.resource.ilike(s),
                AuditLog.details.ilike(s)
            )
        )

    if include_user_ids:
        count_query = count_query.where(AuditLog.user_id.in_(include_user_ids))
    if start_date:
        count_query = count_query.where(AuditLog.timestamp >= start_date)
    if end_date:
        count_query = count_query.where(AuditLog.timestamp <= end_date)
    
    count_result = await db.execute(count_query)
    total_count = count_result.scalar_one()

    logs = await crud_audit.list_audit_logs(
        db,
        include_user_ids=include_user_ids,
        exclude_user_ids=exclude_user_ids,
        include_resources=include_resources,
        exclude_resources=exclude_resources,
        include_actions=include_actions,
        exclude_actions=exclude_actions,
        start_date=start_date,
        end_date=end_date,
        search=search,
        skip=skip,
        limit=limit,
    )

    user_map = await fetch_users_by_ids(db, {log.user_id for log in logs if log.user_id})

    patient_ids = {log.resource_id for log in logs if log.resource == "patient" and log.resource_id}
    patient_map: dict[str, tuple[str, str]] = {} # id -> (name, readable_id)
    if patient_ids:
        result = await db.execute(
            select(PatientModel.id, PatientModel.name, PatientModel.patient_id)
            .where(PatientModel.id.in_(patient_ids))
        )
        for pid, name, rid in result.all():
            patient_map[str(pid)] = (name, rid)

    enriched = []
    for log in logs:
        display_details = log.details or ""
        if log.resource == "patient" and log.resource_id in patient_map:
            name, rid = patient_map[log.resource_id]
            if log.resource_id:
                display_details = display_details.replace(log.resource_id, f"{name} ({rid})")
            if not display_details or (log.resource_id and log.resource_id not in display_details):
                 display_details = f"{display_details} [Patient: {name} ({rid})]".strip()

        data = AuditLogResponse(
            id=log.id,
            user_id=log.user_id,
            action=log.action,
            resource=log.resource,
            resource_id=log.resource_id,
            details=display_details,
            timestamp=log.timestamp,
        ).model_dump(mode="json", by_alias=True)
        
        if log.user_id:
            if log.user_id in user_map:
                u = user_map[log.user_id]
                data["userName"] = u.name
                data["userRole"] = u.role.value
            else:
                data["userName"] = "Former User"
                data["userRole"] = UserRole.auditor.value
        else:
            data["userName"] = "System"
            data["userRole"] = UserRole.auditor.value
            
        enriched.append(data)

    censored = censor_audit_log(current_user, enriched)

    return ok({
        "items": censored,
        "total": total_count,
        "page": page,
        "limit": limit,
        "pages": (total_count + limit - 1) // limit
    })


@router.get("/export", status_code=status.HTTP_200_OK)
async def export_audit_logs(
    reason: str = Query(..., min_length=10),
    include_user_ids: Optional[list[str]] = Query(default=None),
    include_resources: Optional[list[str]] = Query(default=None),
    include_actions: Optional[list[str]] = Query(default=None),
    start_date: Optional[datetime] = Query(default=None),
    end_date: Optional[datetime] = Query(default=None),
    search: Optional[str] = Query(default=None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("canViewAuditLog")),
):
    await crud_audit.create_audit_log(
        db,
        user_id=current_user.id,
        action="EXPORT_AUDIT_DATA",
        resource="audit_log",
        details=f"Exported filtered audit logs. Reason: {reason}"
    )

    logs = await crud_audit.list_audit_logs(
        db,
        include_user_ids=include_user_ids,
        include_resources=include_resources,
        include_actions=include_actions,
        start_date=start_date,
        end_date=end_date,
        search=search,
        limit=None,
    )

    user_ids = {log.user_id for log in logs if log.user_id}
    user_map = {}
    if user_ids:
        u_res = await db.execute(select(User.id, User.name).where(User.id.in_(user_ids)))
        user_map = {u.id: u.name for u in u_res.all()}

    log_data = [
        {
            "timestamp": log.timestamp,
            "user_id": log.user_id,
            "action": log.action,
            "resource": log.resource,
            "resource_id": log.resource_id,
            "details": log.details
        }
        for log in logs
    ]
    censored_logs = censor_audit_log(current_user, log_data)

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Timestamp", "Actor", "Action", "Resource", "Resource ID", "Details"])

    for log in censored_logs:
        writer.writerow([
            log["timestamp"].strftime("%Y-%m-%d %H:%M:%S") if log["timestamp"] else "",
            user_map.get(log["user_id"]) if log["user_id"] else "System",
            log["action"],
            log["resource"],
            log["resource_id"] or "N/A",
            log["details"]
        ])

    output.seek(0)
    filename = f"audit_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.get("/filters", status_code=status.HTTP_200_OK)
async def get_audit_log_filters(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("canViewAuditLog")),
):
    actions_result = await db.execute(select(AuditLog.action).distinct())
    resources_result = await db.execute(select(AuditLog.resource).distinct())
    
    user_ids_result = await db.execute(select(AuditLog.user_id).distinct())
    user_ids = [uid for uid in user_ids_result.scalars() if uid]
    
    user_list = []
    if user_ids:
        users = await db.execute(select(User.id, User.name).where(User.id.in_(user_ids)))
        user_list = [{"id": u.id, "name": u.name} for u in users.all()]

    return ok({
        "actions": [a for a in actions_result.scalars() if a],
        "resources": [r for r in resources_result.scalars() if r],
        "users": user_list
    })
