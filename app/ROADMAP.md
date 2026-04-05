# Chacra — Roadmap

Where we are and what's next. Updated after each milestone.
What gets built is defined in SPEC.md. How it's built is in ARCHITECTURE.md.

---

## Phase Overview

| Phase | Name | Status |
|-------|------|--------|
| 0 | Restructure | DONE |
| 1 | Foundation | DONE |
| 2 | Core Modules | DONE |
| 3 | UI | DONE |
| 4 | Polish | DONE |
| 5 | Demo-Ready | DONE |

---

## Phase 0: Restructure

Clean project structure and tooling before any feature work.

| Task | Status | Notes |
|------|--------|-------|
| Move source into `src/` directory | DONE | app, components, hooks, lib |
| Remove ESLint + Prettier | DONE | Deleted configs + deps |
| Install and configure Biome | DONE | biome.jsonc created |
| Update tsconfig paths (`@/*` → `./src/*`) | DONE | |
| Update components.json for `src/` paths | DONE | CSS path fixed |
| Update package.json scripts | DONE | lint, format, check scripts |
| Verify build passes | DONE | 11 static pages, no errors |

**Completed.**

---

## Phase 1: Foundation

Everything the app needs before any features can work.

| Task | Status | Notes |
|------|--------|-------|
| Install database deps (drizzle-orm, @neondatabase/serverless) | DONE | |
| Drizzle schema (`db/schema.ts`) | DONE | cooperative + transaction + auth tables |
| Neon connection (`lib/db.ts`, `db/index.ts`) | DONE | neon-http driver |
| Run initial migration | DONE | drizzle-kit push, 6 tables live |
| Install better-auth | DONE | |
| better-auth config + Google OAuth (`lib/auth.ts`) | DONE | customSession, additionalFields, role guards |
| Auth API route (`/api/auth/[...all]`) | DONE | /api/auth/ok returns {"ok":true} |
| Role assignment by entry point | DONE | Deferred to onboarding server actions |
| App shell: `/productor` layout with auth guard | DONE | 5-state auth pattern, mobile-first shell |
| App shell: `/dashboard` layout with auth guard | DONE | Sidebar shell, coop name from DB |
| App shell: `/scoring` layout with auth guard | DONE | Auto-onboard, minimal shell |
| Env vars configured (.env) | DONE | |
| Onboarding flows (producer, coop, financiera) | DONE | Server actions + client forms |
| Settings page (products, invite code) | DONE | Real CRUD functionality |
| Verify auth flows in browser | DONE | All 3 roles work correctly |

**Blocked by:** Nothing. Ready to start.

---

## Phase 2: Core Modules

Two parallel tracks once Phase 1 is complete.

### Track A — Data Pipeline

| Task | Status | Notes |
|------|--------|-------|
| Server Actions: transactions (`actions/transactions.ts`) | DONE | create, getByProducer, getByCoop, confirm, reject |
| Server Actions: cooperatives (`actions/cooperatives.ts`) | DONE | Extended: exportGoals + getCooperativeStats |
| Server Actions: producers (`actions/producers.ts`) | DONE | getProducersForCooperative, getProducerProfile |
| Sync module (`lib/sync.ts`) | DONE | Batch validation, UUID dedup, integrity check |
| Sync API route (`/api/sync`) | DONE | POST with auth, max 100 per batch |
| Price benchmark module (`lib/prices.ts`) | DONE | p10/p90/avg, min 5 data points |
| Integrity module (`lib/integrity.ts`) | DONE | 3-layer checks + trust score |

### Track B — Scoring

| Task | Status | Notes |
|------|--------|-------|
| Scoring module (`lib/scoring.ts`) | DONE | Tier A/B/C, loan range, trend, consistency |
| Trust score computation (part of integrity) | DONE | Formula: 50 + confirmed - 5*flagged |

**Completed.**

---

## Phase 3: UI

Two parallel tracks once Phase 2 modules exist.

### Track A — Producer PWA

