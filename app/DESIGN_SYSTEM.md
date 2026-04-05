# Chacra Design System

Reference for AI tools, asset generation, and cross-chat context.
Source of truth: `app/globals.css` (CSS variables) + `components.json` (shadcn config).

## Brand

**Chacra** — offline-first agricultural data platform for Peruvian producers.
Tagline: "Datos bancables para el agro peruano."

### Personality

- **Warm, not cold.** Earthy tones rooted in Peruvian landscape — clay, soil, olive, amber.
- **Quiet confidence.** Premium through restraint, not decoration. No gradients, no glass morphism.
- **Trustworthy.** Feels like a real banking app but warmer. "My data is safe here."
- **Accessible.** Spanish-first, large text, offline-capable, zero-friction.

### Two audiences

| Audience | Feel | Treatment |
|----------|------|-----------|
| **Producers** (free) | Warm, large, simple | 18px body, 44px touch targets, generous whitespace |
| **Cooperativas/Financieras** (B2B) | Professional, data-dense | Compact tables, charts, credible SaaS aesthetic |

---

## Color Palette (OKLCH)

All colors use OKLCH format. Hue `33` = terracotta, `145` = olive, `75` = amber, `155` = sage, `45` = clay.

### Semantic tokens — Light

| Token | OKLCH | Role | Approx hex |
|-------|-------|------|------------|
| `--primary` | `oklch(0.53 0.14 33)` | Terracotta — brand, CTAs, links | #B7522A |
| `--primary-foreground` | `oklch(0.98 0.005 75)` | Text on primary | #FBF8F5 |
| `--secondary` | `oklch(0.94 0.01 70)` | Light taupe — secondary buttons | #F0ECE6 |
| `--accent` | `oklch(0.65 0.10 85)` | Warm gold — interactive highlights | #A89050 |
| `--muted` | `oklch(0.95 0.008 70)` | Taupe — disabled, backgrounds | #F2EFE9 |
| `--destructive` | `oklch(0.55 0.20 25)` | Warm red — errors | #C53A25 |
| `--success` | `oklch(0.60 0.12 145)` | Olive green — synced, confirmed | #4D8B4A |
| `--warning` | `oklch(0.75 0.14 75)` | Amber — pending sync | #C4A030 |
| `--background` | `oklch(0.98 0.006 80)` | Warm off-white | #FAF8F5 |
| `--foreground` | `oklch(0.22 0.02 50)` | Warm near-black | #2E2820 |
| `--border` | `oklch(0.91 0.008 70)` | Warm light gray | #E5E0D8 |

### Chart colors (data visualization)

| Token | OKLCH | Name | Use |
|-------|-------|------|-----|
| `--chart-1` | `oklch(0.58 0.14 33)` | Terracotta | Primary metric |
| `--chart-2` | `oklch(0.60 0.10 145)` | Olive | Secondary metric |
| `--chart-3` | `oklch(0.72 0.14 75)` | Amber | Tertiary metric |
| `--chart-4` | `oklch(0.65 0.08 155)` | Sage | Quaternary metric |
| `--chart-5` | `oklch(0.50 0.10 45)` | Clay | Quinary metric |

### Dark mode

Same hue families, adjusted lightness. Primary lightens to `oklch(0.70 0.12 33)`. Backgrounds shift to warm dark brown `oklch(0.18 0.015 50)`. Full values in `app/globals.css`.

### Color rules

- Max 2–3 colors per screen. Earthy palette used sparingly against warm neutrals.
- Never use raw Tailwind colors (`bg-blue-500`). Always semantic (`bg-primary`, `text-muted-foreground`).
- Scoring badges: **A** = `bg-success`, **B** = `bg-warning`, **C** = `variant="destructive"`.
- Shadows: subtle, warm-tinted (not cool gray). Only for elevation changes.

---

## Typography

| Property | Value |
|----------|-------|
| Font family | Geist (via `next/font/google`) |
| Weights | Regular (400), Medium (500), Semibold (600) — max 3 |
| Body minimum | 16px (1rem) |
| Producer screens | 18px (text-lg) body, text-base for secondary |
| Line height | Generous (Tailwind defaults) |
| Language | Spanish-first. All UI copy in Spanish. |

### Scale

