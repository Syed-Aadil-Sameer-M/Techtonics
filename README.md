# ProcureX  
### Enterprise Procurement & Logistics Workspace

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20Data-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

ProcureX brings **request creation, approvals, purchase orders, inventory visibility, supplier management, dispatch tracking, and auditability** into one role-aware workspace.

---

## ✨ Why ProcureX

- 🎯 **Role-based operating model** for Admin, Requisitioner, and Procurement Officer
- 🔁 **End-to-end flow** from request to delivery
- 📊 **Live dashboards and analytics** for decisions with context
- 🔐 **Audit-ready operations** with traceable actions and status transitions

---

## 📈 Workflow Infographic

```mermaid
flowchart LR
    A[Requisitioner raises Material Request] --> B[Admin reviews & approves]
    B -->|Approved| C[Procurement Officer creates Purchase Order]
    B -->|Rejected| R[Request Closed]
    C --> D[Supplier processing & dispatch]
    D --> E[Goods received]
    E --> F[Inventory updated]
    F --> G[Audit logs + notifications]
```

---

## 🧩 System Snapshot

```mermaid
graph TD
    UI[React + Vite Frontend]
    STATE[Zustand State Layer]
    AUTH[Supabase Auth]
    DB[Supabase Database]
    CHARTS[Recharts Dashboards]

    UI --> STATE
    STATE --> AUTH
    STATE --> DB
    UI --> CHARTS
```

---

## 👥 Role Matrix

| Role | Core Responsibility | Key Modules |
|---|---|---|
| **ADMIN** | Oversight, approvals, governance, user control | Dashboard, Approvals, POs, Users, Reports, Audit, Tasks, Settings |
| **RECEIVER** (Requisitioner) | Raise and track requests | Dashboard, Requests, New Request, Tasks, Notifications |
| **PROCUREMENT** | Execute sourcing and order lifecycle | Dashboard, Approved Requests, Inventory, Purchase Requests, Purchase Orders, Suppliers, Dispatch |

---

## 🛠 Tech Stack

- **Frontend:** React 18 + TypeScript + Vite  
- **Styling/UI:** Tailwind CSS + custom component system  
- **State Management:** Zustand  
- **Charts:** Recharts  
- **Backend Services:** Supabase (Auth + Database)  

---

## 🚀 Quick Start

### 1) Clone and install

```bash
git clone <your-repo-url>
cd Techtonics
npm install
```

### 2) Configure environment

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Set:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3) Run locally

```bash
npm run dev
```

---

## 📦 Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint checks |
| `npm run typecheck` | Run TypeScript type checks |

---

## 🗂 Project Structure

```text
src/
├── components/
│   ├── shared/
│   └── ui/
├── pages/
│   ├── admin/
│   ├── auth/
│   ├── officer/
│   └── requisitioner/
├── lib/
├── store/
└── types/
supabase/
└── migrations/
```

---

## 🔒 Operational Highlights

- Session-aware authentication using Supabase
- Password change flow support (`mustChangePassword`)
- Centralized toast/error handling
- Workflow transparency through status-driven UI and activity trails

---

## 🤝 Contributing

1. Create a feature branch
2. Make focused changes
3. Run lint + typecheck
4. Open a pull request with a clear summary

---

## 📜 License

Add your preferred license (MIT/Apache-2.0/etc.) in `LICENSE` if not already present.
