from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings

connect_args = {}
if settings.DB_SSL_MODE == "require":
    connect_args["ssl"] = "require"

engine = create_async_engine(
    settings.ASYNC_DATABASE_URL,
    echo=False,
    connect_args=connect_args,
    prepared_statement_cache_size=0,
    pool_pre_ping=True
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)
