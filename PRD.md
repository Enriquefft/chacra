# PRD: Chacra
## Offline-First Rural Data Platform

---

## ONE-LINER
Turn invisible agricultural transactions into structured, bankable data. No 4G required.

---

## HACKATHON WIN STRATEGY

**Scoring weights:**
- Impact + Relevance: 35% → Real producer quotes from Oscar's Spinout calls
- Viability: 35% → Live demo. Airplane mode. WhatsApp message parsed in real time.
- Context understanding: 20% → Avanzar Rural specific language, regions, crops, program data
- Innovation: 10% → WhatsApp AI bot + offline PWA, dual channel, same database

**What beats every other team:**
A working app demoed live on airplane mode + a WhatsApp bot that parses natural language in real time + real validation data from Spinout farmers + a cooperativa interest signal. Nobody else will have all three.

**What does NOT win:**
- Slides
- Mockups
- Fancy tech stack nobody can try
- Theoretical business models

---

## ARCHITECTURE DECISION: 2 CHANNELS, 1 DATABASE

### Why 2, not 3
SMS was considered and cut. WhatsApp + PWA covers ~95% of rural Peru. SMS adds build complexity for a shrinking edge case (feature phones with no data). Every hour on SMS is an hour not spent polishing the demo. If judges ask about feature phones: "La arquitectura soporta SMS como tercer canal en producción. Para el piloto, WhatsApp + offline cubre al 95% de productores de nuestra red en Spinout."

### Channel Roles

**WhatsApp Bot (PRIMARY INPUT)**
- Most farmers already use WhatsApp daily
- Zero learning curve: they send a message like they would to a buyer
- Free for our use case (farmer initiates, we reply within 24hr service window)
- Rich: we can send back formatted confirmations, even charts
- Works with any data signal (2G, 3G, WiFi)
- BEST FOR: daily transaction logging, quick entries

**PWA - Progressive Web App (POWER USER TOOL)**
- For cooperative leaders, organized farmers, anyone who wants history/trends
- Works fully offline (IndexedDB stores everything locally)
- Syncs when connectivity returns (on-open check + manual sync button)
- Accessible via URL, no install needed, works on any phone
- Add-to-homescreen makes it feel native
- BEST FOR: batch entries, viewing transaction history, offline-heavy zones, cooperative managers

**Both channels feed the SAME PostgreSQL database. Same dashboard. Same credit scoring.**

```
┌─────────────────────┐     ┌──────────────────────┐
│   WhatsApp Bot      │     │   PWA (Offline)       │
│                     │     │                       │
│  Farmer sends:      │     │  Farmer fills form:   │
│  "vendi 50kg cafe   │     │  Producto: Café       │
│   a 8 soles"        │     │  Cantidad: 50 kg      │
│                     │     │  Precio: S/8           │
└─────────┬───────────┘     └───────────┬───────────┘
          │                             │
          │ (instant,                   │ (syncs when
          │  needs data)                │  signal returns)
          ▼                             ▼
┌─────────────────────────────────────────────────────┐
│                   API Server                         │
│                                                      │
│  WhatsApp webhook     │    POST /api/sync            │
│  → Claude Haiku       │    → Validate                │
│  → Parse to JSON      │    → Deduplicate (UUID)      │
│  → Store              │    → Store                   │
│  → Reply confirmation │    → Return sync status      │
└─────────────────┬────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│                 PostgreSQL (Supabase)                 │
│                                                      │
│  farmers │ transactions │ cooperatives │ sync_queue  │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  MATERIALIZED VIEW: farmer_credit_scores     │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────┬────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
┌──────────────┐    ┌──────────────┐
│ Cooperativa  │    │ Financiera   │
│ Dashboard    │    │ Credit API   │
│              │    │              │
│ Production   │    │ Risk tier    │
│ Traceability │    │ Revenue est  │
│ Exports      │    │ Consistency  │
└──────────────┘    └──────────────┘
```

---

## CORE USER FLOWS

### Flow 1: Farmer Logs Sale via WhatsApp (PRIMARY)

