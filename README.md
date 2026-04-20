# ArogyaX

A unified hospital operating system for clinical workflows, patient records, and hospital administration.

---

### 🌐 Live Demo
<a href="https://arogyax.amithshankar.in" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/Frontend-Live_Demo-blue?style=for-the-badge&logo=nextdotjs" alt="Frontend Live Demo"></a>
<a href="https://arogyax-api.amithshankar.in/docs" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/Backend-API_Docs-green?style=for-the-badge&logo=fastapi" alt="Backend API Docs"></a>

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
