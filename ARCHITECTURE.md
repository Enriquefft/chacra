# Chacra — Architecture

## Philosophy: Deep Modules

Each module exposes a narrow, stable interface and hides all implementation complexity inside.
Callers (server components, server actions, API routes) never touch the DB, Kapso SDK, or
Anthropic client directly — they go through the module.

Rules:
- One file per module in `lib/`
- API routes are thin: verify → extract → delegate to module → respond
- Server components and actions import only from modules
- Client components are UI-only: no business logic, no direct API calls
- Types are co-located with the module that owns them

---

## Modules

### `lib/db.ts` — Data Access

The single source of truth for all persistence. Owns the Drizzle client and all query logic.

**Interface:**
```ts
// Farmers
db.farmers.findByPhone(phone: string): Promise<Farmer | null>
db.farmers.create(data: NewFarmer): Promise<Farmer>

// Transactions
db.transactions.insert(data: NewTransaction): Promise<Transaction>
db.transactions.batchInsert(rows: NewTransaction[]): Promise<{ inserted: string[] }>
db.transactions.forFarmer(farmerId: string, filters?: TransactionFilters): Promise<Transaction[]>

// Cooperativa
db.cooperatives.members(cooperativeId: string): Promise<FarmerSummary[]>
db.cooperatives.production(cooperativeId: string, filters?: ProductionFilters): Promise<ProductionSummary>

// Scoring (reads materialized view)
db.scoring.forFarmer(farmerId: string): Promise<CreditScore>
db.scoring.forCooperative(cooperativeId: string): Promise<CreditScore[]>
```

**Hides:** Neon pooled connection, Drizzle query builder, SQL, connection string, materialized view refresh scheduling

---

### `lib/whatsapp.ts` — Kapso Messaging

Owns all WhatsApp I/O. The webhook route and any send logic go through this.

**Interface:**
```ts
whatsapp.verifySignature(rawBody: string, signature: string): boolean
whatsapp.extractIncoming(webhookBody: unknown): IncomingMessage | null
whatsapp.sendText(to: string, body: string): Promise<void>
whatsapp.sendConfirmation(to: string, parsed: ParsedTransaction): Promise<void>
whatsapp.sendClarification(to: string, hint: string): Promise<void>
whatsapp.sendError(to: string): Promise<void>
```

**Hides:** Kapso SDK instantiation (`@kapso/whatsapp-cloud-api`), API key, `phone_number_id` resolution,
message formatting and Spanish copy, WhatsApp API version, retry logic on 5xx

---

### `lib/ai.ts` — Transaction Parsing

Owns the Claude Haiku integration. One job: raw text → structured transaction.

**Interface:**
```ts
ai.parseTransaction(rawText: string): Promise<ParsedTransaction | ParseError>
```

**Hides:** Anthropic SDK, system prompt, model selection (`claude-haiku-4-5-20251001`), temperature,
JSON schema validation, retry on malformed output, error classification (unparseable vs ambiguous vs valid)

**ParsedTransaction:**
```ts
{
  type: 'sale' | 'purchase' | 'expense'
  product: string
  quantity: number
  unit: 'kg' | 'arroba' | 'quintal' | 'saco'
  price_per_unit: number
  buyer: string | null
  date_offset: number  // 0 = today, -1 = yesterday, etc.
}
```

---

### `lib/scoring.ts` — Credit Scoring

Owns the risk tier algorithm. Dashboard and financiera API go through this.

**Interface:**
```ts
scoring.forFarmer(farmerId: string): Promise<CreditScore>
scoring.tier(metrics: ScoringMetrics): RiskTier  // 'A' | 'B' | 'C'
```

**Hides:** Metric formulas, tier thresholds, whether it reads the materialized view or computes live,
revenue_trend calculation, consistency scoring

---

### `lib/sync.ts` — Offline Sync

Owns the batch sync contract between PWA and server.

**Interface:**
```ts
sync.process(farmerId: string, transactions: OfflineTransaction[]): Promise<SyncResult>
// SyncResult = { synced_ids: string[], failed: string[] }
```

