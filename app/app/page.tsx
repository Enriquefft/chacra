import type { Metadata } from "next"
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
  Server,
  ArrowRight,
  CheckCircle,
  ListCheck,
} from "@/components/landing/solar-icons"
import { MobileNav } from "@/components/landing/mobile-nav"
import { Logo } from "@/components/landing/logo"

export const metadata: Metadata = {
  title: "Chacra — Datos bancables para el agro peruano",
  description:
    "Transacciones invisibles, ahora son datos bancables. Chacra convierte las ventas de productores rurales en datos estructurados para credito y trazabilidad.",
  openGraph: {
    title: "Chacra — Datos bancables para el agro peruano",
    description:
      "Convierte ventas rurales en datos estructurados para credito y trazabilidad. Funciona sin internet.",
    type: "website",
    locale: "es_PE",
    siteName: "Chacra",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chacra — Datos bancables para el agro peruano",
    description:
      "Convierte ventas rurales en datos estructurados para credito y trazabilidad. Funciona sin internet.",
  },
}

const navLinks = [
  { label: "Problema", href: "#problema" },
  { label: "Solucion", href: "#solucion" },
  { label: "Cooperativas", href: "#cooperativas" },
  { label: "Financieras", href: "#financieras" },
  { label: "Precios", href: "#precios" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen scroll-smooth">
      {/* ─── Nav ─── */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/">
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
            <Button size="lg" className="hidden sm:inline-flex">
              Probar Demo
            </Button>
            <MobileNav />
          </div>
        </div>
      </nav>

      {/* ─── 1. Hero ─── */}
      <section className="overflow-hidden py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-5 text-xs tracking-wide">
              Sin 4G? Sin problema.
            </Badge>
            <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              Transacciones invisibles,{" "}
              <span className="text-primary">ahora son datos bancables</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
              Chacra convierte las ventas de productores rurales en datos
              estructurados para credito y trazabilidad. Sin internet? Funciona
              igual.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg">Ver Demo en Vivo</Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#solucion">Como Funciona</a>
              </Button>
            </div>
          </div>

          {/* Hero mockups */}
          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2 md:mt-20">
            {/* WhatsApp chat mockup */}
            <div className="-rotate-1 rounded-2xl border border-border/60 bg-card p-1 shadow-lg shadow-foreground/[0.03] transition-transform duration-300 hover:rotate-0">
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
                    <p className="text-sm">vendi 50kg cafe a 8 soles al juan</p>
                    <p className="mt-1 text-right text-[10px] text-muted-foreground">10:32</p>
                  </div>
                  <div className="flex max-w-[88%] items-end gap-1.5">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">C</div>
                    <div className="rounded-2xl rounded-bl-md bg-muted px-3.5 py-2.5">
                      <p className="text-sm leading-relaxed">
                        <span className="text-base">&#10003;</span>{" "}
                        <span className="font-medium">Cafe</span> — 50 kg a S/8.00
                        <br />
                        <span className="text-muted-foreground">Total:</span>{" "}
                        <span className="font-semibold">S/400.00</span>
                        <br />
                        <span className="text-muted-foreground">Comprador:</span> Juan
                      </p>
                      <p className="mt-2 text-sm font-medium text-primary">
                        Correcto?
                      </p>
                      <p className="mt-1 text-right text-[10px] text-muted-foreground">10:32</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PWA form mockup */}
            <div className="rotate-1 rounded-2xl border border-border/60 bg-card p-1 shadow-lg shadow-foreground/[0.03] transition-transform duration-300 hover:rotate-0">
              <div className="rounded-xl bg-card p-4">
                <div className="mb-3 flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-xs font-semibold text-primary">C</span>
                    </div>
                    <span className="text-sm font-medium">Nueva Venta</span>
                  </div>
                  <Badge className="bg-warning/15 text-warning-foreground">
                    Offline
                  </Badge>
                </div>
                <div className="space-y-2.5">
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Producto</label>
                    <div className="rounded-lg border bg-background px-3 py-2 text-sm">
                      Cafe
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Cantidad</label>
                      <div className="rounded-lg border bg-background px-3 py-2 text-sm">
                        50 kg
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Precio</label>
                      <div className="rounded-lg border bg-background px-3 py-2 text-sm">
                        S/8.00
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-success/10 px-3 py-2">
                    <span className="text-sm font-medium text-success">Guardado localmente</span>
                    <Badge variant="outline" className="text-xs">3 pendientes</Badge>
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
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
              20,000 productores. Cero datos formales.
            </h2>
            <p className="mt-4 text-pretty text-base text-muted-foreground md:text-lg">
              Avanzar Rural fortalecio mas de 1,000 planes de negocio. Pero
              cuando el programa cierre, toda esa data queda atrapada en
              cuadernos. Sin datos, no hay credito. Sin trazabilidad, no hay
              exportacion.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                icon: Leaf,
                title: "Sin trazabilidad",
                detail:
                  "Fair Trade puede agregar $0.40/lb al cafe. Sin datos de origen, imposible certificar.",
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
                  "Las apps agricolas asumen 4G. El 70% del Peru rural no lo tiene.",
              },
            ].map((item) => (
              <Card key={item.title} className="border-border/50 bg-card/80">
                <CardContent className="pt-6">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon
                      weight="BoldDuotone"
                      size={24}
                      className="text-primary"
                    />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">{item.title}</h3>
                  <p className="mt-2 text-pretty text-base leading-relaxed text-muted-foreground">
                    {item.detail}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. Solution ─── */}
      <section id="solucion" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
              2 canales. 1 base de datos. Cero friccion.
            </h2>
            <p className="mt-4 text-pretty text-base text-muted-foreground md:text-lg">
              El productor elige como registrar. Los datos siempre llegan al
              mismo lugar.
            </p>
          </div>

          <div className="relative mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto_1fr]">
            {/* WhatsApp channel */}
            <div>
              <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
                <div className="flex items-center gap-2 border-b bg-success/5 px-4 py-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-success/15">
                    <div className="size-2 rounded-full bg-success" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Canal WhatsApp</h3>
                    <p className="text-xs text-muted-foreground">Lenguaje natural</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 p-4">
                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-success/10 px-3.5 py-2.5">
                    <p className="text-sm">
                      vendi 50kg cafe a 8 soles al juan
                    </p>
                    <p className="mt-0.5 text-right text-[10px] text-muted-foreground">10:32</p>
                  </div>
                  <div className="flex max-w-[88%] items-end gap-1.5">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">C</div>
                    <div className="rounded-2xl rounded-bl-md bg-muted px-3.5 py-2.5">
                      <p className="text-sm leading-relaxed">
                        <span className="font-medium">Cafe</span> — 50 kg a S/8.00
                        <br />
                        Total: <span className="font-semibold">S/400.00</span>
                        <br />
                        Comprador: Juan
                      </p>
                      <p className="mt-1.5 text-sm font-medium text-primary">
                        Correcto?
                      </p>
                      <p className="mt-0.5 text-right text-[10px] text-muted-foreground">10:32</p>
                    </div>
                  </div>
                </div>
              </div>
              <ul className="mt-5 space-y-2.5 pl-1">
                {[
                  "Cero curva de aprendizaje",
                  "Registra ventas con lenguaje natural",
                  "IA confirma antes de guardar",
                ].map((text) => (
                  <li key={text} className="flex items-center gap-2.5">
                    <CheckCircle
                      weight="Linear"
                      size={18}
                      className="shrink-0 text-primary"
                    />
                    <span className="text-sm">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Center connector (lg only) */}
            <div className="hidden items-center lg:flex">
              <div className="flex flex-col items-center gap-2">
                <div className="h-20 w-px bg-border" />
                <div className="flex size-10 items-center justify-center rounded-xl border bg-card shadow-sm">
                  <Server
                    weight="BoldDuotone"
                    size={20}
                    className="text-primary"
                  />
                </div>
                <span className="max-w-[5rem] text-center text-[11px] leading-tight text-muted-foreground">
                  Misma base de datos
                </span>
                <div className="h-20 w-px bg-border" />
              </div>
            </div>

            {/* PWA offline channel */}
            <div>
              <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
                <div className="flex items-center justify-between border-b bg-warning/5 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-xs font-semibold text-primary">C</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">App Offline (PWA)</h3>
                      <p className="text-xs text-muted-foreground">Sin conexion</p>
                    </div>
                  </div>
                  <Badge className="bg-warning/15 text-warning-foreground">Offline</Badge>
                </div>
                <div className="space-y-2.5 p-4">
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Producto</label>
                    <div className="rounded-lg border bg-background px-3 py-2 text-sm">Cafe</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Cantidad</label>
                      <div className="rounded-lg border bg-background px-3 py-2 text-sm">50 kg</div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Precio</label>
                      <div className="rounded-lg border bg-background px-3 py-2 text-sm">S/8.00</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-success/10 px-3 py-2">
                    <span className="text-sm font-medium text-success">Guardado</span>
                    <Badge variant="outline" className="text-xs">Sincronizar (3)</Badge>
                  </div>
                </div>
              </div>
              <ul className="mt-5 space-y-2.5 pl-1">
                {[
                  "Funciona sin internet",
                  "Sincroniza cuando hay senal",
                  "No se pierde ningun dato",
                ].map((text) => (
                  <li key={text} className="flex items-center gap-2.5">
                    <CheckCircle
                      weight="Linear"
                      size={18}
                      className="shrink-0 text-primary"
                    />
                    <span className="text-sm">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. For Cooperativas ─── */}
      <section id="cooperativas" className="border-t bg-muted/40 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
              Trazabilidad en tiempo real para tu cooperativa
            </h2>
            <p className="mt-4 text-pretty text-base text-muted-foreground md:text-lg">
              Sabe exactamente cuanto produjo cada socio. Exporta con
              certificacion.
            </p>
          </div>

          {/* Dashboard mockup */}
          <div className="mt-14 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg shadow-foreground/[0.03]">
            {/* Browser chrome */}
            <div className="flex items-center gap-3 border-b bg-muted/60 px-4 py-2.5">
              <div className="flex gap-1.5">
                <div className="size-3 rounded-full bg-foreground/10" />
                <div className="size-3 rounded-full bg-foreground/10" />
                <div className="size-3 rounded-full bg-foreground/10" />
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
                    label: "Produccion Total",
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
                  <div key={stat.label} className="rounded-xl border bg-background p-4">
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

              {/* Table */}
              <div className="mt-5 overflow-hidden rounded-xl border">
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
                        name: "Maria Lopez",
                        product: "Cafe",
                        qty: "50 kg",
                        price: "S/8.00",
                        date: "15 Mar",
                        source: "WhatsApp",
                      },
                      {
                        name: "Juan Perez",
                        product: "Cacao",
                        qty: "30 kg",
                        price: "S/12.50",
                        date: "14 Mar",
                        source: "PWA",
                      },
                      {
                        name: "Rosa Garcia",
                        product: "Cafe",
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
                        <TableCell className="font-medium">
                          {row.name}
                        </TableCell>
                        <TableCell>{row.product}</TableCell>
                        <TableCell>{row.qty}</TableCell>
                        <TableCell>{row.price}</TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
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

          {/* Callout */}
          <div className="mt-8 flex items-start gap-3 rounded-xl border border-accent/20 bg-accent/5 px-5 py-4">
            <Leaf weight="BoldDuotone" size={20} className="mt-0.5 shrink-0 text-accent" />
            <p className="text-sm leading-relaxed text-accent-foreground">
              <span className="font-medium">Certificacion Fair Trade</span> puede agregar hasta $0.40/lb al cafe
              exportado. Trazabilidad es el primer paso.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Button size="lg">Solicitar Acceso</Button>
          </div>
        </div>
      </section>

      {/* ─── 5. For Financieras ─── */}
      <section id="financieras" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
              Score crediticio alternativo, construido con datos reales
            </h2>
            <p className="mt-4 text-pretty text-base text-muted-foreground md:text-lg">
              Evaluacion de riesgo basada en historial de produccion verificado.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            {/* Feature list */}
            <div className="space-y-4 lg:order-last">
              {[
                { icon: ListCheck, text: "47 transacciones verificadas" },
                { icon: GraphUp, text: "8 meses de historial" },
                { icon: ShieldCheck, text: "Score A/B/C automatico" },
                { icon: CheckCircle, text: "Datos cruzados con cooperativa" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/80 px-4 py-3.5">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon
                      weight="BoldDuotone"
                      size={20}
                      className="text-primary"
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

            {/* API response card */}
            <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-foreground text-background shadow-lg shadow-foreground/5 lg:order-first">
              <div className="flex items-center justify-between border-b border-background/10 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-success" />
                  <code className="text-xs text-background/50">200 OK</code>
                </div>
                <code className="text-xs text-background/40">
                  GET /api/scoring/farmer_abc123
                </code>
              </div>
              <pre className="overflow-x-auto p-5 text-[13px] leading-[1.7]">
                <code>
                  <span className="text-background/40">{"{"}</span>{"\n"}
                  {"  "}<span className="text-primary">&quot;farmer_id&quot;</span>: <span className="text-accent">&quot;abc123&quot;</span>,{"\n"}
                  {"  "}<span className="text-primary">&quot;name&quot;</span>: <span className="text-accent">&quot;Maria Lopez&quot;</span>,{"\n"}
                  {"  "}<span className="text-primary">&quot;risk_tier&quot;</span>: <span className="text-success">&quot;A&quot;</span>,{"\n"}
                  {"  "}<span className="text-primary">&quot;score&quot;</span>: <span className="text-warning">82</span>,{"\n"}
                  {"  "}<span className="text-primary">&quot;transactions&quot;</span>: <span className="text-warning">47</span>,{"\n"}
                  {"  "}<span className="text-primary">&quot;months_active&quot;</span>: <span className="text-warning">8</span>,{"\n"}
                  {"  "}<span className="text-primary">&quot;avg_monthly_volume&quot;</span>: <span className="text-accent">&quot;S/3,200&quot;</span>,{"\n"}
                  {"  "}<span className="text-primary">&quot;trend&quot;</span>: <span className="text-accent">&quot;stable&quot;</span>,{"\n"}
                  {"  "}<span className="text-primary">&quot;cooperative&quot;</span>: <span className="text-accent">&quot;Coop Valle Verde&quot;</span>,{"\n"}
                  {"  "}<span className="text-primary">&quot;recommendation&quot;</span>: <span className="text-success">&quot;Apta para credito&quot;</span>,{"\n"}
                  {"  "}<span className="text-primary">&quot;verification&quot;</span>: <span className="text-background/40">{"{"}</span>{"\n"}
                  {"    "}<span className="text-primary">&quot;cross_validated&quot;</span>: <span className="text-success">true</span>,{"\n"}
                  {"    "}<span className="text-primary">&quot;consistency_score&quot;</span>: <span className="text-warning">0.94</span>,{"\n"}
                  {"    "}<span className="text-primary">&quot;flags&quot;</span>: <span className="text-warning">0</span>{"\n"}
                  {"  "}<span className="text-background/40">{"}"}</span>{"\n"}
                  <span className="text-background/40">{"}"}</span>
                </code>
              </pre>
            </div>
          </div>

          {/* Trust verification model */}
          <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-border/60 bg-muted/30 px-5 py-4">
            <p className="text-sm font-medium text-muted-foreground">
              ¿Como sabemos que los datos son reales?
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:gap-6">
              {[
                {
                  step: "1",
                  title: "Consistencia temporal",
                  desc: "Anomalias en volumen, precio y frecuencia",
                },
                {
                  step: "2",
                  title: "Validacion cruzada",
                  desc: "Contrastado con registros de cooperativa",
                },
                {
                  step: "3",
                  title: "Triage humano",
                  desc: "Solo casos atipicos van a verificacion",
                },
              ].map((layer) => (
                <div key={layer.step} className="flex items-baseline gap-2">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted-foreground/15 text-[11px] font-semibold text-muted-foreground">
                    {layer.step}
                  </span>
                  <p className="text-sm">
                    <span className="font-medium">{layer.title}</span>{" "}
                    <span className="text-muted-foreground">— {layer.desc}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 text-center">
            <Button size="lg">Integrar API</Button>
          </div>
        </div>
      </section>

      {/* ─── 6. How It Works ─── */}
      <section className="border-t bg-muted/40 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
              De mensaje a credito en 3 pasos
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                step: "1",
                icon: ChatDots,
                title: "Registrar",
                detail:
                  "El productor envia un WhatsApp o usa la app offline. La IA estructura los datos automaticamente.",
              },
              {
                step: "2",
                icon: ShieldCheck,
                title: "Verificar",
                detail:
                  "Chacra confirma con el productor, cruza datos con la cooperativa, y detecta anomalias automaticamente. Solo los casos atipicos requieren verificacion humana.",
              },
              {
                step: "3",
                icon: GraphUp,
                title: "Monetizar",
                detail:
                  "Cooperativas acceden a trazabilidad. Financieras acceden a scoring crediticio.",
              },
            ].map((item, i) => (
              <div key={item.step} className="relative flex">
                <Card className="flex-1 border-border/50 bg-card/80">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                        {item.step}
                      </span>
                      <item.icon
                        weight="BoldDuotone"
                        size={28}
                        className="text-primary"
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
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. Pricing ─── */}
      <section id="precios" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
              Gratis para el productor. Siempre.
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Productor */}
            <Card className="border-border/50">
              <CardHeader>
                <Badge className="mb-2 w-fit bg-success/15 text-success">
                  Siempre gratis
                </Badge>
                <CardTitle className="text-xl">Productor</CardTitle>
                <p className="text-3xl font-semibold tracking-tight">Gratis</p>
              </CardHeader>
              <CardContent>
                <Separator className="mb-4" />
                <ul className="space-y-3">
                  {[
                    "WhatsApp ilimitado",
                    "App offline",
                    "Historial de ventas",
                    "Score crediticio propio",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle
                        weight="Linear"
                        size={16}
                        className="shrink-0 text-success"
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Cooperativa — elevated */}
            <Card className="relative border-primary/30 shadow-lg shadow-primary/5 ring-2 ring-primary">
              <CardHeader>
                <Badge className="mb-2 w-fit">Mas popular</Badge>
                <CardTitle className="text-xl">Cooperativa</CardTitle>
                <p className="text-3xl font-semibold tracking-tight">$50–200<span className="text-base font-normal text-muted-foreground">/mes</span></p>
              </CardHeader>
              <CardContent>
                <Separator className="mb-4" />
                <ul className="space-y-3">
                  {[
                    "Dashboard completo",
                    "Trazabilidad",
                    "Gestion de socios",
                    "Alertas de produccion",
                    "Export CSV/PDF",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle
                        weight="Linear"
                        size={16}
                        className="shrink-0 text-primary"
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Financiera */}
            <Card className="border-border/50">
              <CardHeader>
                <Badge
                  variant="outline"
                  className="mb-2 w-fit border-accent/40 text-accent-foreground"
                >
                  API
                </Badge>
                <CardTitle className="text-xl">Financiera</CardTitle>
                <p className="text-3xl font-semibold tracking-tight">$200–500<span className="text-base font-normal text-muted-foreground">/mes</span></p>
              </CardHeader>
              <CardContent>
                <Separator className="mb-4" />
                <ul className="space-y-3">
                  {[
                    "Scoring API",
                    "Portafolio de productores",
                    "Inteligencia rural",
                    "Datos verificados",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle
                        weight="Linear"
                        size={16}
                        className="shrink-0 text-accent"
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            50 cooperativas + 10 financieras ={" "}
            <span className="font-medium text-foreground">$8,000/mes</span>.
            Infraestructura: &lt;$50/mes.
          </p>
        </div>
      </section>

      {/* ─── 8. Validation ─── */}
      <section className="border-t bg-muted/40 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Stats bar */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "1,000+", label: "planes de negocio" },
              { value: "20,000", label: "productores en red" },
              { value: "~$0.001", label: "costo por mensaje IA" },
              { value: "$0.40/lb", label: "valor Fair Trade" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-semibold tracking-tight md:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className="mt-12 border-l-2 border-primary pl-5">
            <p className="text-pretty text-base italic text-muted-foreground md:text-lg">
              &ldquo;La pregunta obvia es: ¿como saben que los datos son
              reales? Consistencia temporal. Es imposible mentir de forma
              consistente durante 8 meses.&rdquo;
            </p>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Construido por un equipo con experiencia en fintech, IA en campo, y
            distribucion rural via Spinout.
          </p>
        </div>
      </section>

      {/* ─── 9. Final CTA ─── */}
      <section className="bg-primary py-20 text-primary-foreground md:py-28">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
            Prueba Chacra ahora
          </h2>
          <p className="mt-3 text-lg text-primary-foreground/70">
            Demo en vivo. Funciona en modo avion.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
            >
              Abrir Demo
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              Contactar Equipo
            </Button>
          </div>
        </div>
      </section>

      {/* ─── 10. Footer ─── */}
      <footer className="bg-foreground py-10 text-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <Logo className="h-7" />
              <p className="mt-1 text-sm text-background/50">
                Datos bancables para el agro peruano.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-sm text-background/50 transition-colors hover:text-background"
              >
                Demo
              </a>
              <a
                href="#"
                className="text-sm text-background/50 transition-colors hover:text-background"
              >
                Contacto
              </a>
            </div>
          </div>
          <Separator className="my-6 bg-background/10" />
          <p className="text-center text-sm text-background/30">
            Hecho con cafe para el Challenge Avanzar Rural 2026
          </p>
        </div>
      </footer>
    </div>
  )
}
