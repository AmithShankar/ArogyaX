from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, field_validator
from pydantic.alias_generators import to_camel

from app.models.user import UserRole, UserStatus


class UserBase(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )

    phone: str
    name: str
    role: UserRole
    status: Optional[UserStatus] = UserStatus.active
    job_title: Optional[str] = None
    address: Optional[str] = None
    hire_dt: Optional[date] = None
    manager_id: Optional[str] = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        digits = v.replace("-", "").replace(" ", "")
        if not digits.isdigit() or len(digits) != 10:
            raise ValueError("Phone must be a 10-digit Indian mobile number")
        return digits


class UserCreate(UserBase):
    password: str
    password_type: str = "admin_created"


class UserUpdate(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )

    phone: Optional[str] = None
    name: Optional[str] = None
    role: Optional[UserRole] = None
    status: Optional[UserStatus] = None
    job_title: Optional[str] = None
    address: Optional[str] = None
    hire_dt: Optional[date] = None
    manager_id: Optional[str] = None


class UserResponse(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )

    id: str
    phone: str
    name: str
    role: UserRole
    status: Optional[UserStatus] = None
    job_title: Optional[str] = None
    address: Optional[str] = None
    hire_dt: Optional[date] = None
    manager_id: Optional[str] = None
    password_type: Optional[str] = None
    created_timestamp: Optional[datetime] = None
    permissions: Optional[dict[str, bool]] = None


class UserLogin(BaseModel):
    phone: str
    password: str


class ChangePasswordRequest(BaseModel):
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        from app.core.config import settings

        if len(v) < settings.PASSWORD_MIN_LENGTH:
            raise ValueError(
                f"Password must be at least {settings.PASSWORD_MIN_LENGTH} characters"
            )
        if settings.PASSWORD_REQUIRE_UPPERCASE and not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if settings.PASSWORD_REQUIRE_LOWERCASE and not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter")
        if settings.PASSWORD_REQUIRE_DIGIT and not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v
