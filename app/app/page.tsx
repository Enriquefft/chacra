import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Leaf,
  WalletMoney,
  Smartphone,
  ChatDots,
  ShieldCheck,
  GraphUp,
  ArrowRight,
  CheckCircle,
  ListCheck,
} from "@/components/landing/solar-icons"
import { MobileNav } from "@/components/landing/mobile-nav"
import { Logo } from "@/components/landing/logo"
import { StickyNav } from "@/components/landing/sticky-nav"
import { ScrollReveal } from "@/components/landing/scroll-reveal"
import { StatCounter } from "@/components/landing/stat-counter"

export const metadata: Metadata = {
  title: "Chacra — Datos bancables para el agro peruano",
  description:
    "Transacciones invisibles, ahora son datos bancables. Chacra convierte las ventas de productores rurales en datos estructurados para crédito y trazabilidad.",
  openGraph: {
    title: "Chacra — Datos bancables para el agro peruano",
    description:
      "Convierte ventas rurales en datos estructurados para crédito y trazabilidad. Funciona sin internet.",
    type: "website",
    locale: "es_PE",
    siteName: "Chacra",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chacra — Datos bancables para el agro peruano",
    description:
      "Convierte ventas rurales en datos estructurados para crédito y trazabilidad. Funciona sin internet.",
  },
}

const calLink = "https://cal.com/enrique-flores/chacra"

