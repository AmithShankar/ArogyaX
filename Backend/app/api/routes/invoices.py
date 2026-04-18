from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_db
from app.core.permissions import require_permission
from app.crud import crud_invoice, crud_patient
from app.models.user import User
from app.schemas.common import ok
from app.schemas.invoice import InvoiceCreate, InvoiceResponse, InvoiceListResponse, InvoiceUpdate

router = APIRouter()
global_router = APIRouter()


@router.get("", status_code=status.HTTP_200_OK)
async def list_invoices(
    patient_id: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_permission("canViewBilling")),
):
    patient = await crud_patient.get_patient(db, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    invoices = await crud_invoice.list_invoices(db, patient_id)
    return ok([InvoiceResponse.model_validate(inv).model_dump(mode="json", by_alias=True) for inv in invoices])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_invoice(
    request: Request,
    patient_id: str,
    inv_in: InvoiceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("canViewBilling")),
):
    patient = await crud_patient.get_patient(db, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    invoice = await crud_invoice.create_invoice(db, patient_id, inv_in)
    request.state.audit_details = f"Created invoice '{invoice.name}' for patient {patient_id}"
    request.state.audit_resource_id = invoice.id
    return ok(InvoiceResponse.model_validate(invoice).model_dump(mode="json", by_alias=True))


@router.patch("/{invoice_id}", status_code=status.HTTP_200_OK)
async def update_invoice(
    request: Request,
    patient_id: str,
    invoice_id: str,
    inv_in: InvoiceUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("canViewBilling")),
):
    invoice = await crud_invoice.get_invoice(db, invoice_id)
    if not invoice or invoice.patient_id != patient_id:
        raise HTTPException(status_code=404, detail="Invoice not found")

    update_data = inv_in.model_dump(exclude_unset=True)
    updated_inv = await crud_invoice.update_invoice(db, invoice, update_data)
    
    request.state.audit_details = f"Updated invoice '{invoice.id}' status to {inv_in.status}"
    request.state.audit_resource_id = invoice.id
    
    return ok(InvoiceResponse.model_validate(updated_inv).model_dump(mode="json", by_alias=True))


@router.delete("/{invoice_id}", status_code=status.HTTP_200_OK)
async def delete_invoice(
    request: Request,
    patient_id: str,
    invoice_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("canDeleteData")),
):
    invoice = await crud_invoice.get_invoice(db, invoice_id)
    if not invoice or invoice.patient_id != patient_id:
        raise HTTPException(status_code=404, detail="Invoice not found")

    request.state.audit_details = f"Deleted invoice for patient {patient_id}"
    await crud_invoice.delete_invoice(db, invoice)
    return ok("invoice deleted")


@global_router.get("", response_model=None)
async def list_all_invoices(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_permission("canViewBilling")),
):
    results = await crud_invoice.list_all_invoices(db)
    formatted = [
        InvoiceListResponse(
            **InvoiceResponse.model_validate(inv).model_dump(),
            patient_name=p_name,
            patient_phone=p_phone
        ).model_dump(mode="json", by_alias=True)
        for inv, p_name, p_phone in results
    ]
    return ok(formatted)
