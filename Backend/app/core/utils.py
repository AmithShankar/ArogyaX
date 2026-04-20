"""
Shared backend utilities - extracted to eliminate repeated patterns across routes.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


def get_role_str(user: User) -> str:
    """Return the string value of a user's role enum."""
    return user.role.value


async def fetch_users_by_ids(db: "AsyncSession", ids: set[str]) -> dict[str, User]:
    """
    Bulk-fetch users by a set of IDs and return a mapping of id → User.
    Returns an empty dict if *ids* is empty, avoiding an unnecessary query.
    """
    if not ids:
        return {}
    from sqlalchemy import select

    from app.models.user import User as UserModel

    result = await db.execute(select(UserModel).where(UserModel.id.in_(ids)))
    return {u.id: u for u in result.scalars()}


async def fetch_patients_by_ids(db: "AsyncSession", ids: set[str]):
    """
    Bulk-fetch patients by a set of IDs and return a mapping of id → Patient.
    """
    if not ids:
        return {}
    from sqlalchemy import select
    from app.models.patient import Patient as PatientModel

    result = await db.execute(select(PatientModel).where(PatientModel.id.in_(ids)))
    return {p.id: p for p in result.scalars()}