```
Farmer opens WhatsApp → sends message to Chacra bot:
  "vendi 50 kilos de cafe a 8 soles al juan del mercado"
  or: "50kg cafe 8sol"
  or: "vendí mi quinua hoy, 3 arrobas a 12 soles cada una"
  or even: voice note (stretch goal: Whisper transcription)

→ WhatsApp webhook receives message
→ Claude Haiku parses natural language to structured JSON
→ Validates (product exists, numbers make sense)
→ Stores in PostgreSQL
→ Replies via WhatsApp:

  "✅ Registrado:
   Café - 50 kg a S/8.00
   Total: S/400.00
   Comprador: Juan del mercado
   ¿Correcto? Responde 'sí' o corrígeme."

→ Farmer replies "si" → confirmed
→ Farmer replies "no, fueron 60 kilos" → re-parsed, updated
```

**Why this works:** Farmers already send messages like this to buyers and family. Zero learning curve. The bot is just another WhatsApp contact.

### Flow 2: Farmer Uses PWA Offline (POWER USER)

```
Farmer opens PWA (bookmarked / home screen icon)
→ App checks navigator.onLine + pings server
→ If OFFLINE:
    Shows "Sin conexión - tus datos se guardan localmente"
    Farmer fills form:
      - Producto (dropdown: café, cacao, quinua, papa, maíz, etc.)
      - Cantidad (number + unit selector: kg, arroba, quintal)
      - Precio por unidad (soles)
      - Comprador (text, optional)
      - Fecha (defaults to today, can backdate)
    → Saved to IndexedDB via Dexie.js instantly
    → Green toast: "Guardado ✓ Pendientes de sincronizar: 3"
    → Can view full local transaction history

→ If ONLINE (or comes back online):
    On app open: auto-attempts to push pending queue
    Manual "Sincronizar" button always visible with badge count
    → Batch POST to /api/sync
    → Server validates, deduplicates by UUID, stores
    → App updates: "3 registros sincronizados ✓"
    → Can now see full history including server-synced data
```

**No Background Sync API.** It's unreliable, Chrome-only, gets killed by Android battery optimization. Instead: sync-on-open + manual button. Simple, honest, works everywhere.

### Flow 3: Cooperativa Dashboard (B2B)

```
Cooperativa manager logs into chacra.app/dashboard
→ Overview:
  - Total production this month by crop
  - Number of active producers
  - Price trends by crop
  - Transaction volume over time

→ Traceability view:
  - Filter by crop, region, date range
  - See: farmer → product → volume → price → buyer → date
  - Each record traceable to source (WhatsApp or PWA)
  - Export CSV/PDF for certification (Comercio Justo, orgánico)

→ Member management:
  - List of associated farmers
  - Individual production summaries
  - Activity status (active/inactive)

→ Alerts:
  - Unusual price drops (potential exploitation)
  - Inactive producers (may need support)
  - Volume anomalies
```

### Flow 4: Credit Scoring View (B2B - Financiera)

```
Financiera accesses API: GET /api/scoring/:farmer_id

Response:
{
  "farmer_id": "uuid",
  "name": "Juan Pérez",
  "phone": "+51...",
  "risk_tier": "A",
  "metrics": {
    "total_transactions": 47,
    "active_months": 8,
    "avg_monthly_revenue": 2400.00,
    "revenue_trend": "growing",
    "crop_diversity": 3,
    "transaction_consistency": 0.85,
    "cooperative_member": true
  },
  "recommendation": "Low risk. Consistent production history across 8 months."
}

This IS the alternative credit score.
The data that was invisible in notebooks is now bankable.
```

---

## TECH STACK

| Layer | Tech | Why |
|-------|------|-----|
| Frontend (PWA) | Next.js 14 + next-pwa | Enrique's fastest stack. SSR for dashboard, PWA for offline. URL = instant access for demo. |
| Offline Storage | IndexedDB via Dexie.js | Simple API, reliable, structured data. No localStorage limitations. |
| Sync Strategy | Sync-on-open + manual "Sincronizar" button | No flaky Background Sync API. Honest, reliable, works everywhere. |
| WhatsApp Bot | WhatsApp Business API (via Meta Cloud API) | Free for inbound farmer messages + service replies within 24hr. |
| AI Parsing | Claude Haiku (Anthropic API) | Parse unstructured WhatsApp messages into structured JSON. Fast, cheap, accurate. |
| Backend | Next.js API Routes | Same repo, zero infra overhead. API routes for sync, webhook, dashboard, scoring. |
| Database | PostgreSQL via Supabase | Free tier, instant setup, real-time subscriptions for live dashboard updates, auth built-in. |
| Charts | Recharts | Lightweight, React-native, Enrique knows it. |
| Deploy | Vercel | Instant deploys, connected to Enrique's account. Custom domain if time allows. |

