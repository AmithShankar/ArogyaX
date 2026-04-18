from datetime import datetime
from typing import Optional

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.db.base import Base


class PatientSummary(Base):
    __tablename__ = "patient_summaries"

    patient_id: Mapped[str] = mapped_column(String(50), ForeignKey("patients.id", ondelete="CASCADE"), primary_key=True)
    chief_complaint: Mapped[Optional[str]] = mapped_column(Text)
    past_medical_history: Mapped[Optional[str]] = mapped_column(Text)
    recent_developments: Mapped[Optional[str]] = mapped_column(Text)
    current_assessment: Mapped[Optional[str]] = mapped_column(Text)
    last_updated: Mapped[Optional[datetime]] = mapped_column(server_default=func.now(), onupdate=func.now())
