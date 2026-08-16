# ArogyaX Deployment Guide

Exact configuration steps for deploying the full-stack system to Supabase, Render, and Vercel.

---

## 1. Database (Supabase)

1. **Create Project**: Start a new project at [Supabase](https://supabase.com).
2. **Retrieve URI**: Go to **Settings** -> **Database**.
3. **Copy Connection String**: Select the **URI** tab and copy it.
   - It looks like: `postgresql://postgres:[PASSWORD]@db.[ID].supabase.co:5432/postgres`
4. **Create Storage Bucket**:
   - Go to **Storage**.
   - Create a new **Public** bucket named `lab-reports`.

---

## 2. Backend (Render)

Create a new **Web Service** on [Render](https://render.com) and connect your repository.

### Configuration Fields:
- **Root Directory**: `Backend`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `alembic upgrade head && python seed_admin.py && gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app`

### Environment Variables:
- `DATABASE_URL`: Your Supabase Pooler URI + `?sslmode=require` (for migrations).
- `ASYNC_DATABASE_URL`: Your Supabase Pooler URI + `?ssl=require` (for runtime).
- `JWT_SECRET_KEY`: A random 32-character hex string.
- `JWT_ALGORITHM`: `HS256`
- `INITIAL_ADMIN_PHONE`: The phone number for your first admin (e.g., `0000000000`).
- `INITIAL_ADMIN_PASSWORD`: The password for your first admin (min 8 chars).
- `SUPABASE_URL`: Your Supabase Project URL.
- `SUPABASE_SERVICE_KEY`: Your Supabase `service_role` secret (used for cloud storage).
- `SUPABASE_STORAGE_BUCKET`: `lab-reports`
- `IS_PRODUCTION`: `True`
- `CORS_ORIGINS`: Your Vercel domain (e.g., `https://arogyax.vercel.app`).
- `DB_SSL_MODE`: `require`

---

## 3. Frontend (Vercel)

Create a new project on [Vercel](https://vercel.com) and connect your repository.

### Configuration Fields:
- **Framework Preset**: `Next.js`
- **Root Directory**: `Frontend`
- **Build Command**: `pnpm build` (Enable "Override" and type this manually if needed)
- **Install Command**: `pnpm install`
- **Output Directory**: `.next`

### Environment Variables:
- `INTERNAL_BACKEND_URL`: Your Render Web Service URL (e.g., `https://arogyax-api.onrender.com`).
- `NEXT_PUBLIC_API_URL`: Same as above (used for client-side links).

---

## 4. Verification

1. **API Status**: Visit your Render URL. You should see "ArogyaX API is running".
2. **Auth Service**: Check `/auth/me` to verify JWT and DB connectivity.
3. **Login**: Visit the Vercel site and log in with your seeded administrator account.
