import time
from dataclasses import dataclass
from functools import lru_cache
from typing import Literal

from fastapi import Request, Response
from limits import parse
from limits.storage import storage_from_string
from limits.strategies import FixedWindowRateLimiter

from app.core.config import settings
from app.core.security import decode_token
from app.schemas.common import ErrorDetail, ErrorResponse

RateLimitScope = Literal["ip", "authenticated"]


def get_skip_paths() -> frozenset[str]:
    return frozenset(settings.RATE_LIMIT_SKIP_PATHS)


@dataclass(frozen=True)
class RateLimitPolicy:
    name: str
    scope: RateLimitScope
    raw_limits: tuple[str, ...]


class RateLimitExceededError(Exception):
    def __init__(self, message: str, headers: dict[str, str] | None = None):
        super().__init__(message)
        self.headers = headers or {}


# This function takes a comma-separated string and turns it into a clean tuple of strings. "a","b" -> ("a", "b")
def _split_limits(value: str) -> tuple[str, ...]:
    return tuple(part.strip() for part in value.split(",") if part.strip())


LOGIN_LIMIT = RateLimitPolicy(
    name="login",
    scope="ip",
    raw_limits=_split_limits(settings.RATE_LIMIT_LOGIN_LIMITS),
)
SUMMARY_GENERATE_LIMIT = RateLimitPolicy(
    name="summary_generate",
    scope="authenticated",
    raw_limits=_split_limits(settings.RATE_LIMIT_SUMMARY_GENERATE_LIMITS),
)
UPLOAD_LIMIT = RateLimitPolicy(
    name="upload",
    scope="authenticated",
    raw_limits=_split_limits(settings.RATE_LIMIT_UPLOAD_LIMITS),
)
REGISTER_PATIENT_LIMIT = RateLimitPolicy(
    name="register_patient",
    scope="authenticated",
    raw_limits=_split_limits(settings.RATE_LIMIT_PATIENT_REGISTRATION_LIMITS),
)
AUTHENTICATED_API_LIMIT = RateLimitPolicy(
    name="authenticated_api",
    scope="authenticated",
    raw_limits=_split_limits(settings.RATE_LIMIT_AUTHENTICATED_LIMITS),
)
GLOBAL_IP_LIMIT = RateLimitPolicy(
    name="global_ip",
    scope="ip",
    raw_limits=_split_limits(settings.RATE_LIMIT_GLOBAL_IP_LIMITS),
)


class RateLimitService:
    def __init__(self) -> None:
        storage_uri = settings.RATE_LIMIT_REDIS_URL or "memory://"
        self.storage_uri = storage_uri
        self.storage = storage_from_string(storage_uri)
        self.limiter = FixedWindowRateLimiter(self.storage)

    @lru_cache(maxsize=32)
    def _items_for_policy(self, raw_limits: tuple[str, ...]):
        return tuple(parse(limit) for limit in raw_limits)

    def is_enabled(self) -> bool:
        return settings.RATE_LIMIT_ENABLED

    def get_client_ip(self, request: Request) -> str:
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            return forwarded.split(",")[0].strip()

        real_ip = request.headers.get("x-real-ip")
        if real_ip:
            return real_ip.strip()

        if request.client and request.client.host:
            return request.client.host

        return "unknown"

    def get_key(self, request: Request, scope: RateLimitScope) -> str:
        client_ip = self.get_client_ip(request)
        if scope == "ip":
            return f"ip:{client_ip}"

        token = request.cookies.get(settings.AUTH_COOKIE_NAME)
        if token:
            payload = decode_token(token)
            user_id = payload.get("sub") if payload else None
            if user_id:
                return f"user:{user_id}"

        return f"ip:{client_ip}"

    def _limit_value(self, raw_limit: str, item) -> str:
        return str(getattr(item, "amount", raw_limit))

    def _headers_for_policy(
        self, policy: RateLimitPolicy, item, stats, include_retry_after: bool
    ) -> dict[str, str]:
        reset_at = int(stats.reset_time)
        headers = {
            "X-RateLimit-Policy": policy.name,
            "X-RateLimit-Limit": self._limit_value(policy.raw_limits[0], item),
            "X-RateLimit-Remaining": str(max(0, int(stats.remaining))),
            "X-RateLimit-Reset": str(reset_at),
        }
        if include_retry_after:
            headers["Retry-After"] = str(max(1, reset_at - int(time.time())))
        return headers

    def check(self, policy: RateLimitPolicy, request: Request) -> dict[str, str]:
        if not self.is_enabled() or not policy.raw_limits:
            return {}

        key = self.get_key(request, policy.scope)
        items = self._items_for_policy(policy.raw_limits)
        primary_headers: dict[str, str] | None = None

        for raw_limit, item in zip(policy.raw_limits, items):
            allowed = self.limiter.hit(item, key)
            stats = self.limiter.get_window_stats(item, key)
            headers = self._headers_for_policy(
                policy, item, stats, include_retry_after=not allowed
            )

            if primary_headers is None:
                headers["X-RateLimit-Limit"] = self._limit_value(raw_limit, item)
                primary_headers = headers

            if not allowed:
                raise RateLimitExceededError(
                    message=f"Rate limit exceeded for {policy.name}",
                    headers=headers,
                )

        return primary_headers or {}


def should_skip_rate_limit(request: Request) -> bool:
    return request.method in {"OPTIONS", "HEAD"} or request.url.path in get_skip_paths()


def apply_headers(response: Response, headers: dict[str, str]) -> None:
    for key, value in headers.items():
        if key not in response.headers:
            response.headers[key] = value


def rate_limit_dependency(policy: RateLimitPolicy):
    async def dependency(request: Request, response: Response) -> None:
        headers = get_rate_limiter().check(policy, request)
        apply_headers(response, headers)

    return dependency


def build_rate_limit_error(headers: dict[str, str]) -> dict:
    policy_name = headers.get("X-RateLimit-Policy")
    suffix = f" ({policy_name})" if policy_name else ""
    return ErrorResponse(
        errors=[ErrorDetail(message=f"Rate limit exceeded{suffix}")]
    ).model_dump()


@lru_cache(maxsize=1)
def get_rate_limiter() -> RateLimitService:
    return RateLimitService()
