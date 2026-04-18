import uuid
from datetime import datetime
from typing import Optional, Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.audit_log import AuditLog


async def create_audit_log(
    db: AsyncSession,
    user_id: Optional[str],
    action: str,
    resource: str,
    resource_id: Optional[str] = None,
    details: Optional[str] = None,
) -> AuditLog:
    entry = AuditLog(
        id=str(uuid.uuid4()),
        user_id=user_id,
        action=action,
        resource=resource,
        resource_id=resource_id,
        details=details,
    )
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


async def list_audit_logs(
    db: AsyncSession,
    include_user_ids: Optional[list[str]] = None,
    exclude_user_ids: Optional[list[str]] = None,
    include_resources: Optional[list[str]] = None,
    exclude_resources: Optional[list[str]] = None,
    include_actions: Optional[list[str]] = None,
    exclude_actions: Optional[list[str]] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: Optional[int] = 100,
) -> Sequence[AuditLog]:
    from sqlalchemy import or_
    query = select(AuditLog)
    
    if search:
        search_fmt = f"%{search}%"
        query = query.where(
            or_(
                AuditLog.action.ilike(search_fmt),
                AuditLog.resource.ilike(search_fmt),
                AuditLog.details.ilike(search_fmt),
            )
        )
    if include_user_ids:
        query = query.where(AuditLog.user_id.in_(include_user_ids))
    if exclude_user_ids:
        query = query.where(~AuditLog.user_id.in_(exclude_user_ids))
        
    if include_resources:
        query = query.where(AuditLog.resource.in_(include_resources))
    if exclude_resources:
        query = query.where(~AuditLog.resource.in_(exclude_resources))
        
    if include_actions:
        query = query.where(AuditLog.action.in_(include_actions))
    if exclude_actions:
        query = query.where(~AuditLog.action.in_(exclude_actions))

    if start_date:
        query = query.where(AuditLog.timestamp >= start_date)
    if end_date:
        query = query.where(AuditLog.timestamp <= end_date)
        
    query = query.order_by(AuditLog.timestamp.desc()).offset(skip)
    if limit:
        query = query.limit(limit)
        
    result = await db.execute(query)
    return result.scalars().all()


async def archive_old_logs(db: AsyncSession, older_than: datetime) -> int:
    """
    Moves logs older than the specified date to the archive table.
    Returns the number of records archived.
    """
    from sqlalchemy import delete, insert
    from app.models.audit_log import AuditLogArchive

    query = select(AuditLog).where(AuditLog.timestamp < older_than)
    result = await db.execute(query)
    records = result.scalars().all()

    if not records:
        return 0

    archive_data = [
        {
            "id": r.id,
            "user_id": r.user_id,
            "action": r.action,
            "resource": r.resource,
            "resource_id": r.resource_id,
            "details": r.details,
            "timestamp": r.timestamp,
        }
        for r in records
    ]
    
    await db.execute(insert(AuditLogArchive), archive_data)

    ids_to_delete = [r.id for r in records]
    await db.execute(delete(AuditLog).where(AuditLog.id.in_(ids_to_delete)))
    
    await db.commit()
    return len(records)