| Level | Class | Use |
|-------|-------|-----|
| Page title | `text-3xl font-semibold tracking-tight` | h1 |
| Section title | `text-2xl font-semibold tracking-tight` | h2 |
| Subtitle | `text-xl font-medium` | h3 |
| Body large | `text-lg` | Producer-facing body text |
| Body | `text-base` | Default body |
| Secondary | `text-sm text-muted-foreground` | Labels, metadata |
| Caption | `text-xs text-muted-foreground` | Timestamps, hints |

---

## Spacing

4px grid: `4, 8, 12, 16, 24, 32, 48`. No arbitrary values.
Use Tailwind `gap-*` (not `space-x/y-*`). For vertical stacks: `flex flex-col gap-*`.

---

## Border Radius

Base: `--radius: 0.5rem` (8px). Consistent on cards, buttons, inputs, badges.

| Token | Computed | Use |
|-------|----------|-----|
| `rounded-sm` | 4.8px | Small badges |
| `rounded-md` | 6.4px | Small inputs |
| `rounded-lg` | 8px | Cards, buttons, inputs (default) |
| `rounded-xl` | 11.2px | Modals, large cards |

---

## Icons

**Library:** `@solar-icons/react` (Solar Icons)

| Variant | Use | Example context |
|---------|-----|-----------------|
| **Bold Duotone** | Primary — navigation, key actions, dashboard metrics | `weight="BoldDuotone"` |
| **Linear** | Secondary — table row actions, metadata, checklists | `weight="Linear"` |

| Size | Pixels | Use |
|------|--------|-----|
| 16 | Inline badges | `size={16}` |
| 20 | Default, list items | `size={20}` |
| 24 | Navigation, prominent | `size={24}` |
| 28–40 | Feature cards, heroes | `size={28}` to `size={40}` |

**No Lucide, no Heroicons.** Solar is the single icon system.
Icons inside `Button` use `data-icon="inline-start"` or `data-icon="inline-end"` — no manual sizing classes.

Solar icons are client components — re-export through a `"use client"` barrel file when used in server components.

---

## Components (shadcn/ui)

**Style:** `radix-nova` | **Base:** Radix | **Tailwind:** v4 with `@theme inline`

### Installed

`alert` `badge` `button` `card` `chart` `input` `select` `separator` `sheet` `sidebar` `skeleton` `sonner` `table` `tooltip`

### Button sizes

| Size | Height | Use |
|------|--------|-----|
| `xs` | 24px (h-6) | Compact inline actions |
| `sm` | 28px (h-7) | Dashboard secondary |
| `default` | 32px (h-8) | Dashboard primary |
| `lg` | **44px (h-11)** | Producer-facing (touch target) |

Producer routes use `size="lg"` as default. Dashboard uses `size="default"`.

### Input touch targets

Default input: `h-8`. Producer-facing: add `className="h-11 text-base"` for 44px touch targets.

### Key patterns

```tsx
// Semantic badges for scoring
<Badge className="bg-success text-success-foreground">Tier A</Badge>
<Badge className="bg-warning text-warning-foreground">Tier B</Badge>
<Badge variant="destructive">Tier C</Badge>

// Sync status
<Badge className="bg-success text-success-foreground">Sincronizado</Badge>
<Badge className="bg-warning text-warning-foreground">Pendiente</Badge>

// Source badges
<Badge variant="secondary">WhatsApp</Badge>
<Badge variant="outline">PWA</Badge>

// Forms: FieldGroup + Field, not raw divs
// Spacing: gap-*, not space-y-*
// Equal dimensions: size-*, not w-* h-*
```

---

## Transitions & Animation

- Duration: 150–200ms `ease-out`. Nothing bounces. Nothing overshoots.
- Loading: `Skeleton` with earthy tones, not generic gray pulses.
- Active buttons: `active:translate-y-px` (subtle press).
- Empty states: designed with Solar icon + warm Spanish copy.

---

## Asset Generation Guidelines

When generating images, illustrations, or visual assets for Chacra:

- **Color palette:** terracotta (#B7522A), olive (#4D8B4A), amber (#C4A030), warm cream (#FAF8F5), warm brown (#2E2820)
- **Style:** clean, geometric, minimal illustration. No gradients or glass effects.
- **Iconography:** match Solar Icons' geometric, consistent-weight style.
- **Photography direction (if used):** warm sunlight, Peruvian highlands/selva, coffee/cacao farms, human hands working soil. Warm color grading.
- **Typography in assets:** clean sans-serif (Geist or similar). Max 2 weights.
- **Mood:** trustworthy, warm, grounded. Like a well-designed banking app for people who work with their hands.
