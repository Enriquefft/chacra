// ─── Types ───

export type Tier = "A" | "B" | "C"

export interface Farmer {
  name: string
  region: string
  crop: string
  tier: Tier
  monthlyIncome: number
  months: number
  trustScore: number
}

export interface MonthlyIncome {
  month: string
  income: number
}

export interface IncomeSource {
  source: string
  pct: number
  color: string
}

export interface TrustCheck {
  label: string
  passed: boolean
}

export interface FlaggedTransaction {
  crop: string
  qty: string
  price: string
  reason: string
}

export interface VerificationLayer {
  step: string
  title: string
  desc: string
}

export interface DataSource {
  source: string
  verified: boolean
}

// ─── Seed data ───

export const FARMERS: Farmer[] = [
  { name: "María Quispe", region: "Cajamarca", crop: "Café/Leche", tier: "A", monthlyIncome: 2400, months: 8, trustScore: 8.7 },
  { name: "Carlos Huanca", region: "Puno", crop: "Cacao", tier: "A", monthlyIncome: 1890, months: 11, trustScore: 9.1 },
  { name: "Rosa Mamani", region: "Cusco", crop: "Café", tier: "A", monthlyIncome: 2100, months: 6, trustScore: 7.8 },
  { name: "Ana Condori", region: "Apurímac", crop: "Cacao", tier: "A", monthlyIncome: 1750, months: 9, trustScore: 8.4 },
  { name: "Luis Flores", region: "San Martín", crop: "Café", tier: "A", monthlyIncome: 2230, months: 7, trustScore: 8.0 },
  { name: "Sofía Ramos", region: "La Libertad", crop: "Fresa", tier: "B", monthlyIncome: 1320, months: 5, trustScore: 6.9 },
  { name: "Pedro Vargas", region: "San Martín", crop: "Cacao", tier: "B", monthlyIncome: 1450, months: 4, trustScore: 6.2 },
  { name: "Elena Torres", region: "Cajamarca", crop: "Fresa", tier: "B", monthlyIncome: 980, months: 7, trustScore: 6.8 },
  { name: "Juan Paredes", region: "Junín", crop: "Maíz", tier: "B", monthlyIncome: 850, months: 3, trustScore: 5.9 },
  { name: "Lucía Mamani", region: "Puno", crop: "Leche", tier: "B", monthlyIncome: 1100, months: 5, trustScore: 6.5 },
  { name: "Diego Chávez", region: "Huánuco", crop: "Café", tier: "B", monthlyIncome: 1200, months: 4, trustScore: 6.3 },
  { name: "Carmen Huamán", region: "Amazonas", crop: "Cacao", tier: "B", monthlyIncome: 1050, months: 3, trustScore: 5.7 },
  { name: "José Mendoza", region: "San Martín", crop: "Cacao", tier: "C", monthlyIncome: 720, months: 3, trustScore: 4.1 },
  { name: "Marco Quispe", region: "Ayacucho", crop: "Café", tier: "C", monthlyIncome: 430, months: 2, trustScore: 3.2 },
]

/** Farmers with full profile data available in the demo. */
export const AVAILABLE_FARMER_NAMES = new Set([
  "María Quispe",
  "Rosa Mamani",
  "Pedro Vargas",
  "José Mendoza",
])

export const PORTFOLIO_KPIS = [
  { label: "Volumen transado", value: 1.2, prefix: "S/", suffix: "M", decimals: 1 },
  { label: "Productores activos", value: 156, prefix: "", suffix: "", decimals: 0 },
  { label: "Datos verificados", value: 92, prefix: "", suffix: "%", decimals: 0 },
  { label: "Tasa de mora", value: 3.2, prefix: "", suffix: "%", decimals: 1 },
] as const

export const PORTFOLIO_RISK = [
  { label: "Estabilidad de ingreso", value: "84%", desc: "Variación mensual promedio invertida" },
  { label: "Diversificación", value: "6 cultivos", desc: "Productos agrícolas distintos" },
  { label: "Cobertura regional", value: "8 regiones", desc: "Departamentos con productores" },
  { label: "Fuentes de datos", value: "3 independientes", desc: "Cooperativa, acopio, Chacra" },
  { label: "Historial promedio", value: "5.8 meses", desc: "Meses de datos por productor" },
] as const

export const TIER_DISTRIBUTION = [
  { tier: "A" as Tier, count: 67, fill: "var(--color-success)" },
  { tier: "B" as Tier, count: 59, fill: "var(--color-warning)" },
  { tier: "C" as Tier, count: 30, fill: "var(--color-destructive)" },
]

export const VERIFICATION_LAYERS: VerificationLayer[] = [
  {
    step: "1",
    title: "Consistencia temporal",
    desc: "Detecta anomalías en volumen, precio y frecuencia a lo largo del tiempo",
  },
  {
    step: "2",
    title: "Validación cruzada",
    desc: "Contrasta cada registro con datos de cooperativa y promedios zonales",
  },
  {
    step: "3",
    title: "Triage humano",
    desc: "Solo los casos atípicos pasan a verificación manual por un analista",
  },
]

// ─── Per-farmer generated data ───

const MONTHS_LABELS = ["Oct", "Nov", "Dic", "Ene", "Feb", "Mar"]

/** Deterministic pseudo-random from farmer name, so data is stable across renders. */
function seed(name: string, i: number): number {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) | 0
  return Math.abs((h * (i + 1) * 2654435761) | 0)
}

