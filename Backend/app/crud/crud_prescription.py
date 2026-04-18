import uuid
from typing import Optional, Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.prescription import Prescription
from app.schemas.prescription import PrescriptionCreate, PrescriptionUpdate


async def get_prescription(
    db: AsyncSession, prescription_id: str
) -> Optional[Prescription]:
    result = await db.execute(
        select(Prescription).where(Prescription.id == prescription_id)
    )
    return result.scalar_one_or_none()


async def list_prescriptions(
    db: AsyncSession, patient_id: str
) -> Sequence[Prescription]:
    result = await db.execute(
        select(Prescription)
        .where(Prescription.patient_id == patient_id)
        .order_by(Prescription.created_dt.desc())
    )
    return result.scalars().all()


async def create_prescription(
    db: AsyncSession,
    patient_id: str,
    prescribed_by_id: str,
    rx_in: PrescriptionCreate,
) -> Prescription:
    db_rx = Prescription(
        id=str(uuid.uuid4()),
        patient_id=patient_id,
        prescribed_by_id=prescribed_by_id,
        medication=rx_in.medication,
        dosage=rx_in.dosage,
        frequency=rx_in.frequency,
        duration=rx_in.duration,
        status=rx_in.status,
    )
    db.add(db_rx)
    await db.commit()
    await db.refresh(db_rx)
    return db_rx


async def update_prescription(
    db: AsyncSession, rx: Prescription, updates: PrescriptionUpdate
) -> Prescription:
    for field, value in updates.model_dump(exclude_unset=True).items():
        setattr(rx, field, value)
    await db.commit()
    await db.refresh(rx)
    return rx


async def delete_prescription(db: AsyncSession, rx: Prescription) -> None:
    await db.delete(rx)
    await db.commit()
