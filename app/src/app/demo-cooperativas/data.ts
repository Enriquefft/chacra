import type { ChartConfig } from "@/components/ui/chart"

// ─── Types ───

export type KpiItem = {
  label: string
  value: number
  prefix: string
  suffix: string
  decimals: number
  change: string
  icon: "leaf" | "users" | "wallet" | "shield"
}

export type Producer = {
  name: string
  region: string
  kgCafe: number
  trust: number
  note: string | null
  phone: string
  crop: string
  expectedKg: number
  avgPrice: number
  lastActive: string
  monthsActive: number
}

export type Transaction = {
  id: string
  producer: string
  product: string
  qty: string
  price: string
  buyer: string
  date: string
  source: "WhatsApp" | "PWA"
  status: "confirmado" | "flaggeado"
}

export type ProductionMonth = {
  month: string
  cafe: number
  cacao: number
}

export type PriceBuyer = {
  buyer: string
  avgPrice: number
  transactions: number
}

// ─── Constants ───

export const COOP_NAME = "Cooperativa Agraria Valle Verde"
export const COOP_REGION = "Jaen, Cajamarca"
export const PERIOD = "Oct 2025 — Mar 2026"
export const CONTRACT_GOAL = 5000
export const CONTRACT_CURRENT = 3247
export const CONTRACT_PROJECTED = 4800
export const CONTRACT_DAYS_LEFT = 32

// ─── KPIs ───

export const kpis: KpiItem[] = [
  {
    label: "Productores Activos",
    value: 12,
    prefix: "",
    suffix: "",
    decimals: 0,
    change: "+2",
    icon: "users",
  },
  {
    label: "Produccion Total",
    value: 3247,
    prefix: "",
    suffix: " kg",
    decimals: 0,
    change: "+18%",
    icon: "leaf",
  },
  {
    label: "Ingreso del Periodo",
    value: 48320,
    prefix: "S/",
    suffix: "",
    decimals: 0,
    change: "+12%",
    icon: "wallet",
  },
  {
    label: "Alertas Activas",
    value: 2,
    prefix: "",
    suffix: "",
    decimals: 0,
    change: "2 pendientes",
    icon: "shield",
  },
]

// ─── Producers ───

export const producers: Producer[] = [
  { name: "Maria Quispe", region: "Jaen", kgCafe: 420, trust: 94, note: null, phone: "51976543210", crop: "Cafe", expectedKg: 500, avgPrice: 8.40, lastActive: "15 Mar", monthsActive: 8 },
  { name: "Carlos Huaman", region: "San Ignacio", kgCafe: 385, trust: 88, note: null, phone: "51945678123", crop: "Cafe", expectedKg: 450, avgPrice: 8.20, lastActive: "14 Mar", monthsActive: 6 },
  { name: "Rosa Mendoza", region: "Jaen", kgCafe: 310, trust: 91, note: null, phone: "51934567890", crop: "Cacao", expectedKg: 350, avgPrice: 12.50, lastActive: "13 Mar", monthsActive: 7 },
  { name: "Pedro Mamani", region: "Cutervo", kgCafe: 295, trust: 72, note: "Comprador paga S/0.80 bajo mercado", phone: "51967890123", crop: "Cafe", expectedKg: 400, avgPrice: 7.20, lastActive: "13 Mar", monthsActive: 5 },
  { name: "Lucia Torres", region: "Jaen", kgCafe: 280, trust: 85, note: null, phone: "51923456789", crop: "Cafe", expectedKg: 350, avgPrice: 8.60, lastActive: "12 Mar", monthsActive: 6 },
  { name: "Antonio Soto", region: "San Ignacio", kgCafe: 265, trust: 79, note: null, phone: "51956789012", crop: "Cacao", expectedKg: 350, avgPrice: 12.00, lastActive: "12 Mar", monthsActive: 4 },
  { name: "Elena Vargas", region: "Cutervo", kgCafe: 248, trust: 83, note: null, phone: "51912345678", crop: "Cafe", expectedKg: 300, avgPrice: 8.10, lastActive: "11 Mar", monthsActive: 5 },
  { name: "Jose Medina", region: "Jaen", kgCafe: 240, trust: 61, note: "240 kg en una transaccion. Promedio: 45 kg.", phone: "51989012345", crop: "Cafe", expectedKg: 300, avgPrice: 7.90, lastActive: "14 Mar", monthsActive: 3 },
]

