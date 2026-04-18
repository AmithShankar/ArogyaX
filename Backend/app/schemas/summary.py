from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class SummaryResponse(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )

    patient_id: str
    chief_complaint: Optional[str] = None
    past_medical_history: Optional[str] = None
    recent_developments: Optional[str] = None
    current_assessment: Optional[str] = None
    last_updated: Optional[datetime] = None
