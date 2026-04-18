import enum
from datetime import date, datetime
from typing import Optional

from sqlalchemy import String, Text
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.db.base import Base


class GenderType(str, enum.Enum):
    male = "male"
    female = "female"
    other = "other"
    prefer_not_to_say = "prefer_not_to_say"


class Patient(Base):
    __tablename__ = "patients"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, index=True)
    patient_id: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=True) # human readable AX-1025
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    address: Mapped[Optional[str]] = mapped_column(Text)
    date_of_birth: Mapped[date] = mapped_column(nullable=False)
    gender: Mapped[GenderType] = mapped_column(SQLEnum(GenderType, name="gender_type"), nullable=False)
    created_timestamp: Mapped[Optional[datetime]] = mapped_column(server_default=func.now())
    referred_by: Mapped[Optional[str]] = mapped_column(String(100))
