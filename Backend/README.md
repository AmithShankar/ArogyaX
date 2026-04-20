# ArogyaX - Backend

High-performance clinical API built with FastAPI and PostgreSQL.

### 🌐 Live API Docs
<a href="https://arogyax-api.amithshankar.in/docs" target="_blank"><img src="https://img.shields.io/badge/View-API_Docs-green?style=for-the-badge&logo=fastapi" alt="API Docs"></a>

### 🏗️ Architecture
- **Framework**: FastAPI (Async)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy + Alembic
- **Security**: JWT Authentication + Password Hashing (BCrypt)
- **Validation**: Pydantic V2

### 📥 Setup & Launch

1.  **Environment Setup**:
    ```bash
    # Create virtual environment
    python -m venv venv

    # Activate
    .\venv\Scripts\activate

    # Install dependencies
    pip install -r requirements.txt
    ```

2.  **Database Configuration**:
    Configure your `.env` by referring to [`.env.example`](.env.example).

3.  **Seed Admin User**:
    ```bash
    python seed_admin.py
    ```

4.  **Launch API**:
    ```bash
    python -m uvicorn app.main:app --reload
    ```

### 🔒 Enterprise Standards
- **Middleware**: CORSMiddleware configured for strict local domains.
- **Audit Logs**: Automatic logging of data mutations (create, update, delete).
- **Scalability**: Async-first request handling for high-throughput environments.

---
[Return to Root README](../README.md)
