from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import settings
from app.core.rate_limit import (
    AUTHENTICATED_API_LIMIT,
    GLOBAL_IP_LIMIT,
    apply_headers,
    get_rate_limiter,
    should_skip_rate_limit,
)


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        if should_skip_rate_limit(request):
            return await call_next(request)

        limiter = get_rate_limiter()
        global_headers = limiter.check(GLOBAL_IP_LIMIT, request)
        auth_headers: dict[str, str] = {}

        if request.cookies.get(settings.AUTH_COOKIE_NAME):
            auth_headers = limiter.check(AUTHENTICATED_API_LIMIT, request)

        response = await call_next(request)
        apply_headers(response, global_headers)
        apply_headers(response, auth_headers)
        return response