export function getFarmerIncome(farmer: Farmer): MonthlyIncome[] {
  const base = farmer.monthlyIncome
  return MONTHS_LABELS.map((month, i) => {
    // Tier A: steady upward. Tier B: flat/wobbly. Tier C: erratic.
    const s = seed(farmer.name, i) % 100
    let variation: number
    if (farmer.tier === "A") {
      variation = -0.15 + (i / 5) * 0.2 + (s / 100) * 0.08
    } else if (farmer.tier === "B") {
      variation = -0.1 + (s / 100) * 0.2
    } else {
      variation = -0.25 + (s / 100) * 0.4
    }
    return { month, income: Math.round(base * (1 + variation)) }
  })
}

const CROP_SOURCES: Record<string, IncomeSource[]> = {
  "Café/Leche": [
    { source: "Café", pct: 70, color: "var(--color-chart-2)" },
    { source: "Leche", pct: 30, color: "var(--color-chart-3)" },
  ],
  "Café": [
    { source: "Café", pct: 85, color: "var(--color-chart-2)" },
    { source: "Otros", pct: 15, color: "var(--color-chart-4)" },
  ],
  "Cacao": [
    { source: "Cacao", pct: 80, color: "var(--color-chart-5)" },
    { source: "Otros", pct: 20, color: "var(--color-chart-4)" },
  ],
  "Fresa": [
    { source: "Fresa", pct: 75, color: "var(--color-chart-1)" },
    { source: "Otros", pct: 25, color: "var(--color-chart-4)" },
  ],
  "Maíz": [
    { source: "Maíz", pct: 90, color: "var(--color-chart-3)" },
    { source: "Otros", pct: 10, color: "var(--color-chart-4)" },
  ],
  "Leche": [
    { source: "Leche", pct: 85, color: "var(--color-chart-3)" },
    { source: "Otros", pct: 15, color: "var(--color-chart-4)" },
  ],
}

export function getFarmerSources(farmer: Farmer): IncomeSource[] {
  return CROP_SOURCES[farmer.crop] ?? [
    { source: farmer.crop, pct: 100, color: "var(--color-chart-2)" },
  ]
}

const TRUST_LABELS = [
  "Volumen consistente con zona",
  "Precios dentro de rango de mercado",
  "Frecuencia de reporte estable",
  "Sin transacciones duplicadas",
]

export function getFarmerTrustChecks(farmer: Farmer): TrustCheck[] {
  if (farmer.tier === "A") {
    return TRUST_LABELS.map((label) => ({ label, passed: true }))
  }
  if (farmer.tier === "B") {
    // One check borderline-fails for some B farmers
    const failIdx = seed(farmer.name, 99) % 4
    return TRUST_LABELS.map((label, i) => ({
      label,
      passed: i !== failIdx || farmer.trustScore > 6.5,
    }))
  }
  // Tier C: first two fail
  return TRUST_LABELS.map((label, i) => ({ label, passed: i >= 2 }))
}

export function getFarmerFlag(farmer: Farmer): FlaggedTransaction | null {
  if (farmer.tier !== "C") return null
  const crop = farmer.crop.split("/")[0]
  if (farmer.name === "José Mendoza") {
    return { crop: "Cacao", qty: "200 kg", price: "S/15.00/kg", reason: "Volumen 4x promedio zonal" }
  }
  return { crop, qty: "150 kg", price: "S/12.00/kg", reason: "Precio 2x promedio regional" }
}

export function getLoanRange(farmer: Farmer): { min: number; max: number } | null {
  if (farmer.tier === "C") return null
  const base = farmer.monthlyIncome
  if (farmer.tier === "A") return { min: Math.round(base * 2), max: Math.round(base * 5) }
  return { min: Math.round(base * 1), max: Math.round(base * 2.5) }
}

// ─── Additional per-farmer data (cooperative, hectares, stability, data sources) ───

const COOPERATIVES: Record<string, string> = {
  "Cajamarca": "Coop. Agraria Cajamarca",
  "Puno": "Coop. Altiplano Sur",
  "Cusco": "Coop. Valle Sagrado",
  "San Martín": "Coop. San Martín Verde",
  "Apurímac": "Coop. Agraria Apurímac",
  "La Libertad": "Coop. La Libertad",
  "Junín": "Coop. Valle del Mantaro",
  "Ayacucho": "Coop. Agraria Ayacucho",
  "Huánuco": "Coop. Huallaga Central",
  "Amazonas": "Coop. Amazonas Norte",
}

export function getFarmerCooperative(farmer: Farmer): string {
  return COOPERATIVES[farmer.region] ?? "Cooperativa local"
}

export function getFarmerHectares(farmer: Farmer): number {
  const base = farmer.tier === "A" ? 3 : farmer.tier === "B" ? 1.5 : 0.8
  const variation = (seed(farmer.name, 77) % 30) / 10
  return Math.round((base + variation) * 10) / 10
}

export function getFarmerStability(farmer: Farmer): number {
  if (farmer.tier === "A") return 75 + (seed(farmer.name, 50) % 20)
  if (farmer.tier === "B") return 55 + (seed(farmer.name, 50) % 20)
  return 30 + (seed(farmer.name, 50) % 25)
}

export function getFarmerDataSources(farmer: Farmer): DataSource[] {
  const coop = COOPERATIVES[farmer.region]
  const sources: DataSource[] = [
    { source: coop ?? "Cooperativa local", verified: farmer.tier !== "C" },
    { source: "Registro de ventas en acopio", verified: farmer.months >= 4 },
    { source: "Historial de transacciones Chacra", verified: true },
  ]
  if (farmer.tier === "A" && farmer.months >= 6) {
    sources.push({ source: "Verificación de campo", verified: true })
  }
  return sources
}
