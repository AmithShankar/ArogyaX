# ArogyaX Backend

FastAPI application handling hospital data, authentication, and security logging.

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy 2.0 (async)
- **Migrations**: Alembic
- **Validation**: Pydantic v2
- **Auth**: JWT (cookies)

## Key Features

- **RBAC**: A permissions matrix controls access for 8 roles (Doctor, Nurse, Admin, etc.).
- **Audit Logging**: Middleware records all data changes (User, Action, Resource) automatically.
- **Async DB**: Full async implementation for database sessions.
- **Redaction**: Sensitive patient data is hidden from staff roles without sufficient clearance.

## Quick Start

```bash
uvicorn app.main:app --reload
```

API documentation: `http://localhost:8000/docs`

## Full Setup

### 1. Environment & Dependencies
```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configuration
```bash
cp .env.example .env
```

### 3. Database & Admin
```bash
alembic upgrade head
python seed_admin.py        # Create initial admin account
```

## Deployment

**Build Command**: `pip install -r requirements.txt`
**Start Command**: `alembic upgrade head && python seed_admin.py && gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app`
