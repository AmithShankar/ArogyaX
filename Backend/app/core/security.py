import hashlib
from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _get_password_hash(password: str) -> str:
    """Pre-hash with SHA-256 to circumvent bcrypt's 72-byte limit."""
    return hashlib.sha256(password.encode()).hexdigest()


def verifyPassword(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(_get_password_hash(plain_password), hashed_password)


def get_password(password: str) -> str:
    return pwd_context.hash(_get_password_hash(password))


def create_access_token(data: dict[str, Any]) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode["exp"] = expire
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict[str, Any] | None:
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except JWTError:
        return None
