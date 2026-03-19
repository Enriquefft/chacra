"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { CreditScore } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
	fertilizante: "Fertilizante",
	semillas: "Semillas",
	herramientas: "Herramientas",
	mano_de_obra: "Mano de obra",
	transporte: "Transporte",
	otro: "Otro",
};

function MarginBadge({ ratio }: { ratio: number }) {
	const pct = Math.round(ratio * 100);
	if (ratio >= 0.3) {
		return (
			<Badge className="border-0 bg-success/15 text-success">
				{pct}% margen
			</Badge>
		);
	}
	if (ratio >= 0.1) {
		return (
			<Badge className="border-0 bg-warning/15 text-warning">
				{pct}% margen
			</Badge>
		);
	}
	return (
		<Badge variant="destructive">
			{pct}% margen
		</Badge>
	);
}

export function RepaymentCapacity({
	creditScore,
}: {
	creditScore: CreditScore;
}) {
	const { activeMonths } = creditScore;
	const monthlyRevenue =
		activeMonths > 0 ? creditScore.totalRevenue / activeMonths : 0;
	const monthlyExpenses =
		activeMonths > 0 ? creditScore.totalExpenses / activeMonths : 0;
	const monthlyNetMargin = monthlyRevenue - monthlyExpenses;

	const chartData = creditScore.expenseBreakdown
		.filter((item) => item.total > 0)
		.map((item) => ({
			category: CATEGORY_LABELS[item.category] ?? item.category,
			total: Math.round(item.total),
		}))
		.sort((a, b) => b.total - a.total);

	return (
		<Card className="border-border/50 bg-card/80">
			<CardContent className="pt-5">
				<div className="mb-4 flex items-center justify-between">
					<p className="text-sm font-medium text-muted-foreground">
						Capacidad de pago
					</p>
					<MarginBadge ratio={creditScore.marginRatio} />
				</div>

				{/* Summary metrics */}
				<div className="grid grid-cols-3 gap-3">
					<div className="rounded-lg bg-muted/40 px-3 py-2.5">
						<p className="text-base font-semibold tracking-tight tabular-nums">
							S/{Math.round(monthlyRevenue).toLocaleString()}
						</p>
						<p className="mt-0.5 text-xs text-muted-foreground">
							Ingreso/mes
						</p>
					</div>
					<div className="rounded-lg bg-muted/40 px-3 py-2.5">
						<p className="text-base font-semibold tracking-tight tabular-nums">
							S/{Math.round(monthlyExpenses).toLocaleString()}
						</p>
						<p className="mt-0.5 text-xs text-muted-foreground">
							Gasto/mes
						</p>
					</div>
					<div
						className={`rounded-lg px-3 py-2.5 ${
							monthlyNetMargin >= 0
								? "bg-success/10"
								: "bg-destructive/10"
						}`}
					>
						<p
							className={`text-base font-semibold tracking-tight tabular-nums ${
								monthlyNetMargin >= 0
									? "text-success"
									: "text-destructive"
							}`}
						>
							S/{Math.round(monthlyNetMargin).toLocaleString()}
						</p>
						<p className="mt-0.5 text-xs text-muted-foreground">
							Margen neto/mes
						</p>
					</div>
				</div>

				{/* Capacidad de pago estimada */}
				<div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5">
					<p className="text-xs text-muted-foreground">
						Capacidad de pago estimada
					</p>
					<p className="mt-0.5 text-lg font-semibold tracking-tight tabular-nums">
						S/{Math.round(Math.max(0, monthlyNetMargin)).toLocaleString()}/mes
					</p>
					<p className="mt-0.5 text-xs text-muted-foreground">
						Margen disponible para servicio de deuda
					</p>
				</div>

				{/* Expense breakdown chart */}
				{chartData.length > 0 && (
					<div className="mt-4">
						<p className="mb-2 text-xs font-medium text-muted-foreground">
							Desglose de gastos
						</p>
						<ChartContainer
							config={{
								total: {
									label: "Total (S/)",
									color: "var(--chart-5)",
								},
							}}
							className="h-[160px] w-full"
						>
							<BarChart
								data={chartData}
								layout="vertical"
								margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
							>
								<CartesianGrid
									strokeDasharray="3 3"
									horizontal={false}
									stroke="var(--color-border)"
								/>
								<XAxis
									type="number"
									tickLine={false}
									axisLine={false}
									tickFormatter={(v) => `S/${v}`}
									className="text-xs"
								/>
								<YAxis
									type="category"
									dataKey="category"
									tickLine={false}
									axisLine={false}
									className="text-xs"
									width={90}
								/>
								<ChartTooltip content={<ChartTooltipContent />} />
								<Bar
									dataKey="total"
									radius={[0, 4, 4, 0]}
									fill="var(--color-chart-5)"
								/>
							</BarChart>
						</ChartContainer>
					</div>
				)}

				{chartData.length === 0 && creditScore.totalExpenses === 0 && (
					<div className="mt-4 rounded-lg bg-muted/30 py-6 text-center">
						<p className="text-sm text-muted-foreground">
							Sin gastos registrados
						</p>
					</div>
				)}

				{/* Totals summary */}
				<div className="mt-3 border-t pt-3">
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Ingreso total</span>
						<span className="font-medium tabular-nums">
							S/{creditScore.totalRevenue.toLocaleString()}
						</span>
					</div>
					<div className="mt-1 flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Gastos totales</span>
						<span className="font-medium tabular-nums">
							S/{creditScore.totalExpenses.toLocaleString()}
						</span>
					</div>
					<div className="mt-1 flex items-center justify-between text-sm font-medium">
						<span>Margen neto</span>
						<span
							className={`tabular-nums ${
								creditScore.netMargin >= 0
									? "text-success"
									: "text-destructive"
							}`}
						>
							S/{creditScore.netMargin.toLocaleString()}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
