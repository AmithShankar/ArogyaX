from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.censorship import censor_patient_data
from app.api.dependencies import get_db
from app.core.permissions import require_permission
from app.core.rate_limit import REGISTER_PATIENT_LIMIT, rate_limit_dependency
from app.crud import crud_patient
from app.models.user import User
from app.schemas.common import ok
from app.schemas.patient import PatientCreate, PatientResponse, PatientUpdate

router = APIRouter()


@router.get("", status_code=status.HTTP_200_OK)
async def list_patients(
    search: Optional[str] = Query(default=None),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("canViewPatients")),
):
    skip = (page - 1) * limit
    patients = await crud_patient.list_patients(db, search=search, skip=skip, limit=limit)
    raw_data = [PatientResponse.model_validate(p).model_dump(mode="json", by_alias=True) for p in patients]
    return ok(censor_patient_data(current_user, raw_data))


@router.post("", status_code=status.HTTP_201_CREATED, dependencies=[Depends(rate_limit_dependency(REGISTER_PATIENT_LIMIT))])
async def create_patient(
    request: Request,
    patient_in: PatientCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("canEditPatients")),
):
    patient = await crud_patient.create_patient(db, patient_in)
    request.state.audit_details = f"Registered patient {patient.name}"
    request.state.audit_resource_id = patient.id
    return ok(PatientResponse.model_validate(patient).model_dump(mode="json", by_alias=True))


@router.get("/{patient_id}", status_code=status.HTTP_200_OK)
async def get_patient(
    patient_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("canViewPatients")),
):
    patient = await crud_patient.get_patient(db, patient_id)
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    raw_data = PatientResponse.model_validate(patient).model_dump(mode="json", by_alias=True)
    return ok(censor_patient_data(current_user, raw_data))


@router.put("/{patient_id}", status_code=status.HTTP_200_OK)
async def update_patient(
    request: Request,
    patient_id: str,
    updates: PatientUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("canEditPatients")),
):
    patient = await crud_patient.get_patient(db, patient_id)
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")

    updated = await crud_patient.update_patient(db, patient, updates)
    request.state.audit_details = f"Updated patient {patient.name}"
    raw_data = PatientResponse.model_validate(updated).model_dump(mode="json", by_alias=True)
    return ok(censor_patient_data(current_user, raw_data))


@router.delete("/{patient_id}", status_code=status.HTTP_200_OK)
async def delete_patient(
    request: Request,
    patient_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("canDeleteData")),
):
    patient = await crud_patient.get_patient(db, patient_id)
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")

    request.state.audit_details = f"Deleted patient {patient.name}"
    await crud_patient.delete_patient(db, patient)
    return ok("patient deleted")
