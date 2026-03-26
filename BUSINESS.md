# Chacra — Business

Single source of truth for **why** this matters, **for whom**, and **how it wins**.
Product spec lives in app/SPEC.md. Research and data live in INTEL.md.

---

## The Problem

In rural Peru, agricultural transactions are invisible. A farmer can produce and sell coffee for a decade and have zero financial history. No records. No credit score. No way to prove they're a viable business.

This invisibility creates a chain of failures:

1. **Farmers can't access credit.** Banks require documentation that doesn't exist. Only 30% of smallholders access formal credit. The rest rely on intermediaries who charge 30%+ interest or lock them into exploitative advance-purchase agreements.

2. **Cooperatives can't prove traceability.** Export markets (especially the EU) increasingly demand per-farmer production records. Cooperatives track this on paper or Excel — fragile, unauditable, and useless when the inspector asks for digital proof.

3. **Financieras can't assess risk.** Lending to agriculture in rural Peru means lending blind. Without farmer-level transaction data, financial institutions either over-price credit (punishing good farmers) or avoid the sector entirely.

4. **The data exists but evaporates.** Every sale happens. Every kilo is weighed. Every price is negotiated. But none of it is captured digitally because there's no connectivity at the point of transaction.

**The root cause is not illiteracy or unwillingness. It's infrastructure.** Rural Peru has spotty or zero internet at the farm gate. Any solution that requires connectivity at the moment of data entry fails.

**Why a PWA and nothing else:** A structured offline form captures clean data at the point of transaction — no parsing, no ambiguity, no connectivity required. SMS/WhatsApp/voice all produce unstructured text that's unreliable for credit scoring.

---

## Who We Serve

### Persona 1: The Farmer (Rosa)

**Rosa, 42. Coffee farmer in San Ignacio, Cajamarca.**

- Manages 3 hectares with her husband. Two children in secondary school.
- Member of her local cooperative for 8 years.
- Sells 15-25 quintales per harvest season.
- Keeps a cuaderno (paper notebook) with sale dates and amounts. Sometimes.
- Has a mid-range Android phone (Samsung A series or similar). Prepaid data plan she recharges weekly.
- Gets internet at the cooperative office, the town plaza, or sometimes at home with weak signal.
- Has never had a formal bank loan. Got an advance from an intermediary once at 35% interest because she needed money for fertilizer before harvest.
- Speaks Spanish fluently. Some Quechua with older family members.

**What she needs:** A way to register her sales that works without internet, takes less than 30 seconds, and eventually helps her get a real bank loan at a fair rate.

**What she doesn't need:** Another app to learn. Complex interfaces. Anything that requires her to understand financial terminology.

### Persona 2: The Cooperative Admin (Carlos)

**Carlos, 35. Operations manager at a 500-member coffee cooperative in Moyobamba, San Martin.**

- University-educated (agronomy). Returned to his home region to work in the cooperative.
- Manages producer records, tracks production against export contracts, handles certification audits.
- Currently uses Excel spreadsheets and paper forms collected from collection centers.
- Spends 2 weeks per year preparing documentation for Fair Trade / Organic audits.
- Loses sleep over export contract compliance — if they promised 200 tons and can't trace it per-farmer, they risk the contract.
- Has a laptop, smartphone, and reliable office internet.

**What he needs:** Real-time visibility into production by farmer. Traceability that auditors accept. Early warning when a farmer's behavior looks suspicious (integrity). A way to manage which products his farmers can log.

**What he doesn't need:** Another system to maintain manually. Anything that requires his farmers to have internet.

### Persona 3: The Financiera Analyst (Lucia)

**Lucia, 29. Credit analyst at a microfinance institution in Lima.**

- Evaluates loan applications for agricultural clients.
- Current process: field visit, interview, take photos of the farm, check SBS (banking regulator) for existing debts, make a judgment call.
- Each evaluation costs the institution S/500-800 in travel and staff time for rural clients.
- Approval rates for rural agricultural loans are low because she can't verify income claims.
- Her institution wants to grow the agricultural portfolio (government incentives exist) but risk management pushes back because data is too thin.

