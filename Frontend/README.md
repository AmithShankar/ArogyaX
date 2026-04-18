# ArogyaX Frontend

Next.js interface for clinical staff and administration.

## Features

- **Staff Dashboards**: Dashboards for 8 staff types (Doctor, Nurse, Pharm, etc.) with specific stats and actions.
- **Patient Records**: Registration, profiles, and chronological chart feeds.
- **Clinical Data**: Digital prescriptions, vitals tracking, and lab report uploads.
- **Billing**: Itemized invoices and revenue tracking.
- **Security**: Role-based routing and first-login password enforcement.
- **UI**: Dark/light mode theme with responsive navigation.

## Tech Stack

- **Next.js 16** (App Router)
- **Tailwind CSS**
- **TanStack Query** (Data fetching)
- **Zustand** (State management)
- **TanStack Table** (Data grids)
- **Sonner** (Notifications)

## Quick Start

```bash
pnpm dev
```

## Full Setup

### 1. Prerequisites
- Node.js v18+ and pnpm

### 2. Installation
```bash
pnpm install
```

### 3. Configuration
```bash
cp .env.example .env   # Update INTERNAL_BACKEND_URL
```

## Deployment

1. Set **Root Directory** to `Frontend/`.
2. Add `INTERNAL_BACKEND_URL` pointing to your deployed backend.
