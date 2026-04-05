"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { PieChart, Pie, Cell, Label, XAxis, YAxis, Area, AreaChart, CartesianGrid } from "recharts"
import Link from "next/link"
import { Logo } from "@/components/landing/logo"
import { ScrollReveal } from "@/components/landing/scroll-reveal"
import { StatCounter } from "@/components/landing/stat-counter"
import {
  WalletMoney,
  ShieldCheck,
  CheckCircle,
  DangerTriangle,
  UsersGroupTwoRounded,
  Chart2,
} from "@solar-icons/react"

import {
  PRODUCERS,
  AVAILABLE_PRODUCER_NAMES,
  PORTFOLIO_KPIS,
  PORTFOLIO_RISK,
  TIER_DISTRIBUTION,
  VERIFICATION_LAYERS,
  getProducerIncome,
  getProducerSources,
  getProducerTrustChecks,
  getProducerFlag,
  getLoanRange,
  getProducerCooperative,
  getProducerHectares,
  getProducerStability,
  getProducerDataSources,
  type Producer,
  type Tier,
} from "./_data"

const calLink = "https://cal.com/enrique-flores/chacra"

// ─── Shared utilities ───

function useAnimatedProgress(target: number) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => setValue(target))
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return { value, ref }
}

function AnimatedProgress({ target, className }: { target: number; className?: string }) {
  const { value, ref } = useAnimatedProgress(target)
  return (
    <div ref={ref}>
      <Progress value={value} className={className} />
    </div>
  )
}

function IncomeSourceBar({ source, pct, color }: { source: string; pct: number; color: string }) {
  const { value, ref } = useAnimatedProgress(pct)
  return (
    <div ref={ref}>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium">{source}</span>
        <span className="text-sm font-medium tabular-nums">{pct}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

const KPI_ICONS = [WalletMoney, UsersGroupTwoRounded, ShieldCheck, Chart2] as const

function TierBadge({ tier }: { tier: Tier }) {
  if (tier === "A")
    return <Badge className="bg-success/15 text-success border-0">Tier A</Badge>
  if (tier === "B")
    return <Badge className="bg-warning/15 text-warning border-0">Tier B</Badge>
  return <Badge variant="destructive">Tier C</Badge>
}

const TIER_TEXT_COLOR: Record<Tier, string> = {
  A: "text-success",
  B: "text-warning",
  C: "text-destructive",
}

const TIER_PROGRESS_COLOR: Record<Tier, string> = {
  A: "[&>div]:bg-success",
  B: "[&>div]:bg-warning",
  C: "[&>div]:bg-destructive",
}

// ─── Seed helper for deterministic tx count ───
function seed(name: string, i = 0): number {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) | 0
  return Math.abs((h * (i + 1) * 2654435761) | 0)
}

// ─── Shell ───

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="hero-animate" style={{ "--animate-delay": "0ms", "--animate-duration": "400ms" } as React.CSSProperties}>
            <Link href="/">
              <Logo className="h-8 w-auto text-foreground" />
            </Link>
          </div>
          <Badge
            variant="secondary"
            className="hero-animate hidden text-xs font-medium sm:inline-flex"
            style={{ "--animate-delay": "80ms", "--animate-duration": "400ms" } as React.CSSProperties}
          >
            Demo para Financieras
          </Badge>
          <div className="hero-animate" style={{ "--animate-delay": "160ms", "--animate-duration": "400ms" } as React.CSSProperties}>
            <Button
              size="sm"
              className="transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]"
              asChild
            >
              <a href={calLink} target="_blank" rel="noopener noreferrer">
                Agendar Demo
              </a>
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-12 sm:px-6">
        {children}
      </div>
    </div>
  )
}

// ─── Portafolio tab ───

