# Trellis — Modern SaaS Administration Platform

Trellis is a polished, fully functional, frontend-only SaaS administration application built with **React 19**, **strict TypeScript**, and **Vite**.

Engineered with a clean, premium **white theme** across every view, Trellis provides an executive-ready foundation for dashboards, CRM, customer billing, product catalogs, and analytics platforms.

Every screen operates immediately after `npm install && npm run dev` using an in-process mock server powered by **MSW v2** with deterministic seed data and automatic browser local storage persistence.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-a855f7.svg)](https://vite.dev/)

---

## Key Features

- **Executive Dashboard** — Key performance indicators with sparklines, monthly revenue trends, recent orders table, inventory distribution donut chart, quick actions, and live workspace activity audit feed.
- **User Management** — Full directory with search, filtering by role and status, sorting, pagination, user detail pages, creation/editing forms, and delete confirmation dialogs with email uniqueness validation.
- **Product Catalog** — Complete inventory CRUD with SKU formatting, category classification, price formatting, stock status indicators, and detail views.
- **Order Management** — Customer transactions with line item calculations, payment statuses, fulfillment statuses, and state transitions.
- **Project Tracking** — Project milestones, progress bars (0–100%), client attribution, target dates, and status transitions.
- **Invoices & Billing** — Billing ledger with amount calculations, customer linking, due dates, modal detail inspection, and lifecycle status transitions (`draft` → `sent` → `paid` / `cancelled`).
- **Data-Driven Analytics** — Synchronized 7-day, 30-day, and 90-day time horizons with responsive SVG area, bar, and donut charts computed from real database records.
- **Notifications** — Dropdown menu panel with real-time unread badges, mark-as-read, and mark-all-as-read capabilities.
- **Workspace Settings** — Profile updates, table pagination preferences, compact layout toggle, email digest preferences, and interactive demonstration data reset with confirmation.
- **White-Only Design System** — Unified design tokens ensuring high contrast, clean typography, visible borders, and zero dark-theme clutter.

---

## Demonstration Credentials

Trellis includes pre-configured local demonstration credentials for easy access:

| Role        | Email                  | Password         | Notes                          |
| ----------- | ---------------------- | ---------------- | ------------------------------ |
| **Admin**   | `admin@trellis.demo`   | `TrellisDemo123` | Full administrative privileges |
| **Manager** | `manager@trellis.demo` | `manager123`     | Management role                |

On the login page (`/login`), click **"Use Demo"** to automatically fill the credentials.

---

## Tech Stack

| Layer               | Technology                                   | Notes                                                                |
| ------------------- | -------------------------------------------- | -------------------------------------------------------------------- |
| **Runtime**         | React 19                                     | StrictMode enabled                                                   |
| **Language**        | TypeScript (~6.0)                            | Strict mode, verbatimModuleSyntax, erasableSyntaxOnly                |
| **Build & Tooling** | Vite 8                                       | Hot module reloading, optimized production bundling                  |
| **Styling**         | Plain CSS + Semantic Tokens                  | Pure white theme palette (`tokens.css`), zero CSS-in-JS dependencies |
| **Routing**         | React Router v7                              | Lazy-loaded pages, breadcrumb tracking                               |
| **Server State**    | TanStack Query v5                            | Query caching, invalidation, mutation tracking                       |
| **Forms & Schema**  | Custom `useForm` + Zod v4                    | Unified request validation contracts shared across client and mock   |
| **Charts**          | Custom SVG Components                        | Zero external charting library; fully responsive via ResizeObserver  |
| **Mock Engine**     | MSW v2 (`msw/browser` + in-process dispatch) | Deterministic JSON database with browser localStorage persistence    |
| **Icons**           | Lucide React                                 | Consistent SVG icon set                                              |
| **Testing**         | Vitest 4 + Testing Library + MSW Node        | Unit, component, and end-to-end service integration tests            |

---

## Architecture & Data Flow

Trellis adheres to strict unidirectional layering:

```
UI Component → Custom Hook → Feature Service → API Client → MSW Mock Handler → Browser Persistence
```

1. **Components** never communicate directly with HTTP or mock database files.
2. **Hooks** manage asynchronous server state, caching, and cache invalidation via TanStack Query.
3. **Services** (`<domain>.service.ts`) define the boundary for HTTP operations.
4. **Zod Schemas** (`src/models/schemas.ts`) validate request payloads on both form inputs and mock handlers.
5. **Mock Server** resolves requests in-process without requiring a live Service Worker or server runtime, making it 100% compatible with static hosting environments.

---

## Data Persistence & Reset

- **Automatic Browser Persistence:** Changes created during a session (adding a user, editing a product, updating order or invoice status) are automatically persisted to the browser's `localStorage` (`trellis.mock.db`).
- **Corruption Recovery:** If stored data is corrupted or invalid, Trellis recovers gracefully by restoring pristine seed data without crashing.
- **Isolated Storage:** Trellis operates strictly within its own storage keys (`trellis.*`), ensuring no collision with unrelated storage items.
- **One-Click Reset:** In **Settings → Demo Data Management**, clicking **"Reset Demo Data"** clears custom mutations and restores default demonstration seeds after user confirmation.

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Trellis

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to explore Trellis.

---

## Verification & Scripts

| Command             | Description                                       |
| ------------------- | ------------------------------------------------- |
| `npm run dev`       | Starts the local development server               |
| `npm run build`     | Executes typecheck (`tsc -b`) and Vite build      |
| `npm run typecheck` | Runs TypeScript compiler across all project files |
| `npm run lint`      | Runs ESLint to verify code quality standards      |
| `npm run test:run`  | Executes the complete Vitest automated test suite |
| `npm run preview`   | Serves the production build locally               |
| `npm run seed`      | Deterministically regenerates mock JSON databases |
| `npm run format`    | Formats codebase using Prettier                   |

---

## Static Deployment

Trellis is built to deploy seamlessly on static web hosts such as Vercel, Netlify, GitHub Pages, or Cloudflare Pages.

Because the mock API runs in-process within the client bundle:

- No server-side environment variables are required.
- No external backend or database connections are needed.
- `vercel.json` includes SPA rewrites (`/(.*) -> /index.html`) so refreshing nested routes functions correctly.

To build for production:

```bash
npm run build
npm run preview
```

---

## Replacing the Mock Backend

When you are ready to connect Trellis to a live backend:

1. Update `.env`:
   ```bash
   VITE_API_URL=https://api.yourdomain.com
   VITE_ENABLE_MOCK_API=false
   ```
2. Ensure your backend matches the standard envelope structure:
   - Lists: `{ "data": [...], "meta": { "page", "pageSize", "total", "totalPages" } }`
   - Single entities: `{ "data": { ... } }`
   - Errors: `{ "code": string, "message": string, "fields"?: Record<string, string> }`
3. Delete `src/data/mock-server/` when ready — the UI and query hooks will continue functioning unchanged.

---

## License

This project is licensed under the [MIT License](./LICENSE). Original copyright notice preserved in accordance with license requirements.
