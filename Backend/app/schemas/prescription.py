from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class PrescriptionCreate(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )

    medication: str
    dosage: str
    frequency: str
    duration: str
    status: str = "active"


class PrescriptionUpdate(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )

    status: Optional[str] = None
    medication: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None


class PrescriptionResponse(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )

    id: str
    patient_id: str
    prescribed_by_id: str
    prescribed_by: Optional[str] = None
    medication: str
    dosage: str
    frequency: str
    duration: str
    status: str
    created_dt: Optional[date] = None