### Why NOT native mobile app:
- "Please install this APK" = demo friction
- PWA: "Abran esta URL" = everyone in the room is using your app in 3 seconds
- Judges aren't mobile dev judges. They're rural impact judges.
- One Android version bug during demo = dead pitch

---

## DATABASE SCHEMA

```sql
CREATE TABLE farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(15) UNIQUE NOT NULL,    -- primary identifier, works for both WhatsApp and PWA
  name VARCHAR(100),
  region VARCHAR(100),                  -- match Avanzar Rural regions
  cooperative_id UUID REFERENCES cooperatives(id),
  registered_via VARCHAR(10) NOT NULL,  -- 'whatsapp' or 'pwa'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cooperatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  region VARCHAR(100),
  contact_phone VARCHAR(15),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES farmers(id) NOT NULL,
  type VARCHAR(20) NOT NULL,             -- 'sale', 'purchase', 'expense'
  product VARCHAR(100) NOT NULL,
  quantity DECIMAL NOT NULL,
  unit VARCHAR(20) NOT NULL,             -- 'kg', 'arroba', 'quintal', 'saco'
  price_per_unit DECIMAL NOT NULL,
  total DECIMAL GENERATED ALWAYS AS (quantity * price_per_unit) STORED,
  currency VARCHAR(3) DEFAULT 'PEN',
  buyer VARCHAR(200),
  recorded_at TIMESTAMPTZ NOT NULL,      -- when farmer actually recorded it
  synced_at TIMESTAMPTZ DEFAULT NOW(),   -- when server received it
  source VARCHAR(10) NOT NULL,           -- 'whatsapp' or 'pwa'
  raw_input TEXT,                        -- original WhatsApp message if applicable
  confirmed BOOLEAN DEFAULT FALSE,       -- WhatsApp: farmer replied 'sí'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Materialized view for credit scoring
CREATE MATERIALIZED VIEW farmer_credit_scores AS
SELECT
  f.id AS farmer_id,
  f.name,
  f.phone,
  f.region,
  COUNT(t.id) AS total_transactions,
  COUNT(DISTINCT DATE_TRUNC('month', t.recorded_at)) AS active_months,
  AVG(t.total) AS avg_transaction_value,
  SUM(t.total) AS total_revenue,
  COUNT(DISTINCT t.product) AS crop_diversity,
  STDDEV(t.total) AS revenue_volatility,
  CASE
    WHEN COUNT(DISTINCT DATE_TRUNC('month', t.recorded_at)) >= 6
     AND COUNT(t.id) >= 20 THEN 'A'
    WHEN COUNT(DISTINCT DATE_TRUNC('month', t.recorded_at)) >= 3
     AND COUNT(t.id) >= 10 THEN 'B'
    ELSE 'C'
  END AS risk_tier,
  MAX(t.recorded_at) AS last_activity
FROM farmers f
LEFT JOIN transactions t ON f.id = t.farmer_id AND t.confirmed = TRUE
GROUP BY f.id, f.name, f.phone, f.region;
```

---

## WHATSAPP BOT: AI PARSING PIPELINE

```
Message arrives: "vendi 50kg cafe a 8 soles al juan del mercado ayer"
                              │
              WhatsApp Cloud API webhook
              POST /api/whatsapp/webhook
                              │
              Extract: sender phone, message text, timestamp
                              │
              Check: is sender a registered farmer?
              ├── YES → proceed
              └── NO → register flow: "Hola! Soy Chacra. ¿Cómo te llamas?"
                              │
              Claude Haiku API call:
              ┌──────────────────────────────────────────┐
              │ System: You parse agricultural            │
              │ transaction messages from Peruvian         │
              │ rural farmers into JSON.                   │
              │ Return ONLY valid JSON. No explanation.    │
              │ Handle misspellings, abbreviations,        │
              │ regional terms (arroba, quintal, saco).    │
              │ If you can't parse, return                 │
              │ {"error": "description"}.                  │
              │                                            │
              │ Schema:                                    │
              │ {                                          │
              │   "type": "sale"|"purchase"|"expense",     │
              │   "product": string,                       │
              │   "quantity": number,                      │
              │   "unit": "kg"|"arroba"|"quintal"|"saco",  │
              │   "price_per_unit": number,                │
              │   "buyer": string|null,                    │
              │   "date_offset": number                    │
              │ }                                          │
              │                                            │
              │ User: {raw_message}                        │
              └──────────────────────────────────────────┘
                              │
              Validate parsed JSON
              ├── Valid → store in DB
              │   └── Reply: "✅ Café - 50kg a S/8.00 = S/400.00
              │              Comprador: Juan del mercado
              │              ¿Correcto?"
              │
              ├── Uncertain → ask clarification
              │   └── Reply: "Entendí 50kg de café, pero no capté
              │              el precio. ¿A cuánto vendiste?"
              │
              └── Unparseable → friendly error
                  └── Reply: "No entendí bien. Intenta así:
                             'vendí [cantidad] [producto] a [precio]'"
```