const navLinks = [
  { label: "Problema", href: "#problema" },
  { label: "Cooperativas", href: "#cooperativas" },
  { label: "Financieras", href: "#financieras" },
  { label: "Precios", href: "#precios" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen scroll-smooth">
      {/* ─── Nav ─── */}
      <StickyNav>
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/" aria-label="Chacra — Inicio">
            <Logo className="h-7" />
          </a>
          <div className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="lg"
              className="hidden transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97] sm:inline-flex"
              asChild
            >
              <a href={calLink} target="_blank" rel="noopener noreferrer">
                Agendar Demo
              </a>
            </Button>
            <MobileNav calLink={calLink} />
          </div>
        </div>
      </StickyNav>

      {/* ─── 1. Hero ─── */}
      <section className="hero-grain relative overflow-hidden py-20 md:py-28">
        {/* Ambient background orbs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {/* Terracotta orb — top left */}
          <div
            className="absolute -left-[10%] -top-[5%] h-[550px] w-[550px] rounded-full blur-[100px] md:h-[700px] md:w-[700px]"
            style={{
              background: "radial-gradient(circle, oklch(0.55 0.18 30) 0%, transparent 65%)",
              animation: "orb-drift 20s ease-in-out infinite, glow-breathe 8s ease-in-out infinite",
              "--glow-min": "0.18",
              "--glow-max": "0.30",
            } as React.CSSProperties}
          />
          {/* Gold orb — center right */}
          <div
            className="absolute -right-[5%] top-[10%] h-[500px] w-[500px] rounded-full blur-[90px] md:h-[650px] md:w-[650px]"
            style={{
              background: "radial-gradient(circle, oklch(0.65 0.16 85) 0%, transparent 65%)",
              animation: "orb-drift 25s ease-in-out infinite reverse, glow-breathe 10s ease-in-out infinite",
              "--glow-min": "0.14",
              "--glow-max": "0.25",
            } as React.CSSProperties}
          />
          {/* Green orb — bottom center */}
          <div
            className="absolute -bottom-[15%] left-[25%] h-[350px] w-[350px] rounded-full blur-[100px] md:h-[450px] md:w-[450px]"
            style={{
              background: "radial-gradient(circle, oklch(0.50 0.14 145) 0%, transparent 70%)",
              animation: "orb-drift 22s ease-in-out infinite",
              animationDelay: "-8s",
              "--glow-min": "0.03",
              "--glow-max": "0.08",
            } as React.CSSProperties}
          />
          {/* Warm spotlight behind headline */}
          <div
            className="absolute left-1/2 top-[10%] h-[400px] w-[700px] -translate-x-1/2 rounded-full blur-[80px] md:h-[500px] md:w-[900px]"
            style={{
              background: "radial-gradient(ellipse, oklch(0.60 0.10 33) 0%, transparent 55%)",
              animation: "glow-breathe 6s ease-in-out infinite",
              "--glow-min": "0.03",
              "--glow-max": "0.07",
            } as React.CSSProperties}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div
              className="hero-animate"
              style={
                {
                  "--animate-delay": "0ms",
                  "--animate-duration": "400ms",
                  "--slide-distance": "8px",
                } as React.CSSProperties
              }
            >
              <Badge
                variant="secondary"
                className="mb-5 text-xs tracking-wide"
              >
                ¿Sin 4G? Sin problema.
              </Badge>
            </div>
            <h1
              className="hero-animate text-balance font-semibold tracking-tight"
              style={
                {
                  fontSize: "clamp(1.875rem, 5vw, 3.75rem)",
                  "--animate-delay": "100ms",
                  "--animate-duration": "500ms",
                  "--slide-distance": "12px",
                } as React.CSSProperties
              }
            >
              Transacciones invisibles,{" "}
              <span
                className="bg-[length:200%_100%] bg-clip-text text-transparent decoration-primary/40 underline decoration-2 underline-offset-4"
                style={{
                  backgroundImage: "linear-gradient(90deg, oklch(0.70 0.12 33), oklch(0.75 0.14 65), oklch(0.70 0.12 33))",
                  animation: "shimmer-slide 6s ease-in-out infinite",
                }}
              >
                ahora son datos bancables
              </span>
            </h1>
            <p
              className="hero-animate mx-auto mt-5 max-w-[65ch] text-pretty text-lg text-muted-foreground md:text-xl"
              style={
                {
                  "--animate-delay": "200ms",
                  "--animate-duration": "400ms",
                  "--slide-distance": "8px",
                } as React.CSSProperties
              }
            >
              Chacra convierte las ventas de productores rurales en datos
              estructurados para crédito y trazabilidad.
            </p>
            <div
              className="hero-animate mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
              style={
                {
                  "--animate-delay": "300ms",
                  "--animate-duration": "400ms",
                  "--slide-distance": "8px",
                } as React.CSSProperties
              }
            >
              <Button
                size="lg"
                className="transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]"
                asChild
              >
                <a href={calLink} target="_blank" rel="noopener noreferrer">
                  Agendar Demo
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="transition-transform duration-150 active:scale-[0.97]"
                asChild
              >
                <a href="#solucion">¿Cómo Funciona?</a>
              </Button>
            </div>
          </div>

          {/* Hero mockups — cacao transaction (different from Section 3) */}
          <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 md:mt-20">
            {/* WhatsApp chat mockup */}
            <div
              className="hero-float"
              style={{ "--float-duration": "6s", "--float-delay": "0s" } as React.CSSProperties}
            >
            <div
              className="hero-animate -rotate-1 rounded-2xl border border-border/60 bg-card/80 p-1 shadow-[0_8px_40px_-12px_oklch(0.50_0.14_33_/_0.15)] backdrop-blur-sm transition-all duration-300 hover:rotate-0 hover:scale-[1.01] hover:shadow-[0_12px_50px_-12px_oklch(0.50_0.14_33_/_0.25)]"
              style={
                {
                  "--animate-delay": "400ms",
                  "--animate-duration": "500ms",
                  "--slide-distance": "16px",
                } as React.CSSProperties
              }
            >
              <div className="rounded-xl bg-card p-4">
                <div className="mb-3 flex items-center gap-2 border-b pb-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-success/15">
                    <div className="size-2 rounded-full bg-success" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">Chacra Bot</span>
                    <p className="text-xs text-muted-foreground">WhatsApp</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-md bg-success/10 px-3.5 py-2.5">
                    <p className="text-sm">
                      vendí 80kg cacao a 12 soles a la cooperativa
                    </p>
                    <p className="mt-1 text-right text-[10px] text-muted-foreground">
                      10:32
                    </p>
                  </div>
                  {/* Typing indicator */}
                  <div className="flex max-w-[88%] items-end gap-1.5">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                      C
                    </div>
                    <div className="flex gap-1 rounded-2xl rounded-bl-md bg-muted px-3.5 py-3">
                      <span
                        className="typing-dot size-1.5 rounded-full bg-muted-foreground/50"
                        aria-hidden="true"
                      />
                      <span
                        className="typing-dot size-1.5 rounded-full bg-muted-foreground/50"
                        aria-hidden="true"
                      />
                      <span
                        className="typing-dot size-1.5 rounded-full bg-muted-foreground/50"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <div className="flex max-w-[88%] items-end gap-1.5">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                      C
                    </div>
                    <div className="rounded-2xl rounded-bl-md bg-muted px-3.5 py-2.5">
                      <p className="text-sm leading-relaxed">
                        <span className="text-base">&#10003;</span>{" "}
                        <span className="font-medium">Cacao</span> — 80 kg a
                        S/12.00
                        <br />
                        <span className="text-muted-foreground">
                          Total:
                        </span>{" "}
                        <span className="font-semibold">S/960.00</span>
                        <br />
                        <span className="text-muted-foreground">
                          Comprador:
                        </span>{" "}
                        Cooperativa
                      </p>
                      <p className="mt-2 text-sm font-medium text-primary">
                        ¿Correcto?
                      </p>
                      <p className="mt-1 text-right text-[10px] text-muted-foreground">
                        10:33
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>

            {/* PWA form mockup */}
            <div
              className="hero-float"
              style={{ "--float-duration": "7s", "--float-delay": "-3s" } as React.CSSProperties}
            >
            <div
              className="hero-animate group rotate-1 rounded-2xl border border-border/60 bg-card/80 p-1 shadow-[0_8px_40px_-12px_oklch(0.50_0.12_85_/_0.12)] backdrop-blur-sm transition-all duration-300 hover:rotate-0 hover:scale-[1.01] hover:shadow-[0_12px_50px_-12px_oklch(0.50_0.12_85_/_0.2)]"
              style={
                {
                  "--animate-delay": "450ms",
                  "--animate-duration": "500ms",
                  "--slide-distance": "16px",
                } as React.CSSProperties
              }
            >
              <div className="rounded-xl bg-card p-4">
                <div className="mb-3 flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-xs font-semibold text-primary">
                        C
                      </span>
                    </div>
                    <span className="text-sm font-medium">Nueva Venta</span>
                  </div>
                  <Badge className="bg-warning/15 text-warning-foreground">
                    Offline
                  </Badge>
                </div>
                <div className="flex flex-col gap-2.5">
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">
                      Producto
                    </label>
                    <div className="rounded-lg border bg-background px-3 py-2 text-sm">
                      Cacao
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">
                        Cantidad
                      </label>
                      <div className="rounded-lg border bg-background px-3 py-2 text-sm">
                        80 kg
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">
                        Precio
                      </label>
                      <div className="rounded-lg border bg-background px-3 py-2 text-sm">
                        S/12.00
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-success/10 px-3 py-2">
                    <span className="flex items-center gap-1.5 text-sm font-medium text-success">
                      <svg
                        className="check-draw size-4"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 8.5l3.5 3.5 6.5-7" />
                      </svg>
                      Guardado localmente
                    </span>
                    <Badge variant="outline" className="text-xs">
                      3 pendientes
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. Problem ─── */}
      <section id="problema" className="border-t bg-muted/40 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
                20,000 productores. Cero datos formales.
              </h2>
              <p className="mt-4 max-w-[65ch] mx-auto text-pretty text-base text-muted-foreground md:text-lg">
                Avanzar Rural fortaleció más de 1,000 planes de negocio. Pero
                cuando el programa cierre, toda esa data queda atrapada en
                cuadernos. Sin datos, no hay crédito. Sin trazabilidad, no hay
                exportación.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                icon: Leaf,
                title: "Sin trazabilidad",
                detail:
                  "Fair Trade puede agregar $0.40/lb al café. Sin datos de origen, imposible certificar.",
              },
              {
                icon: WalletMoney,
                title: "Sin historial crediticio",
                detail:
                  "Los productores son invisibles para financieras. No hay datos para evaluar riesgo.",
              },
              {
                icon: Smartphone,
                title: "Sin conectividad",
                detail:
                  "Las apps agrícolas asumen 4G. El 70% del Perú rural no lo tiene.",
              },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 100}>
                <Card className="h-full border-border/50 bg-card/80 transition-all duration-150 hover:scale-[1.01] hover:shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                      <item.icon
                        weight="BoldDuotone"
                        size={24}
                        className="text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">{item.title}</h3>
                    <p className="mt-2 text-pretty text-base leading-relaxed text-muted-foreground">
                      {item.detail}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. For Cooperativas ─── */}
      <section
        id="cooperativas"
        className="border-t bg-muted/40 py-20 md:py-28"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
                Trazabilidad en tiempo real para tu cooperativa
              </h2>
              <p className="mt-4 max-w-[65ch] mx-auto text-pretty text-base text-muted-foreground md:text-lg">
                Sabe exactamente cuánto produjo cada socio. Exporta con
                certificación.
              </p>
            </div>
          </ScrollReveal>

          {/* Dashboard mockup */}
          <ScrollReveal delay={100} distance={16} duration={500}>
            <div className="mt-14 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg shadow-foreground/[0.03]">
              {/* Browser chrome */}
              <div className="flex items-center gap-3 border-b bg-muted/60 px-4 py-2.5">
                <div className="flex gap-1.5">
                  <div
                    className="size-3 rounded-full bg-foreground/10"
                    aria-hidden="true"
                  />
                  <div
                    className="size-3 rounded-full bg-foreground/10"
                    aria-hidden="true"
                  />
                  <div
                    className="size-3 rounded-full bg-foreground/10"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-1 rounded-md bg-background/80 px-3 py-1 text-center text-xs text-muted-foreground">
                  chacra.app/dashboard
                </div>
                <div className="w-[42px]" />
              </div>

              <div className="p-4 md:p-6">
                {/* Stats */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    {
                      label: "Producción Total",
                      value: "2,450 kg",
                      change: "+12%",
                    },
                    {
                      label: "Productores Activos",
                      value: "47",
                      change: "+5",
                    },
                    {
                      label: "Valor Promedio",
                      value: "S/8.20/kg",
                      change: null,
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border bg-background p-4"
                    >
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                      <div className="mt-1.5 flex items-baseline gap-2">
                        <span className="text-2xl font-semibold tracking-tight">
                          {stat.value}
                        </span>
                        {stat.change && (
                          <span className="text-xs font-medium text-success">
                            {stat.change}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Volume progress */}
                <div className="mt-4 rounded-xl border bg-background p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">
                      Meta Exportación — Café
                    </p>
                    <span className="text-xs text-muted-foreground">
                      12 productores activos
                    </span>
                  </div>
                  <div className="relative mt-2.5 h-2 overflow-hidden rounded-full bg-muted">
                    {/* Ghost: projected (0 → 96%) */}
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-primary/20"
                      style={{ width: "96%" }}
                    />
                    {/* Solid: current (0 → 64%) */}
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-primary"
                      style={{ width: "64%" }}
                    />
                    {/* Forecast marker line at 96% */}
                    <div
                      className="absolute inset-y-0 w-px bg-primary/60"
                      style={{ left: "96%" }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-baseline justify-between">
                    <span className="text-sm font-semibold tracking-tight">
                      3.2 / 5.0 ton
                    </span>
                    <span className="text-xs text-muted-foreground">
                      96% al 31 de marzo
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <div className="size-2 rounded-full bg-primary/30" />
                    <p className="text-xs text-muted-foreground">
                      Al ritmo actual:{" "}
                      <span className="font-medium text-foreground">
                        4.8 ton proyectadas al cierre del mes
                      </span>
                    </p>
                  </div>
                </div>

                {/* Table */}
                <div className="mt-4 overflow-hidden rounded-xl border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead>Productor</TableHead>
                        <TableHead>Producto</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Fecha
                        </TableHead>
                        <TableHead>Fuente</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        {
                          name: "María López",
                          product: "Café",
                          qty: "50 kg",
                          price: "S/8.00",
                          date: "15 Mar",
                          source: "WhatsApp",
                        },
                        {
                          name: "Juan Pérez",
                          product: "Cacao",
                          qty: "30 kg",
                          price: "S/12.50",
                          date: "14 Mar",
                          source: "PWA",
                        },
                        {
                          name: "Rosa García",
                          product: "Café",
                          qty: "75 kg",
                          price: "S/8.20",
                          date: "14 Mar",
                          source: "WhatsApp",
                        },
                        {
                          name: "Pedro Silva",
                          product: "Cacao",
                          qty: "20 kg",
                          price: "S/12.00",
                          date: "13 Mar",
                          source: "PWA",
                        },
                      ].map((row) => (
                        <TableRow key={`${row.name}-${row.date}`}>
                          <TableCell className="font-medium truncate max-w-[120px]">
                            {row.name}
                          </TableCell>
                          <TableCell>{row.product}</TableCell>
                          <TableCell>{row.qty}</TableCell>
                          <TableCell>{row.price}</TableCell>
                          <TableCell className="hidden text-muted-foreground sm:table-cell">
                            {row.date}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                row.source === "WhatsApp"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {row.source}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Callout */}
          <ScrollReveal delay={200}>
            <div className="mt-8 flex items-start gap-3 rounded-xl border border-accent/20 bg-accent/5 px-5 py-4">
              <Leaf
                weight="BoldDuotone"
                size={20}
                className="mt-0.5 shrink-0 text-accent"
                aria-hidden="true"
              />
              <p className="text-sm leading-relaxed text-foreground">
                <span className="font-medium">
                  15 productores × 200kg = 3 toneladas.
                </span>{" "}
                Un productor solo no accede a exportación. Con Chacra, tu
                cooperativa sabe en tiempo real si va a cumplir el mínimo.
                Fair Trade puede agregar hasta $0.40/lb si lo certificas.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]"
              asChild
            >
              <Link href="/demo-cooperativas">
                Ver demo en vivo
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]"
              asChild
            >
              <a href={calLink} target="_blank" rel="noopener noreferrer">
                Agendar Demo
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── 5. For Financieras ─── */}
      <section id="financieras" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
                Score crediticio basado en historial de transacciones verificado
              </h2>
              <p className="mt-4 max-w-[65ch] mx-auto text-pretty text-base text-muted-foreground md:text-lg">
                Sin bureau. Sin garante. Solo 8 meses de ventas reales.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            {/* Feature list */}
            <ScrollReveal delay={150} className="lg:order-last">
              <div className="flex flex-col gap-4">
                {[
                  { icon: ListCheck, text: "47 transacciones verificadas" },
                  { icon: GraphUp, text: "8 meses de historial" },
                  { icon: ShieldCheck, text: "Score A/B/C automático" },
                  {
                    icon: CheckCircle,
                    text: "Datos cruzados con cooperativa",
                  },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/80 px-4 py-3.5 transition-all duration-150 hover:scale-[1.01] hover:shadow-md"
                  >
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon
                        weight="BoldDuotone"
                        size={20}
                        className="text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <span className="text-base font-medium">{item.text}</span>
                  </div>
                ))}

                <div className="flex items-center gap-3 pl-1 pt-1">
                  <span className="text-sm text-muted-foreground">
                    Niveles de riesgo:
                  </span>
                  <Badge className="bg-success text-success-foreground">
                    A
                  </Badge>
                  <Badge className="bg-warning text-warning-foreground">
                    B
                  </Badge>
                  <Badge variant="destructive">C</Badge>
                </div>
              </div>
            </ScrollReveal>

            {/* API response card */}
            <ScrollReveal delay={0} className="lg:order-first">
              <p className="mb-3 text-sm font-medium text-muted-foreground">
                Respuesta de la API de scoring
              </p>
              <div className="overflow-hidden rounded-2xl border border-code-block-foreground/10 bg-code-block text-code-block-foreground shadow-lg shadow-foreground/5">
                <div className="flex items-center justify-between border-b border-code-block-foreground/10 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-success" />
                    <code className="text-xs text-code-block-foreground/50">
                      200 OK
                    </code>
                  </div>
                  <code className="text-xs text-code-block-foreground/40">
                    GET /api/scoring/farmer_abc123
                  </code>
                </div>
                <pre className="overflow-x-auto p-5 text-[13px] leading-[1.7]">
                  <code>
                    <span className="text-code-block-foreground/40">
                      {"{"}
                    </span>
                    {"\n"}
                    {"  "}
                    <span className="text-primary">
                      &quot;farmer_id&quot;
                    </span>
                    :{" "}
                    <span className="text-accent">&quot;abc123&quot;</span>,
                    {"\n"}
                    {"  "}
                    <span className="text-primary">&quot;name&quot;</span>:{" "}
                    <span className="text-accent">
                      &quot;María López&quot;
                    </span>
                    ,{"\n"}
                    {"  "}
                    <span className="text-primary">
                      &quot;risk_tier&quot;
                    </span>
                    : <span className="text-success">&quot;A&quot;</span>,
                    {"\n"}
                    {"  "}
                    <span className="text-primary">&quot;score&quot;</span>:{" "}
                    <span className="text-warning">82</span>,{"\n"}
                    {"  "}
                    <span className="text-primary">
                      &quot;transactions&quot;
                    </span>
                    : <span className="text-warning">47</span>,{"\n"}
                    {"  "}
                    <span className="text-primary">
                      &quot;months_active&quot;
                    </span>
                    : <span className="text-warning">8</span>,{"\n"}
                    {"  "}
                    <span className="text-primary">
                      &quot;avg_monthly_volume&quot;
                    </span>
                    :{" "}
                    <span className="text-accent">&quot;S/3,200&quot;</span>,
                    {"\n"}
                    {"  "}
                    <span className="text-primary">&quot;trend&quot;</span>:{" "}
                    <span className="text-accent">&quot;stable&quot;</span>,
                    {"\n"}
                    {"  "}
                    <span className="text-primary">
                      &quot;cooperative&quot;
                    </span>
                    :{" "}
                    <span className="text-accent">
                      &quot;Coop Valle Verde&quot;
                    </span>
                    ,{"\n"}
                    {"  "}
                    <span className="text-primary">
                      &quot;recommendation&quot;
                    </span>
                    :{" "}
                    <span className="text-success">
                      &quot;Apta para crédito&quot;
                    </span>
                    ,{"\n"}
                    {"  "}
                    <span className="text-primary">
                      &quot;verification&quot;
                    </span>
                    :{" "}
                    <span className="text-code-block-foreground/40">
                      {"{"}
                    </span>
                    {"\n"}
                    {"    "}
                    <span className="text-primary">
                      &quot;cross_validated&quot;
                    </span>
                    : <span className="text-success">true</span>,{"\n"}
                    {"    "}
                    <span className="text-primary">
                      &quot;consistency_score&quot;
                    </span>
                    : <span className="text-warning">0.94</span>,{"\n"}
                    {"    "}
                    <span className="text-primary">&quot;flags&quot;</span>:{" "}
                    <span className="text-warning">0</span>
                    {"\n"}
                    {"  "}
                    <span className="text-code-block-foreground/40">
                      {"}"}
                    </span>
                    {"\n"}
                    <span className="text-code-block-foreground/40">
                      {"}"}
                    </span>
                  </code>
                </pre>
              </div>
            </ScrollReveal>
          </div>

          {/* Trust verification model */}
          <ScrollReveal delay={200}>
            <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-border/60 bg-muted/30 px-5 py-4">
              <p className="text-sm font-medium text-muted-foreground">
                ¿Cómo sabemos que los datos son reales?
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:gap-6">
                {[
                  {
                    step: "1",
                    title: "Consistencia temporal",
                    desc: "Anomalías en volumen, precio y frecuencia",
                  },
                  {
                    step: "2",
                    title: "Validación cruzada",
                    desc: "Contrastado con registros de cooperativa",
                  },
                  {
                    step: "3",
                    title: "Triage humano",
                    desc: "Solo casos atípicos van a verificación",
                  },
                ].map((layer) => (
                  <div
                    key={layer.step}
                    className="flex items-baseline gap-2"
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted-foreground/15 text-[11px] font-semibold text-muted-foreground">
                      {layer.step}
                    </span>
                    <p className="text-sm">
                      <span className="font-medium">{layer.title}</span>{" "}
                      <span className="text-muted-foreground">
                        — {layer.desc}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]"
              asChild
            >
              <Link href="/demo-financieras">
                Ver scoring en vivo
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]"
              asChild
            >
              <a href={calLink} target="_blank" rel="noopener noreferrer">
                Agendar Demo
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── 6. How It Works ─── */}
      <section className="border-t bg-muted/40 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
                De mensaje a crédito en 3 pasos
              </h2>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                step: "1",
                icon: ChatDots,
                title: "Registrar",
                detail:
                  "El productor envía un WhatsApp o usa la app offline — sin internet, sin capacitación. La IA estructura los datos automáticamente.",
              },
              {
                step: "2",
                icon: ShieldCheck,
                title: "Verificar",
                detail:
                  "Chacra confirma con el productor, cruza datos con la cooperativa, y detecta anomalías automáticamente. Solo los casos atípicos requieren verificación humana.",
              },
              {
                step: "3",
                icon: GraphUp,
                title: "Monetizar",
                detail:
                  "Cooperativas acceden a trazabilidad. Financieras acceden a scoring crediticio.",
              },
            ].map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 120}>
                <div className="relative flex h-full">
                  <Card className="flex-1 border-border/50 bg-card/80 transition-all duration-150 hover:scale-[1.01] hover:shadow-md">
                    <CardContent className="pt-6">
                      <div className="mb-4 flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                          {item.step}
                        </span>
                        <item.icon
                          weight="BoldDuotone"
                          size={28}
                          className="text-primary"
                          aria-hidden="true"
                        />
                      </div>
                      <h3 className="text-lg font-medium">{item.title}</h3>
                      <p className="mt-2 text-pretty text-base leading-relaxed text-muted-foreground">
                        {item.detail}
                      </p>
                    </CardContent>
                  </Card>
                  {i < 2 && (
                    <div className="absolute -right-2.5 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border bg-card p-1 shadow-sm md:block">
                      <ArrowRight
                        weight="Linear"
                        size={14}
                        className="text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. Pricing ─── */}
      <section id="precios" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
                Gratis para el productor. Siempre.
              </h2>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Productor */}
            <ScrollReveal delay={80}>
              <Card className="h-full border-border/50 transition-all duration-150 hover:scale-[1.01] hover:shadow-md">
                <CardHeader>
                  <Badge className="mb-2 w-fit bg-success/15 text-success">
                    Siempre gratis
                  </Badge>
                  <CardTitle className="text-xl">Productor</CardTitle>
                  <p className="text-3xl font-semibold tracking-tight">
                    Gratis
                  </p>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-4" />
                  <ul className="flex flex-col gap-3">
                    {[
                      "WhatsApp ilimitado",
                      "App offline",
                      "Historial de ventas",
                      "Score crediticio propio",
                    ].map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2.5 text-sm"
                      >
                        <CheckCircle
                          weight="Linear"
                          size={16}
                          className="shrink-0 text-success"
                          aria-hidden="true"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Cooperativa — elevated */}
            <ScrollReveal delay={0}>
              <Card className="relative h-full border-primary/30 shadow-lg shadow-primary/5 ring-2 ring-primary transition-all duration-150 hover:scale-[1.01] hover:shadow-xl">
                <CardHeader>
                  <Badge className="mb-2 w-fit">Más popular</Badge>
                  <CardTitle className="text-xl">Cooperativa</CardTitle>
                  <p className="text-3xl font-semibold tracking-tight">
                    desde $50
                    <span className="text-base font-normal text-muted-foreground">
                      /mes
                    </span>
                  </p>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-4" />
                  <ul className="flex flex-col gap-3">
                    {[
                      "Dashboard completo",
                      "Trazabilidad",
                      "Gestión de socios",
                      "Alertas de producción",
                      "Export CSV/PDF",
                    ].map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2.5 text-sm"
                      >
                        <CheckCircle
                          weight="Linear"
                          size={16}
                          className="shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Financiera */}
            <ScrollReveal delay={80}>
              <Card className="h-full border-border/50 transition-all duration-150 hover:scale-[1.01] hover:shadow-md">
                <CardHeader>
                  <Badge
                    variant="outline"
                    className="mb-2 w-fit border-accent/40 text-accent-foreground"
                  >
                    API
                  </Badge>
                  <CardTitle className="text-xl">Financiera</CardTitle>
                  <p className="text-3xl font-semibold tracking-tight">
                    desde $200
                    <span className="text-base font-normal text-muted-foreground">
                      /mes
                    </span>
                  </p>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-4" />
                  <ul className="flex flex-col gap-3">
                    {[
                      "Scoring API",
                      "Portafolio de productores",
                      "Tendencias de producción por zona",
                      "Datos verificados",
                    ].map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2.5 text-sm"
                      >
                        <CheckCircle
                          weight="Linear"
                          size={16}
                          className="shrink-0 text-accent"
                          aria-hidden="true"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            Sin costos de integración. Sin lock-in.
          </p>
        </div>
      </section>

      {/* ─── 8. Validation ─── */}
      <section className="border-t bg-muted/40 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Stats bar */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { end: 1000, prefix: "", suffix: "+", label: "planes de negocio" },
              { end: 20000, prefix: "", suffix: "", label: "productores en red" },
              { end: 0, prefix: "~$", suffix: "", label: "costo por mensaje IA", static: "~$0.001" },
              { end: 0, prefix: "$", suffix: "/lb", label: "valor Fair Trade", static: "$0.40/lb" },
            ].map((stat) => (
              <ScrollReveal key={stat.label} delay={0}>
                <div className="text-center">
                  <p className="text-2xl font-semibold tracking-tight md:text-3xl">
                    {stat.static ? (
                      stat.static
                    ) : (
                      <StatCounter
                        end={stat.end}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                      />
                    )}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <Separator className="my-10" />

          {/* Quote */}
          <ScrollReveal>
            <div className="flex items-start gap-5">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-border/50 md:size-20">
                <Image
                  src="/persona-cafe.webp"
                  alt="Productor de café en campo"
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <blockquote className="border-l-2 border-primary pl-6">
                <p className="max-w-[65ch] text-pretty text-base italic leading-relaxed text-muted-foreground md:text-lg">
                  &ldquo;La pregunta obvia es: ¿cómo saben que los datos son
                  reales? Consistencia temporal. Es imposible mentir de forma
                  consistente durante 8 meses.&rdquo;
                </p>
                <footer className="mt-3 text-sm font-medium text-foreground">
                  — Enrique Flores, Chacra
                </footer>
              </blockquote>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ─── 9. Team ─── */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
                Quiénes somos
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <div className="relative mt-10 h-96 overflow-hidden rounded-2xl md:h-[28rem]">
              <Image
                src="/team.jpg"
                alt="Enrique Flores y Oscar Castro, fundadores de Chacra"
                fill
                className="object-cover object-[center_33%]"
                sizes="(max-width: 768px) 100vw, 1152px"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-card to-transparent" />
            </div>
          </ScrollReveal>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <ScrollReveal delay={0}>
              <Card className="h-full border-border/50 bg-card/80">
                <CardContent className="pt-6">
                  <p className="text-lg font-semibold">Enrique Flores</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Fundador · Producto
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    10+ productos tech desde cero, incluyendo plataformas
                    fintech.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <Card className="h-full border-border/50 bg-card/80">
                <CardContent className="pt-6">
                  <p className="text-lg font-semibold">Oscar Castro</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Co-fundador · Campo
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    IA deployada en zonas sin conectividad. LoRa, campo, campo.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

        </div>
      </section>

      {/* ─── 10. Final CTA ─── */}
      <section className="bg-primary py-20 text-primary-foreground md:py-28">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
            Prueba Chacra ahora
          </h2>
          <p className="mt-3 text-lg text-primary-foreground/70">
            Explora los dashboards con datos reales. Sin registro.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="bg-primary-foreground text-primary transition-transform duration-150 hover:scale-[1.02] hover:bg-primary-foreground/90 active:scale-[0.97]"
              asChild
            >
              <Link href="/demo-cooperativas">
                Demo Cooperativas
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button
              size="lg"
              className="bg-primary-foreground text-primary transition-transform duration-150 hover:scale-[1.02] hover:bg-primary-foreground/90 active:scale-[0.97]"
              asChild
            >
              <Link href="/demo-financieras">
                Demo Financieras
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
          <div className="mt-4">
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground transition-transform duration-150 hover:scale-[1.02] hover:bg-primary-foreground/20 active:scale-[0.97]"
              asChild
            >
              <a href={calLink} target="_blank" rel="noopener noreferrer">
                Hablar con el Equipo
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── 11. Footer ─── */}
      <footer className="bg-code-block py-10 text-code-block-foreground">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <Logo className="h-7" />
              <p className="mt-1 text-sm text-code-block-foreground/50">
                Datos bancables para el agro peruano.
              </p>
            </div>
            <a
              href={calLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-code-block-foreground/50 transition-colors hover:text-code-block-foreground"
            >
              Agendar Demo
            </a>
          </div>
          <Separator className="my-6 bg-code-block-foreground/10" />
          <p className="text-center text-sm text-code-block-foreground/50">
            Hecho con café para el Challenge Avanzar Rural 2026
          </p>
        </div>
      </footer>
    </div>
  )
}
