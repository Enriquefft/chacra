"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  Leaf,
  WalletMoney,
  ShieldCheck,
  UsersGroupRounded,
  Bell,
  ArrowRight,
} from "@/components/landing/solar-icons"
import { Logo } from "@/components/landing/logo"
import { ScrollReveal } from "@/components/landing/scroll-reveal"
import { StatCounter } from "@/components/landing/stat-counter"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  AreaChart,
  Area,
} from "recharts"
import {
  COOP_NAME,
  COOP_REGION,
  PERIOD,
  CONTRACT_GOAL,
  CONTRACT_CURRENT,
  CONTRACT_PROJECTED,
  CONTRACT_DAYS_LEFT,
  kpis,
  producers,
  priceBuyers,
  MARKET_FLOOR,
  MARKET_CEILING,
  productionByMonth,
  transactions,
  priceChartConfig,
  productionChartConfig,
  getProducerTransactions,
  type Producer,
} from "./data"

const calLink = "https://cal.com/enrique-flores/chacra"

// ─── WhatsApp icon ───

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

// ─── Shared utilities ───

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(el)
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

const kpiIcons = {
  leaf: Leaf,
  users: UsersGroupRounded,
  wallet: WalletMoney,
  shield: ShieldCheck,
} as const

function getTrustTier(score: number) {
  if (score > 80) return { label: "Confiable", color: "bg-success", textColor: "text-success", badgeCls: "bg-success/10 text-success hover:bg-success/10", borderCls: "border-l-success" }
  if (score >= 60) return { label: "Revisar", color: "bg-warning", textColor: "text-warning", badgeCls: "bg-warning/10 text-warning hover:bg-warning/10", borderCls: "border-l-warning" }
  return { label: "Alerta", color: "bg-destructive", textColor: "text-destructive", badgeCls: "bg-destructive/10 text-destructive hover:bg-destructive/10", borderCls: "border-l-destructive" }
}

function getWhatsAppLink(producer: Producer) {
  return `https://wa.me/12029883577?text=${encodeURIComponent(`Hola! Vi el demo de ${COOP_NAME} y quiero saber mas sobre Chacra.`)}`
}

// ─── 1. Header Bar ───

function HeaderBar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Logo className="h-6" />
          </Link>
          <span className="hidden text-sm font-medium sm:inline">{COOP_NAME}</span>
          <Badge variant="secondary" className="hidden sm:inline-flex">{COOP_REGION}</Badge>
          <Badge className="border-0 bg-primary/10 text-primary text-[10px] hover:bg-primary/10">Datos de ejemplo</Badge>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="destructive" className="gap-1">
            <Bell weight="Bold" size={12} aria-hidden="true" />
            2
          </Badge>
          <span className="hidden text-xs text-muted-foreground lg:inline">{PERIOD}</span>
        </div>
      </div>
    </header>
  )
}

// ─── 2. KPI Row ───