### WhatsApp Registration Flow (first message)
```
Farmer: "hola"
Bot: "¡Hola! Soy Chacra, tu asistente de registro de ventas.
      ¿Cómo te llamas?"
Farmer: "Juan Pérez"
Bot: "Mucho gusto Juan. ¿De qué región eres?"
Farmer: "Cajamarca"
Bot: "Listo Juan de Cajamarca ✅
      Ahora puedes registrar tus ventas escribiéndome.
      Ejemplo: 'vendí 50 kilos de café a 8 soles'
      Prueba ahora si quieres!"
```

---

## PWA OFFLINE SYNC: IMPLEMENTATION

### Dexie.js Schema (client-side)
```javascript
const db = new Dexie('chacra');
db.version(1).stores({
  transactions: 'id, farmer_id, synced, recorded_at',
  farmer: 'id, phone'
});
```

### Sync Logic (no Background Sync API)
```javascript
// On app open + on manual button press
async function syncPendingTransactions() {
  const pending = await db.transactions
    .where('synced').equals(0)
    .toArray();

  if (pending.length === 0) return { synced: 0 };

  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactions: pending })
    });

    if (res.ok) {
      const { synced_ids } = await res.json();
      await db.transactions
        .where('id').anyOf(synced_ids)
        .modify({ synced: 1 });
      return { synced: synced_ids.length };
    }
  } catch (e) {
    // Still offline, keep pending. No crash.
    return { synced: 0, offline: true };
  }
}

// Check on every app open
if (navigator.onLine) {
  syncPendingTransactions();
}

// Also listen for connectivity changes
window.addEventListener('online', syncPendingTransactions);
```

### UUID Generation (client-side, prevents duplicates)
```javascript
// crypto.randomUUID() works in all modern browsers
// Each transaction gets a UUID at creation time on the client
// Server deduplicates by UUID on insert (ON CONFLICT DO NOTHING)
```

---

## BUILD PLAN (60 HOURS)

### PHASE 1: Foundation (Hours 0-4)
- [ ] Next.js project setup
- [ ] Supabase project + database schema migration
- [ ] PWA config (next-pwa, manifest.json, service worker for app shell caching)
- [ ] Basic layout: 2 views (farmer / dashboard)
- [ ] Vercel deploy (get URL working immediately for testing)

### PHASE 2: WhatsApp Bot (Hours 4-8)
- [ ] WhatsApp Business API setup (Meta Cloud API)
- [ ] Webhook endpoint: /api/whatsapp/webhook (verify + receive)
- [ ] Claude Haiku integration for message parsing
- [ ] Registration flow (new farmers)
- [ ] Transaction parsing + confirmation reply
- [ ] Correction flow ("no, fueron 60 kilos")
- [ ] Test with real phone

### PHASE 3: PWA Farmer App (Hours 8-18)
- [ ] Dexie.js setup (IndexedDB schema)
- [ ] Transaction input form (product dropdown, quantity, unit, price, buyer, date)
- [ ] Save to IndexedDB on submit
- [ ] Local transaction history view
- [ ] Sync-on-open logic (check online → push pending)
- [ ] Manual "Sincronizar" button with pending count badge
- [ ] Online event listener for auto-sync
- [ ] Sync status indicators (pending, syncing, synced)
- [ ] Offline detection banner ("Sin conexión - datos guardados localmente")