**What she needs:** Verified transaction history for farmers applying for credit. A trust score based on data consistency. Evidence that the farmer actually produces what they claim, at the volumes they claim, at market-consistent prices.

**What she doesn't need:** Raw data to analyze herself. She needs a pre-computed credit profile she can incorporate into her existing evaluation workflow.

---

## Value Proposition

### For Farmers
> Registra tus ventas en 15 segundos, sin internet. Cada venta que registras construye tu historial. Cuando un banco pregunte, vas a tener datos — no un cuaderno.

- First-ever digital financial history
- Price signals: know if you're selling above or below market average
- Path to formal credit at fair rates
- **Free. Always.**

### For Cooperatives
> Ve la produccion de todos tus productores en tiempo real. Cumple contratos de exportacion con trazabilidad digital.

- Real-time production tracking per farmer
- Export contract progress monitoring
- Integrity checks that flag suspicious data before auditors find it
- Product list and goal management
- CSV export for reports and audits
- **Pays for the tool** (SaaS model)

### For Financieras
> Evalua productores rurales con datos reales de campo, no con suposiciones.

- Credit profiles built from 6+ months of verified transactions
- Trust score (0-100) based on data consistency
- Income trends, volume patterns, price benchmarks
- Reduces evaluation cost and risk
- **Pays for credit profiles consumed** (per-query or subscription)

---

## Market

### Peru Agricultural Sector

- **2.2 million farming families** in Peru (MIDAGRI census)
- **20,000+ producers** benefited by Avanzar Rural alone
- **1,000+ business plans** co-financed by Avanzar Rural
- Coffee: Peru is the **#1 organic coffee exporter** globally. 223,000 coffee families.
- Cacao: Peru is a **top 10 cacao producer** globally. Growing specialty/fine-flavor segment.
- Banano organico: Peru is a **top organic banana exporter**. Concentrated in Piura.

### Cooperative Ecosystem

- **56 cooperatives** in the Junta Nacional del Cafe alone, representing **70,000 families**
- Cooperatives handle **30% of Peru's coffee exports**
- Key regions: Cajamarca, San Martin, Junin, Cusco, Piura, Puno, Amazonas
- Most cooperatives export (Fair Trade, Organic, Rainforest Alliance certifications require traceability)

### Financial Inclusion Gap

- Only **41.8% of rural adults** have financial system access (vs 65.5% urban)
- Smallholders have **~30% probability** of accessing formal credit
- Agrobanco (state ag bank) projects **166,000 clients** and **S/1.8 billion** in placements for 2026
- Government approved **S/100 million** for FIFPPA fund to reduce rural interest rates
- SBS National Financial Inclusion Strategy targets **75% banked adult population**

### Addressable Market

| Segment | Size | Chacra's entry |
|---------|------|----------------|
| Coffee cooperatives | 56 (JNC) + independents, ~223,000 families | One coop at a time. Each brings all its farmers. |
| Cacao cooperatives | ~30 organized cooperatives, 50,000+ families | Same distribution model. |
| Other agro cooperatives | Banano, quinoa, etc. | Expansion after coffee/cacao. |
| Microfinanzas/financieras | Agrobanco, 5 CRACs, 10+ CMACs, Mibanco, etc. | Credit scoring API/dashboard access. |

**TAM (total addressable):** 2.2M farming families in Peru.
**SAM (serviceable):** ~350,000 organized cooperative members (coffee + cacao + banano + quinoa).
**SOM (obtainable year 1):** 5-10 cooperatives, 3,000-10,000 farmers.

---

## Competition & Alternatives

### Closest competitor: Agros (Peru)

Blockchain-based digital identities for smallholder farmers. Field agents ("Inges") collect soil samples and georeference plots. Partners with Caja Sullana for credit. 10,000+ farmers. Funded by ProInnovate. Expanding internationally via IICA + IFAD.

**Key differences:**