function KpiRow() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {kpis.map((kpi, i) => {
        const Icon = kpiIcons[kpi.icon]
        return (
          <ScrollReveal key={kpi.label} delay={i * 80}>
            <Card className="transition-shadow duration-200 hover:shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${
                    kpi.icon === "shield" ? "bg-destructive/10" :
                    kpi.icon === "users" ? "bg-chart-2/10" :
                    kpi.icon === "wallet" ? "bg-chart-3/10" :
                    "bg-primary/10"
                  }`}>
                    <Icon
                      weight="BoldDuotone"
                      size={20}
                      className={
                        kpi.icon === "shield" ? "text-destructive" :
                        kpi.icon === "users" ? "text-chart-2" :
                        kpi.icon === "wallet" ? "text-chart-3" :
                        "text-primary"
                      }
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-semibold tracking-tight">
                        <StatCounter
                          end={kpi.value}
                          prefix={kpi.prefix}
                          suffix={kpi.suffix}
                          decimals={kpi.decimals}
                        />
                      </span>
                      <span className={`text-xs font-medium ${kpi.icon === "shield" ? "text-destructive" : "text-success"}`}>
                        {kpi.change}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        )
      })}
    </div>
  )
}

// ─── 3. Export Contract Progress ───

function ContractProgress() {
  const currentPct = (CONTRACT_CURRENT / CONTRACT_GOAL) * 100
  const projectedPct = (CONTRACT_PROJECTED / CONTRACT_GOAL) * 100
  const maxKg = producers[0].kgCafe
  const { ref: progressRef, inView } = useInView(0.3)

  return (
    <ScrollReveal delay={100}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Meta de Exportacion — Cafe</CardTitle>
            <Badge className="border-0 bg-warning/10 text-warning hover:bg-warning/10">{CONTRACT_DAYS_LEFT} dias restantes</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress bar */}
          <div ref={progressRef}>
            <div className="relative mt-1 h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-primary/20 transition-[width] duration-1000 ease-out"
                style={{ width: inView ? `${projectedPct}%` : "0%" }}
              />
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] duration-[1200ms] ease-out"
                style={{ width: inView ? `${currentPct}%` : "0%" }}
              />
              <div
                className="absolute inset-y-0 w-px bg-primary/60 transition-[left] duration-1000 ease-out"
                style={{ left: inView ? `${projectedPct}%` : "0%" }}
              />
            </div>
            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="text-sm font-semibold tracking-tight">
                <StatCounter end={CONTRACT_CURRENT} /> / {CONTRACT_GOAL.toLocaleString()} kg
              </span>
              <span className="text-xs text-muted-foreground">
                {Math.round(projectedPct)}% proyectado
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-primary/30" />
              <p className="text-xs text-muted-foreground">
                Al ritmo actual:{" "}
                <span className="font-medium text-foreground">
                  {CONTRACT_PROJECTED.toLocaleString()} kg proyectadas
                </span>
              </p>
            </div>
          </div>

          {/* Producer breakdown */}
          <div className="space-y-1 border-t pt-4">
            {producers.map((p, i) => {
              const pct = (p.kgCafe / maxKg) * 100
              const isLow = i >= producers.length - 3
              const hasIssue = p.trust < 75
              const barColor = hasIssue ? "bg-warning/60" : "bg-primary/60"
              return (
                <div key={p.name} className="-mx-2 flex items-center gap-3 rounded-md px-2 py-1 transition-colors duration-150 hover:bg-muted/50">
                  <span className={`w-28 truncate text-sm ${hasIssue ? "text-warning" : isLow ? "text-muted-foreground" : "font-medium"}`}>
                    {p.name}
                  </span>
                  <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full ${barColor} transition-[width] duration-700 ease-out`}
                      style={{ width: inView ? `${pct}%` : "0%", transitionDelay: `${i * 60}ms` }}
                    />
                  </div>
                  <span className={`w-14 text-right text-xs tabular-nums ${isLow ? "text-muted-foreground" : ""}`}>
                    {p.kgCafe} kg
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </ScrollReveal>
  )
}

// ─── 4. Price Benchmark Chart ───

