from datetime import date as date_type
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class InvoiceCreate(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )

    name: str
    amount: Decimal
    status: Optional[str] = "pending"
    comments: Optional[str] = None


class InvoiceResponse(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )

    id: str
    patient_id: str
    name: str
    amount: Decimal
    status: Optional[str] = "pending"
    comments: Optional[str] = None
    date: Optional[date_type] = None


class InvoiceUpdate(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )

    name: Optional[str] = None
    amount: Optional[Decimal] = None
    status: Optional[str] = None
    comments: Optional[str] = None


class InvoiceListResponse(InvoiceResponse):
    patient_name: str
    patient_phone: Optional[str] = None