**Hides:** UUID deduplication (`ON CONFLICT DO NOTHING`), batch validation per row,
partial failure isolation (one bad row doesn't fail the batch), `synced_at` timestamp injection

---

### `lib/auth.ts` — Dashboard Auth

Guards cooperativa/dashboard routes only. Farmers are identified by phone, not session.

**Interface:**
```ts
auth.requireSession(): Promise<Session>   // redirects to /login if no session
auth.getSession(): Promise<Session | null>
```

**Hides:** Session storage (cookies), token validation, login redirect target, cooperativa lookup

---

## Data Flow

```
WhatsApp message
  → POST /api/whatsapp/webhook
  → whatsapp.verifySignature()
  → whatsapp.extractIncoming()
  → db.farmers.findByPhone()     ← registered? if not: registration flow
  → ai.parseTransaction()
  → db.transactions.insert()
  → whatsapp.sendConfirmation()  or sendClarification() or sendError()

PWA offline form (Client Component)
  → Dexie.js (IndexedDB, browser-only)
  → [connectivity restored]
  → POST /api/sync
  → sync.process()
  → db.transactions.batchInsert()
  → { synced_ids } → Dexie marks records synced

Dashboard page (Server Component)
  → auth.requireSession()
  → db.cooperatives.production()
  → db.scoring.forCooperative()
  → rendered as HTML, no client JS for data fetching

Farmer transaction (online, Server Action)
  → createTransaction(formData)
  → db.transactions.insert()
  → revalidatePath()
```

---

## File Map

```
app/
  (farmer)/
    page.tsx                        # SC: farmer home + transaction form
    register/page.tsx               # SC: onboarding (first-time farmer)
  (dashboard)/
    layout.tsx                      # SC: auth guard via auth.requireSession()
    page.tsx                        # SC: cooperativa overview
    traceability/page.tsx           # SC: traceability table
    scoring/[farmerId]/page.tsx     # SC: credit scoring detail
  api/
    whatsapp/webhook/route.ts       # thin route → whatsapp.* + ai.* + db.*
    sync/route.ts                   # thin route → sync.process()

lib/
  db.ts                             # deep module: Neon + Drizzle
  whatsapp.ts                       # deep module: Kapso
  ai.ts                             # deep module: Claude Haiku
  scoring.ts                        # deep module: credit score
  sync.ts                           # deep module: batch sync
  auth.ts                           # deep module: session

db/
  schema.ts                         # Drizzle table + view definitions
  index.ts                          # Neon connection (used only by lib/db.ts)
  migrations/

actions/
  transactions.ts                   # createTransaction, updateTransaction
  farmers.ts                        # registerFarmer

components/
  farmer/
    TransactionForm.tsx             # CC: offline-capable form (Dexie.js)
    SyncButton.tsx                  # CC: pending count badge + trigger
    OfflineBanner.tsx               # CC: connectivity indicator
  dashboard/
    ProductionChart.tsx             # CC: shadcn Chart wrapper
    TraceabilityTable.tsx           # SC: server-rendered table
    ScoringBadge.tsx                # SC: risk tier badge
```

---

## Schema (Drizzle)

```ts
// farmers
id uuid pk, phone varchar unique not null, name varchar,
region varchar, cooperative_id uuid fk, registered_via varchar,
created_at timestamptz

// cooperatives
id uuid pk, name varchar, region varchar, contact_phone varchar,
created_at timestamptz

// transactions
id uuid pk,                          // client-generated, enables dedup
farmer_id uuid fk not null,
type varchar,                        // sale | purchase | expense
product varchar, quantity decimal, unit varchar,
price_per_unit decimal,
total decimal generated always as (quantity * price_per_unit) stored,
currency varchar default 'PEN',
buyer varchar,
recorded_at timestamptz,             // when farmer recorded it
synced_at timestamptz,               // when server received it
source varchar,                      // whatsapp | pwa
raw_input text,                      // original WhatsApp message
confirmed boolean default false,
created_at timestamptz

// materialized view: farmer_credit_scores
farmer_id, name, phone, region,
total_transactions, active_months, avg_transaction_value,
total_revenue, crop_diversity, revenue_volatility,
risk_tier (A | B | C), last_activity
```

---

## Environment Variables

```
DATABASE_URL          # Neon connection string (pooled)
KAPSO_API_KEY         # Kapso API key
ANTHROPIC_API_KEY     # Claude Haiku
KAPSO_WEBHOOK_SECRET  # Signature verification
```