function PriceBenchmarkChart() {
  const data = priceBuyers.map((b) => ({
    ...b,
    fill: b.avgPrice < MARKET_FLOOR ? "var(--chart-3)" : "var(--chart-1)",
  }))

  return (
    <ScrollReveal delay={120}>
      <Card className="flex h-full flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Precio por Comprador</CardTitle>
          <p className="text-xs text-muted-foreground">S/ por kg — cafe pergamino</p>
        </CardHeader>
        <CardContent className="flex-1 pb-4">
          <ChartContainer config={priceChartConfig} className="aspect-[4/3] w-full">
            <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="buyer"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: string) => v.split(" ").slice(0, 2).join(" ")}
                fontSize={11}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                domain={[6, 10]}
                tickFormatter={(v: number) => `S/${v}`}
                fontSize={11}
              />
              <ReferenceLine
                y={MARKET_FLOOR}
                stroke="var(--color-warning)"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{ value: `Piso S/${MARKET_FLOOR}`, position: "insideTopLeft", fontSize: 10, fill: "var(--color-warning)" }}
              />
              <ReferenceLine
                y={MARKET_CEILING}
                stroke="var(--color-success)"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{ value: `Techo S/${MARKET_CEILING}`, position: "insideTopLeft", fontSize: 10, fill: "var(--color-success)" }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelKey="buyer"
                    formatter={(value, _name, item) => (
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">S/{(value as number).toFixed(2)}/kg</span>
                        <span className="text-muted-foreground">{item.payload.transactions} transacciones</span>
                      </div>
                    )}
                  />
                }
              />
              <Bar dataKey="avgPrice" radius={[4, 4, 0, 0]} animationDuration={800} animationEasing="ease-out" />
            </BarChart>
          </ChartContainer>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Promedio cooperativa: <span className="font-medium text-foreground">S/8.10/kg</span>
          </p>
        </CardContent>
      </Card>
    </ScrollReveal>
  )
}

// ─── 5. Production Over Time Chart ───

function ProductionChart() {
  return (
    <ScrollReveal delay={160}>
      <Card className="flex h-full flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Produccion por Mes</CardTitle>
          <p className="text-xs text-muted-foreground">Kg acumulados — cafe + cacao</p>
        </CardHeader>
        <CardContent className="flex-1 pb-4">
          <ChartContainer config={productionChartConfig} className="aspect-[4/3] w-full">
            <AreaChart data={productionByMonth} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                type="monotone"
                dataKey="cafe"
                stackId="1"
                stroke="var(--color-cafe)"
                fill="var(--color-cafe)"
                fillOpacity={0.3}
                animationDuration={1000}
                animationEasing="ease-out"
              />
              <Area
                type="monotone"
                dataKey="cacao"
                stackId="1"
                stroke="var(--color-cacao)"
                fill="var(--color-cacao)"
                fillOpacity={0.3}
                animationDuration={1000}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </ScrollReveal>
  )
}

// ─── 6. Traceability Table ───

