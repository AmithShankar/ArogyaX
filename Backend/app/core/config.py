from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "ArogyaX"
    PROJECT_ACRONYM: str = "HPMS"
    DATABASE_URL: str = ""
    ASYNC_DATABASE_URL: str = ""

    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Initial Admin (for seeding)
    INITIAL_ADMIN_PHONE: str
    INITIAL_ADMIN_PASSWORD: str

    # Cookie Settings
    AUTH_COOKIE_NAME: str = "auth-token"
    AUTH_COOKIE_PATH: str = "/"
    AUTH_COOKIE_HTTPONLY: bool = True
    AUTH_COOKIE_SAMESITE: Literal["lax", "strict", "none"] = "lax"
    AUTH_COOKIE_DOMAIN: str | None = None
    PASSWORD_TYPE_COOKIE: str = "password-type"

    # Password Policy
    PASSWORD_MIN_LENGTH: int = 8
    PASSWORD_REQUIRE_UPPERCASE: bool = True
    PASSWORD_REQUIRE_LOWERCASE: bool = True
    PASSWORD_REQUIRE_DIGIT: bool = True

    CORS_ORIGINS: str = "http://localhost:3000"
    UPLOAD_DIR: str = "uploads"

    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_REDIS_URL: str = ""
    RATE_LIMIT_GLOBAL_IP_LIMITS: str = "300/minute"
    RATE_LIMIT_AUTHENTICATED_LIMITS: str = "120/minute"
    RATE_LIMIT_LOGIN_LIMITS: str = "5/minute,20/15minute"
    RATE_LIMIT_SUMMARY_GENERATE_LIMITS: str = "5/minute"
    RATE_LIMIT_UPLOAD_LIMITS: str = "10/minute"
    RATE_LIMIT_PATIENT_REGISTRATION_LIMITS: str = "10/minute,50/hour"
    RATE_LIMIT_SKIP_PATHS: list[str] = ["/", "/docs", "/redoc", "/openapi.json"]

    # Supabase Storage (for production)
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_KEY: str = ""
    SUPABASE_STORAGE_BUCKET: str = "lab-reports"

    # Database SSL configuration
    DB_SSL_MODE: str = "prefer"

    IS_PRODUCTION: bool = False
    USE_PROXY_HEADERS: bool = False

    model_config = SettingsConfigDict(env_file=".env")

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]


settings = Settings()  # type: ignore[call-arg]
