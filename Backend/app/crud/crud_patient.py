import random
import string
import uuid
from datetime import datetime
from typing import Optional, Sequence

from sqlalchemy import or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientUpdate


async def generate_patient_id() -> tuple[str, str]:
    # Format: AX-YYMM-XXXXXX (e.g. AX2404-K98J2R)
    prefix = f"AX{datetime.now().strftime('%y%m')}"
    chars = string.ascii_uppercase + string.digits
    safe_chars = "".join([c for c in chars if c not in "0O1IL"])

    suffix = "".join(random.choices(safe_chars, k=6))
    return suffix, prefix


async def get_patient(db: AsyncSession, patient_id: str) -> Optional[Patient]:
    result = await db.execute(
        select(Patient).where(
            or_(Patient.id == patient_id, Patient.patient_id == patient_id)
        )
    )
    return result.scalar_one_or_none()


async def list_patients(
    db: AsyncSession,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
) -> Sequence[Patient]:
    query = select(Patient)
    if search:
        like = f"%{search}%"
        query = query.where(
            or_(
                Patient.name.ilike(like),
                Patient.phone.ilike(like),
                Patient.patient_id.ilike(like),  # Search by readable ID too
            )
        )
    query = query.order_by(Patient.created_timestamp.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


async def create_patient(db: AsyncSession, patient_in: PatientCreate) -> Patient:
    max_retries = 5
    for attempt in range(max_retries):
        suffix, prefix = await generate_patient_id()
        readable_id = f"{prefix}-{suffix}"

        db_patient = Patient(
            id=str(uuid.uuid4()),
            patient_id=readable_id,
            name=patient_in.name,
            phone=patient_in.phone,
            address=patient_in.address,
            date_of_birth=patient_in.date_of_birth,
            gender=patient_in.gender,
            referred_by=patient_in.referred_by,
        )

        try:
            db.add(db_patient)
            await db.commit()
            await db.refresh(db_patient)
            return db_patient
        except IntegrityError:
            await db.rollback()
            if attempt == max_retries - 1:
                raise Exception(
                    "Failed to generate a unique patient ID after multiple attempts."
                )
            continue
    raise Exception("ID generation failed")


async def update_patient(
    db: AsyncSession, patient: Patient, updates: PatientUpdate
) -> Patient:
    for field, value in updates.model_dump(exclude_unset=True).items():
        setattr(patient, field, value)
    await db.commit()
    await db.refresh(patient)
    return patient


async def delete_patient(db: AsyncSession, patient: Patient) -> None:
    await db.delete(patient)
    await db.commit()
