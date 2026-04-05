import { getAllProducersForScoring } from "@/actions/producers";
import { GraphUp } from "@/components/auth/solar-icons";
import { EmptyState } from "@/components/empty-state";
import { CreditCandidateTable } from "./_components/credit-candidate-table";
import { PortfolioKpis } from "./_components/portfolio-kpis";
import { PortfolioRiskSummary } from "./_components/portfolio-risk-summary";
import { TierDistributionChart } from "./_components/tier-distribution-chart";

export default async function ScoringPage() {
	const result = await getAllProducersForScoring();

	if ("error" in result) {
		return (
			<div className="flex flex-col gap-6">
				<h1 className="text-3xl font-semibold tracking-tight">Scoring</h1>
				<EmptyState
					icon={GraphUp}
					title="Error al cargar datos"
					description={result.error}
				/>
			</div>
		);
	}

	const { producers } = result.data;

	if (producers.length === 0) {
		return (
			<div className="flex flex-col gap-6">
				<h1 className="text-3xl font-semibold tracking-tight">Scoring</h1>
				<EmptyState
					icon={GraphUp}
					title="No hay datos de scoring disponibles"
					description="Los perfiles crediticios apareceran cuando haya datos."
				/>
			</div>
		);
	}

	// Compute aggregates from producers list
	const tierCounts = { A: 0, B: 0, C: 0 };
	let totalTrustScore = 0;
	let totalTransactions = 0;

	for (const producer of producers) {
		tierCounts[producer.tier]++;
		totalTrustScore += producer.trustScore;
		totalTransactions += producer.transactionCount;
	}

	const totalProducers = producers.length;
	const avgTrustScore = Math.round(totalTrustScore / totalProducers);

	const distribution = [
		{
			tier: "A",
			count: tierCounts.A,
			fill: "var(--color-success)",
		},
		{
			tier: "B",
			count: tierCounts.B,
			fill: "var(--color-warning)",
		},
		{
			tier: "C",
			count: tierCounts.C,
			fill: "var(--color-destructive)",
		},
	].filter((d) => d.count > 0);

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-3xl font-semibold tracking-tight">Scoring</h1>
			<PortfolioKpis
				totalProducers={totalProducers}
				tierCounts={tierCounts}
				avgTrustScore={avgTrustScore}
				totalTransactions={totalTransactions}
			/>
			<div className="grid gap-6 lg:grid-cols-2">
				<TierDistributionChart
					distribution={distribution}
					totalProducers={totalProducers}
				/>
				<PortfolioRiskSummary producers={producers} />
			</div>
			<CreditCandidateTable producers={producers} />
		</div>
	);
}
