# Chacra — Roadmap

## Principles

- Phases are linear. Never start the next phase until the current one is done.
- Sections within a phase are parallel. Deep modules enable this — each section owns its interface contract and can be built independently.
- Design is Phase 0 and is the most important phase. Everything built in later phases serves the design decisions made here.
- Each phase produces working, integrated output — not stubs or placeholders.

---

## Phase 0: Design

> The conversion phase. Farmer UX must have zero friction (they will abandon anything unfamiliar).
> Dashboard must feel like a real B2B product (cooperativas and financieras are the paying customers).
> Every pixel is a sales argument.

**Sections run in parallel.**

### 0A — Design System

- Choose shadcn/ui preset: earthy but professional (warm neutrals, no generic blues)
- Define semantic color tokens: brand, success (synced), warning (pending), error (offline/failed)
- Typography scale: minimum 16px body, 44px touch targets throughout farmer app
- Run `npx shadcn@latest init` with chosen preset in the app directory
- Define reusable component conventions: which shadcn components map to each UI pattern

**Output:** `components.json` committed, theme tokens defined in global CSS, component map doc

### 0B — UX Flows

- Farmer mobile flow: home → add transaction → offline state → sync → confirmation toast
- WhatsApp flow: send message → bot reply → correction flow
- Dashboard flow: login → overview → traceability → scoring detail
- Identify all form inputs and decide: dropdown vs free text vs toggle (affects conversion rate)
- Mobile audit checklist: touch targets, contrast, Spanish copy, one-thumb reachability

**Output:** Screen-by-screen component map (which component renders what, which are SC vs CC)

---

## Phase 1: Foundation

> One section. Everything else depends on it.

### 1A — Scaffold + DB Module

- Initialize Next.js 16 app (already in `/app`), configure TypeScript strict mode and path aliases
- `npx shadcn@latest init` (using preset from Phase 0)
- Write Drizzle schema (`db/schema.ts`): `farmers`, `cooperatives`, `transactions` tables + `farmer_credit_scores` materialized view
- Neon connection in `db/index.ts`, wrapped by `lib/db.ts` deep module
- Run first migration against Neon dev branch
- Deploy empty shell to Vercel — URL working immediately
- Commit `.env.local.example` with all required keys

**Output:** Live URL, `db.*` interface ready for all other modules to build on

---

## Phase 2: Core Modules

> Two sections, run in parallel. They share only the `db` module interface — no other dependency between them.

### 2A — Data Pipeline

- `lib/sync.ts` module: batch validation, UUID dedup (`ON CONFLICT DO NOTHING`), partial failure isolation
- `POST /api/sync` route: thin wrapper around `sync.process()`
- `lib/scoring.ts` module: reads `farmer_credit_scores` materialized view, computes tier
- Server actions: `createTransaction` (online path), `registerFarmer`
- Test: insert 20 transactions for one farmer, verify tier A is computed correctly
- Test: send duplicate UUIDs, verify only one is stored

**Output:** `/api/sync` accepting batches, server actions working, scoring returning tiers

### 2B — Bot Pipeline

- `lib/whatsapp.ts` module: Kapso SDK wrapper, signature verification, send helpers
- `lib/ai.ts` module: Claude Haiku with system prompt, JSON schema validation, error classification
- `POST /api/whatsapp/webhook` route: verify signature → extract message → parse → store → reply
- Registration flow: first-time farmer greeted, name/region collected over 2-3 messages
- Correction flow: farmer replies "no, fueron 60 kilos" → re-parsed and updated
- End-to-end test: real WhatsApp message → parsed JSON → stored in DB → confirmation received on phone

**Output:** Functional WhatsApp bot, tested with real phone

---

## Phase 3: UI

> Two sections, run in parallel. Both depend on Phase 2 module interfaces but not on each other.

### 3A — Farmer PWA

- Transaction form (Client Component): shadcn `FieldGroup` + `Field` + `Select` + `Input` + `Button`
  - Fields: product (dropdown), quantity, unit (toggle), price, buyer (optional), date
  - Submits via server action when online; saves to Dexie.js when offline
- `SyncButton.tsx`: pending count badge, triggers `POST /api/sync`, updates Dexie on success
- `OfflineBanner.tsx`: shadcn `Alert`, shown when `navigator.onLine === false`
- Farmer registration page: 3-step form, mobile-first, large inputs
- PWA manifest + service worker: add-to-homescreen, app shell cached
- Offline demo path confirmed working: form in airplane mode → reconnect → sync → data appears in DB

**Output:** Fully working offline-capable farmer app

### 3B — Dashboard

- Auth guard in `(dashboard)/layout.tsx` via `auth.requireSession()`
- Overview page: production totals, active farmers, revenue this month — shadcn `Card` + `Chart`
- Traceability table: `Table` + date/crop/region filters, source badge (WhatsApp vs PWA)
- Scoring page: farmer list with risk tier `Badge`, click → detail view with metrics breakdown
- CSV export: server action streams CSV from `db.cooperatives.production()`
- Real-time feel: `revalidatePath` after each new transaction

**Output:** Full cooperativa dashboard, auth-gated

---

## Phase 4: Demo

> Linear. Polish what exists, prepare the pitch moment.

### 4A — Seed Data + Demo Script

- Seed 5 farmers: 3 regions (Cajamarca, Piura, Puno), 3 crops (café, cacao, quinua)
- Farmer distribution tells a story:
  - "Juan" → 8 months active, 47 transactions → tier A (the success case)
  - "María" → 4 months, growing trend → tier B (the potential case)
  - "Pedro" → 1 month, just started → tier C (the onboarding case)
- Dry-run demo flow: airplane mode → form → reconnect → sync → dashboard reflects update
- Dry-run WhatsApp flow: real message from test phone → bot reply → dashboard updates

**Output:** Demo-ready data, full flow tested 3+ times

### 4B — Polish

- Mobile UI audit against Phase 0 checklist (touch targets, contrast, Spanish copy)
- Error states: sync failure message, WhatsApp parse error reply, offline banner transitions
- Loading states: `Skeleton` on dashboard while data loads, spinner on sync button
- Record screen recording of full demo as backup
- Edge cases: misspelled product ("kfe" → café), missing price, unknown unit

**Output:** Demo-hardened app, backup recording ready
