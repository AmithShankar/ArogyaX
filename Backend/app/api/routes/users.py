from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_db, get_current_user
from app.core.permissions import require_permission, get_permissions
from app.core.censorship import censor_patient_data
from app.core.utils import get_role_str
from app.crud import crud_user
from app.models.user import User
from app.schemas.common import ok
from app.schemas.user import UserCreate, UserResponse, UserUpdate

router = APIRouter()


@router.get("", status_code=status.HTTP_200_OK)
async def list_users(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    perms = get_permissions(current_user)
    if not (perms.get("canManageUsers", False) or get_role_str(current_user) == "auditor"):
        raise HTTPException(status_code=403, detail="Forbidden")
        
    users = await crud_user.list_users(db)
    raw_data = [UserResponse.model_validate(u).model_dump(by_alias=True) for u in users]
    return ok(censor_patient_data(current_user, raw_data))


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_user(
    request: Request,
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("canManageUsers")),
):
    existing = await crud_user.get_user_by_phone(db, user_in.phone)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number already registered",
        )

    new_user = await crud_user.create_user(db, user_in)
    request.state.audit_details = f"Created user {new_user.name}"
    request.state.audit_resource_id = new_user.id
    return ok(UserResponse.model_validate(new_user).model_dump(by_alias=True))


@router.get("/{user_id}", status_code=status.HTTP_200_OK)
async def get_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    perms = get_permissions(current_user)
    if not (perms.get("canManageUsers", False) or get_role_str(current_user) == "auditor"):
        raise HTTPException(status_code=403, detail="Forbidden")

    user = await crud_user.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    raw_data = UserResponse.model_validate(user).model_dump(by_alias=True)
    return ok(censor_patient_data(current_user, raw_data))


@router.put("/{user_id}", status_code=status.HTTP_200_OK)
async def update_user(
    request: Request,
    user_id: str,
    updates: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("canManageUsers")),
):
    user = await crud_user.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if updates.phone and updates.phone != user.phone:
        conflict = await crud_user.get_user_by_phone(db, updates.phone)
        if conflict:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Phone number already registered",
            )

    updated = await crud_user.update_user(db, user, updates)
    request.state.audit_details = f"Updated user {user.name}"
    return ok(UserResponse.model_validate(updated).model_dump(by_alias=True))


@router.delete("/{user_id}", status_code=status.HTTP_200_OK)
async def deactivate_user(
    request: Request,
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("canDeleteData")),
):
    user = await crud_user.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot deactivate yourself"
        )

    await crud_user.deactivate_user(db, user)
    request.state.audit_details = f"Deactivated user {user.name}"
    return ok("user deactivated")
