import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AnimatedBar } from "@/components/landing/animated-bar";
import { Logo } from "@/components/landing/logo";
import { MobileNav } from "@/components/landing/mobile-nav";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import {
	ArrowRight,
	ArrowUp,
	CashOut,
	CheckCircle,
	GraphUp,
	Leaf,
	ListCheck,
	ShieldCheck,
	Smartphone,
	Tag,
	UsersGroupRounded,
	WalletMoney,
} from "@/components/landing/solar-icons";
import { StatCounter } from "@/components/landing/stat-counter";
import { StickyNav } from "@/components/landing/sticky-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
	title: "Chacra — Gestiona tu cooperativa. Conecta a tus socios con credito.",
	description:
		"Chacra registra ventas y gastos de tus socios y genera perfiles crediticios verificados. Funciona sin internet. Para cooperativas agrarias del Peru.",
	openGraph: {
		title:
			"Chacra — Gestiona tu cooperativa. Conecta a tus socios con credito.",
		description:
			"Registra ventas y gastos, genera perfiles crediticios verificados. Funciona sin internet.",
		type: "website",
		locale: "es_PE",
		siteName: "Chacra",
	},
	twitter: {
		card: "summary_large_image",
		title: "Chacra — Gestiona tu cooperativa",
		description:
			"Registra ventas y gastos, genera perfiles crediticios verificados. Funciona sin internet.",
	},
};

const calLink = "https://cal.com/enrique-flores/chacra";

const navLinks = [
	{ label: "Problema", href: "#problema" },
	{ label: "Productores", href: "#productores" },
	{ label: "Cooperativas", href: "#cooperativas" },
	{ label: "Financieras", href: "#financieras" },
	{ label: "Planes", href: "#planes" },
];

