from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_db
from app.core.censorship import censor_patient_data
from app.core.permissions import require_permission
from app.core.utils import fetch_users_by_ids
from app.crud import crud_patient, crud_prescription
from app.models.user import User
from app.schemas.common import ok
from app.schemas.prescription import (
    PrescriptionCreate,
    PrescriptionResponse,
    PrescriptionUpdate,
)

router = APIRouter()
global_router = APIRouter()


def _enrich_rx(rx, user_map: dict) -> dict:
    data = PrescriptionResponse(
        id=rx.id,
        patient_id=rx.patient_id,
        prescribed_by_id=rx.prescribed_by_id,
        medication=rx.medication,
        dosage=rx.dosage,
        frequency=rx.frequency,
        duration=rx.duration,
        status=rx.status,
        created_dt=rx.created_dt,
    ).model_dump(mode="json", by_alias=True)
    if rx.prescribed_by_id in user_map:
        data["prescribedBy"] = user_map[rx.prescribed_by_id].name
    return data


@global_router.get("", status_code=status.HTTP_200_OK)
async def list_all_prescriptions_global(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("canViewPrescriptions")),
):
    prescriptions = await crud_prescription.list_all_prescriptions(db)
    user_map = await fetch_users_by_ids(
        db, {rx.prescribed_by_id for rx in prescriptions}
    )
    data = [_enrich_rx(rx, user_map) for rx in prescriptions]
    return ok(censor_patient_data(current_user, data))


@router.get("", status_code=status.HTTP_200_OK)
async def list_prescriptions(
    patient_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("canViewPrescriptions")),
):
    patient = await crud_patient.get_patient(db, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    prescriptions = await crud_prescription.list_prescriptions(db, patient_id)

    user_map = await fetch_users_by_ids(
        db, {rx.prescribed_by_id for rx in prescriptions}
    )

    data = [_enrich_rx(rx, user_map) for rx in prescriptions]
    return ok(censor_patient_data(current_user, data))


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_prescription(
    request: Request,
    patient_id: str,
    rx_in: PrescriptionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("canEditPrescriptions")),
):
    patient = await crud_patient.get_patient(db, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    rx = await crud_prescription.create_prescription(
        db, patient_id, current_user.id, rx_in
    )
    request.state.audit_details = f"Prescribed {rx.medication} for patient {patient_id}"
    request.state.audit_resource_id = rx.id
    data = _enrich_rx(rx, {current_user.id: current_user})
    return ok(censor_patient_data(current_user, data))


@router.put("/{rx_id}", status_code=status.HTTP_200_OK)
async def update_prescription(
    request: Request,
    patient_id: str,
    rx_id: str,
    updates: PrescriptionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("canEditPrescriptions")),
):
    rx = await crud_prescription.get_prescription(db, rx_id)
    if not rx or rx.patient_id != patient_id:
        raise HTTPException(status_code=404, detail="Prescription not found")

    updated = await crud_prescription.update_prescription(db, rx, updates)
    request.state.audit_details = (
        f"Updated prescription {rx_id} for patient {patient_id}"
    )

    user_map = {current_user.id: current_user}
    data = _enrich_rx(updated, user_map)
    return ok(censor_patient_data(current_user, data))


@router.delete("/{rx_id}", status_code=status.HTTP_200_OK)
async def delete_prescription(
    request: Request,
    patient_id: str,
    rx_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("canDeleteData")),
):
    rx = await crud_prescription.get_prescription(db, rx_id)
    if not rx or rx.patient_id != patient_id:
        raise HTTPException(status_code=404, detail="Prescription not found")

    request.state.audit_details = f"Deleted prescription for patient {patient_id}"
    await crud_prescription.delete_prescription(db, rx)
    return ok("prescription deleted")
