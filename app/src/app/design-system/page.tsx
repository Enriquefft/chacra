import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

const colors = [
  { name: "Primary (Terracotta)", var: "bg-primary", fg: "text-primary-foreground" },
  { name: "Secondary (Taupe)", var: "bg-secondary", fg: "text-secondary-foreground" },
  { name: "Accent (Gold)", var: "bg-accent", fg: "text-accent-foreground" },
  { name: "Muted", var: "bg-muted", fg: "text-muted-foreground" },
  { name: "Destructive", var: "bg-destructive", fg: "text-white" },
  { name: "Success", var: "bg-success", fg: "text-success-foreground" },
  { name: "Warning", var: "bg-warning", fg: "text-warning-foreground" },
]

const chartColors = [
  { name: "Chart 1 — Terracotta", var: "bg-chart-1" },
  { name: "Chart 2 — Olive", var: "bg-chart-2" },
  { name: "Chart 3 — Amber", var: "bg-chart-3" },
  { name: "Chart 4 — Sage", var: "bg-chart-4" },
  { name: "Chart 5 — Clay", var: "bg-chart-5" },
]

export default function DesignSystemPage() {
  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-semibold tracking-tight">Chacra — Sistema de Diseno</h1>
      <p className="mt-2 text-muted-foreground">
        Paleta de colores, tipografia, y componentes base.
      </p>

      <Separator className="my-8" />

      {/* Color Palette */}
      <section>
        <h2 className="text-xl font-medium">Colores semanticos</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {colors.map((c) => (
            <div key={c.name} className="flex flex-col gap-1.5">
              <div className={`${c.var} ${c.fg} flex h-20 items-center justify-center rounded-lg text-sm font-medium`}>
                {c.name.split(" (")[0]}
              </div>
              <span className="text-xs text-muted-foreground">{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      <Separator className="my-8" />

      {/* Chart Colors */}
      <section>
        <h2 className="text-xl font-medium">Colores de graficos</h2>
        <div className="mt-4 flex gap-2">
          {chartColors.map((c) => (
            <div key={c.name} className="flex flex-1 flex-col gap-1.5">
              <div className={`${c.var} h-16 rounded-lg`} />
              <span className="text-xs text-muted-foreground">{c.name.split(" — ")[1]}</span>
            </div>
          ))}
        </div>
      </section>

      <Separator className="my-8" />

      {/* Surface Colors */}
      <section>
        <h2 className="text-xl font-medium">Superficies</h2>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex h-20 items-center justify-center rounded-lg border bg-background text-sm">Background</div>
            <span className="text-xs text-muted-foreground">bg-background</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex h-20 items-center justify-center rounded-lg border bg-card text-sm">Card</div>
            <span className="text-xs text-muted-foreground">bg-card</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex h-20 items-center justify-center rounded-lg border bg-muted text-sm text-muted-foreground">Muted</div>
            <span className="text-xs text-muted-foreground">bg-muted</span>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Typography */}
      <section>
        <h2 className="text-xl font-medium">Tipografia</h2>
        <div className="mt-4 flex flex-col gap-3">
          <p className="text-3xl font-semibold tracking-tight">Titulo Principal — 30px semibold</p>
          <p className="text-2xl font-semibold tracking-tight">Titulo Seccion — 24px semibold</p>
          <p className="text-xl font-medium">Subtitulo — 20px medium</p>
          <p className="text-lg">Cuerpo grande — 18px regular (pantallas productor)</p>
          <p className="text-base">Cuerpo — 16px regular (minimo)</p>
          <p className="text-sm text-muted-foreground">Texto secundario — 14px muted</p>
          <p className="text-xs text-muted-foreground">Etiqueta — 12px muted</p>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Buttons */}
      <section>
        <h2 className="text-xl font-medium">Botones</h2>
        <div className="mt-4 flex flex-col gap-6">
          <div>
            <p className="mb-3 text-sm text-muted-foreground">Variantes</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm text-muted-foreground">Tamanos (touch target: lg = 44px)</p>
            <div className="flex flex-wrap items-end gap-3">
              <Button size="xs">XS</Button>
              <Button size="sm">SM</Button>
              <Button size="default">Default</Button>
              <Button size="lg">LG — Productor</Button>
            </div>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Badges */}
      <section>
        <h2 className="text-xl font-medium">Badges</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge className="bg-success text-success-foreground">Sincronizado</Badge>
          <Badge className="bg-warning text-warning-foreground">Pendiente</Badge>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Inputs */}
      <section>
        <h2 className="text-xl font-medium">Inputs</h2>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Dashboard (default h-8)</label>
            <Input placeholder="Escribe aqui..." />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Productor (h-11 touch target)</label>
            <Input className="h-11 text-base" placeholder="Escribe aqui..." />
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Cards */}
      <section>
        <h2 className="text-xl font-medium">Cards</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Produccion Total</CardTitle>
              <CardDescription>Ultimo mes — Cafe arabica</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">2,450 kg</p>
            </CardContent>
            <CardFooter>
              <Badge className="bg-success text-success-foreground">+12% vs mes anterior</Badge>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Puntaje Crediticio</CardTitle>
              <CardDescription>Productor: Maria Lopez</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-semibold">A</span>
                <Badge className="bg-success text-success-foreground">Riesgo bajo</Badge>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">Basado en 24 transacciones</p>
            </CardFooter>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Alerts */}
      <section>
        <h2 className="text-xl font-medium">Alertas</h2>
        <div className="mt-4 flex flex-col gap-3">
          <Alert>
            <AlertTitle>Modo sin conexion</AlertTitle>
            <AlertDescription>
              Tus datos se guardan localmente y se sincronizaran cuando vuelvas a tener conexion.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Error de sincronizacion</AlertTitle>
            <AlertDescription>
              No se pudieron enviar 3 transacciones. Intenta de nuevo.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Scoring Badges */}
      <section>
        <h2 className="text-xl font-medium">Scoring — Niveles de riesgo</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Badge className="bg-success text-success-foreground">Tier A — Bajo riesgo</Badge>
          <Badge className="bg-warning text-warning-foreground">Tier B — Riesgo medio</Badge>
          <Badge variant="destructive">Tier C — Alto riesgo</Badge>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Spacing Scale */}
      <section>
        <h2 className="text-xl font-medium">Escala de espaciado (4px grid)</h2>
        <div className="mt-4 flex flex-col gap-2">
          {[1, 2, 3, 4, 6, 8, 12].map((n) => (
            <div key={n} className="flex items-center gap-3">
              <span className="w-12 text-right text-xs text-muted-foreground">{n * 4}px</span>
              <div className="h-3 rounded-sm bg-primary" style={{ width: `${n * 4}px` }} />
            </div>
          ))}
        </div>
      </section>

      <Separator className="my-8" />

      {/* Border Radius */}
      <section>
        <h2 className="text-xl font-medium">Border radius</h2>
        <p className="mt-1 text-sm text-muted-foreground">Base: 0.5rem (8px). Consistente en todo.</p>
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex size-16 items-center justify-center rounded-sm border bg-muted text-xs">sm</div>
          <div className="flex size-16 items-center justify-center rounded-md border bg-muted text-xs">md</div>
          <div className="flex size-16 items-center justify-center rounded-lg border bg-muted text-xs">lg</div>
          <div className="flex size-16 items-center justify-center rounded-xl border bg-muted text-xs">xl</div>
        </div>
      </section>

      <div className="py-12 text-center text-sm text-muted-foreground">
        Chacra — Phase 0 Design System
      </div>
    </div>
  )
}
