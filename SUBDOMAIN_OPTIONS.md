# Backend Subdomain & Deployment Options

This guide explains how to use your Vercel-managed domain for your FastAPI backend, either by proxying to Render (Recommended) or by deploying directly to Vercel.

---

## Option 1: Render + Vercel Subdomain (Recommended)

Keep the stability of a long-running server on Render, but use a clean subdomain like `api.yourdomain.com`.

### 1. In the Vercel Dashboard
- Go to **Domains** -> (Your Domain) -> **Manage DNS**.
- Add a new **CNAME Record**:
  - **Name**: `api`
  - **Value**: Your Render URL (e.g., `arogyax-api.onrender.com`).
  - **TTL**: `60` or `Automatic`.

### 2. In the Render Dashboard
- Go to your Web Service settings.
- Scroll to **Custom Domains**.
- Click **Add Custom Domain** and enter `api.yourdomain.com`.
- Render will automatically verify the DNS and issue an SSL certificate.

### Pros/Cons
- ✅ **Pros**: Zero cold starts, automatic migrations via Start Command, persistent logs.
- ❌ **Cons**: Needs two separate platforms (though free tiers work fine).

---

## Option 2: Deploy Backend to Vercel (Serverless)

Run the Python API entirely within Vercel's infrastructure.

### 1. Requirements
You must create a `vercel.json` file in the **project root** (ArogyaX/):

```json
{
  "version": 2,
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/Backend/app/main.py" }
  ],
  "functions": {
    "Backend/app/main.py": {
      "runtime": "vercel-python@0.10.0"
    }
  }
}
```

### 2. Critical Changes
- **Migrations**: You CANNOT run `alembic upgrade head` on Vercel. You must run it manually from your local PC whenever you change the database schema.
- **Paths**: You may need to adjust your Python `sys.path` or imports to account for the way Vercel bundles directories.

### Pros/Cons
- ✅ **Pros**: Everything in one dashboard, unified billing/limits, easy subdomain management.
- ❌ **Cons**: **Cold starts** (latency peaks after inactivity), manual migrations, limited to 10s-60s request execution time.

---

## My Recommendation

Go with **Option 1**. 

By using a **CNAME** in Vercel pointing to Render, you get the best of both worlds: a professional URL under your own domain, but with the reliable long-running architecture needed for a database-heavy app like ArogyaX.
