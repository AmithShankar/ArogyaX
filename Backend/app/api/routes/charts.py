from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.censorship import censor_clinical_data
from app.api.dependencies import get_db
from app.core.permissions import require_permission
from app.core.rate_limit import UPLOAD_LIMIT, rate_limit_dependency
from app.core.utils import fetch_users_by_ids
from app.crud import crud_chart, crud_patient
from app.models.user import User
from app.models.chart_entry import ChartType
from app.schemas.chart_entry import ChartEntryCreate, ChartEntryResponse
from app.schemas.common import ok
from app.services import file_service

router = APIRouter()


def _enrich_entry(entry, user_map: dict) -> dict:
    """Attach userName and userRole from user_map to a chart entry dict."""
    data = ChartEntryResponse(
        id=entry.id,
        patient_id=entry.patient_id,
        user_id=entry.user_id,
        comments=entry.comments,
        type=entry.type,
        upload=entry.upload_url,
        created_dt=entry.created_dt,
    ).model_dump(mode="json", by_alias=True)
    if entry.user_id in user_map:
        u = user_map[entry.user_id]
        data["userName"] = u.name
        data["userRole"] = u.role.value
    return data


@router.get("", status_code=status.HTTP_200_OK)
async def list_charts(
    patient_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("canViewCharting")),
):
    patient = await crud_patient.get_patient(db, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    entries = await crud_chart.list_chart_entries(db, patient_id)

    user_map = await fetch_users_by_ids(db, {e.user_id for e in entries})

    data = [_enrich_entry(e, user_map) for e in entries]
    return ok(censor_clinical_data(current_user, data))


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_chart_entry(
    request: Request,
    patient_id: str,
    entry_in: ChartEntryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("canEditCharting")),
):
    patient = await crud_patient.get_patient(db, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    entry = await crud_chart.create_chart_entry(db, patient_id, current_user.id, entry_in)
    request.state.audit_details = f"Added {entry.type.value} chart entry for patient {patient_id}"
    request.state.audit_resource_id = entry.id
    data = _enrich_entry(entry, {current_user.id: current_user})
    return ok(censor_clinical_data(current_user, data))


@router.post(
    "/upload",
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(rate_limit_dependency(UPLOAD_LIMIT))],
)
async def upload_lab_file(
    request: Request,
    patient_id: str,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("canUploadLabs")),
):
    patient = await crud_patient.get_patient(db, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    upload_url = await file_service.save_lab_file(patient_id, file)

    entry_in = ChartEntryCreate(comments=file.filename, type=ChartType.lab)
    entry = await crud_chart.create_chart_entry(
        db, patient_id, current_user.id, entry_in, upload_url=upload_url
    )
    request.state.audit_details = f"Uploaded lab file {file.filename} for patient {patient_id}"
    request.state.audit_resource_id = entry.id
    data = _enrich_entry(entry, {current_user.id: current_user})
    return ok(censor_clinical_data(current_user, data))


@router.delete("/{entry_id}", status_code=status.HTTP_200_OK)
async def delete_chart_entry(
    request: Request,
    patient_id: str,
    entry_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("canDeleteData")),
):
    entry = await crud_chart.get_chart_entry(db, entry_id)
    if not entry or entry.patient_id != patient_id:
        raise HTTPException(status_code=404, detail="Chart entry not found")

    if entry.upload_url:
        file_service.delete_lab_file(entry.upload_url)

    request.state.audit_details = f"Deleted chart entry for patient {patient_id}"
    await crud_chart.delete_chart_entry(db, entry)
    return ok("entry deleted")
