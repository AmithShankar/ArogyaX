import asyncio
import logging

from app.core.config import settings
from app.crud import crud_user
from app.db.database import AsyncSessionLocal
from app.models.user import UserRole
from app.schemas.user import UserCreate

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def seed_admin():
    async with AsyncSessionLocal() as db:
        admin_phone = settings.INITIAL_ADMIN_PHONE
        admin_password = settings.INITIAL_ADMIN_PASSWORD

        existing_user = await crud_user.get_user_by_phone(db, admin_phone)

        if existing_user:
            logger.info(f"Admin user with phone {admin_phone} already exists.")
            return

        logger.info("Creating initial admin user...")
        admin_in = {
            "phone": admin_phone,
            "name": f"System {settings.PROJECT_NAME} Admin",
            "role": UserRole.owner,
            "job_title": "System Administrator",
            "password": admin_password,
            "password_type": "admin_created",
            "status": "active",
        }

        try:
            await crud_user.create_user(db, UserCreate(**admin_in))
            logger.info("Successfully created admin user!")
            logger.info(f"Phone: {admin_phone}")
            logger.info(f"Password: {admin_password}")
        except Exception as e:
            logger.error(f"Error creating admin user: {e}")


if __name__ == "__main__":
    asyncio.run(seed_admin())