| Dimension | Agros | Chacra |
|-----------|-------|--------|
| Data capture | Field agents visit farms | Farmer self-reports via PWA |
| Works offline | No (agent has connectivity) | Yes (offline-first, sync later) |
| Core data | Identity + geolocation + soil | Transaction history (sales, prices, volumes) |
| Credit input | Static farm profile | Dynamic transaction-based score |
| Blockchain | Yes | No (simpler, lower friction) |
| Cooperative integration | Indirect | Native (coop manages products, sees dashboards) |
| Scalability | Limited by agent capacity | Unlimited (farmer-operated, zero marginal cost) |

**Verdict:** Complementary more than competitive. Agros provides identity + land data. Chacra provides transaction + credit data. Combined, they'd give a financiera the full picture.

### What else exists

| Alternative | What it does | Why it falls short |
|-------------|-------------|--------------|
| Paper notebook (cuaderno) | Farmer writes sales | No sync, no aggregation, no credit profile, gets lost |
| Excel at cooperative | Admin tracks production | Manual entry, no farmer input, stale, error-prone |
| WhatsApp groups | Coops coordinate with farmers | Unstructured, can't extract data, requires connectivity |
| ERP for coops (SAP, custom) | Large coop management | Expensive, complex, doesn't capture farmer-level data at point of sale |
| COPERAWEB (Peru) | Export traceability ERP | Coop-facing, not farmer-facing. No offline. No credit scoring. |
| Agritracer (Peru) | Farm management + traceability | Field worker operated, not farmer operated |
| FarmForce (Syngenta) | Smallholder data collection | Requires connectivity, agent-operated |
| Agritask, Cropio | Commercial ag-tech | Designed for large farms, not smallholders, not offline |
| MIDAGRI AgroDigital | Training + info app for farmers | Information delivery, not data capture. No credit output. |

### The gap Chacra fills

**No existing solution captures farmer-level transaction data offline and converts it into a credit profile.**

The data originates at the farm gate where there's no internet. Everyone either requires connectivity (killing adoption), relies on agents (limiting scale), or relies on the cooperative to manually enter data (killing accuracy and coverage).

Chacra is the only solution that:
1. Works at point of transaction without internet
2. Is operated by the farmer themselves (not an agent or admin)
3. Produces a credit-grade output (not just a record)
4. Integrates natively with the cooperative (traceability, product management, export goals)

### Complementary players (not competitors)

- **MIDAGRI PPA:** Government farmer registry (2M+ farmers, 38 data points). Identity layer. Chacra adds transaction/credit layer.
- **Agros:** Farm identity + geolocation + soil. Chacra adds transaction history + credit scoring.
- **UNICAs / bancos comunales:** Repayment data from savings groups. Chacra adds production/sales data.
- **Yape / Plin:** Payment rails. Chacra tracks the agricultural transaction, not the payment method.

---

## Business Model

**Farmers never pay.** They are the data source and primary beneficiary, not the customer.

### Revenue streams

| Stream | Who pays | Model | Why they pay |
|--------|----------|-------|-------------|
| Cooperative SaaS | Cooperative | Monthly per-cooperative fee | Traceability, export compliance, producer management |
| Credit scoring | Financiera | Per-profile or subscription | Risk reduction, portfolio expansion into rural ag |
| Data insights (future) | Exporters, gov programs | Aggregated anonymized data | Market intelligence, program evaluation |

### Pricing intuition (validate with market)

- Cooperative: S/200-500/month depending on size (cheaper than one lost export contract)
- Financiera: S/10-50 per credit profile (cheaper than S/500+ field visit)

### Unit economics

- CAC is low: cooperatives are the distribution channel. One cooperative onboarded = all its farmers onboarded.
- Marginal cost per farmer is near-zero (serverless infra, no per-user licensing).
- Network effects: more farmers = better price benchmarks = more valuable credit profiles = more financieras willing to pay.

---

## Regulatory Tailwinds

### EU Deforestation Regulation (EUDR)
- Effective 2025. Requires companies importing coffee, cacao, soy, palm oil, etc. to prove products are deforestation-free with **per-farm traceability**.
- Peruvian cooperatives that export to Europe MUST have auditable per-farmer production data.
- Chacra generates exactly this data as a byproduct of normal operation.

