from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, computed_field
from pydantic.alias_generators import to_camel

from app.models.patient import GenderType


class PatientCreate(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )

    name: str
    phone: str
    address: Optional[str] = None
    date_of_birth: date
    gender: GenderType
    referred_by: Optional[str] = None


class PatientUpdate(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )

    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[GenderType] = None
    referred_by: Optional[str] = None


class PatientResponse(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )

    id: str
    patient_id: Optional[str] = None
    name: str
    phone: str
    address: Optional[str] = None
    date_of_birth: date
    gender: GenderType
    created_timestamp: Optional[datetime] = None
    referred_by: Optional[str] = None

    @computed_field
    @property
    def age(self) -> int:
        today = date.today()
        dob = self.date_of_birth
        return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
