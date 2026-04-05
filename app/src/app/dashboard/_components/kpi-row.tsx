import {
	Bell,
	Leaf,
	UsersGroupRounded,
	WalletMoney,
} from "@/components/auth/solar-icons";
import { Card, CardContent } from "@/components/ui/card";
import type { CooperativeStats } from "@/lib/types";

export function KpiRow({ stats }: { stats: CooperativeStats }) {
	const kpis = [
		{
			label: "Productores Activos",
			value: `${stats.activeProducers} / ${stats.totalProducers}`,
			icon: UsersGroupRounded,
			iconBg: "bg-chart-2/10",
			iconColor: "text-chart-2",
		},
		{
			label: "Produccion Total",
			value: `${stats.totalProductionKg.toLocaleString("es-PE")} kg`,
			icon: Leaf,
			iconBg: "bg-primary/10",
			iconColor: "text-primary",
		},
		{
			label: "Ingreso del Periodo",
			value: `S/${stats.periodRevenueTotal.toLocaleString("es-PE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
			icon: WalletMoney,
			iconBg: "bg-chart-3/10",
			iconColor: "text-chart-3",
		},
		{
			label: "Alertas Activas",
			value: String(stats.activeAlerts),
			icon: Bell,
			iconBg: stats.activeAlerts > 0 ? "bg-destructive/10" : "bg-muted",
			iconColor:
				stats.activeAlerts > 0 ? "text-destructive" : "text-muted-foreground",
			valueColor: stats.activeAlerts > 0 ? "text-destructive" : undefined,
		},
	];

	return (
		<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
			{kpis.map((kpi) => {
				const Icon = kpi.icon;
				return (
					<Card key={kpi.label}>
						<CardContent className="flex items-center gap-4 p-4">
							<div className={`rounded-lg p-2 ${kpi.iconBg}`}>
								<Icon
									weight="BoldDuotone"
									size={20}
									className={kpi.iconColor}
									aria-hidden="true"
								/>
							</div>
							<div className="min-w-0">
								<p className="text-xs text-muted-foreground">{kpi.label}</p>
								<p
									className={`mt-1 text-2xl font-semibold tabular-nums tracking-tight ${kpi.valueColor ?? ""}`}
								>
									{kpi.value}
								</p>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