### PHASE 4: Sync API (Hours 18-22)
- [ ] POST /api/sync endpoint
- [ ] Receive batch, validate each transaction
- [ ] Deduplicate by UUID (ON CONFLICT DO NOTHING)
- [ ] Insert to PostgreSQL
- [ ] Return synced_ids array
- [ ] Error handling for partial syncs
- [ ] Flag transactions with price or volume outside regional market range on ingest

### PHASE 5: Dashboard (Hours 22-34)
- [ ] Auth for cooperativa users (Supabase auth or simple code)
- [ ] Overview: total production, active farmers, revenue this month
- [ ] Chart: production by crop (Recharts bar chart)
- [ ] Chart: transaction volume over time (Recharts line chart)
- [ ] Chart: price trends by crop
- [ ] Traceability table: farmer → product → volume → price → buyer → date
- [ ] Filter by: crop, region, date range
- [ ] Export to CSV
- [ ] Credit score view per farmer (risk tier, metrics, trend)
- [ ] Data integrity triage view: flagged transactions with reason (volume spike, price outlier, inconsistency with cooperative records)
- [ ] Trust score indicator per farmer (consistent / under review / flagged)
- [ ] Seed realistic demo data (regions: Cajamarca, Piura, Puno, Junín, San Martín)
- [ ] Seed at least 1 flagged farmer + 1 clean farmer to demo the triage contrast

### PHASE 6: Polish + Demo Prep (Hours 34-48)
- [ ] Mobile UI polish (farmers use small screens, big touch targets)
- [ ] Demo flow: airplane mode → register → reconnect → sync → dashboard updates
- [ ] Demo flow: WhatsApp message → bot parses → dashboard updates live
- [ ] Demo flow: show triage view — flagged farmer vs clean farmer, explain 3-layer logic
- [ ] Seed data that tells a story (show variety of farmers, crops, regions)
- [ ] Edge cases: misspellings in WhatsApp, weird units, missing fields
- [ ] Error states look good (offline banner, sync failures)
- [ ] Landing page if time allows (explains the product, not for farmers, for judges/investors)

### PHASE 7: Pitch + Final (Hours 48-60)
- [ ] Integrate Oscar's validation findings into pitch
- [ ] Prepare answer for "¿cómo saben que los datos son reales?" — name the 3 triage layers proactively
- [ ] Practice demo flow 5+ times
- [ ] Prepare one-pager / summary deliverable if required
- [ ] Practice Q&A with Oscar
- [ ] Backup plan: if WhatsApp demo fails live, have screen recording

---

## DEMO SCRIPT (5 min pitch, Demo Day)

**Setup:** PWA open on phone. Dashboard open on laptop. WhatsApp ready on a second phone.

**[0:00 - 0:30] THE HOOK**
Walk up. Make eye contact.
"Les pido un favor. Saquen sus celulares y pónganlos en Modo Avión."
(Wait for them to do it)
"Ahora intenten registrar una venta, revisar su cuenta bancaria, o mandar un dato a su cooperativa."
(Pause)
"No pueden. Bienvenidos a la realidad diaria de los productores rurales del Perú."

**[0:30 - 1:15] THE PROBLEM (anchor to Avanzar Rural)**
"Avanzar Rural fortaleció más de 1,000 planes de negocio y llegó a 20,000 productores. Pero cuando el programa cierre, ¿dónde queda esa data? En cuadernos. En el Excel de un promotor que ya no estará. La producción existe, pero para el sistema formal, estos productores son invisibles. No es que no produzcan. Es que su data está atrapada. Sin datos, no hay trazabilidad para exportar. No hay historial crediticio para acceder a un préstamo. No hay visibilidad para que la cooperativa tome decisiones."

**[1:15 - 2:15] LA SOLUCIÓN**
"Para resolverlo, construimos Chacra. Dos caminos, una misma base de datos."
(Levantar el celular)
"Camino uno: WhatsApp. El agricultor ya usa WhatsApp todos los días. Le manda un mensaje a Chacra como le mandaría a cualquier comprador."
(Mandar WhatsApp en vivo: "vendi 50kg cafe a 8 soles al juan")
"Nuestra IA entiende el mensaje, lo estructura, y le confirma."
(Mostrar la respuesta del bot en pantalla)

