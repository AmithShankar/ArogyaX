import uuid
from typing import Optional, Sequence

from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_password
from app.models.user import User, UserStatus
from app.schemas.user import UserCreate, UserUpdate


async def get_user_by_id(db: AsyncSession, user_id: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def get_user_by_phone(db: AsyncSession, phone: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.phone == phone))
    return result.scalar_one_or_none()


async def get_user_by_phone_or_id(
    db: AsyncSession, user_id: str, phone: str
) -> Optional[User]:
    result = await db.execute(
        select(User).where(or_(User.id == user_id, User.phone == phone))
    )
    return result.scalar_one_or_none()


async def list_users(db: AsyncSession) -> Sequence[User]:
    result = await db.execute(select(User).order_by(User.name))
    return result.scalars().all()


async def create_user(db: AsyncSession, user_in: UserCreate) -> User:
    db_user = User(
        id=str(uuid.uuid4()),
        phone=user_in.phone,
        name=user_in.name,
        password=get_password(user_in.password),
        role=user_in.role,
        status=user_in.status,
        job_title=user_in.job_title,
        password_type=user_in.password_type,
        address=user_in.address,
        hire_dt=user_in.hire_dt,
        manager_id=user_in.manager_id,
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user


async def update_user(db: AsyncSession, user: User, updates: UserUpdate) -> User:
    for field, value in updates.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    await db.commit()
    await db.refresh(user)
    return user


async def change_password(db: AsyncSession, user: User, new_password: str) -> User:
    user.password = get_password(new_password)
    user.password_type = "user_created"
    await db.commit()
    await db.refresh(user)
    return user


async def deactivate_user(db: AsyncSession, user: User) -> User:
    user.status = UserStatus.inactive
    await db.commit()
    await db.refresh(user)
    return user