| Task | Status | Notes |
|------|--------|-------|
| Transaction form (online path) | DONE | createTransaction server action |
| Dexie.js offline storage setup | DONE | offlineDb, pendingTransactions table |
| Transaction form (offline path) | DONE | Saves to Dexie, syncs when online |
| Sync button + offline banner | DONE | Auto-sync on mount/reconnect |
| Transaction history with price signals | DONE | Cards with IntegrityBadge + PriceSignal |
| PWA manifest | DONE | manifest.ts, standalone mode |
| Service worker (scoped to /productor/*) | DONE | public/sw.js |
| Add-to-homescreen | DONE | Via PWA manifest |

### Track B — Dashboards

| Task | Status | Notes |
|------|--------|-------|
| Coop dashboard: KPIs | DONE | 4 cards: producers, production, revenue, alerts |
| Coop dashboard: charts (production, prices) | DONE | AreaChart + BarChart with shadcn Chart |
| Coop dashboard: traceability table | DONE | Last 10 txns with integrity badges |
| Coop dashboard: integrity panel | DONE | Trust scores in producer list |
| Coop settings: products, invite code, goals | DONE | Extended with ExportGoalManager |
| Producer list with filters | DONE | Tabs, search, trust score badges |
| Producer detail view | DONE | Profile card + txn table with confirm/reject |
| Financiera: portfolio view + tier chart | DONE | KPIs, donut chart, candidate table |
| Financiera: credit profile view | DONE | Identity, income trend, verification, loan range |
| CSV export | DONE | Moved to Phase 4, implemented there |

**Completed.**

---

## Phase 4: Polish

| Task | Status | Notes |
|------|--------|-------|
| Empty states for all data-dependent views | DONE | EmptyState component, used across all views |
| Loading states (Skeleton) for all pages | DONE | 8 loading.tsx files for all dynamic routes |
| Error boundaries | DONE | 3 error.tsx files (producer, dashboard, scoring) + not-found.tsx |
| Mobile audit (touch targets, contrast, one-thumb reach) | DONE | Producer labels text-base, history text-base, timestamps text-sm |
| CSV export | DONE | Server action + ExportButton, UTF-8 BOM, Spanish headers |

**Completed.**

---

## Phase 5: Demo-Ready

Validated with first asociación. Four tracks to prepare for 1-month pilot
and group pitch to other organizations.

### Track A — Input Advances (Expenses)

| Task | Status | Notes |
|------|--------|-------|
| DB: `input_advance` table + migration | DONE | Schema in ARCHITECTURE.md, pushed to Neon |
| Server Actions: `actions/advances.ts` | DONE | create, getByProducer, getByCoop, delete |
| Coop dashboard: input advance logging UI | DONE | Per-producer form with category/description/amount/date |
| Coop dashboard: advance summary per producer | DONE | Total, breakdown by category, in producer detail |
| Scoring: factor in expenses (net margin) | DONE | Loan range based on revenue − expenses |
| Financiera: repayment capacity view | DONE | Monthly margin, expense breakdown chart |

### Track B — Producer Price Transparency

| Task | Status | Notes |
|------|--------|-------|
| Producer PWA: two-tab layout (Registrar / Precios) | DONE | shadcn Tabs, full-width |
| Precios tab: price range per product in zone | DONE | Min/avg/max from lib/prices.ts |
| Precios tab: producer's last price vs average | DONE | "Tu último precio" comparison |
| Precios tab: simple signal + trend | DONE | "Buen precio" / "Precio bajo" + arrow |

### Track C — KYC & Profile

| Task | Status | Notes |
|------|--------|-------|
| Producer onboarding: add DNI + hectáreas fields | DONE | Required fields in onboarding form |
| Producer profile completion UI | DONE | "Completa tu perfil" card with progress, 5 optional fields |
| Producer profile: update user additionalFields + migration | DONE | 7 new fields, schema pushed |
| Coop onboarding: add representative name + phone | DONE | Required fields in onboarding form |
| Coop profile completion UI | DONE | RUC, org type, members, address, year — in settings |
| Coop profile: update cooperative table + migration | DONE | 7 new columns, schema pushed |
| Integrity: plausibility checks using hectáreas | DONE | Max yield per crop/ha, single + cumulative checks |
| Financiera: show profile completeness per producer | DONE | Progress bar + field checklist in credit profile |

### Track D — Landing Page

| Task | Status | Notes |
|------|--------|-------|
| Landing page redesign | — | Manual task (user) |

**Completed** (except landing page — manual).

---

## Current Focus

**Phase 5 complete.** Landing page redesign is a manual task.

---

## Blockers

None.