function TraceabilityTable() {
  return (
    <ScrollReveal delay={140}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Ultimas Transacciones</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto rounded-b-xl border-t">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead>Productor</TableHead>
                  <TableHead>Cultivo</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Precio/kg</TableHead>
                  <TableHead className="hidden md:table-cell">Comprador</TableHead>
                  <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                  <TableHead>Fuente</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => {
                  const isFlagged = tx.status === "flaggeado"
                  const isLowPrice = tx.buyer === "Acopio El Norte"
                  return (
                    <TableRow key={tx.id} className={isFlagged ? "bg-destructive/5" : undefined}>
                      <TableCell className={`max-w-[120px] truncate font-medium ${isFlagged ? "text-destructive" : ""}`}>
                        {tx.producer}
                      </TableCell>
                      <TableCell>{tx.product}</TableCell>
                      <TableCell className={`tabular-nums ${isFlagged ? "font-semibold text-destructive" : ""}`}>{tx.qty}</TableCell>
                      <TableCell className={`tabular-nums ${isLowPrice ? "text-warning" : ""}`}>{tx.price}</TableCell>
                      <TableCell className={`hidden md:table-cell ${isLowPrice ? "text-warning" : ""}`}>
                        {tx.buyer}
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground sm:table-cell">
                        {tx.date}
                      </TableCell>
                      <TableCell>
                        <Badge variant={tx.source === "WhatsApp" ? "secondary" : "outline"}>
                          {tx.source}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {isFlagged ? (
                          <Badge variant="destructive">Flaggeado</Badge>
                        ) : (
                          <Badge className="border-success/20 bg-success/10 text-success hover:bg-success/10">
                            Confirmado
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </ScrollReveal>
  )
}

// ─── 7. Integrity Panel ───

function IntegrityPanel() {
  const { ref: integrityRef, inView: integrityInView } = useInView(0.2)

  return (
    <ScrollReveal delay={160}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck weight="BoldDuotone" size={20} className="text-primary" aria-hidden="true" />
            <CardTitle className="text-base">Integridad de Datos</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div ref={integrityRef} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {producers.map((p, i) => {
              const tier = getTrustTier(p.trust)
              return (
                <div key={p.name} className={`rounded-lg border border-l-2 ${tier.borderCls} p-3 transition-colors duration-200 hover:bg-muted/30`}>
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.region}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full ${tier.color} transition-[width] duration-[600ms] ease-out`}
                        style={{ width: integrityInView ? `${p.trust}%` : "0%", transitionDelay: `${i * 50}ms` }}
                      />
                    </div>
                    <span className="text-xs tabular-nums text-muted-foreground">{p.trust}</span>
                  </div>
                  <div className="mt-1.5">
                    <Badge className={`${tier.badgeCls} border-0 text-xs`}>
                      {tier.label}
                    </Badge>
                  </div>
                  {p.note && (
                    <p className="mt-2 line-clamp-1 text-xs leading-snug text-destructive">{p.note}</p>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </ScrollReveal>
  )
}

// ─── 8. Producer Card ───

function ProducerCard({
  producer,
  isSelected,
  onSelect,
  inView,
  index,
}: {
  producer: Producer
  isSelected: boolean
  onSelect: () => void
  inView: boolean
  index: number
}) {
  const tier = getTrustTier(producer.trust)
  const deliveryPct = Math.round((producer.kgCafe / producer.expectedKg) * 100)
  const initials = producer.name.split(" ").map((w) => w[0]).join("")

  return (
    <Card
      className={`cursor-pointer border-l-2 transition-all duration-150 hover:shadow-md h-full ${tier.borderCls} ${isSelected ? "bg-primary/5 shadow-md border-primary/30" : ""}`}
      onClick={onSelect}
    >
      <CardContent className="flex flex-col gap-4 flex-1 pt-5">
        {/* Identity */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {initials}
            </div>
            <div>
              <p className="font-medium leading-tight">{producer.name}</p>
              <p className="text-xs text-muted-foreground">{producer.region} · {producer.crop}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <a
              href={getWhatsAppLink(producer)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex size-7 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
            >
              <WhatsAppIcon className="size-3.5" />
            </a>
            <Badge className={`${tier.badgeCls} shrink-0 border-0 text-xs`}>
              {tier.label}
            </Badge>
          </div>
        </div>

        {/* Delivery progress */}
        <div>
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-muted-foreground">Entrega</span>
            <span className="font-medium tabular-nums">{producer.kgCafe}/{producer.expectedKg} kg</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-[width] duration-700 ease-out ${deliveryPct >= 80 ? "bg-success" : deliveryPct >= 60 ? "bg-primary" : "bg-warning"}`}
              style={{ width: inView ? `${Math.min(deliveryPct, 100)}%` : "0%", transitionDelay: `${index * 60}ms` }}
            />
          </div>
          <p className="mt-1 text-right text-xs tabular-nums text-muted-foreground">{deliveryPct}%</p>
        </div>

        {/* Warning note */}
        {producer.note && (
          <p className="line-clamp-2 rounded-md bg-warning/10 px-2.5 py-1.5 text-xs leading-snug text-warning">{producer.note}</p>
        )}

        <div className="mt-auto" />

        {/* Metadata row */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            <span className="font-medium tabular-nums text-foreground">S/{producer.avgPrice.toFixed(2)}</span>/kg prom
          </span>
          <span className="text-xs text-muted-foreground">Act. {producer.lastActive}</span>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── 9. Producer Detail Panel ───

function ProducerDetail({ producer }: { producer: Producer }) {
  const producerTx = getProducerTransactions(producer.name)
  const deliveryPct = Math.round((producer.kgCafe / producer.expectedKg) * 100)
  const initials = producer.name.split(" ").map((w) => w[0]).join("")
  const tier = getTrustTier(producer.trust)

  return (
    <ScrollReveal>
      <Card className="border-border/50 bg-card/80">
        <CardContent className="pt-5">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold tracking-tight">{producer.name}</h3>
                  <Badge className={`${tier.badgeCls} border-0`}>{tier.label}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {producer.region} · {producer.crop} · {producer.monthsActive} meses activo
                </p>
              </div>
            </div>
            <a
              href={getWhatsAppLink(producer)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-2 rounded-lg border border-[#25D366]/40 text-[#25D366] bg-[#25D366]/5 px-5 py-2.5 text-sm font-medium transition-all duration-150 hover:bg-[#25D366]/10 active:scale-[0.97]"
            >
              <WhatsAppIcon className="size-4" />
              WhatsApp
            </a>
          </div>

          {/* KPI strip */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border bg-background p-3">
              <p className="text-xs text-muted-foreground">Entregado</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">{producer.kgCafe} kg</p>
              <p className="text-xs text-muted-foreground">de {producer.expectedKg} kg ({deliveryPct}%)</p>
            </div>
            <div className="rounded-lg border bg-background p-3">
              <p className="text-xs text-muted-foreground">Precio promedio</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">S/{producer.avgPrice.toFixed(2)}</p>
              <p className={`text-xs ${producer.avgPrice >= MARKET_FLOOR ? "text-success" : "text-warning"}`}>
                {producer.avgPrice >= MARKET_FLOOR ? "Dentro de mercado" : "Bajo piso de mercado"}
              </p>
            </div>
            <div className="rounded-lg border bg-background p-3">
              <p className="text-xs text-muted-foreground">Transacciones</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">{producerTx.length}</p>
              <p className="text-xs text-muted-foreground">este periodo</p>
            </div>
            <div className="rounded-lg border bg-background p-3">
              <p className="text-xs text-muted-foreground">Confiabilidad</p>
              <p className={`mt-1 text-lg font-semibold tabular-nums ${tier.textColor}`}>{producer.trust}/100</p>
              <p className="text-xs text-muted-foreground">{producer.monthsActive} meses de datos</p>
            </div>
          </div>

          {/* Transactions table */}
          {producerTx.length > 0 ? (
            <div className="mt-5 overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead>Cultivo</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Precio/kg</TableHead>
                    <TableHead className="hidden sm:table-cell">Comprador</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {producerTx.map((tx) => {
                    const isFlagged = tx.status === "flaggeado"
                    return (
                      <TableRow key={tx.id} className={isFlagged ? "bg-destructive/5" : undefined}>
                        <TableCell>{tx.product}</TableCell>
                        <TableCell className={`tabular-nums ${isFlagged ? "font-semibold text-destructive" : ""}`}>{tx.qty}</TableCell>
                        <TableCell className="tabular-nums">{tx.price}</TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">{tx.buyer}</TableCell>
                        <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                        <TableCell>
                          {isFlagged ? (
                            <Badge variant="destructive">Flaggeado</Badge>
                          ) : (
                            <Badge className="border-success/20 bg-success/10 text-success hover:bg-success/10">Confirmado</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="mt-5 rounded-lg border bg-muted/20 py-8 text-center">
              <p className="text-sm text-muted-foreground">Sin transacciones registradas este periodo.</p>
              <a
                href={getWhatsAppLink(producer)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#25D366] hover:underline"
              >
                <WhatsAppIcon className="size-3.5" />
                Contactar para seguimiento
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </ScrollReveal>
  )
}

// ─── 10. Productores Tab View ───

function ProductoresView({
  selectedProducer,
  onSelectProducer,
}: {
  selectedProducer: string | null
  onSelectProducer: (name: string | null) => void
}) {
  const [filter, setFilter] = useState<"all" | "on-track" | "attention">("all")
  const { ref: gridRef, inView: gridInView } = useInView(0.05)
  const detailRef = useRef<HTMLDivElement>(null)

  const selected = selectedProducer
    ? producers.find((p) => p.name === selectedProducer) ?? null
    : null

  useEffect(() => {
    if (selected && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [selected])

  const onTrack = producers.filter((p) => (p.kgCafe / p.expectedKg) >= 0.8).length
  const needsAttention = producers.filter((p) => p.trust < 75).length

  const filtered = filter === "all" ? producers
    : filter === "on-track" ? producers.filter((p) => (p.kgCafe / p.expectedKg) >= 0.8)
    : producers.filter((p) => p.trust < 75)

  return (
    <div className="space-y-6">
      {/* Filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilter("all")}
          className={filter === "all" ? "bg-primary/10 border-primary/30 text-primary hover:bg-primary/10" : ""}
        >
          Todos ({producers.length})
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilter("on-track")}
          className={filter === "on-track" ? "bg-primary/10 border-primary/30 text-primary hover:bg-primary/10" : ""}
        >
          En meta ({onTrack})
        </Button>
        {needsAttention > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter("attention")}
            className={filter === "attention" ? "bg-warning/10 border-warning/30 text-warning hover:bg-warning/10" : ""}
          >
            Atencion ({needsAttention})
          </Button>
        )}
      </div>

      {/* Producer cards grid */}
      <div ref={gridRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, i) => (
          <ScrollReveal key={p.name} delay={i * 60} className="h-full">
            <ProducerCard
              producer={p}
              isSelected={p.name === selectedProducer}
              onSelect={() => onSelectProducer(p.name === selectedProducer ? null : p.name)}
              inView={gridInView}
              index={i}
            />
          </ScrollReveal>
        ))}
      </div>

      {/* Selected producer detail */}
      {selected && (
        <div ref={detailRef}>
          <ProducerDetail producer={selected} />
        </div>
      )}
    </div>
  )
}

// ─── 11. Footer CTA ───

function FooterCTA() {
  return (
    <ScrollReveal delay={180}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center gap-4 rounded-xl border border-accent/20 bg-accent/5 px-6 py-8 text-center sm:flex-row sm:text-left">
          <Leaf weight="BoldDuotone" size={24} className="shrink-0 text-accent" aria-hidden="true" />
          <p className="flex-1 text-sm leading-relaxed text-foreground">
            <span className="font-medium">Quieres este dashboard para tu cooperativa?</span>{" "}
            Conectamos WhatsApp, PWA offline, y gestion de productores en una sola plataforma.
          </p>
          <div className="flex shrink-0 gap-2">
            <Button size="lg" className="transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]" asChild>
              <a href={calLink} target="_blank" rel="noopener noreferrer">Agenda una demo</a>
            </Button>
            <Button variant="outline" size="lg" className="gap-1.5 transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]" asChild>
              <Link href="/">
                Conoce Chacra
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </ScrollReveal>
  )
}

// ─── Main Export ───

export function DemoCooperativasSections() {
  const [selectedProducer, setSelectedProducer] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <HeaderBar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Tabs defaultValue="operaciones">
          <TabsList
            className="hero-animate mb-6 w-full sm:w-auto"
            style={{ "--animate-delay": "0ms", "--animate-duration": "400ms" } as React.CSSProperties}
          >
            <TabsTrigger value="operaciones">Operaciones</TabsTrigger>
            <TabsTrigger value="productores">Productores</TabsTrigger>
          </TabsList>

          <TabsContent value="operaciones">
            <div className="space-y-4">
              <KpiRow />
              <ContractProgress />
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <PriceBenchmarkChart />
              <ProductionChart />
            </div>
            <div className="mt-8">
              <TraceabilityTable />
            </div>
            <div className="mt-8">
              <IntegrityPanel />
            </div>
          </TabsContent>

          <TabsContent value="productores">
            <ProductoresView
              selectedProducer={selectedProducer}
              onSelectProducer={setSelectedProducer}
            />
          </TabsContent>
        </Tabs>
      </main>
      <FooterCTA />
    </div>
  )
}