// ─── Price Benchmark ───

export const priceBuyers: PriceBuyer[] = [
  { buyer: "Acopio El Norte", avgPrice: 7.2, transactions: 18 },
  { buyer: "Exportadora Lima", avgPrice: 8.6, transactions: 12 },
  { buyer: "Acopio Local", avgPrice: 7.8, transactions: 24 },
  { buyer: "Mercado Cajamarca", avgPrice: 8.1, transactions: 15 },
]

export const MARKET_FLOOR = 7.5
export const MARKET_CEILING = 9.0

// ─── Production by Month ───

export const productionByMonth: ProductionMonth[] = [
  { month: "Oct", cafe: 384, cacao: 96 },
  { month: "Nov", cafe: 416, cacao: 104 },
  { month: "Dic", cafe: 312, cacao: 78 },
  { month: "Ene", cafe: 488, cacao: 122 },
  { month: "Feb", cafe: 464, cacao: 116 },
  { month: "Mar", cafe: 374, cacao: 93 },
]

// ─── Transactions ───

export const transactions: Transaction[] = [
  { id: "TX-001", producer: "Maria Quispe", product: "Cafe", qty: "85 kg", price: "S/8.40", buyer: "Exportadora Lima", date: "15 Mar", source: "WhatsApp", status: "confirmado" },
  { id: "TX-002", producer: "Carlos Huaman", product: "Cafe", qty: "60 kg", price: "S/8.20", buyer: "Mercado Cajamarca", date: "14 Mar", source: "PWA", status: "confirmado" },
  { id: "TX-003", producer: "Jose Medina", product: "Cafe", qty: "240 kg", price: "S/7.90", buyer: "Acopio Local", date: "14 Mar", source: "WhatsApp", status: "flaggeado" },
  { id: "TX-004", producer: "Rosa Mendoza", product: "Cacao", qty: "45 kg", price: "S/12.50", buyer: "Exportadora Lima", date: "13 Mar", source: "WhatsApp", status: "confirmado" },
  { id: "TX-005", producer: "Pedro Mamani", product: "Cafe", qty: "50 kg", price: "S/7.20", buyer: "Acopio El Norte", date: "13 Mar", source: "PWA", status: "confirmado" },
  { id: "TX-006", producer: "Lucia Torres", product: "Cafe", qty: "70 kg", price: "S/8.60", buyer: "Exportadora Lima", date: "12 Mar", source: "WhatsApp", status: "confirmado" },
  { id: "TX-007", producer: "Antonio Soto", product: "Cacao", qty: "35 kg", price: "S/12.00", buyer: "Acopio Local", date: "12 Mar", source: "PWA", status: "confirmado" },
  { id: "TX-008", producer: "Elena Vargas", product: "Cafe", qty: "55 kg", price: "S/8.10", buyer: "Mercado Cajamarca", date: "11 Mar", source: "WhatsApp", status: "confirmado" },
  { id: "TX-009", producer: "Maria Quispe", product: "Cafe", qty: "40 kg", price: "S/8.50", buyer: "Exportadora Lima", date: "10 Mar", source: "PWA", status: "confirmado" },
  { id: "TX-010", producer: "Carlos Huaman", product: "Cafe", qty: "75 kg", price: "S/7.80", buyer: "Acopio Local", date: "10 Mar", source: "WhatsApp", status: "confirmado" },
]

// ─── Helpers ───

export function getProducerTransactions(name: string): Transaction[] {
  return transactions.filter((tx) => tx.producer === name)
}

// ─── Chart Configs ───

export const priceChartConfig: ChartConfig = {
  avgPrice: { label: "Precio Promedio", color: "var(--chart-1)" },
}

export const productionChartConfig: ChartConfig = {
  cafe: { label: "Cafe", color: "var(--chart-1)" },
  cacao: { label: "Cacao", color: "var(--chart-2)" },
}