"Camino dos: la app funciona sin internet."
(Mostrar celular en Modo Avión, abrir PWA)
"Registro una venta. Se guarda localmente."
(Registrar venta en la PWA offline)
"Cuando el agricultor llega al pueblo y tiene señal..."
(Quitar Modo Avión, presionar Sincronizar)
"La data llega al servidor."
(Dashboard en laptop se actualiza)

"Dos caminos. Misma base de datos. Misma trazabilidad."

**[2:15 - 2:50] EL IMPACTO**
"¿Qué cambia? Tres cosas."
"Uno: la cooperativa ahora tiene trazabilidad real para exportar con certificación de Comercio Justo. Eso puede agregar hasta 40 centavos de dólar por libra de café."
"Dos: con data estructurada, una financiera puede generar un score crediticio alternativo. El productor deja de ser invisible y accede a microcrédito."
"Tres: Avanzar Rural cierra, pero su legado vive en la data. Cada transacción registrada es un ladrillo del legado digital del programa."

**[2:50 - 3:20] MODELO DE NEGOCIO**
"La app es 100% gratis para el productor. Quienes pagan son las cooperativas por acceder a dashboards de trazabilidad en tiempo real, y las financieras por acceder a la API de scoring crediticio alternativo. B2B2C: el valor sube, el costo no baja al agricultor."

**[3:20 - 3:50] EQUIPO + DISTRIBUCIÓN**
"No somos teóricos. Yo he construido más de 10 productos tech desde cero, incluyendo plataformas fintech con integración bancaria real. Oscar ha desplegado IA en entornos sin conectividad, transmitiendo datos vía LoRa en campo."
"Y la distribución no es un problema. Soy parte del equipo directivo de Spinout, una ONG que ya trabaja con comunidades rurales. No necesitamos construir confianza desde cero. Ya existe."

