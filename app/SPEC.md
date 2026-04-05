# Chacra — Product Spec

Single source of truth for **what** gets built.
If this doc and the code disagree, fix one of them.
Technical decisions live in ARCHITECTURE.md. Progress lives in ROADMAP.md.

---

## What It Is

Chacra turns invisible agricultural transactions into structured, bankable data.
One input channel (offline-first PWA), one database, three audiences
(producer, cooperative, financiera).

Producers register sales through a structured form that works without internet.
Data syncs when connectivity returns. Cooperatives get traceability dashboards.
Financieras get credit scoring profiles.

---

## Principles

1. **Zero mocks.** No sample data, no seed scripts, no hardcoded arrays.
   If a feature has no real data to show, it renders an empty state.
2. **Deep modules.** Each module owns a narrow interface and hides all complexity
   behind it. Callers never touch internals. Modules are independently testable.
3. **Production-ready.** This is not a prototype. Interested users will use it.
   Error handling, auth, data validation — all real.
4. **Server by default.** Server Components for reads, Server Actions for mutations.
   Client Components only where the browser API is required (offline storage,
   connectivity detection, charts, interactive forms).
5. **This is the whole product.** No "future work", no "phase 2 add-ons". Everything
   in this spec gets built and shipped. Nothing outside this spec gets built.

---

## Domain

```
chacra.404tf.com              — everything
chacra.404tf.com/productor      — producer PWA (home screen icon points here)
chacra.404tf.com/dashboard    — cooperative dashboard
chacra.404tf.com/scoring      — financiera scoring
```

One Next.js app, one Vercel deployment, path-based routing.
PWA service worker scoped to `/productor/*`.

---

## Stack

| Layer | Tech | Notes |
|-------|------|-------|
| Framework | Next.js 16 (App Router) | Turbopack dev |
| Database | Neon (serverless Postgres) | |
| ORM | Drizzle | Migrations via `drizzle-kit` |
| Auth | better-auth + Google OAuth | Passwordless. Role by entry point. |
| UI | shadcn/ui | Semantic colors only. Chart component wraps Recharts. |
| Offline | Dexie.js (IndexedDB) | Client-side only, in producer PWA |
| Deploy | Vercel | `chacra.404tf.com` |

---

## Auth & Onboarding

**Google OAuth** via better-auth. Passwordless. Every Android phone has a Google account.

### Role assignment

Role is determined by which page the user signs in from:
- Sign in at `/productor` → producer role
- Sign in at `/dashboard` → cooperative role
- Sign in at `/scoring` → financiera role

No role picker. The entry point decides.

### Producer onboarding

Every producer belongs to a cooperative. No independent producers.

1. Cooperative admin creates cooperative in Chacra → gets an invite code
2. Admin shares code with producers (verbally, printed, at a meeting)
3. Producer opens `chacra.404tf.com/productor` at cooperative office (wifi available)
4. Taps "Sign in with Google" — one tap
5. First time: enters invite code + name + region → linked to cooperative
6. Done. Session persists. App works offline from this point.

### Cooperative onboarding

1. Opens `chacra.404tf.com/dashboard`
2. Signs in with Google
3. First time: creates cooperative (name, region) → gets invite code
4. Configures product list for their cooperative
5. Shares invite code with producers

### Financiera onboarding

1. Opens `chacra.404tf.com/scoring`
2. Signs in with Google
3. Sees portfolio across all cooperatives

---

## Data Model (entities, not schema)

Schema details defined during implementation (see ARCHITECTURE.md).
These are the entities and relationships:

- **Cooperative** — name, region, invite code, product list, export goals
- **Producer** — Google account, name, region, belongs to one cooperative
- **Transaction** — producer, product, quantity (kg), price per unit (PEN), buyer (optional),
  date, UUID (client-generated), integrity status (confirmed/flagged)
- **Credit Score** — computed from transactions: tier (A/B/C), metrics, trust score

Relationships:
- Cooperative has many producers
- Producer has many transactions
- Cooperative defines which products its producers can log
- Credit score is computed per producer from their transactions

---

## Products & Units

**Products are defined per cooperative.** The cooperative admin configures which products
their producers can log. The producer's transaction form dropdown shows only their
cooperative's product list.

**Unit is kg.** No unit selector. All quantities in kilograms.

**Currency is PEN (soles).** All prices in soles per kg.

---

## Pages & Routes

### Existing (keep as-is)

| Route | Type | Description |
|-------|------|-------------|
| `/` | SC | Landing page. Sales tool. Already built. |
| `/demo-cooperativas` | CC | Static demo with hardcoded data. Sales tool. |
| `/demo-financieras` | CC | Static demo with hardcoded data. Sales tool. |

These are static sales tools with hardcoded data. They stay unchanged.

### Production App

