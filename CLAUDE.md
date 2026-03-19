# Chacra

Offline-first agricultural data platform for Peruvian farmers. One PWA, three audiences (farmer, cooperative, financiera). Turns invisible transactions into structured, bankable data.

## Documentation

### Product (in `app/`)

| Doc | Purpose |
|-----|---------|
| `app/SPEC.md` | **What gets built.** Product requirements, features, data model, routes. Single source of truth for product. Read before any code task. |
| `app/ARCHITECTURE.md` | **How it's built.** DB schema, directory structure, auth design, module contracts, tech decisions log. Read before any code task. |
| `app/ROADMAP.md` | **Where we are.** Phase progress and task status. Check before starting work to avoid duplicating effort. |
| `app/DESIGN_SYSTEM.md` | **How it looks.** Colors (OKLCH terracotta palette), typography (Geist), icons (Solar), spacing, component patterns. Read before any UI task. |

### Business (in project root)

| Doc | Purpose |
|-----|---------|
| `BUSINESS.md` | **Why it matters.** Problem statement, 3 user personas (Rosa/Carlos/Lucia), value proposition per audience, market sizing (TAM/SAM/SOM), competition (incl. Agros), business model, go-to-market, regulatory tailwinds, risks. Stable strategy doc. |
| `INTEL.md` | **What we know.** Living research doc. 20+ cooperatives with contacts, financieras, NGOs, government programs, funding opportunities (ProInnovate, Kunan, NESsT), competitive landscape, outreach log. Grows over time. |
| `PITCH.md` | **What we say.** 5-min pitch script for Avanzar Rural Legacy Challenge. Structured by evaluation criteria. Q&A prep for likely questions. Delivery notes. |
| `OUTREACH.md` | **Who we contact.** Cold outreach targets by type (coops, financieras, allies), message templates (WhatsApp/email), tracking table. |
| `ALLIANCES.md` | **Who strengthens us.** Alliance value map, proof points checklist, narrative hooks per evaluation criterion. |
| `bases.pdf` | **Challenge rules.** Avanzar Rural Legacy Challenge 2026 (UTEC Ventures + FIDA). 4 retos, evaluation criteria, legal terms. |

## Key Rules

- Read the relevant docs BEFORE doing any work
- `app/SPEC.md` is the single source of truth for what gets built
- `BUSINESS.md` is the single source of truth for business strategy
- All UI copy in Spanish

## Stack

Next.js 16 (App Router) | Neon (Postgres) | Drizzle ORM | better-auth (Google OAuth) | shadcn/ui | Dexie.js (offline) | Biome | Vercel

## Challenge Context

Avanzar Rural Legacy Challenge 2026. UTEC Ventures + FIDA + Avanzar Rural.
- Reto 4: Data management & traceability in low connectivity (primary)
- Reto 2: Financial management & access to financial services (secondary)
- Evaluation: Impact 35%, Viability 35%, Problem Understanding 20%, Innovation 10%
- Closest competitor: Agros (complementary -- they do identity/blockchain, we do transactions/credit scoring)
