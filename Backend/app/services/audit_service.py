import logging
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import crud_audit
from app.models.user import User

logger = logging.getLogger(__name__)


async def log_action(
    db: AsyncSession,
    user: Optional[User],
    action: str,
    resource: str,
    resource_id: Optional[str] = None,
    details: Optional[str] = None,
) -> None:
    """Write an audit log entry. Does not raise to avoid breaking the main request."""
    try:
        await crud_audit.create_audit_log(
            db=db,
            user_id=user.id if user else None,
            action=action,
            resource=resource,
            resource_id=resource_id,
            details=details,
        )
    except Exception as exc:
        logger.error(
            "Audit log write failed: action=%s resource=%s resource_id=%s error=%s",
            action,
            resource,
            resource_id,
            exc,
        )
