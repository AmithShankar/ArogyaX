# ArogyaX

A production-grade, full-stack hospital management system covering the entire clinical and administrative lifecycle - patient registration, bedside charting, prescriptions, lab diagnostics, billing, staff management, and compliance auditing. The architecture is built around a layered security model with role-scoped data access enforced at every layer of the stack.

---

### 🌐 Live Demo

<a href="https://arogyax.amithshankar.in" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/Frontend-Live_Demo-blue?style=for-the-badge&logo=nextdotjs" alt="Frontend Live Demo"></a>
<a href="https://arogyax-api.amithshankar.in/docs" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/Backend-API_Docs-green?style=for-the-badge&logo=fastapi" alt="Backend API Docs"></a>

---

### 🩺 Comprehensive Feature Set

#### 🏥 Clinical Operations
*   **Bedside Charting**: Real-time documentation of vitals, clinical notes, and visit summaries.
*   **Digital Prescriptions**: Full medication lifecycle management with dosage, frequency, and status tracking.
*   **Diagnostic Lab Hub**: Integrated lab result management with file uploads and inline report previews.
*   **Clinical Feed**: Live activity stream of patient updates for doctors and nursing staff.

#### 👥 Patient & Staff Management
*   **Patient Registry**: Centralized directory with advanced search and SSR for instant loading.
*   **Unified History**: Complete chronological timeline spanning visits, prescriptions, and lab entries.
*   **Staff Governance**: 8 distinct roles with purpose-built dashboards and granular permission gating.
*   **Account Security**: Mandatory password rotation and HttpOnly session management.

#### 💰 Billing & Governance
*   **Automated Invoicing**: Per-patient billing integrated directly with clinical chart activity.
*   **Admin Analytics**: High-performance dashboards for revenue tracking and patient visit frequency.
*   **Audit Trail**: Non-blocking, background-captured logs of every system mutation for compliance.
*   **Data Redaction**: Automated censorship of sensitive clinical data based on staff role.

#### 🚀 Performance Architecture
*   **Sub-second Dashboards**: Bulk-parallel fetching and server-side aggregation eliminate bottlenecks.
*   **Deep Indexing**: Optimized database layer for high-speed retrieval of clinical history.
*   **Visual Stability**: Route-level streaming skeletons to eliminate layout shift (Zero CLS).

---

### 🏗️ Project Structure

| Module       | Technology                                               | Docs                                    |
| :----------- | :------------------------------------------------------- | :-------------------------------------- |
| **Frontend** | Next.js 16, Tailwind CSS, shadcn/ui, TanStack Query      | [Frontend README](./Frontend/README.md) |
| **Backend**  | FastAPI, SQLAlchemy 2.0 (async), PostgreSQL, Pydantic V2 | [Backend README](./Backend/README.md)   |

---

### 🛠️ Local Development

#### Backend

```bash
cd Backend
python -m venv venv && .\venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # set DATABASE_URL and JWT_SECRET_KEY
alembic upgrade head
python seed_admin.py
python -m uvicorn app.main:app --reload
```

#### Frontend

```bash
cd Frontend
pnpm install
cp .env.example .env.local  # set INTERNAL_BACKEND_URL
pnpm dev
```
