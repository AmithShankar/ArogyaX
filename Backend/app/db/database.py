from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings

# Explicitly type as Any to allow both int and str values
connect_args: dict[str, Any] = {"statement_cache_size": 0}

if settings.DB_SSL_MODE == "require":
    connect_args["ssl"] = "require"

engine = create_async_engine(
    settings.ASYNC_DATABASE_URL,
    echo=False,
    connect_args=connect_args,
    pool_pre_ping=True,
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)
