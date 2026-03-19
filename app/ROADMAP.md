# Chacra — Roadmap

Where we are and what's next. Updated after each milestone.
What gets built is defined in SPEC.md. How it's built is in ARCHITECTURE.md.

---

## Phase Overview

| Phase | Name | Status |
|-------|------|--------|
| 0 | Restructure | NOT STARTED |
| 1 | Foundation | NOT STARTED |
| 2 | Core Modules | NOT STARTED |
| 3 | UI | NOT STARTED |
| 4 | Polish | NOT STARTED |

---

## Phase 0: Restructure

Clean project structure and tooling before any feature work.

| Task | Status | Notes |
|------|--------|-------|
| Move source into `src/` directory | - | app, components, hooks, lib |
| Remove ESLint + Prettier | - | Delete configs + deps |
| Install and configure Biome | - | Lint + format in one tool |
| Update tsconfig paths (`@/*` → `./src/*`) | - | |
| Update components.json for `src/` paths | - | shadcn/ui alias update |
| Update package.json scripts | - | Replace lint script with biome |
| Verify build passes | - | |

**Blocked by:** Nothing. Ready to start.

---

## Phase 1: Foundation

Everything the app needs before any features can work.

| Task | Status | Notes |
|------|--------|-------|
| Install database deps (drizzle-orm, @neondatabase/serverless) | - | |
| Drizzle schema (`db/schema.ts`) | - | |
| Neon connection (`lib/db.ts`, `db/index.ts`) | - | |
| Run initial migration | - | |
| Install better-auth | - | |
| better-auth config + Google OAuth (`lib/auth.ts`) | - | |
| Auth API route (`/api/auth/[...all]`) | - | |
| Role assignment by entry point | - | |
| App shell: `/farmer` layout with auth guard | - | |
| App shell: `/dashboard` layout with auth guard | - | |
| App shell: `/scoring` layout with auth guard | - | |
| Env vars configured (.env.local) | - | |
| Deploy to Vercel with working auth | - | |

**Blocked by:** Nothing. Ready to start.

---

## Phase 2: Core Modules

Two parallel tracks once Phase 1 is complete.

### Track A — Data Pipeline

| Task | Status | Notes |
|------|--------|-------|
| Server Actions: transactions (`actions/transactions.ts`) | - | |
| Server Actions: cooperatives (`actions/cooperatives.ts`) | - | |
| Server Actions: farmers (`actions/farmers.ts`) | - | |
| Sync module (`lib/sync.ts`) | - | |
| Sync API route (`/api/sync`) | - | |
| Price benchmark module (`lib/prices.ts`) | - | |
| Integrity module (`lib/integrity.ts`) | - | |

### Track B — Scoring

| Task | Status | Notes |
|------|--------|-------|
| Scoring module (`lib/scoring.ts`) | - | |
| Trust score computation (part of integrity) | - | |

**Blocked by:** Phase 1 (schema + auth).

---

## Phase 3: UI

Two parallel tracks once Phase 2 modules exist.

### Track A — Farmer PWA

| Task | Status | Notes |
|------|--------|-------|
| Transaction form (online path) | - | |
| Dexie.js offline storage setup | - | |
| Transaction form (offline path) | - | |
| Sync button + offline banner | - | |
| Transaction history with price signals | - | |
| PWA manifest | - | |
| Service worker (scoped to /farmer/*) | - | |
| Add-to-homescreen | - | |

### Track B — Dashboards

| Task | Status | Notes |
|------|--------|-------|
| Coop dashboard: KPIs | - | |
| Coop dashboard: charts (production, prices) | - | |
| Coop dashboard: traceability table | - | |
| Coop dashboard: integrity panel | - | |
| Coop settings: products, invite code, goals | - | |
| Producer list with filters | - | |
| Producer detail view | - | |
| Financiera: portfolio view + tier chart | - | |
| Financiera: credit profile view | - | |
| CSV export | - | |

**Blocked by:** Phase 2 (modules must exist for UI to call).

---

## Phase 4: Polish

| Task | Status | Notes |
|------|--------|-------|
| Empty states for all data-dependent views | - | |
| Loading states (Skeleton) for all pages | - | |
| Error boundaries | - | |
| Mobile audit (touch targets, contrast, one-thumb reach) | - | |

**Blocked by:** Phase 3 (UI must exist to polish).

---

## Current Focus

**Next up:** Phase 0 — Restructure

---

## Blockers

None.
