import logging
import re
import time

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

from app.api.dependencies import get_current_user_from_request
from app.db.database import AsyncSessionLocal
from app.services import audit_service

logger = logging.getLogger(__name__)


class AuditMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp):
        super().__init__(app)
        self.id_pattern = re.compile(r"/([a-f0-9\-]{36}|[0-9]+)")

    async def dispatch(self, request: Request, call_next):
        is_prefetch = (
            request.headers.get("Purpose") == "prefetch"
            or request.headers.get("X-Nextjs-Data") is not None
            or request.url.path.startswith("/_next")
        )

        if (
            request.method == "OPTIONS"
            or request.url.path == "/"
            or request.url.path.startswith("/static")
            or is_prefetch
        ):
            return await call_next(request)

        start_time = time.time()

        response = await call_next(request)

        is_write_operation = request.method in ("POST", "PUT", "PATCH", "DELETE")

        sensitive_paths = (
            "/charts",
            "/audit-log",
            "/patients",
            "/users",
            "/admin",
            "/prescriptions",
            "/invoices",
            "/summary",
        )
        is_sensitive_read = request.method == "GET" and any(
            p in request.url.path for p in sensitive_paths
        )

        if getattr(request.state, "skip_audit", False):
            return response

        if is_write_operation or is_sensitive_read:
            duration = time.time() - start_time
            
            # Extract info needed for logging BEFORE returning response
            # Note: request.state might become inaccessible if we don't extract now
            resource_id = getattr(request.state, "audit_resource_id", None)
            if not resource_id:
                match = self.id_pattern.search(request.url.path)
                if match:
                    resource_id = match.group(1)
            
            custom_details = getattr(request.state, "audit_details", None)
            path = request.url.path
            method = request.method
            status_code = response.status_code
            
            # Fire and forget the audit log write in the background
            import asyncio
            asyncio.create_task(self._log_background(
                request, 
                method, 
                path, 
                status_code, 
                duration, 
                resource_id, 
                custom_details
            ))

        return response

    async def _log_background(
        self, 
        request: Request, 
        method: str, 
        path: str, 
        status_code: int, 
        duration: float,
        resource_id: str | None,
        custom_details: str | None
    ):
        """Asynchronous background task to write audit log without blocking response."""
        try:
            async with AsyncSessionLocal() as db:
                user = await get_current_user_from_request(request, db)
                
                details = f"{custom_details}. " if custom_details else ""
                details += f"Method: {method}, Path: {path}, Duration: {duration:.3f}s"
                
                # Safety truncation for resource path (schema limit 512)
                safe_path = path[:512] if path else "unknown"
                
                await audit_service.log_action(
                    db=db,
                    user=user,
                    action=f"{method} {status_code}",
                    resource=safe_path,
                    resource_id=resource_id,
                    details=details,
                )
                await db.commit()
        except Exception:
            logger.warning("Background audit log failed", exc_info=True)
