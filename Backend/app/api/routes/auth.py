from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user, get_db
from app.core.config import settings
from app.core.permissions import get_permissions
from app.core.rate_limit import LOGIN_LIMIT, rate_limit_dependency
from app.core.security import create_access_token, verifyPassword
from app.crud import crud_user
from app.models.user import User, UserStatus
from app.schemas.common import ok
from app.schemas.user import ChangePasswordRequest, UserLogin, UserResponse

router = APIRouter()


@router.post(
    "/login",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(rate_limit_dependency(LOGIN_LIMIT))],
)
async def login(
    credentials: UserLogin,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    user = await crud_user.get_user_by_phone(db, credentials.phone)

    if not user or not verifyPassword(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid phone number or password",
        )

    if user.status != UserStatus.active:
        message = (
            "Account suspended. Contact your administrator."
            if user.status == UserStatus.suspended
            else "Account deactivated. Contact your administrator."
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=message,
        )

    token = create_access_token({"sub": user.id, "role": user.role.value})

    response.set_cookie(
        key=settings.AUTH_COOKIE_NAME,
        value=token,
        httponly=settings.AUTH_COOKIE_HTTPONLY,
        secure=settings.IS_PRODUCTION,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        path=settings.AUTH_COOKIE_PATH,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    response.set_cookie(
        key=settings.PASSWORD_TYPE_COOKIE,
        value=user.password_type or "user_created",
        httponly=settings.AUTH_COOKIE_HTTPONLY,
        secure=settings.IS_PRODUCTION,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        path=settings.AUTH_COOKIE_PATH,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    return ok("ok")


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(response: Response):
    response.delete_cookie(
        key=settings.AUTH_COOKIE_NAME, path=settings.AUTH_COOKIE_PATH
    )
    response.delete_cookie(
        key=settings.PASSWORD_TYPE_COOKIE, path=settings.AUTH_COOKIE_PATH
    )
    return ok("ok")


@router.get("/me", response_model=None, status_code=status.HTTP_200_OK)
async def get_me(current_user: User = Depends(get_current_user)):
    data = UserResponse.model_validate(current_user).model_dump(by_alias=True)
    data["permissions"] = get_permissions(current_user)
    return ok(data)


@router.post("/change-password", status_code=status.HTTP_200_OK)
async def change_password(
    body: ChangePasswordRequest,
    response: Response,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await crud_user.change_password(db, current_user, body.new_password)

    token = create_access_token(
        {"sub": current_user.id, "role": current_user.role.value}
    )

    response.set_cookie(
        key=settings.AUTH_COOKIE_NAME,
        value=token,
        httponly=settings.AUTH_COOKIE_HTTPONLY,
        secure=settings.IS_PRODUCTION,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        path=settings.AUTH_COOKIE_PATH,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    response.set_cookie(
        key=settings.PASSWORD_TYPE_COOKIE,
        value="user_created",
        httponly=settings.AUTH_COOKIE_HTTPONLY,
        secure=settings.IS_PRODUCTION,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        path=settings.AUTH_COOKIE_PATH,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    return ok("password changed")
