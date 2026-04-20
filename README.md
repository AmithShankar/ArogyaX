# ArogyaX

A unified hospital operating system for clinical workflows, patient records, and hospital administration.

---

### ✨ Features
- **Dashboard**: Operational overview of patients and bills.
- **Patients**: Comprehensive profiles with medical history and charting.
- **Prescriptions**: Digital medication records.
- **Billing**: Invoice generation and payment tracking.
- **Audit Logging**: System-wide event tracking for all changes.

### 🏗️ Project Structure
| Module | Technology | Path |
| :--- | :--- | :--- |
| **Frontend** | Next.js, pnpm, Tailwind | [`./Frontend`](./Frontend/README.md) |
| **Backend** | FastAPI, Python, SQLAlchemy | [`./Backend`](./Backend/README.md) |
| **Database** | PostgreSQL | Managed via SQLAlchemy |

### 🛠️ Local Development

#### 1. Backend Setup
```bash
cd Backend
python -m venv venv
.\venv\Scripts\activate

pip install -r requirements.txt
python seed_admin.py
python -m uvicorn app.main:app --reload
```

#### 2. Frontend Setup
```bash
cd Frontend
pnpm install
pnpm dev
```