**[3:50 - 4:20] VALIDACIÓN**
(Oscar's data goes here - adapt based on what he found)
"En estas 48 horas, Oscar contactó a [X] productores de nuestra red en Spinout. [Real quote]. La cooperativa [Y] nos confirmó interés en acceder a data estructurada de sus asociados."
"No estamos suponiendo. Estamos probando."

**[4:20 - 5:00] CIERRE**
"El programa Avanzar Rural termina, pero su legado no tiene que terminar con él. Con el premio de este Challenge, desplegamos Chacra en nuestra red de Spinout el próximo mes. 500 productores, datos reales, acceso a mercados y crédito."
"Pueden volver a encender sus celulares."
(Sonreír)
"Gracias."

---

## Q&A PREPARATION

**Q: "¿Cómo manejan la privacidad de datos?"**
"Los datos son del agricultor. Las cooperativas ven solo data agregada de sus asociados. Las financieras acceden con consentimiento explícito del productor. Cumplimos con la Ley 29733 de Protección de Datos Personales."

**Q: "¿Qué pasa si el agricultor no sabe escribir bien?"**
"Por WhatsApp, la IA maneja errores ortográficos, abreviaciones y regionalismos. Probamos con variantes como 'bendi' o 'kfe' y las parsea bien. Además, siempre pedimos confirmación antes de guardar. Por la PWA, son dropdowns predefinidos, no texto libre."

**Q: "¿Cuánto cuesta mantener esto?"**
"WhatsApp es gratis para mensajes que inicia el agricultor. La infra corre en Supabase (free tier soporta miles de usuarios) y Vercel. El costo de la IA es ~$0.001 por mensaje parseado. Para 500 productores, hablamos de menos de $50/mes."

**Q: "¿Cómo aseguran que los datos son verdaderos?"**
"Buena pregunta — y la más importante para cualquier financiera. Tres capas: primero, consistencia temporal: un productor que vendía 50kg/mes y de repente declara 500kg es una alerta automática. Segundo, validación cruzada: si la cooperativa registra acopio de X kg de un productor y él declaró 3X, hay inconsistencia. Tercero, triage humano: solo los casos sospechosos llegan a un validador físico — el sistema actúa como filtro para que el humano intervenga donde realmente importa. Además, la realidad del campo ayuda: los agricultores venden a acopiadores que también llevan registro. Esa fuente independiente valida sin esfuerzo adicional. Es imposible mentir de forma consistente durante 8 meses."

**Q: "¿Qué pasa cuando Avanzar Rural cierre?"**
"Exactamente por eso es B2B2C autosostenible. Cooperativas pagan por trazabilidad, financieras por scoring. No dependemos de programas o subsidios."

**Q: "¿Han validado con productores reales?"**
(Adapt with Oscar's data) "Contactamos a X productores de Spinout. [Quote]. La cooperativa [Y] confirmó interés."

**Q: "¿Y los que no tienen smartphone?"**
"Hoy, la mayoría de conexiones móviles en Perú son smartphones. Pero la arquitectura soporta SMS como tercer canal. En producción lo activaríamos. Para este piloto, WhatsApp + offline cubre al 95% de nuestra red en Spinout."

**Q: "¿Qué los diferencia de otras apps agrícolas?"**
"Las apps agrícolas asumen 4G. Nosotros asumimos cero conectividad. Y no somos una app de registro. Somos un pipeline que convierte registros en acceso a mercados y crédito. El registro es el input, no el producto."

**Q: "¿Cómo escalan más allá de Spinout?"**
"Cada cooperativa es un canal de distribución. Si la cooperativa adopta Chacra, sus 200-500 asociados la usan. No necesitamos ir productor por productor. Y las cooperativas tienen incentivo: trazabilidad para exportar."

---

## NAMING

**Chacra.** Every Peruvian judge gets it instantly. Warm, grounded, universal. Chacra means the small farm plot in quechua/spanish, understood across all regions.

Domain check during hackathon: try chacra.app, chacraapp.com, or use chacra.vercel.app for demo.

---

## MONETIZATION

```
FARMER (free, always)
  │
  │ data flows up
  ▼
COOPERATIVA ($50-200/month)
  - Real-time production dashboard
  - Traceability for export certification
  - Member management
  │
  │ data flows up (with farmer consent)
  ▼
FINANCIERA ($200-500/month)
  - Alternative credit scoring API
  - Portfolio risk assessment
  - Rural market intelligence
```

Unit economics at scale:
- 50 cooperativas × $100/mo = $5,000/mo
- 10 financieras × $300/mo = $3,000/mo
- Total: $8,000/mo, minimal infra costs
- Self-sustaining without grants

---

## COMPETITIVE POSITIONING

| Feature | Chacra | Generic AgTech | Paper Notebooks |
|---------|--------|----------------|-----------------|
| Works offline | Full PWA | Needs 4G | Always works |
| WhatsApp input | AI-parsed | No | No |
| Structured data | Automatic | Manual entry | Unstructured |
| Credit scoring | Built-in | Not their focus | Impossible |
| Traceability | Automatic | Some | Manual |
| Cost to farmer | Free | $5-20/month | Free |
| Learning curve | Zero (WhatsApp) | App training | None |
| Works in rural Peru | Designed for it | Adapted from urban | Yes but limited |

---

## AVANZAR RURAL LEGACY TIE-IN

Use in pitch and deliverable:

"Avanzar Rural generó 1,000 planes de negocio y fortaleció 20,000 productores. Esa data, esos aprendizajes, esas redes de confianza son el activo más valioso del programa. Chacra es la infraestructura que mantiene ese activo vivo después del cierre. Cada transacción registrada es un ladrillo del legado digital de Avanzar Rural."

---

## RISK REGISTER

| Risk | Mitigation |
|------|------------|
| Farmers won't adopt | WhatsApp = zero learning curve. Spinout trust network for distribution. |
| AI misparsing messages | Confirmation reply. Farmer corrects. Model improves. |
| No smartphone | 95%+ coverage. SMS as production roadmap. |
| Cooperativas won't pay | Start free during pilot. Charge when exports increase. |
| Data quality/gaming | Temporal consistency + cooperative cross-validation. |
| WhatsApp API changes | PWA is fully independent channel. Not locked to Meta. |
| Demo fails live | Screen recording backup of full demo flow. |

---

## CUT LIST (if running out of time)

Priority order (cut from bottom):
1. **MUST SHIP:** WhatsApp bot (parse + confirm) + PWA offline form + sync + basic dashboard
2. **HIGH VALUE:** Credit scoring view, charts, cooperativa filters
3. **NICE TO HAVE:** CSV export, correction flow in WhatsApp, registration flow
4. **CUT IF NEEDED:** Landing page, farmer history in PWA, advanced analytics

Rule: if it's 4 AM and something isn't working, cut it and polish what works. One flawless demo > three buggy features.
