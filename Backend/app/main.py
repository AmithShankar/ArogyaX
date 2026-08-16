import logging
import os

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware

from app.api import api_router
from app.core.config import settings
from app.core.rate_limit import RateLimitExceededError, build_rate_limit_error
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.audit import AuditMiddleware
from app.schemas.common import ErrorDetail, ErrorResponse

logger = logging.getLogger(__name__)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Inject security headers on every response."""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        if settings.IS_PRODUCTION:
            response.headers["Strict-Transport-Security"] = (
                "max-age=63072000; includeSubDomains; preload"
            )
        return response


def create_app() -> FastAPI:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )

    app = FastAPI(title=settings.PROJECT_NAME, version="1.0.0")

    configure_middleware(app)
    configure_exception_handlers(app)
    configure_routes(app)

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    return app


def configure_middleware(app: FastAPI) -> None:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Accept", "Authorization", "X-Requested-With"],
        expose_headers=["X-Total-Count", "Content-Disposition"],
    )

    if settings.USE_PROXY_HEADERS:
        app.add_middleware(ProxyHeadersMiddleware, trusted_hosts="*")

    app.add_middleware(RateLimitMiddleware)
    app.add_middleware(AuditMiddleware)
    app.add_middleware(SecurityHeadersMiddleware)


def configure_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(RateLimitExceededError)
    async def rate_limit_exception_handler(request: Request, exc: RateLimitExceededError):
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content=build_rate_limit_error(exc.headers),
            headers=exc.headers,
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.exception("Unhandled exception on %s %s", request.method, request.url.path)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=ErrorResponse(
                errors=[ErrorDetail(message="Internal server error")]
            ).model_dump(),
        )


def configure_routes(app: FastAPI) -> None:
    app.include_router(api_router)

    @app.api_route("/", methods=["GET", "HEAD"], tags=["Health"])
    @app.api_route("/health", methods=["GET", "HEAD"], tags=["Health"])
    async def health() -> dict:
        from sqlalchemy import text
        from app.db.database import AsyncSessionLocal
        import time

        db_status = "ok"
        db_latency_ms: float | None = None
        try:
            t0 = time.monotonic()
            async with AsyncSessionLocal() as session:
                await session.execute(text("SELECT 1"))
            db_latency_ms = round((time.monotonic() - t0) * 1000, 1)
        except Exception as exc:
            logger.error("Health check DB ping failed: %s", exc)
            db_status = "degraded"

        return {
            "status": "ok" if db_status == "ok" else "degraded",
            "service": settings.PROJECT_NAME,
            "db": db_status,
            "db_latency_ms": db_latency_ms,
        }


app = create_app()
