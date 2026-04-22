# ArogyaX - Backend

An async-first clinical API built with **FastAPI** and **PostgreSQL** - designed for real hospital workflows with a layered security model, automatic audit logging on every mutation, and a role-based permission system that goes down to the field level.

### 🌐 Live API Docs

<a href="https://arogyax-api.amithshankar.in/docs" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/View-API_Docs-green?style=for-the-badge&logo=fastapi" alt="API Docs"></a>

---

### 🏗️ Architecture

- **Framework**: FastAPI (fully async)
- **Database**: PostgreSQL with SQLAlchemy 2.0 async + Alembic migrations
- **Validation**: Pydantic V2 with custom field validators
- **Security**: JWT in HttpOnly cookies, BCrypt password hashing, per-route permission dependencies
- **Middleware**: Async audit logging, CORS, security headers (HSTS, CSP, X-Frame-Options)
- **Performance**: High-concurrency connection pooling (20+10), deep indexing on foreign keys, server-side data aggregation

---

### 🔒 Security & Access Control

The backend implements a **centralized RBAC permission matrix** - a single source of truth that maps each of the 8 staff roles to a dict of boolean permissions (`canEditCharting`, `canViewBilling`, `canManageUsers`, etc.). Every protected route uses a `require_permission()` FastAPI dependency that checks this matrix before the handler runs.

Beyond route-level access, **response censorship** is applied on patient and clinical data endpoints: roles without `canViewSensitiveData` receive redacted field values rather than the raw records. This means security is enforced in the data layer, not just the UI.

**First-login enforcement** - accounts created by admins carry a `password_type: system_generated` flag. The API rejects all non-auth requests from these accounts until the user completes a password change, preventing access with default credentials.

---

### 📋 Non-blocking Audit Logging

Every `POST`, `PUT`, `PATCH`, and `DELETE` request is intercepted by `AuditMiddleware`. To ensure zero latency for clinical users, logging is decoupled from the request-response cycle using `asyncio.create_task`. The system writes structured log entries in the background while the API responds immediately.

The audit log endpoint supports pagination, multi-field filtering (by role, action, date range, user), and CSV export for compliance reporting.

---

### 🚀 Performance Engineering

The API is tuned for low-latency clinical environments:

- **Foreign Key Indexing**: Deep indexing on `patient_id` across `ChartEntry`, `Invoice`, and `Prescription` models eliminates table scans during history retrieval.
- **Connection Pooling**: SQL Engine configured with `pool_size=20` and `max_overflow=10` to handle high-concurrency staff dashboards without request queuing.
- **Server-side Aggregation**: Analytic metrics (like visit frequency distribution) are computed via nested SQL aggregations on the database server to minimize payload size and frontend processing time.

### 📡 API Endpoint Reference

Full interactive documentation at [`/docs`](https://arogyax-api.amithshankar.in/docs) (Swagger) or `/redoc`.

| Resource            | Endpoint                       | Auth Required | Description                                             |
| :------------------ | :----------------------------- | :------------ | :------------------------------------------------------ |
| **Auth**            | `/auth`                        | Public        | Login, logout, profile, password change                 |
| **Patients**        | `/patients`                    | Yes           | Full CRUD for patient records                           |
| **Charts**          | `/patients/{id}/charts`        | Yes           | Visit notes, vitals, lab entries, clinical observations |
| **Prescriptions**   | `/patients/{id}/prescriptions` | Yes           | Medication orders with dosage and lifecycle status      |
| **Invoices**        | `/patients/{id}/invoices`      | Yes           | Per-patient billing                                     |
| **Billing**         | `/billing`                     | Admin         | Aggregate invoice view across all patients              |
| **Files**           | `/files`                       | Yes           | Lab report file uploads and retrieval                   |
| **AI Summary**      | `/patients/{id}/summary`       | Yes           | Generate and cache LLM patient status reports           |
| **Users**           | `/users`                       | Admin         | Staff account management and role assignment            |
| **Audit Log**       | `/audit-log`                   | Admin/Owner   | Paginated event log with export                         |
| **Admin Dashboard** | `/admin`                       | Admin         | Revenue aggregates and operational stats                |

---

### 📥 Setup & Launch

1. **Environment setup**

   ```bash
   python -m venv venv && .\venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   ```

   Required: `DATABASE_URL`, `JWT_SECRET_KEY`, `INITIAL_ADMIN_PHONE`, `INITIAL_ADMIN_PASSWORD`

2. **Run migrations & seed**

   ```bash
   alembic upgrade head
   python seed_admin.py
   ```

3. **Start**
   ```bash
   python -m uvicorn app.main:app --reload
   ```

---

### 🗂️ Maintenance

Archive audit logs older than N days:

```bash
python scripts/maintenance_archive.py 90
```

---

[Return to Root README](../README.md)
