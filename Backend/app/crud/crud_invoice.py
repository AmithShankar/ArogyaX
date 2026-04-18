import uuid
from typing import Optional, Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.invoice import Invoice
from app.schemas.invoice import InvoiceCreate


async def get_invoice(db: AsyncSession, invoice_id: str) -> Optional[Invoice]:
    result = await db.execute(select(Invoice).where(Invoice.id == invoice_id))
    return result.scalar_one_or_none()


async def list_invoices(db: AsyncSession, patient_id: str) -> Sequence[Invoice]:
    result = await db.execute(
        select(Invoice)
        .where(Invoice.patient_id == patient_id)
        .order_by(Invoice.date.desc())
    )
    return result.scalars().all()


async def list_all_invoices(db: AsyncSession) -> Sequence[tuple[Invoice, str, str]]:
    from app.models.patient import Patient
    result = await db.execute(
        select(Invoice, Patient.name, Patient.phone)
        .join(Patient)
        .order_by(Invoice.date.desc())
    )
    return [tuple(row) for row in result.all()]  # type: ignore[return-value]


async def create_invoice(
    db: AsyncSession, patient_id: str, inv_in: InvoiceCreate
) -> Invoice:
    db_inv = Invoice(
        id=str(uuid.uuid4()),
        patient_id=patient_id,
        name=inv_in.name,
        amount=inv_in.amount,
        status=inv_in.status or "pending",
        comments=inv_in.comments,
    )
    db.add(db_inv)
    await db.commit()
    await db.refresh(db_inv)
    return db_inv


async def delete_invoice(db: AsyncSession, invoice: Invoice) -> None:
    await db.delete(invoice)
    await db.commit()


async def update_invoice(
    db: AsyncSession, db_inv: Invoice, obj_in: dict
) -> Invoice:
    for field, value in obj_in.items():
        setattr(db_inv, field, value)
    db.add(db_inv)
    await db.commit()
    await db.refresh(db_inv)
    return db_inv
