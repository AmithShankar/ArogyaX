import asyncio
import hashlib
import os
import sys
import uuid

from app.models.user import User, UserRole, UserStatus
from dotenv import load_dotenv
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

# Re-implementing the app's security logic for direct seeding
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _get_password_hash(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def get_password(password: str) -> str:
    return pwd_context.hash(_get_password_hash(password))


# Load Env
load_dotenv()
DATABASE_URL = os.getenv("ASYNC_DATABASE_URL") or os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("Database URL not found in .env (Check ASYNC_DATABASE_URL or DATABASE_URL)")
    exit(1)

# Normalize URL for asyncpg
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://")
elif DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
elif DATABASE_URL.startswith("postgresql+psycopg2://"):
    DATABASE_URL = DATABASE_URL.replace(
        "postgresql+psycopg2://", "postgresql+asyncpg://"
    )

# Robust Pathing: Ensure app is findable regardless of where script is run
script_dir = os.path.dirname(os.path.abspath(__file__))
if script_dir not in sys.path:
    sys.path.append(script_dir)
project_root = os.path.abspath(os.path.join(script_dir, ".."))
if project_root not in sys.path:
    sys.path.append(project_root)


async def seed_extra_users():
    # Final check for type safety
    if not DATABASE_URL:
        print("DATABASE_URL is still None. Exiting.")
        return

    engine = create_async_engine(DATABASE_URL, echo=True)
    async_session = async_sessionmaker(engine, expire_on_commit=False)

    users_to_seed = [
        {
            "phone": "1",
            "name": "Dr. Aris Sudarshan",
            "role": UserRole.doctor,
            "job_title": "Lead Medical Officer",
        },
        {
            "phone": "2",
            "name": "Meera Kulkarni",
            "role": UserRole.nurse,
            "job_title": "Senior Clinical Nurse",
        },
        {
            "phone": "3",
            "name": "Ananya Roy",
            "role": UserRole.reception,
            "job_title": "Front Desk Manager",
        },
        {
            "phone": "4",
            "name": "Rajiv Saxena",
            "role": UserRole.pharmacy,
            "job_title": "Chief Pharmacist",
        },
        {
            "phone": "5",
            "name": "Sanjay Gupta",
            "role": UserRole.lab_tech,
            "job_title": "Senior Pathologist",
        },
        {
            "phone": "6",
            "name": "Neelam Sharma",
            "role": UserRole.hospital_admin,
            "job_title": "Operations Director",
        },
        {
            "phone": "7",
            "name": "Amith Shankar",
            "role": UserRole.owner,
            "job_title": "Clinical Director",
        },
    ]

    async with async_session() as session:
        for user_data in users_to_seed:
            result = await session.execute(
                select(User).where(User.phone == user_data["phone"])
            )
            existing_user = result.scalar_one_or_none()

            if existing_user:
                print(f"Updating existing user with phone {user_data['phone']}...")
                existing_user.password = get_password("temp")
                existing_user.role = user_data["role"]
                existing_user.name = user_data["name"]
                existing_user.job_title = user_data["job_title"]
            else:
                new_user = User(
                    id=str(uuid.uuid4()),
                    phone=user_data["phone"],
                    name=user_data["name"],
                    password=get_password("temp"),
                    role=user_data["role"],
                    status=UserStatus.active,
                    job_title=user_data["job_title"],
                    password_type="admin_created",
                )
                session.add(new_user)
                print(f"Added {user_data['name']} (Phone: {user_data['phone']})")

        await session.commit()
        print("Success: 7 staff members seeded!")


if __name__ == "__main__":
    asyncio.run(seed_extra_users())