function PortafolioView() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {PORTFOLIO_KPIS.map((kpi, i) => {
          const Icon = KPI_ICONS[i]
          return (
            <div
              key={kpi.label}
              className="hero-animate"
              style={{
                "--animate-delay": `${i * 80}ms`,
                "--animate-duration": "500ms",
                "--slide-distance": "12px",
              } as React.CSSProperties}
            >
              <Card className="border-border/50 bg-card/80 transition-all duration-150 hover:scale-[1.01] hover:shadow-md">
                <CardContent className="pt-5 pb-4">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                    <Icon weight="BoldDuotone" size={20} className="text-primary" aria-hidden="true" />
                  </div>
                  <p className="mt-3 text-2xl font-semibold tracking-tight">
                    <StatCounter end={kpi.value} prefix={kpi.prefix} suffix={kpi.suffix} decimals={kpi.decimals} />
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{kpi.label}</p>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      {/* Chart + Table */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_3fr]">
        {/* Donut */}
        <ScrollReveal delay={100}>
          <Card className="border-border/50 bg-card/80">
            <CardContent className="pt-5">
              <p className="text-sm font-medium text-muted-foreground">Distribución por tier</p>
              <ChartContainer
                config={{
                  A: { label: "Tier A", color: "var(--success)" },
                  B: { label: "Tier B", color: "var(--warning)" },
                  C: { label: "Tier C", color: "var(--destructive)" },
                }}
                className="mx-auto h-[220px] w-full"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={TIER_DISTRIBUTION}
                    dataKey="count"
                    nameKey="tier"
                    innerRadius={60}
                    outerRadius={85}
                    strokeWidth={2}
                    stroke="var(--background)"
                  >
                    {TIER_DISTRIBUTION.map((entry) => (
                      <Cell key={entry.tier} fill={entry.fill} />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                              <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 6} className="fill-foreground text-2xl font-semibold">
                                156
                              </tspan>
                              <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 14} className="fill-muted-foreground text-xs">
                                productores
                              </tspan>
                            </text>
                          )
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="mt-2 flex items-center justify-center gap-4">
                {TIER_DISTRIBUTION.map((d) => (
                  <div key={d.tier} className="flex items-center gap-1.5">
                    <div className="size-2.5 rounded-sm" style={{ backgroundColor: d.fill }} />
                    <span className="text-xs text-muted-foreground">Tier {d.tier}: {d.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Producer Table */}
        <ScrollReveal delay={200}>
          <Card className="border-border/50 bg-card/80">
            <CardContent className="pt-5 pb-2">
              <p className="mb-3 text-sm font-medium text-muted-foreground">Candidatos a crédito</p>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead>Productor</TableHead>
                      <TableHead className="hidden sm:table-cell">Región</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead className="text-right">Ingreso/mes</TableHead>
                      <TableHead className="hidden md:table-cell text-right">Meses</TableHead>
                      <TableHead className="text-center">Tier</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PRODUCERS.map((producer) => (
                      <TableRow key={producer.name}>
                        <TableCell className="font-medium">{producer.name}</TableCell>
                        <TableCell className="hidden text-muted-foreground sm:table-cell">{producer.region}</TableCell>
                        <TableCell className="text-muted-foreground">{producer.crop}</TableCell>
                        <TableCell className="text-right font-medium tabular-nums">S/{producer.monthlyIncome.toLocaleString()}</TableCell>
                        <TableCell className="hidden md:table-cell text-right text-muted-foreground tabular-nums">{producer.months}</TableCell>
                        <TableCell className="text-center"><TierBadge tier={producer.tier} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>

      {/* Portfolio risk summary */}
      <ScrollReveal delay={300}>
        <Card className="border-border/50 bg-card/80">
          <CardContent className="pt-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Perfil de riesgo del portafolio</p>
              <Button variant="outline" size="sm" disabled className="shrink-0 opacity-50">
                Exportar portafolio
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {PORTFOLIO_RISK.map((metric) => (
                <div key={metric.label} className="rounded-lg bg-muted/40 px-3 py-2.5">
                  <p className="text-base font-semibold tracking-tight">{metric.value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{metric.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>
    </div>
  )
}

// ─── Producer selector ───

const AVAILABLE_PRODUCERS = PRODUCERS.filter((f) => AVAILABLE_PRODUCER_NAMES.has(f.name))
const LOCKED_PRODUCERS = PRODUCERS.filter((f) => !AVAILABLE_PRODUCER_NAMES.has(f.name))

function ProducerSelect({
  value,
  onValueChange,
}: {
  value: string
  onValueChange: (name: string) => void
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Seleccionar productor..." />
      </SelectTrigger>
      <SelectContent position="popper" align="start">
        {AVAILABLE_PRODUCERS.map((f) => (
          <SelectItem key={f.name} value={f.name}>
            {f.name} — {f.region}
          </SelectItem>
        ))}
        <SelectSeparator />
        {LOCKED_PRODUCERS.map((f) => (
          <SelectItem key={f.name} value={f.name} disabled>
            {f.name} — {f.region}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// ─── Perfil empty state ───

function ProfileEmptyState({ onSelectMaria }: { onSelectMaria: () => void }) {
  return (
    <Card className="border-border/50 bg-card/80">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
          <UsersGroupTwoRounded weight="BoldDuotone" size={26} className="text-primary" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-lg font-semibold tracking-tight">Selecciona un productor</h3>
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          Elige un productor del menú para ver su perfil crediticio completo.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]"
          onClick={onSelectMaria}
        >
          Ver perfil de María Quispe
        </Button>
      </CardContent>
    </Card>
  )
}

// ─── Perfil de Crédito content ───

function PerfilContent({ producer }: { producer: Producer }) {
  const initials = producer.name.split(" ").map((w) => w[0]).join("")
  const incomeData = getProducerIncome(producer)
  const incomeSources = getProducerSources(producer)
  const trustChecks = getProducerTrustChecks(producer)
  const flag = getProducerFlag(producer)
  const loanRange = getLoanRange(producer)
  const dataSources = getProducerDataSources(producer)
  const cooperative = getProducerCooperative(producer)
  const hectares = getProducerHectares(producer)
  const stability = getProducerStability(producer)
  const trustPct = Math.round(producer.trustScore * 10)
  const txCount = producer.months * 5 + (seed(producer.name) % 8)

  return (
    <>
      {/* Identity */}
      <div
        className="hero-animate flex items-center gap-3"
        style={{ "--animate-delay": "0ms", "--animate-duration": "500ms", "--slide-distance": "12px" } as React.CSSProperties}
      >
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
          {initials}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight">{producer.name}</h2>
            <TierBadge tier={producer.tier} />
          </div>
          <p className="text-sm text-muted-foreground">
            {producer.region} &middot; {producer.crop} &middot; {producer.months} meses activo
          </p>
          <p className="text-xs text-muted-foreground">
            {cooperative} &middot; {hectares} ha
          </p>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Ingreso mensual", value: producer.monthlyIncome, prefix: "S/", suffix: "/mes", decimals: 0 },
          { label: "Estabilidad de ingreso", value: stability, prefix: "", suffix: "%", decimals: 0 },
          { label: "Transacciones", value: txCount, prefix: "", suffix: " txns", decimals: 0 },
          { label: "Chacra Score", value: producer.trustScore, prefix: "", suffix: "/10", decimals: 1 },
        ].map((kpi, i) => {
          const isChacraScore = i === 3
          return (
            <div
              key={kpi.label}
              className="hero-animate"
              style={{ "--animate-delay": `${80 + i * 60}ms`, "--animate-duration": "500ms", "--slide-distance": "12px" } as React.CSSProperties}
            >
              <Card className={`transition-all duration-150 hover:scale-[1.01] hover:shadow-md ${isChacraScore ? "border-primary/25 bg-primary/5" : "border-border/50 bg-card/80"}`}>
                <CardContent className="pt-4 pb-3">
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  <p className="mt-1 text-xl font-semibold tracking-tight">
                    <StatCounter end={kpi.value} prefix={kpi.prefix} suffix={kpi.suffix} decimals={kpi.decimals} />
                  </p>
                  {isChacraScore && (
                    <p className="mt-0.5 text-[11px] text-primary/70">Sugerido por Chacra</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[3fr_2fr]">
        {/* Income trend */}
        <ScrollReveal delay={100}>
          <Card className="border-border/50 bg-card/80">
            <CardContent className="pt-5">
              <p className="mb-3 text-sm font-medium text-muted-foreground">
                Tendencia de ingreso ({producer.months} meses)
              </p>
              <ChartContainer
                config={{ income: { label: "Ingreso", color: "var(--chart-2)" } }}
                className="h-[220px] w-full"
              >
                <AreaChart data={incomeData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id={`ig-${initials}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `S/${v}`} className="text-xs" width={56} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="income" stroke="var(--color-chart-2)" strokeWidth={2} fill={`url(#ig-${initials})`} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Income sources */}
        <ScrollReveal delay={200}>
          <Card className="border-border/50 bg-card/80">
            <CardContent className="pt-5">
              <p className="mb-4 text-sm font-medium text-muted-foreground">Fuentes de ingreso</p>
              <div className="space-y-4">
                {incomeSources.map((src) => (
                  <IncomeSourceBar key={src.source} source={src.source} pct={src.pct} color={src.color} />
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>

      {/* Data quality & verification — one cohesive card */}
      <ScrollReveal delay={100}>
        <Card className="border-border/50 bg-card/80">
          <CardContent className="pt-5">
            {/* Integrity score */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Verificación de datos</p>
              <span className={`text-lg font-semibold ${TIER_TEXT_COLOR[producer.tier]}`}>{trustPct}%</span>
            </div>
            <AnimatedProgress target={trustPct} className={`mt-2 h-2.5 ${TIER_PROGRESS_COLOR[producer.tier]}`} />

            {/* Trust checks */}
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {trustChecks.map((check) => (
                <div key={check.label} className="flex items-center gap-2">
                  {check.passed ? (
                    <CheckCircle weight="Bold" size={16} className="shrink-0 text-success" aria-hidden="true" />
                  ) : (
                    <DangerTriangle weight="Bold" size={16} className="shrink-0 text-destructive" aria-hidden="true" />
                  )}
                  <span className="text-sm text-muted-foreground">{check.label}</span>
                </div>
              ))}
            </div>

            {/* Data sources */}
            <div className="mt-5 border-t pt-4">
              <p className="mb-3 text-xs font-medium text-muted-foreground">Fuentes verificadas</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {dataSources.map((ds) => (
                  <div key={ds.source} className="flex items-center gap-2">
                    {ds.verified ? (
                      <CheckCircle weight="Bold" size={16} className="shrink-0 text-success" aria-hidden="true" />
                    ) : (
                      <div className="flex size-4 shrink-0 items-center justify-center rounded-full border border-muted-foreground/30">
                        <div className="size-1.5 rounded-full bg-muted-foreground/30" />
                      </div>
                    )}
                    <span className={`text-sm ${ds.verified ? "text-foreground" : "text-muted-foreground"}`}>{ds.source}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification layers */}
            <div className="mt-5 border-t pt-4">
              <p className="mb-3 text-xs font-medium text-muted-foreground">Tres capas de verificación</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {VERIFICATION_LAYERS.map((layer) => (
                  <div key={layer.step} className="flex items-start gap-2">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                      {layer.step}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{layer.title}</span> — {layer.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>

      {/* Flagged transaction (Tier C only) */}
      {flag && (
        <ScrollReveal delay={150}>
          <Card className="border-2 border-destructive/30 bg-destructive/5">
            <CardContent className="pt-5">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
                  <DangerTriangle weight="BoldDuotone" size={22} className="text-destructive" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Transacción marcada</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {producer.name} &middot; {producer.region}
                  </p>
                </div>
                <Badge variant="destructive" className="shrink-0">Requiere revisión</Badge>
              </div>
              <div className="mt-4 rounded-lg border border-destructive/20 bg-background p-4">
                <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Producto</p>
                    <p className="mt-0.5 font-medium">{flag.crop}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Cantidad</p>
                    <p className="mt-0.5 font-medium">{flag.qty}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Precio</p>
                    <p className="mt-0.5 font-medium">{flag.price}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Razón</p>
                    <Badge variant="destructive" className="mt-0.5">{flag.reason}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      )}

      {/* Loan Recommendation (Tier A & B only) */}
      {loanRange && (
        <ScrollReveal delay={flag ? 200 : 150}>
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="pt-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rango estimado de crédito</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight">
                  S/{loanRange.min.toLocaleString()} — S/{loanRange.max.toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Basado en {producer.months} meses de datos verificados. Sujeto a su evaluación crediticia.
                </p>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      )}

      {/* Tier C: no loan */}
      {!loanRange && (
        <ScrollReveal delay={200}>
          <Card className="border-border/50 bg-card/80">
            <CardContent className="py-8 text-center">
              <ShieldCheck weight="BoldDuotone" size={28} className="mx-auto text-muted-foreground" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium">Datos insuficientes para estimar rango</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Este productor tiene poco historial y verificaciones pendientes. Los datos disponibles se muestran arriba.
              </p>
            </CardContent>
          </Card>
        </ScrollReveal>
      )}
    </>
  )
}

// ─── Perfil tab wrapper ───

function PerfilTab({
  producer,
  selectedName,
  onSelectProducer,
}: {
  producer: Producer | null
  selectedName: string
  onSelectProducer: (name: string) => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ProducerSelect value={selectedName} onValueChange={onSelectProducer} />
        {producer && (
          <Button variant="outline" size="sm" disabled className="shrink-0 opacity-50">
            Exportar reporte
          </Button>
        )}
      </div>
      {producer ? <PerfilContent producer={producer} /> : <ProfileEmptyState onSelectMaria={() => onSelectProducer("María Quispe")} />}
    </div>
  )
}

// ─── Footer CTA ───

function FooterCTA() {
  return (
    <ScrollReveal delay={200}>
      <div className="mt-8 flex flex-col items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 px-6 py-8 text-center sm:flex-row sm:text-left">
        <ShieldCheck weight="BoldDuotone" size={24} className="shrink-0 text-primary" aria-hidden="true" />
        <p className="flex-1 text-sm leading-relaxed text-foreground">
          <span className="font-medium">Datos verificados para tus decisiones de crédito.</span>{" "}
          Conectamos cooperativas, productores y transacciones en perfiles crediticios que puedes evaluar con tus propios criterios.
        </p>
        <div className="flex shrink-0 gap-2">
          <Button size="lg" className="transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]" asChild>
            <a href={calLink} target="_blank" rel="noopener noreferrer">Agendar Demo</a>
          </Button>
          <Button variant="outline" size="lg" className="transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]" asChild>
            <Link href="/">Conoce Chacra</Link>
          </Button>
        </div>
      </div>
    </ScrollReveal>
  )
}

// ─── Page Root ───

export default function DemoFinancierasPage() {
  const [selectedProducerName, setSelectedProducerName] = useState("")

  const selectedProducer = selectedProducerName
    ? PRODUCERS.find((f) => f.name === selectedProducerName) ?? null
    : null

  return (
    <Shell>
      <Tabs defaultValue="portafolio">
        <TabsList
          className="hero-animate mb-4 w-full sm:w-auto"
          style={{ "--animate-delay": "200ms", "--animate-duration": "400ms" } as React.CSSProperties}
        >
          <TabsTrigger value="portafolio">Portafolio</TabsTrigger>
          <TabsTrigger value="perfil">Perfil de Crédito</TabsTrigger>
        </TabsList>
        <TabsContent value="portafolio">
          <PortafolioView />
        </TabsContent>
        <TabsContent value="perfil">
          <PerfilTab
            producer={selectedProducer}
            selectedName={selectedProducerName}
            onSelectProducer={setSelectedProducerName}
          />
        </TabsContent>
      </Tabs>
      <FooterCTA />
    </Shell>
  )
}
