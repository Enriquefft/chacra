import { Card, CardContent } from "@/components/ui/card";
import type { ScoringFarmerItem } from "@/lib/types";

export function PortfolioRiskSummary({
	farmers,
}: {
	farmers: ScoringFarmerItem[];
}) {
	const uniqueCooperatives = new Set(
		farmers.map((f) => f.cooperativeName).filter(Boolean),
	).size;

	const uniqueRegions = new Set(farmers.map((f) => f.region).filter(Boolean))
		.size;

	const avgActiveMonths =
		farmers.length > 0
			? Math.round(
					farmers.reduce((sum, f) => sum + f.activeMonths, 0) / farmers.length,
				)
			: 0;

	const avgTrustScore =
		farmers.length > 0
			? Math.round(
					farmers.reduce((sum, f) => sum + f.trustScore, 0) / farmers.length,
				)
			: 0;

	const metrics = [
		{
			label: "Diversificacion de cultivos",
			value: `${uniqueCooperatives} cooperativas`,
		},
		{
			label: "Cobertura regional",
			value: `${uniqueRegions} regiones`,
		},
		{
			label: "Historial promedio",
			value: `${avgActiveMonths} meses`,
		},
		{
			label: "Confiabilidad",
			value: `${avgTrustScore}/100`,
		},
	];

	return (
		<Card className="border-border/50 bg-card/80">
			<CardContent className="pt-5">
				<p className="mb-4 text-sm font-medium text-muted-foreground">
					Perfil de riesgo del portafolio
				</p>
				<div className="grid grid-cols-2 gap-3">
					{metrics.map((metric) => (
						<div
							key={metric.label}
							className="rounded-lg bg-muted/40 px-3 py-2.5"
						>
							<p className="text-base font-semibold tracking-tight tabular-nums">
								{metric.value}
							</p>
							<p className="mt-0.5 text-xs text-muted-foreground">
								{metric.label}
							</p>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
