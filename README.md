# ArogyaX

A hospital management system for patient records, clinical charts, billing, and staff.

## Project Structure

- **Frontend**: Next.js 16 app with role-specific dashboards.
- **Backend**: FastAPI with PostgreSQL and JWT authentication.
- **Security**: Role-based access control and audit logging for all changes.

---

## Documentation

- [Frontend Details](./Frontend/README.md)
- [Backend Details](./Backend/README.md)

---

## Features

- **8 Staff Roles**: Views for doctors, nurses, receptionists, pharmacists, lab techs, and admins.
- **Patient Files**: Clinical history, vitals, and digital prescriptions.
- **Lab Results**: File uploads and previews for reports.
- **Invoicing**: Payment tracking and revenue overviews.
- **Audit Log**: Records of all changes with user attribution.
- **AI Summary**: Patient status summaries via LLM.

---

## Project Structure

```
ArogyaX/
├── Frontend/               # Next.js App Router application
│   ├── src/app/            # Route segments
│   ├── src/components/     # UI components
│   ├── src/features/       # Feature logic
│   └── src/lib/            # API client and utilities
├── Backend/                # FastAPI application
│   ├── app/api/routes/     # Route handlers
│   ├── app/core/           # Auth, RBAC, and config
│   ├── app/crud/           # Database access
│   ├── app/models/         # SQLAlchemy models
│   ├── app/schemas/        # Pydantic schemas
│   └── app/middleware/     # Audit logging
└── README.md
```

## Quick Start (Local Development)

**Backend**
```bash
cd Backend
uvicorn app.main:app --reload
```

**Frontend**
```bash
cd Frontend
pnpm dev
```

---

## Full Setup

### Backend
1. **Environment**: `cd Backend && python -m venv .venv && .venv\Scripts\activate`
2. **Install**: `pip install -r requirements.txt`
3. **Config**: `cp .env.example .env`
4. **Init**: `alembic upgrade head && python seed_admin.py`

### Frontend
1. **Install**: `cd Frontend && pnpm install`
2. **Config**: `cp .env.example .env`
3. **Start**: `pnpm dev`