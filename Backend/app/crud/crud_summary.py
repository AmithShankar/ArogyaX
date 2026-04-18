from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.summary import PatientSummary


async def get_summary(db: AsyncSession, patient_id: str) -> Optional[PatientSummary]:
    result = await db.execute(
        select(PatientSummary).where(PatientSummary.patient_id == patient_id)
    )
    return result.scalar_one_or_none()


async def upsert_summary(
    db: AsyncSession,
    patient_id: str,
    chief_complaint: Optional[str] = None,
    past_medical_history: Optional[str] = None,
    recent_developments: Optional[str] = None,
    current_assessment: Optional[str] = None,
) -> PatientSummary:
    existing = await get_summary(db, patient_id)
    if existing:
        if chief_complaint is not None:
            existing.chief_complaint = chief_complaint
        if past_medical_history is not None:
            existing.past_medical_history = past_medical_history
        if recent_developments is not None:
            existing.recent_developments = recent_developments
        if current_assessment is not None:
            existing.current_assessment = current_assessment
        await db.commit()
        await db.refresh(existing)
        return existing

    summary = PatientSummary(
        patient_id=patient_id,
        chief_complaint=chief_complaint,
        past_medical_history=past_medical_history,
        recent_developments=recent_developments,
        current_assessment=current_assessment,
    )
    db.add(summary)
    await db.commit()
    await db.refresh(summary)
    return summary