### SBS National Financial Inclusion Strategy (ENIF)
- Peru's banking regulator is actively pushing to increase rural financial inclusion from 41.8% to 75%.
- Alternative credit scoring mechanisms that reach unbanked populations are explicitly encouraged.

### MIDAGRI Digital Agriculture Push
- Padron de Productores Agrarios (PPA) is digitizing farmer identity.
- Government is investing in rural agricultural credit (FIFPPA fund, Agrobanco expansion).
- Chacra complements the identity layer (PPA) with a transaction/credit layer.

---

## Go-to-Market

### Phase 1: Cooperative-led adoption
1. Onboard 1-3 cooperatives as design partners (free)
2. Cooperative admin configures products, shares invite code with farmers
3. Farmers register at cooperative office (wifi available), then use offline
4. 3-6 months of data accumulation
5. Demonstrate credit profiles to financiera partners

### Phase 2: Financiera revenue
1. Approach microfinance institutions with real anonymized credit profiles
2. Offer pilot: evaluate N farmers using Chacra profiles alongside traditional methods
3. Compare outcomes. If Chacra profiles predict repayment accurately, convert to paid.

### Phase 3: Scale
1. Each financiera partnership creates demand for more cooperatives (they want more profiles)
2. Each cooperative onboarded creates supply for financieras (more profiles available)
3. Flywheel: coops want the tool (free) -> farmers generate data -> financieras pay for profiles -> revenue funds growth

### Distribution channel
The cooperative IS the distribution channel. One relationship with a cooperative admin = 200-5,000 farmers. No need for per-farmer acquisition.

---

## Alliance Value Map

| Ally type | What they give us | What we give them |
|-----------|-------------------|-------------------|
| Cooperativa agraria | Users, validation, pilot data | Free tool, trazabilidad, EUDR compliance |
| Financiera / microfinanza | Revenue, credibility | Credit profiles they can't get otherwise |
| COFIDE | Distribution to 66 institutions | Validated scoring tool for their downstream channels |
| FIDA / IFAD | Legitimacy, funding path, MERCAGRO access | Continuity of Avanzar Rural legacy |
| MIDAGRI / Sierra Exportadora | Institutional backing | Digital tool for their beneficiarios |
| NGO (GIZ, USAID, Helvetas) | Funding, distribution in their programs | Data platform for their rural projects |
| University (UNALM, UTEC) | Research credibility, talent | Real-world case study, thesis projects |
| JNC / umbrella orgs | Access to 56+ coops via one relationship | Free member benefit, EUDR compliance path |

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Farmer adoption: "I won't use another app" | High | 4-field form, 15 seconds, works offline. Cooperative pushes adoption (they need the data). |
| Cooperative resistance: "We already have Excel" | Medium | Free. Show traceability value for export contracts + EUDR compliance. |
| Data quality: farmers enter wrong numbers | Medium | Integrity model detects anomalies. Cross-validation with coop records. Trust scores. |
| Connectivity: sync never happens | Low | Sync-on-open + manual button. Farmers visit coop office or town periodically. |
| Competition: big ag-tech enters the space | Low | They optimize for large farms. Offline-first PWA for smallholders is not their model. |
| Regulatory: data privacy concerns | Medium | Comply with Peru's Ley 29733. Anonymize credit profiles. Farmers own their data. |

---

## Why Now

1. **Avanzar Rural is closing.** 20,000+ producers and 1,000+ business plans risk losing continuity. Chacra captures and sustains that legacy.
2. **EUDR is live.** European export markets now require per-farm traceability. Cooperatives need this yesterday.
3. **Peru government is pushing rural credit.** Agrobanco expansion, FIFPPA fund, SBS inclusion targets. The political will and budget exist.
4. **Smartphones are ubiquitous.** Even in rural Peru, Android phones with Google accounts are the norm. The hardware barrier is gone.
5. **PWA technology is mature.** Offline-first web apps that install from the browser (no Play Store) are production-ready.