| Route | Type | Description |
|-------|------|-------------|
| `/productor` | CC | Producer home — transaction form (offline-capable) + sign-in |
| `/productor/history` | CC | Transaction history with price signals |
| `/dashboard` | SC | Cooperative dashboard — KPIs, production, traceability + sign-in |
| `/dashboard/productores` | SC | Producer management, integrity view |
| `/dashboard/productor/[id]` | SC | Individual producer detail |
| `/dashboard/settings` | SC | Cooperative settings: products, invite code, export goals |
| `/scoring` | SC | Financiera view — portfolio, tier distribution + sign-in |
| `/scoring/productor/[id]` | SC | Individual credit profile |

### API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/[...all]` | * | better-auth handler |
| `/api/sync` | POST | PWA batch sync |

---

## Features

Every feature listed here gets built. Nothing else gets built.

### Producer PWA

| Feature | Description |
|---------|-------------|
| Google sign-in | One-tap Google OAuth |
| Invite code entry | Link producer to cooperative on first sign-in |
| Transaction form (online) | Structured form: product, quantity, price, buyer, date |
| Transaction form (offline + sync) | Same form, saved to IndexedDB, synced when online |
| Offline detection + banner | "Sin conexion" banner when offline |
| Sync button with pending count | Manual sync trigger with badge showing pending count |
| Transaction history | List of all producer's transactions |
| Price signal per transaction | Show if price was above/below/at market average |
| PWA manifest + service worker | Installable, offline-capable |
| Add-to-homescreen | Prompt to install on mobile |

### Cooperative Dashboard

| Feature | Description |
|---------|-------------|
| Google sign-in | One-tap Google OAuth |
| Cooperative creation + invite code | First-time setup, generates shareable code |
| Product list management | Add/remove products producers can log |
| Export goal configuration | Set volume targets per product |
| KPIs | Active producers, total production, period revenue, active alerts |
| Export contract progress | Progress toward goals with per-producer breakdown |
| Price benchmark chart | Price by buyer with market floor/ceiling |
| Production by month chart | Monthly production volumes |
| Traceability table | Transaction list with integrity status |
| Producer list with filters | All / on-track / needs attention |
| Producer detail | Individual producer view with transaction history |
| Data integrity panel | Trust scores and flagged transactions |
| CSV export | Export transaction data |

### Financiera Scoring

| Feature | Description |
|---------|-------------|
| Google sign-in | One-tap Google OAuth |
| Portfolio KPIs | Volume, active producers, verified %, default rate |
| Tier distribution chart | Visual breakdown of A/B/C tiers |
| Credit candidate table | Sortable list of scored producers |
| Portfolio risk summary | Aggregate risk metrics |
| Individual credit profile | Income trend, trust checks, verification layers |
| Flagged transaction cards | Suspicious transactions surfaced for review |
| Loan range estimation | Suggested loan amounts based on score |

### Shared

| Feature | Description |
|---------|-------------|
| Empty states | All views handle zero-data gracefully |
| Loading states | Skeleton components during data fetch |
| Error boundaries | Graceful error handling throughout |

---

## Data Integrity Model

Three layers, applied automatically on every transaction:

1. **Temporal consistency** (automatic) — anomalies in volume, price, frequency
   relative to the producer's own history
2. **Cross-validation** (semi-automatic) — compare producer-reported data against
   cooperative records when available
3. **Human triage** (manual) — suspicious cases surfaced in dashboard for review

Trust score per producer: 0-100, computed from integrity check pass rate across
all their transactions. Displayed in producer list and credit profile.

---

## Input Channel: Offline-First PWA

The PWA is the sole input channel. It works like this:

```
Producer opens PWA (bookmarked or home screen icon)

IF OFFLINE:
  -> Banner: "Sin conexion — tus datos se guardan localmente"
  -> Producer fills structured form:
      Product (dropdown, from cooperative's product list),
      Quantity (number, kg), Price per kg (number, soles),
      Buyer (text, optional), Date (defaults today)
  -> Saved to IndexedDB via Dexie.js instantly
  -> Toast: "Guardado. Pendientes de sincronizar: 3"
  -> Can view full local transaction history
IF ONLINE (or comes back online):
  -> On app open: auto-attempts to push pending queue
  -> Manual "Sincronizar" button with badge count
  -> POST /api/sync with batch
  -> Server validates, deduplicates by UUID, flags anomalies
  -> App updates: "3 registros sincronizados"
```

No Background Sync API. Sync-on-open + manual button only.
UUID generated client-side at transaction creation. Server deduplicates
via ON CONFLICT DO NOTHING.

---

## Environment Variables

```
DATABASE_URL=            # Neon connection string
BETTER_AUTH_SECRET=      # Auth secret
BETTER_AUTH_URL=         # https://chacra.404tf.com
GOOGLE_CLIENT_ID=        # Google OAuth
GOOGLE_CLIENT_SECRET=    # Google OAuth
```
