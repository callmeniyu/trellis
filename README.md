# Trellis — Modern SaaS Administration Platform

Trellis is a polished, fully functional, frontend-only SaaS administration application built with **React 19**, **strict TypeScript**, and **Vite**.

Engineered with a clean, semantic design system across every view, Trellis provides an executive-ready foundation for dashboards, CRM, customer billing, product catalogs, and analytics platforms.

Every screen operates immediately after `npm install && npm run dev` using an in-process mock server powered by **MSW v2** with deterministic seed data and automatic browser localStorage persistence.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-a855f7.svg)](https://vite.dev/)

---

## Key Features

- **Public Landing Page** — SEO-optimized marketing page at `/` with hero, feature overview, architecture diagram, interactive demo section, and FAQ.
- **Executive Dashboard** (`/dashboard`) — Education-focused redesign featuring KPI cards with inline sparklines (Students, Teachers, Programs), Top Programs donut chart with center label, Total Children stacked area chart (Infant/Toddler/School Age), Program cards with cover images and session details, Revenue bar chart with 1st/2nd biannual period toggle, Messages panel with Add Message CTA, Student list with search/edit/delete actions, Calendar widget (monthly grid, today highlight, event dots, prev/next navigation), and Schedule section with colored date badges — all in a three-column responsive layout.
- **Analytics** (`/dashboard/analytics`) — URL-synced 7d/30d/90d range selector, KPI cards with period-over-period deltas, revenue/visitors area & bar charts, sessions-by-country donut with legend, and top-pages ranked list with change indicators.
- **User Management** — Full directory with search, filtering by role and status, multi-column sorting, pagination, user detail pages, creation/editing forms in dialogs, and delete confirmation dialogs with email uniqueness validation.
- **Product Catalog** — Complete inventory CRUD with SKU formatting, category classification, price formatting, stock status indicators, and detail views.
- **Order Management** — Customer transactions with line item calculations, payment statuses, fulfillment statuses, and state transitions.
- **Project Tracking** — Project milestones, progress bars (0–100%), client attribution, target dates, and status transitions with create/edit/delete dialogs.
- **Invoices & Billing** — Billing ledger with amount calculations, customer linking, due dates, modal detail inspection, and lifecycle status transitions (`draft` → `sent` → `paid` / `overdue` / `cancelled`).
- **Notifications** — Topbar dropdown menu panel with real-time unread badges, mark-as-read, and mark-all-as-read capabilities.
- **Workspace Settings** — Profile updates, table pagination preferences, compact layout toggle, email digest preferences, and interactive demonstration data reset with confirmation dialog.
- **Design System** — Semantic design tokens (`tokens.css`) supporting light/dark/system themes with zero hardcoded colors, custom SVG icon set (lucide-react), and accessible UI primitives (Dialog, DropdownMenu, Tabs, Table, Pagination, Badge, Avatar, etc.).
- **Custom Charts** — Zero external charting library; hand-rolled responsive SVG AreaChart, BarChart, and DonutChart components reading colors from `--chart-*` tokens and measuring width via `ResizeObserver`.

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
