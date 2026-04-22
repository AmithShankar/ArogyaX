import enum
from datetime import datetime
from typing import Optional

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.db.base import Base


class ChartType(str, enum.Enum):
    visit = "visit"
    vitals = "vitals"
    lab = "lab"
    note = "note"


class ChartEntry(Base):
    __tablename__ = "chart_entries"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, index=True)
    patient_id: Mapped[str] = mapped_column(String(50), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[str] = mapped_column(String(50), ForeignKey("users.id"), nullable=False)
    comments: Mapped[Optional[str]] = mapped_column(Text)
    type: Mapped[ChartType] = mapped_column(SQLEnum(ChartType, name="chart_type"), nullable=False)
    upload_url: Mapped[Optional[str]] = mapped_column(Text)
    created_dt: Mapped[Optional[datetime]] = mapped_column(server_default=func.now())
