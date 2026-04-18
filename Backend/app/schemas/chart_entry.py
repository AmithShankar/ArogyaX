from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from app.models.chart_entry import ChartType
from app.models.user import UserRole


class ChartEntryCreate(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )

    comments: Optional[str] = None
    type: ChartType


class ChartEntryResponse(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )

    id: str
    patient_id: str
    user_id: str
    user_name: Optional[str] = None
    user_role: Optional[UserRole] = None
    comments: Optional[str] = None
    type: ChartType
    upload: Optional[str] = None
    created_dt: Optional[datetime] = None
