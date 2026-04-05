import { Card, CardContent } from "@/components/ui/card";
import type { ScoringProducerItem } from "@/lib/types";

export function PortfolioRiskSummary({
	producers,
}: {
	producers: ScoringProducerItem[];
}) {
	const uniqueCooperatives = new Set(
		producers.map((f) => f.cooperativeName).filter(Boolean),
	).size;

	const uniqueRegions = new Set(producers.map((f) => f.region).filter(Boolean))
		.size;

	const avgActiveMonths =
		producers.length > 0
			? Math.round(
					producers.reduce((sum, f) => sum + f.activeMonths, 0) / producers.length,
				)
			: 0;

	const avgTrustScore =
		producers.length > 0
			? Math.round(
					producers.reduce((sum, f) => sum + f.trustScore, 0) / producers.length,
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
