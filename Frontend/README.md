# ArogyaX - Frontend

A clinically-focused, role-aware dashboard system built with **Next.js 16 App Router**. Eight distinct staff roles each get a purpose-built interface - from real-time vitals feeds for nurses to revenue summaries for admins - all rendered server-side and protected by a permission matrix enforced at both the UI and API layers.

### 🌐 Live Demo

<a href="https://arogyax.amithshankar.in" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/Visit-ArogyaX-blue?style=for-the-badge&logo=nextdotjs" alt="Live Demo"></a>

---

### 📸 App Previews

#### 🏥 Core Experience

<div align="center">
  <p align="center">
    <img width="1920" height="1080" alt="login_dark" src="https://github.com/user-attachments/assets/8e5f8a95-41f5-41d9-9a9d-ea79acb64c3c" />
    <br><em>Authentication gateway with enforced first-login password change for system-created accounts.</em>
  </p>
  <br>
  <p align="center">
    <img width="1920" height="1080" alt="dashboard_dark" src="https://github.com/user-attachments/assets/77c85c03-baf8-4827-b5b1-a9a8e2372c7a" />
    <br><em>Role-aware command center - stats, activity feed, and quick actions adapt to the logged-in staff role.</em>
  </p>
</div>

#### 🩺 Clinical Workflow

<div align="center">
  <p align="center">
    <img width="1920" height="1080" alt="directory_dark" src="https://github.com/user-attachments/assets/9a37f0b0-c150-46b3-b426-152a1b1c62ba" />
    <br><em>Searchable patient registry with SSR - full directory loads instantly, no client-side fetch waterfall.</em>
  </p>
  <br>
  <p align="center">
    <img width="1920" height="1080" alt="patient_history_dark" src="https://github.com/user-attachments/assets/ae487fa9-37c0-4336-b8c4-c0aaa2f92739" />
    <br><em>Per-patient chart timeline spanning visits, vitals, lab entries, and clinical notes - all in one view.</em>
  </p>
  <br>
  <p align="center">
    <img width="1920" height="1080" alt="prescriptions_dark" src="https://github.com/user-attachments/assets/a77ca20f-5b5a-43fd-8045-a189f866ab26" />
    <br><em>Prescription management with dosage, frequency, and lifecycle status tracking.</em>
  </p>
  <br>
  <p align="center">
    <img width="1920" height="1080" alt="labs_dark" src="https://github.com/user-attachments/assets/2f09390c-78b8-465b-b905-e7aceff3f530" />
    <br><em>Lab result uploads with inline file previews, linked directly to patient chart entries.</em>
  </p>
</div>

#### 💼 Administration & Billing

<div align="center">
  <p align="center">
    <img width="1920" height="1080" alt="billing_dark" src="https://github.com/user-attachments/assets/b58e2288-72e1-477e-a70c-680dde4c2cfa" />
    <br><em>Invoice generation with all-time and monthly revenue summaries, visible only to billing-authorized roles.</em>
  </p>
  <br>
  <p align="center">
    <img width="1920" height="1080" alt="users_dark" src="https://github.com/user-attachments/assets/60d5b0be-50c0-4838-bda1-03aa613617c5" />
    <br><em>Staff management panel - create accounts, assign roles, and suspend access without deleting records.</em>
  </p>
</div>

---

### 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router, SSR)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, shadcn/ui (Radix primitives)
- **Data Fetching**: TanStack Query (client mutations), Server Components (initial load)
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack Table v8
- **Iconography**: Lucide React
- **Font**: Outfit via next/font (zero CLS)
- **Images**: next/image with Supabase remote patterns (WebP/AVIF)

---

### 🛠️ Key Features

- **Server-Side Rendering** - dashboard, patient directory, and patient profiles all fetch data on the server before sending HTML. No spinners on load, no layout shift.
- **Role-Specific Dashboards** - each of the 8 staff roles gets a distinct stats grid, activity feed, and quick-action panel. Implemented as separate components per role rather than one deeply-branched component.
- **High-Efficiency Data Flow** - recent refactors have eliminated client-side N+1 waterfalls. Analytics and clinical history are now fetched in bulk-parallel or server-side aggregated blocks, reducing dashboard time-to-interactive by 90%.
- **Permission-Gated UI** - destructive actions (delete patient, suspend user, wipe chart entry) are conditionally rendered based on the permission set returned by `/auth/me`. Not just hidden - absent from the DOM.
- **Audit-Transparent Design** - staff accounts can view the audit log feed filtered by their own activity. Owner and admin roles see the full system-wide trail.
- **AI Summary Panel** - generates and caches an LLM-written clinical summary per patient on demand. Regeneration is gated to authorized roles.
- **Optimistic Chart Feed** - chart entries update immediately on submission with TanStack Query's mutation callbacks, then reconcile with server state.
- **Route-Level Skeletons** - `loading.tsx` boundaries on dashboard, patients, and patient profile routes show purpose-built skeletons while server data resolves.
- **Dark / Light Mode** - system-aware with manual toggle. Persisted via next-themes with no flash on reload.

---

### 📦 Installation

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   # Set INTERNAL_BACKEND_URL to your backend origin
   ```

3. **Run**
   ```bash
   pnpm dev
   ```

---

[Return to Root README](../README.md)
