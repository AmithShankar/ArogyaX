import uuid
from typing import Optional, Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.chart_entry import ChartEntry
from app.schemas.chart_entry import ChartEntryCreate


async def get_chart_entry(db: AsyncSession, entry_id: str) -> Optional[ChartEntry]:
    result = await db.execute(select(ChartEntry).where(ChartEntry.id == entry_id))
    return result.scalar_one_or_none()


async def list_chart_entries(
    db: AsyncSession, patient_id: str
) -> Sequence[ChartEntry]:
    result = await db.execute(
        select(ChartEntry)
        .where(ChartEntry.patient_id == patient_id)
        .order_by(ChartEntry.created_dt.desc())
    )
    return result.scalars().all()


async def create_chart_entry(
    db: AsyncSession,
    patient_id: str,
    user_id: str,
    entry_in: ChartEntryCreate,
    upload_url: Optional[str] = None,
) -> ChartEntry:
    db_entry = ChartEntry(
        id=str(uuid.uuid4()),
        patient_id=patient_id,
        user_id=user_id,
        comments=entry_in.comments,
        type=entry_in.type,
        upload_url=upload_url,
    )
    db.add(db_entry)
    await db.commit()
    await db.refresh(db_entry)
    return db_entry


async def delete_chart_entry(db: AsyncSession, entry: ChartEntry) -> None:
    await db.delete(entry)
    await db.commit()
