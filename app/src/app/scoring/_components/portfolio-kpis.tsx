import {
	CheckCircle,
	GraphUp,
	UsersGroupRounded,
	WalletMoney,
} from "@/components/auth/solar-icons";
import { Card, CardContent } from "@/components/ui/card";

const ICONS = [UsersGroupRounded, CheckCircle, GraphUp, WalletMoney] as const;

export function PortfolioKpis({
	totalProducers,
	tierCounts,
	avgTrustScore,
	totalTransactions,
}: {
	totalProducers: number;
	tierCounts: { A: number; B: number; C: number };
	avgTrustScore: number;
	totalTransactions: number;
}) {
	const kpis = [
		{
			label: "Productores",
			value: totalProducers.toLocaleString(),
		},
		{
			label: "Tier A",
			value: tierCounts.A.toLocaleString(),
			accent: "text-success",
		},
		{
			label: "Score Promedio",
			value: `${avgTrustScore}/100`,
		},
		{
			label: "Transacciones",
			value: totalTransactions.toLocaleString(),
		},
	];

	return (
		<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
			{kpis.map((kpi, i) => {
				const Icon = ICONS[i];
				return (
					<Card key={kpi.label} className="border-border/50 bg-card/80">
						<CardContent className="pt-5 pb-4">
							<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
								<Icon
									weight="BoldDuotone"
									size={20}
									className="text-primary"
									aria-hidden="true"
								/>
							</div>
							<p
								className={`mt-3 text-2xl font-semibold tracking-tight tabular-nums ${kpi.accent ?? ""}`}
							>
								{kpi.value}
							</p>
							<p className="mt-0.5 text-xs text-muted-foreground">
								{kpi.label}
							</p>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
