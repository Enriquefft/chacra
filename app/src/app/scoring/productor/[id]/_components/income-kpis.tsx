import { Card, CardContent } from "@/components/ui/card";
import type { CreditScore } from "@/lib/types";

function TrendIndicator({ trend }: { trend: "up" | "stable" | "down" }) {
	if (trend === "up") {
		return (
			<span className="text-success" role="img" aria-label="Tendencia al alza">
				{"\u2191"}
			</span>
		);
	}
	if (trend === "down") {
		return (
			<span
				className="text-destructive"
				role="img"
				aria-label="Tendencia a la baja"
			>
				{"\u2193"}
			</span>
		);
	}
	return (
		<span className="text-muted-foreground" role="img" aria-label="Estable">
			{"\u2192"}
		</span>
	);
}

export function IncomeKpis({ creditScore }: { creditScore: CreditScore }) {
	const kpis = [
		{
			label: "Ingreso mensual",
			value: `S/${creditScore.avgMonthlyRevenue.toLocaleString()}/mes`,
			extra: <TrendIndicator trend={creditScore.revenueTrend} />,
		},
		{
			label: "Consistencia",
			value: `${creditScore.consistency}%`,
			extra: (
				<div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
					<div
						className="h-full rounded-full bg-primary transition-all"
						style={{ width: `${creditScore.consistency}%` }}
					/>
				</div>
			),
		},
		{
			label: "Transacciones",
			value: creditScore.totalTransactions.toLocaleString(),
		},
		{
			label: "Chacra Score",
			value: `${creditScore.trustScore}/100`,
			highlighted: true,
		},
	];

	return (
		<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
			{kpis.map((kpi) => (
				<Card
					key={kpi.label}
					className={
						kpi.highlighted
							? "border-primary/25 bg-primary/5"
							: "border-border/50 bg-card/80"
					}
				>
					<CardContent className="pt-4 pb-3">
						<p className="text-xs text-muted-foreground">{kpi.label}</p>
						<p className="mt-1 text-xl font-semibold tracking-tight tabular-nums">
							{kpi.value}{" "}
							{"extra" in kpi && kpi.label === "Ingreso mensual"
								? kpi.extra
								: null}
						</p>
						{"extra" in kpi && kpi.label === "Consistencia" ? kpi.extra : null}
						{kpi.highlighted && (
							<p className="mt-0.5 text-[11px] text-primary/70">
								Sugerido por Chacra
							</p>
						)}
					</CardContent>
				</Card>
			))}
		</div>
	);
}
