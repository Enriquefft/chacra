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
| `BUSINESS.md` | **Why it matters.** Strategy, personas, value prop, market sizing, competition, business model, alliances, go-to-market, risks. Single source of truth for business strategy. |
| `INTEL.md` | **What we know.** Living research doc. Cooperatives, financieras, NGOs, government programs, funding opportunities, competitive landscape, user research. Grows over time. |
| `TEAM.md` | **Who builds it.** Core team roles, responsibilities, needed profiles, equity, decision model. |
| `PLAYBOOK.md` | **How we sell.** Outreach templates (WhatsApp/email/LinkedIn), pitch narrative, objection handling, channel strategy, conversation goals. |
| `crm.csv` | **Who we're talking to.** All contacts and pipeline: cooperatives, financieras, funders, allies, stakeholders. Single source of truth for relationships. |

### Archive (in `archive/`)

Challenge-era artifacts. Historical reference only — not active docs.

## Key Rules

- Read the relevant docs BEFORE doing any work
- `app/SPEC.md` is the single source of truth for what gets built
- `BUSINESS.md` is the single source of truth for business strategy
- `crm.csv` is the single source of truth for contacts and pipeline
- All UI copy in Spanish

## Stack

Next.js 16 (App Router) | Neon (Postgres) | Drizzle ORM | better-auth (Google OAuth) | shadcn/ui | Dexie.js (offline) | Biome | Vercel
