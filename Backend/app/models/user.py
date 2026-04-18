import enum
from datetime import date, datetime
from typing import Optional

from sqlalchemy import ForeignKey, String
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.db.base import Base


class UserRole(str, enum.Enum):
    doctor = "doctor"
    nurse = "nurse"
    reception = "reception"
    pharmacy = "pharmacy"
    lab_tech = "lab_tech"
    hospital_admin = "hospital_admin"
    owner = "owner"
    auditor = "auditor"


class UserStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    suspended = "suspended"


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, index=True)
    phone: Mapped[str] = mapped_column(String(20), nullable=False, unique=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(SQLEnum(UserRole, name="user_role"), nullable=False)
    status: Mapped[UserStatus] = mapped_column(SQLEnum(UserStatus, name="user_status"), nullable=False, default="active")
    job_title: Mapped[Optional[str]] = mapped_column(String(100))
    password_type: Mapped[Optional[str]] = mapped_column(String(50))
    created_timestamp: Mapped[Optional[datetime]] = mapped_column(server_default=func.now())
    address: Mapped[Optional[str]] = mapped_column(String(255))
    hire_dt: Mapped[Optional[date]] = mapped_column()
    manager_id: Mapped[Optional[str]] = mapped_column(String(50), ForeignKey("users.id"), nullable=True)