export default function LandingPage() {
	return (
		<div className="min-h-screen">
			{/* ─── Nav ─── */}
			<StickyNav>
				<div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
					<Link
						href="/"
						aria-label="Chacra — Inicio"
						className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						<Logo className="h-7" />
					</Link>
					<div className="hidden items-center gap-0.5 lg:flex">
						{navLinks.map((link) => (
							<a
								key={link.href}
								href={link.href}
								className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							>
								{link.label}
							</a>
						))}
					</div>
					<div className="flex items-center gap-2">
						<Button
							size="lg"
							className="transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]"
							asChild
						>
							<Link href="/dashboard">
								<span className="hidden sm:inline">
									Registra tu cooperativa
								</span>
								<span className="sm:hidden">Registrar</span>
							</Link>
						</Button>
						<MobileNav />
					</div>
				</div>
			</StickyNav>

			{/* ─── 1. Hero ─── */}
			<section className="hero-grain relative overflow-hidden py-14 sm:py-20 md:py-28">
				{/* Ambient background orbs */}
				<div
					className="pointer-events-none absolute inset-0"
					aria-hidden="true"
				>
					<div
						className="absolute -left-[10%] -top-[5%] h-[550px] w-[550px] rounded-full blur-[100px] md:h-[700px] md:w-[700px]"
						style={
							{
								background:
									"radial-gradient(circle, oklch(0.55 0.18 30) 0%, transparent 65%)",
								animation:
									"orb-drift 20s ease-in-out infinite, glow-breathe 8s ease-in-out infinite",
								"--glow-min": "0.18",
								"--glow-max": "0.30",
							} as React.CSSProperties
						}
					/>
					<div
						className="absolute -right-[5%] top-[10%] h-[500px] w-[500px] rounded-full blur-[90px] md:h-[650px] md:w-[650px]"
						style={
							{
								background:
									"radial-gradient(circle, oklch(0.65 0.16 85) 0%, transparent 65%)",
								animation:
									"orb-drift 25s ease-in-out infinite reverse, glow-breathe 10s ease-in-out infinite",
								"--glow-min": "0.14",
								"--glow-max": "0.25",
							} as React.CSSProperties
						}
					/>
					<div
						className="absolute -bottom-[15%] left-[25%] h-[350px] w-[350px] rounded-full blur-[100px] md:h-[450px] md:w-[450px]"
						style={
							{
								background:
									"radial-gradient(circle, oklch(0.50 0.14 145) 0%, transparent 70%)",
								animation: "orb-drift 22s ease-in-out infinite",
								animationDelay: "-8s",
								"--glow-min": "0.03",
								"--glow-max": "0.08",
							} as React.CSSProperties
						}
					/>
					<div
						className="absolute left-1/2 top-[10%] h-[400px] w-[700px] -translate-x-1/2 rounded-full blur-[80px] md:h-[500px] md:w-[900px]"
						style={
							{
								background:
									"radial-gradient(ellipse, oklch(0.60 0.10 33) 0%, transparent 55%)",
								animation: "glow-breathe 6s ease-in-out infinite",
								"--glow-min": "0.03",
								"--glow-max": "0.07",
							} as React.CSSProperties
						}
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
							<Badge variant="secondary" className="mb-5 text-xs tracking-wide">
								Funciona sin internet
							</Badge>
						</div>
						<h1
							className="hero-animate text-balance font-semibold leading-[1.1] tracking-tight"
							style={
								{
									fontSize: "clamp(1.875rem, 5vw, 3.75rem)",
									"--animate-delay": "100ms",
									"--animate-duration": "500ms",
									"--slide-distance": "12px",
								} as React.CSSProperties
							}
						>
							Gestiona tu cooperativa.{" "}
							<span
								className="bg-[length:200%_100%] bg-clip-text text-transparent"
								style={{
									backgroundImage:
										"linear-gradient(90deg, oklch(0.70 0.12 33), oklch(0.75 0.14 65), oklch(0.70 0.12 33))",
									animation: "shimmer-slide 6s ease-in-out infinite",
								}}
							>
								Conecta a tus socios con credito.
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
							Chacra registra ventas y gastos de tus socios y genera perfiles
							crediticios verificados. Funciona sin internet.
						</p>
						<div
							className="hero-animate mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
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
								className="w-full transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97] sm:w-auto"
								asChild
							>
								<Link href="/dashboard">
									Registra tu cooperativa
									<ArrowRight size={16} />
								</Link>
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="w-full transition-transform duration-150 active:scale-[0.97] sm:w-auto"
								asChild
							>
								<a href="#como-funciona">Ver como funciona</a>
							</Button>
						</div>
					</div>

					{/* Hero mockups — Registrar + Precios tabs */}
					<div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 md:mt-20">
						{/* Registrar tab mockup */}
						<div
							className="hero-float"
							style={
								{
									"--float-duration": "6s",
									"--float-delay": "0s",
								} as React.CSSProperties
							}
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
									{/* Phone header */}
									<div className="mb-3 flex items-center justify-between border-b pb-3">
										<div className="flex items-center gap-2">
											<div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
												<span className="text-xs font-semibold text-primary">
													C
												</span>
											</div>
											<span className="text-sm font-medium">Registrar</span>
										</div>
										<Badge className="bg-warning/20 text-warning">
											Offline
										</Badge>
									</div>
									{/* Form fields */}
									<div className="flex flex-col gap-2.5">
										<div>
											<span className="mb-1 block text-xs text-muted-foreground">
												Producto
											</span>
											<div className="rounded-lg border bg-background px-3 py-2 text-sm">
												Cafe
											</div>
										</div>
										<div className="grid grid-cols-2 gap-2">
											<div>
												<span className="mb-1 block text-xs text-muted-foreground">
													Cantidad
												</span>
												<div className="rounded-lg border bg-background px-3 py-2 text-sm">
													50 kg
												</div>
											</div>
											<div>
												<span className="mb-1 block text-xs text-muted-foreground">
													Precio
												</span>
												<div className="rounded-lg border bg-background px-3 py-2 text-sm">
													S/8.50
												</div>
											</div>
										</div>
										{/* Success state */}
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
												S/425.00
											</Badge>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Precios tab mockup */}
						<div
							className="hero-float"
							style={
								{
									"--float-duration": "7s",
									"--float-delay": "-3s",
								} as React.CSSProperties
							}
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
									{/* Phone header */}
									<div className="mb-3 flex items-center justify-between border-b pb-3">
										<div className="flex items-center gap-2">
											<div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
												<span className="text-xs font-semibold text-primary">
													C
												</span>
											</div>
											<span className="text-sm font-medium">Precios</span>
										</div>
										<Badge
											variant="outline"
											className="text-xs text-muted-foreground"
										>
											Junin
										</Badge>
									</div>
									{/* Price cards */}
									<div className="flex flex-col gap-2.5">
										<div className="rounded-lg border bg-background px-3 py-2.5">
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium">Cafe</span>
												<Badge className="bg-success/15 text-success text-[11px]">
													Buen precio
												</Badge>
											</div>
											<div className="mt-1.5 flex items-baseline justify-between">
												<span className="tabular-nums text-lg font-semibold tracking-tight">
													S/7.50 — S/9.00
													<span className="text-xs font-normal text-muted-foreground">
														/kg
													</span>
												</span>
												<ArrowUp
													size={14}
													className="text-success"
													aria-hidden="true"
												/>
											</div>
										</div>
										<div className="rounded-lg border bg-background px-3 py-2.5">
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium">Cacao</span>
												<Badge
													variant="outline"
													className="text-[11px] text-muted-foreground"
												>
													Estable
												</Badge>
											</div>
											<div className="mt-1.5 flex items-baseline justify-between">
												<span className="tabular-nums text-lg font-semibold tracking-tight">
													S/11.00 — S/13.50
													<span className="text-xs font-normal text-muted-foreground">
														/kg
													</span>
												</span>
												<span className="text-xs text-muted-foreground">—</span>
											</div>
										</div>
										<div className="rounded-lg border bg-background px-3 py-2.5">
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium">Platano</span>
												<Badge className="bg-destructive/15 text-destructive text-[11px]">
													Precio bajo
												</Badge>
											</div>
											<div className="mt-1.5 flex items-baseline justify-between">
												<span className="tabular-nums text-lg font-semibold tracking-tight">
													S/0.80 — S/1.20
													<span className="text-xs font-normal text-muted-foreground">
														/kg
													</span>
												</span>
												<ArrowUp
													size={14}
													className="rotate-180 text-destructive"
													aria-hidden="true"
												/>
											</div>
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
								Datos invisibles. Credito imposible.
							</h2>
						</div>
					</ScrollReveal>

					<div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
						{[
							{
								icon: Leaf,
								title: "Sin trazabilidad",
								detail:
									"Las ventas se registran en cuadernos que se pierden. Sin datos de origen, imposible certificar para exportacion.",
							},
							{
								icon: WalletMoney,
								title: "Sin historial crediticio",
								detail:
									"Los productores son invisibles para las financieras. Sin datos formales, no hay evaluacion de riesgo posible.",
							},
							{
								icon: Smartphone,
								title: "Sin conectividad",
								detail:
									"Las apps agricolas asumen 4G. El 70% del Peru rural no lo tiene. Chacra funciona offline.",
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
										<h3 className="mt-4 text-xl font-medium">{item.title}</h3>
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

			{/* ─── 3. For Producers (Socios) ─── */}
			<section id="productores" className="border-t py-20 md:py-28">
				<div className="mx-auto max-w-6xl px-4 sm:px-6">
					<ScrollReveal>
						<div className="mx-auto max-w-2xl text-center">
							<h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
								Tus socios, mejor informados
							</h2>
							<p className="mx-auto mt-4 max-w-[65ch] text-pretty text-base text-muted-foreground md:text-lg">
								Cada socio ve los precios de su zona y registra sus ventas, con
								o sin internet.
							</p>
						</div>
					</ScrollReveal>

					{/* Two phone mockups side by side */}
					<div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
						{/* Registrar mockup */}
						<ScrollReveal delay={0} distance={16} duration={500}>
							<div className="rounded-2xl border border-border/60 bg-card shadow-lg shadow-foreground/[0.03]">
								{/* Phone status bar */}
								<div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
									<span className="text-[11px] text-muted-foreground">
										9:41
									</span>
									<span className="text-xs font-medium">Chacra</span>
									<Badge className="bg-warning/20 text-warning text-[10px] px-1.5 py-0">
										Offline
									</Badge>
								</div>
								{/* Tab bar */}
								<div className="flex border-b">
									<div className="flex-1 border-b-2 border-primary py-2 text-center text-sm font-medium text-primary">
										Registrar
									</div>
									<div className="flex-1 py-2 text-center text-sm text-muted-foreground">
										Precios
									</div>
								</div>
								<div className="p-4">
									<div className="flex flex-col gap-3">
										<div>
											<span className="mb-1 block text-xs text-muted-foreground">
												Producto
											</span>
											<div className="rounded-lg border bg-background px-3 py-2.5 text-sm font-medium">
												Cafe
											</div>
										</div>
										<div className="grid grid-cols-2 gap-2">
											<div>
												<span className="mb-1 block text-xs text-muted-foreground">
													Cantidad
												</span>
												<div className="rounded-lg border bg-background px-3 py-2.5 text-sm">
													50 kg
												</div>
											</div>
											<div>
												<span className="mb-1 block text-xs text-muted-foreground">
													Precio/kg
												</span>
												<div className="rounded-lg border bg-background px-3 py-2.5 text-sm">
													S/8.50
												</div>
											</div>
										</div>
										<div>
											<span className="mb-1 block text-xs text-muted-foreground">
												Comprador
											</span>
											<div className="rounded-lg border bg-background px-3 py-2.5 text-sm">
												Cooperativa Valle Verde
											</div>
										</div>
										<div className="rounded-lg bg-success/10 px-3 py-3">
											<div className="flex items-center gap-1.5">
												<CheckCircle
													weight="BoldDuotone"
													size={16}
													className="text-success"
													aria-hidden="true"
												/>
												<span className="text-sm font-medium text-success">
													Guardado localmente
												</span>
											</div>
											<p className="mt-1 text-xs text-muted-foreground">
												Se sincronizara cuando haya conexion.
											</p>
										</div>
									</div>
								</div>
							</div>
						</ScrollReveal>

						{/* Precios mockup */}
						<ScrollReveal delay={120} distance={16} duration={500}>
							<div className="rounded-2xl border border-border/60 bg-card shadow-lg shadow-foreground/[0.03]">
								{/* Phone status bar */}
								<div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
									<span className="text-[11px] text-muted-foreground">
										9:41
									</span>
									<span className="text-xs font-medium">Chacra</span>
									<Badge variant="outline" className="text-[10px] px-1.5 py-0">
										Junin
									</Badge>
								</div>
								{/* Tab bar */}
								<div className="flex border-b">
									<div className="flex-1 py-2 text-center text-sm text-muted-foreground">
										Registrar
									</div>
									<div className="flex-1 border-b-2 border-primary py-2 text-center text-sm font-medium text-primary">
										Precios
									</div>
								</div>
								<div className="p-4">
									<div className="flex flex-col gap-3">
										<div className="rounded-lg border bg-background p-3">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
														<Tag
															weight="BoldDuotone"
															size={14}
															className="text-primary"
															aria-hidden="true"
														/>
													</div>
													<span className="text-sm font-medium">Cafe</span>
												</div>
												<Badge className="bg-success/15 text-success text-[11px]">
													Buen precio
												</Badge>
											</div>
											<div className="mt-2 flex items-baseline justify-between">
												<span className="tabular-nums text-lg font-semibold tracking-tight">
													S/7.50 — S/9.00
													<span className="text-xs font-normal text-muted-foreground">
														/kg
													</span>
												</span>
												<ArrowUp
													size={14}
													className="text-success"
													aria-hidden="true"
												/>
											</div>
										</div>
										<div className="rounded-lg border bg-background p-3">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
														<Tag
															weight="BoldDuotone"
															size={14}
															className="text-primary"
															aria-hidden="true"
														/>
													</div>
													<span className="text-sm font-medium">Cacao</span>
												</div>
												<Badge
													variant="outline"
													className="text-[11px] text-muted-foreground"
												>
													Estable
												</Badge>
											</div>
											<div className="mt-2 flex items-baseline justify-between">
												<span className="tabular-nums text-lg font-semibold tracking-tight">
													S/11.00 — S/13.50
													<span className="text-xs font-normal text-muted-foreground">
														/kg
													</span>
												</span>
												<span className="text-xs text-muted-foreground">—</span>
											</div>
										</div>
										<div className="rounded-lg border bg-background p-3">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
														<Tag
															weight="BoldDuotone"
															size={14}
															className="text-primary"
															aria-hidden="true"
														/>
													</div>
													<span className="text-sm font-medium">Platano</span>
												</div>
												<Badge className="bg-destructive/15 text-destructive text-[11px]">
													Precio bajo
												</Badge>
											</div>
											<div className="mt-2 flex items-baseline justify-between">
												<span className="tabular-nums text-lg font-semibold tracking-tight">
													S/0.80 — S/1.20
													<span className="text-xs font-normal text-muted-foreground">
														/kg
													</span>
												</span>
												<ArrowUp
													size={14}
													className="rotate-180 text-destructive"
													aria-hidden="true"
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</ScrollReveal>
					</div>

					{/* Callout */}
					<ScrollReveal delay={200}>
						<div className="mx-auto mt-8 max-w-4xl">
							<div className="flex items-start gap-3 rounded-xl border border-accent/20 bg-accent/5 px-5 py-4">
								<Tag
									weight="BoldDuotone"
									size={20}
									className="mt-0.5 shrink-0 text-accent"
									aria-hidden="true"
								/>
								<p className="text-base leading-relaxed text-foreground">
									<span className="font-medium">
										Un acopiador ofrece S/6.50 por kg de cafe.
									</span>{" "}
									Tu socio consulta Chacra: en su zona se paga entre S/7.50 y
									S/9.00. Ahora negocia con datos.
								</p>
							</div>
						</div>
					</ScrollReveal>
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
								Acopio, insumos y liquidaciones en un solo lugar
							</h2>
							<p className="mx-auto mt-4 max-w-[65ch] text-pretty text-base text-muted-foreground md:text-lg">
								Deja los cuadernos. Toda tu operacion al dia, en un solo sitio.
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
								{/* Stats row */}
								<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
									{[
										{
											label: "Produccion Total",
											value: "2,450 kg",
											change: "+12%",
										},
										{ label: "Productores Activos", value: "47", change: "+5" },
										{
											label: "Insumos Adelantados",
											value: "S/12,800",
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
												<span className="tabular-nums text-2xl font-semibold tracking-tight">
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

								{/* Input advances mini-table */}
								<div className="mt-4 rounded-xl border bg-background p-4">
									<div className="flex items-center justify-between">
										<p className="text-xs font-medium text-muted-foreground">
											Insumos adelantados recientes
										</p>
										<Badge variant="outline" className="text-[11px]">
											Este mes
										</Badge>
									</div>
									<div className="mt-3 flex flex-col gap-2">
										{[
											{
												name: "Maria Lopez",
												category: "Fertilizante",
												amount: "S/800",
											},
											{
												name: "Juan Perez",
												category: "Semillas",
												amount: "S/450",
											},
											{
												name: "Rosa Garcia",
												category: "Herramientas",
												amount: "S/320",
											},
										].map((item) => (
											<div
												key={item.name}
												className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
											>
												<div className="flex items-center gap-2 min-w-0">
													<CashOut
														weight="Linear"
														size={14}
														className="shrink-0 text-muted-foreground"
														aria-hidden="true"
													/>
													<span className="truncate text-sm">{item.name}</span>
												</div>
												<div className="flex shrink-0 items-center gap-2 sm:gap-3">
													<span className="hidden text-xs text-muted-foreground sm:inline">
														{item.category}
													</span>
													<span className="text-sm font-medium">
														{item.amount}
													</span>
												</div>
											</div>
										))}
									</div>
								</div>

								{/* Acopio table */}
								<div className="mt-4 overflow-x-auto rounded-xl border">
									<Table className="min-w-[420px]">
										<TableHeader>
											<TableRow className="bg-muted/30 hover:bg-muted/30">
												<TableHead>Productor</TableHead>
												<TableHead>Producto</TableHead>
												<TableHead>Cantidad</TableHead>
												<TableHead>Precio</TableHead>
												<TableHead className="hidden sm:table-cell">
													Fecha
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{[
												{
													name: "Maria Lopez",
													product: "Cafe",
													qty: "50 kg",
													price: "S/8.50",
													date: "18 Mar",
												},
												{
													name: "Juan Perez",
													product: "Cacao",
													qty: "30 kg",
													price: "S/12.50",
													date: "17 Mar",
												},
												{
													name: "Rosa Garcia",
													product: "Cafe",
													qty: "75 kg",
													price: "S/8.20",
													date: "17 Mar",
												},
												{
													name: "Pedro Silva",
													product: "Cacao",
													qty: "20 kg",
													price: "S/12.00",
													date: "16 Mar",
												},
											].map((row) => (
												<TableRow key={`${row.name}-${row.date}`}>
													<TableCell className="max-w-[120px] truncate font-medium">
														{row.name}
													</TableCell>
													<TableCell>{row.product}</TableCell>
													<TableCell>{row.qty}</TableCell>
													<TableCell>{row.price}</TableCell>
													<TableCell className="hidden text-muted-foreground sm:table-cell">
														{row.date}
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
							<p className="text-base leading-relaxed text-foreground">
								<span className="font-medium">
									15 productores x 200kg = 3 toneladas.
								</span>{" "}
								Con Chacra, sabes en tiempo real si vas a cumplir el minimo de
								exportacion.
							</p>
						</div>
					</ScrollReveal>

					<ScrollReveal delay={250}>
						<div className="mx-auto mt-10 flex max-w-sm flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:items-center">
							<Button
								size="lg"
								className="transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]"
								asChild
							>
								<Link href="/demo-cooperativas">
									Ver demo cooperativas
									<ArrowRight size={16} />
								</Link>
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]"
								asChild
							>
								<Link href="/dashboard">Registra tu cooperativa</Link>
							</Button>
						</div>
					</ScrollReveal>
				</div>
			</section>

			{/* ─── 5. For Financieras ─── */}
			<section id="financieras" className="border-t py-20 md:py-28">
				<div className="mx-auto max-w-6xl px-4 sm:px-6">
					<ScrollReveal>
						<div className="mx-auto max-w-2xl text-center">
							<h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
								Lo que importa es cuanto le queda
							</h2>
							<p className="mx-auto mt-4 max-w-[65ch] text-pretty text-base text-muted-foreground md:text-lg">
								Perfiles crediticios basados en ingresos, gastos y margen neto
								verificado.
							</p>
						</div>
					</ScrollReveal>

					<div className="mt-14 grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
						{/* Credit profile card */}
						<ScrollReveal delay={0} className="lg:order-first">
							<div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg shadow-foreground/[0.03]">
								{/* Card header */}
								<div className="border-b bg-muted/40 px-5 py-3.5">
									<div className="flex items-center justify-between">
										<p className="text-sm font-medium text-muted-foreground">
											Perfil crediticio
										</p>
										<Badge className="bg-success text-success-foreground">
											Tier A
										</Badge>
									</div>
								</div>
								<div className="p-5">
									{/* Producer identity */}
									<div className="flex items-center gap-3 pb-4">
										<div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
											<span className="text-sm font-semibold text-primary">
												ML
											</span>
										</div>
										<div>
											<p className="text-base font-semibold">Maria Lopez</p>
											<p className="text-xs text-muted-foreground">
												Coop Valle Verde · DNI 45678912
											</p>
										</div>
									</div>

									<Separator className="mb-4" />

									{/* Financial metrics */}
									<div className="grid grid-cols-2 gap-3">
										<div className="rounded-lg bg-muted/50 px-3 py-2.5">
											<p className="text-[11px] text-muted-foreground">
												Ingresos (6 meses)
											</p>
											<p className="mt-0.5 tabular-nums text-lg font-semibold tracking-tight text-success">
												S/12,000
											</p>
										</div>
										<div className="rounded-lg bg-muted/50 px-3 py-2.5">
											<p className="text-[11px] text-muted-foreground">
												Gastos (insumos)
											</p>
											<p className="mt-0.5 tabular-nums text-lg font-semibold tracking-tight">
												S/7,500
											</p>
										</div>
										<div className="rounded-lg bg-primary/5 px-3 py-2.5">
											<p className="text-[11px] text-muted-foreground">
												Margen neto
											</p>
											<p className="mt-0.5 tabular-nums text-lg font-semibold tracking-tight text-primary">
												S/4,500
											</p>
										</div>
										<div className="rounded-lg bg-primary/5 px-3 py-2.5">
											<p className="text-[11px] text-muted-foreground">
												Ratio de margen
											</p>
											<p className="mt-0.5 tabular-nums text-lg font-semibold tracking-tight text-primary">
												37.5%
											</p>
										</div>
									</div>

									<Separator className="my-4" />

									{/* Trust + loan */}
									<div className="flex flex-col gap-2.5">
										<div className="flex items-center justify-between">
											<span className="text-sm text-muted-foreground">
												Trust score
											</span>
											<div className="flex items-center gap-2">
												<div className="h-1.5 w-20">
													<AnimatedBar
														percent={82}
														className="bg-success"
														duration={900}
													/>
												</div>
												<span className="tabular-nums text-sm font-semibold">
													82/100
												</span>
											</div>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm text-muted-foreground">
												Rango de credito
											</span>
											<span className="tabular-nums text-sm font-semibold">
												S/3,000 — S/9,000
											</span>
										</div>
									</div>
								</div>
							</div>
						</ScrollReveal>

						{/* Verification model + feature list */}
						<div className="flex flex-col gap-5 lg:order-last">
							{/* Feature list */}
							{[
								{
									icon: GraphUp,
									text: "Ingresos verificados por acopio de cooperativa",
								},
								{
									icon: CashOut,
									text: "Gastos reales: insumos adelantados registrados",
								},
								{
									icon: ListCheck,
									text: "Margen neto = capacidad de pago real",
								},
								{
									icon: ShieldCheck,
									text: "3 capas de verificacion automatica",
								},
							].map((item, i) => (
								<ScrollReveal key={item.text} delay={100 + i * 80}>
									<div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/80 px-4 py-3.5 transition-all duration-150 hover:scale-[1.01] hover:shadow-md">
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
								</ScrollReveal>
							))}

							{/* Risk tiers */}
							<ScrollReveal delay={420}>
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
							</ScrollReveal>
						</div>
					</div>

					{/* Trust verification model */}
					<ScrollReveal delay={200}>
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
											<span className="text-muted-foreground">
												— {layer.desc}
											</span>
										</p>
									</div>
								))}
							</div>
						</div>
					</ScrollReveal>

					<ScrollReveal delay={250}>
						<div className="mx-auto mt-10 flex max-w-sm flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:items-center">
							<Button
								size="lg"
								className="transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]"
								asChild
							>
								<Link href="/demo-financieras">
									Ver demo financieras
									<ArrowRight size={16} />
								</Link>
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]"
								asChild
							>
								<a
									href={calLink}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Habla con nosotros (abre en nueva pestaña)"
								>
									Habla con nosotros
								</a>
							</Button>
						</div>
					</ScrollReveal>
				</div>
			</section>

			{/* ─── 6. How It Works ─── */}
			<section
				id="como-funciona"
				className="border-t bg-muted/40 py-20 md:py-28"
			>
				<div className="mx-auto max-w-6xl px-4 sm:px-6">
					<ScrollReveal>
						<div className="mx-auto max-w-2xl text-center">
							<h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
								De cuaderno a credito en 3 pasos
							</h2>
						</div>
					</ScrollReveal>

					<div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
						{[
							{
								step: "1",
								icon: Smartphone,
								title: "Registrar",
								detail:
									"La cooperativa se registra en 2 minutos. Los socios se unen con un codigo de invitacion y registran sus ventas, con o sin internet.",
							},
							{
								step: "2",
								icon: ListCheck,
								title: "Gestionar",
								detail:
									"La cooperativa registra los insumos adelantados a cada socio. Acopio, gastos y liquidaciones en un solo sistema.",
							},
							{
								step: "3",
								icon: GraphUp,
								title: "Evaluar",
								detail:
									"Las financieras acceden a perfiles crediticios con ingresos, gastos y margen neto verificado. Datos reales, no encuestas.",
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
											<h3 className="text-xl font-medium">{item.title}</h3>
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
			<section id="planes" className="border-t py-20 md:py-28">
				<div className="mx-auto max-w-6xl px-4 sm:px-6">
					<ScrollReveal>
						<div className="mx-auto max-w-2xl text-center">
							<h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
								Planes para cada etapa
							</h2>
							<p className="mx-auto mt-4 max-w-[65ch] text-pretty text-base text-muted-foreground md:text-lg">
								El productor nunca paga. La cooperativa elige el plan que
								necesita.
							</p>
						</div>
					</ScrollReveal>

					<div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
						{/* Comunidad — highlighted/recommended */}
						<ScrollReveal delay={0}>
							<Card className="relative h-full border-2 border-primary bg-card shadow-lg shadow-primary/10 transition-all duration-150 hover:scale-[1.01] hover:shadow-xl hover:shadow-primary/15">
								<Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
									Recomendado
								</Badge>
								<CardContent className="pt-8">
									<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
										<UsersGroupRounded
											weight="BoldDuotone"
											size={22}
											className="text-primary"
											aria-hidden="true"
										/>
									</div>
									<h3 className="mt-3 text-xl font-semibold">Comunidad</h3>
									<p className="mt-1 text-sm text-muted-foreground">
										Hasta 50 productores
									</p>
									<div className="mt-4">
										<span className="text-3xl font-semibold tracking-tight">
											Gratis
										</span>
									</div>
									<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
										Para asociaciones pequenas. Todas las herramientas, sin
										costo.
									</p>
									<Button
										size="lg"
										className="mt-6 w-full transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]"
										asChild
									>
										<Link href="/dashboard">
											Empezar gratis
											<ArrowRight size={16} />
										</Link>
									</Button>
								</CardContent>
							</Card>
						</ScrollReveal>

						{/* Cosecha */}
						<ScrollReveal delay={100}>
							<Card className="h-full border-border/50 bg-card/80 transition-all duration-150 hover:scale-[1.01] hover:shadow-md">
								<CardContent className="pt-6">
									<div className="flex size-10 items-center justify-center rounded-xl bg-accent/10">
										<Leaf
											weight="BoldDuotone"
											size={22}
											className="text-accent"
											aria-hidden="true"
										/>
									</div>
									<h3 className="mt-3 text-xl font-semibold">Cosecha</h3>
									<p className="mt-1 text-sm text-muted-foreground">
										Hasta 200 productores
									</p>
									<div className="mt-4">
										<span className="text-3xl font-semibold tracking-tight">
											S/200
										</span>
										<span className="text-base text-muted-foreground">
											/mes
										</span>
									</div>
									<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
										Para cooperativas en crecimiento. Trazabilidad completa +
										exportacion CSV.
									</p>
									<Button
										size="lg"
										variant="outline"
										className="mt-6 w-full transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]"
										asChild
									>
										<Link href="/dashboard">Comenzar</Link>
									</Button>
								</CardContent>
							</Card>
						</ScrollReveal>

						{/* Exporta */}
						<ScrollReveal delay={200}>
							<Card className="h-full border-border/50 bg-card/80 transition-all duration-150 hover:scale-[1.01] hover:shadow-md">
								<CardContent className="pt-6">
									<div className="flex size-10 items-center justify-center rounded-xl bg-success/10">
										<GraphUp
											weight="BoldDuotone"
											size={22}
											className="text-success"
											aria-hidden="true"
										/>
									</div>
									<h3 className="mt-3 text-xl font-semibold">Exporta</h3>
									<p className="mt-1 text-sm text-muted-foreground">
										Hasta 1,000 productores
									</p>
									<div className="mt-4">
										<span className="text-3xl font-semibold tracking-tight">
											S/500
										</span>
										<span className="text-base text-muted-foreground">
											/mes
										</span>
									</div>
									<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
										Para cooperativas exportadoras. Todo incluido.
									</p>
									<Button
										size="lg"
										variant="outline"
										className="mt-6 w-full transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]"
										asChild
									>
										<Link href="/dashboard">Comenzar</Link>
									</Button>
								</CardContent>
							</Card>
						</ScrollReveal>

						{/* Enterprise */}
						<ScrollReveal delay={300}>
							<Card className="h-full border-border/50 bg-card/80 transition-all duration-150 hover:scale-[1.01] hover:shadow-md">
								<CardContent className="pt-6">
									<div className="flex size-10 items-center justify-center rounded-xl bg-muted">
										<ShieldCheck
											weight="BoldDuotone"
											size={22}
											className="text-muted-foreground"
											aria-hidden="true"
										/>
									</div>
									<h3 className="mt-3 text-xl font-semibold">Enterprise</h3>
									<p className="mt-1 text-sm text-muted-foreground">
										1,000+ productores
									</p>
									<div className="mt-4">
										<span className="text-3xl font-semibold tracking-tight">
											Conversemos
										</span>
									</div>
									<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
										Personalizado para grandes organizaciones.
									</p>
									<Button
										size="lg"
										variant="outline"
										className="mt-6 w-full transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]"
										asChild
									>
										<a href={calLink} target="_blank" rel="noopener noreferrer">
											Contactar
										</a>
									</Button>
								</CardContent>
							</Card>
						</ScrollReveal>
					</div>

					{/* Producer-free callout */}
					<ScrollReveal delay={350}>
						<div className="mx-auto mt-8 max-w-3xl">
							<div className="flex items-start gap-3 rounded-xl border border-success/20 bg-success/5 px-5 py-4">
								<CheckCircle
									weight="BoldDuotone"
									size={20}
									className="mt-0.5 shrink-0 text-success"
									aria-hidden="true"
								/>
								<p className="text-base leading-relaxed text-foreground">
									<span className="font-medium">El productor nunca paga.</span>{" "}
									Chacra es gratis para los productores. La cooperativa o
									asociacion elige el plan que mejor se adapte a su tamano.
								</p>
							</div>
						</div>
					</ScrollReveal>
				</div>
			</section>

			{/* ─── 8. Validation / Social Proof ─── */}
			<section className="border-t py-20 md:py-28">
				<div className="mx-auto max-w-6xl px-4 sm:px-6">
					{/* Stats bar */}
					<div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
						{[
							{ end: 1, suffix: "", label: "cooperativa piloto" },
							{
								end: 20000,
								suffix: "+",
								label: "productores en la red Avanzar Rural",
							},
							{ end: 3, suffix: "", label: "capas de verificacion" },
							{
								end: 0,
								suffix: "%",
								label: "costo para productores",
								static: "0%",
							},
						].map((stat, i) => (
							<ScrollReveal key={stat.label} delay={i * 80}>
								<div className="text-center">
									<p className="tabular-nums text-2xl font-semibold tracking-tight md:text-3xl">
										{stat.static ? (
											stat.static
										) : (
											<StatCounter end={stat.end} suffix={stat.suffix} />
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

					{/* Team */}
					<ScrollReveal>
						<div className="mx-auto max-w-2xl text-center">
							<h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
								Quienes somos
							</h2>
						</div>
					</ScrollReveal>

					<ScrollReveal delay={80}>
						<div className="relative mt-10 h-64 overflow-hidden rounded-2xl sm:h-96 md:h-[28rem]">
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
									<p className="mt-3 text-base leading-relaxed text-muted-foreground">
										10 anos construyendo productos digitales, varios en fintech.
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
									<p className="mt-3 text-base leading-relaxed text-muted-foreground">
										Experiencia con LoRa y sensores en zonas rurales sin
										conectividad.
									</p>
								</CardContent>
							</Card>
						</ScrollReveal>
					</div>
				</div>
			</section>

			{/* ─── 8. Final CTA ─── */}
			<section className="bg-primary py-20 text-primary-foreground md:py-28">
				<div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
					<ScrollReveal distance={8}>
						<h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
							Empieza gratis con hasta 50 productores
						</h2>
						<p className="mt-3 text-pretty text-lg text-primary-foreground/70">
							Sin tarjeta. Sin costo para productores. Registra tu cooperativa
							hoy.
						</p>
					</ScrollReveal>
					<ScrollReveal delay={120} distance={8}>
						<div className="mx-auto mt-8 flex max-w-sm flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:items-center">
							<Button
								size="lg"
								className="bg-primary-foreground text-primary transition-transform duration-150 hover:scale-[1.02] hover:bg-primary-foreground/90 active:scale-[0.97]"
								asChild
							>
								<Link href="/dashboard">
									Registra tu cooperativa
									<ArrowRight size={16} />
								</Link>
							</Button>
							<Button
								size="lg"
								className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground transition-transform duration-150 hover:scale-[1.02] hover:bg-primary-foreground/20 active:scale-[0.97]"
								variant="outline"
								asChild
							>
								<a
									href={calLink}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Habla con el equipo (abre en nueva pestaña)"
								>
									Habla con el equipo
								</a>
							</Button>
						</div>
						<div className="mt-4 flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-4">
							<Button
								size="lg"
								variant="link"
								className="text-primary-foreground/60 hover:text-primary-foreground"
								asChild
							>
								<Link href="/demo-cooperativas">Demo Cooperativas</Link>
							</Button>
							<Button
								size="lg"
								variant="link"
								className="text-primary-foreground/60 hover:text-primary-foreground"
								asChild
							>
								<Link href="/demo-financieras">Demo Financieras</Link>
							</Button>
						</div>
					</ScrollReveal>
				</div>
			</section>

			{/* ─── 9. Footer ─── */}
			<footer className="bg-code-block py-10 text-code-block-foreground">
				<div className="mx-auto max-w-6xl px-4 sm:px-6">
					<div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-start">
						<div className="text-center sm:text-left">
							<Logo className="h-7" />
							<p className="mt-1 text-sm text-code-block-foreground/50">
								Datos bancables para el agro peruano.
							</p>
						</div>
						<div className="flex items-center gap-1">
							<Link
								href="/dashboard"
								className="rounded-lg px-3 py-2 text-sm text-code-block-foreground/50 transition-colors hover:text-code-block-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							>
								Registra tu cooperativa
							</Link>
							<a
								href={calLink}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Contacto (abre en nueva pestaña)"
								className="rounded-lg px-3 py-2 text-sm text-code-block-foreground/50 transition-colors hover:text-code-block-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							>
								Contacto
							</a>
						</div>
					</div>
					<Separator className="my-6 bg-code-block-foreground/10" />
					<p className="text-center text-sm text-code-block-foreground/50">
						Para el Challenge Avanzar Rural 2026
					</p>
				</div>
			</footer>
		</div>
	);
}
