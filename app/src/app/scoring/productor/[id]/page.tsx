import Link from "next/link";
import { getProducerProfile } from "@/actions/producers";
import { getTransactionsByProducer } from "@/actions/transactions";
import { ArrowLeft, ShieldCheck } from "@/components/auth/solar-icons";
import { EmptyState } from "@/components/empty-state";
import { computeTrustScore } from "@/lib/integrity";
import { computeCreditScore } from "@/lib/scoring";
import { FlaggedTransactions } from "./_components/flagged-transactions";
import { IdentityCard } from "./_components/identity-card";
import { IncomeKpis } from "./_components/income-kpis";
import { IncomeTrendChart } from "./_components/income-trend-chart";
import { LoanRangeCard } from "./_components/loan-range-card";
import { ProfileCompleteness } from "./_components/profile-completeness";
import { RepaymentCapacity } from "./_components/repayment-capacity";
import { VerificationPanel } from "./_components/verification-panel";

export default async function ScoringProducerPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const [profileResult, creditScore, trustScore, transactionsResult] =
		await Promise.all([
			getProducerProfile(id),
			computeCreditScore(id),
			computeTrustScore(id),
			getTransactionsByProducer(id, { limit: 500 }),
		]);

	if ("error" in profileResult) {
		return (
			<div className="flex flex-col gap-6">
				<Link
					href="/scoring"
					className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft weight="Linear" size={16} />
					Volver al portafolio
				</Link>
				<EmptyState
					icon={ShieldCheck}
					title="No se encontro este perfil"
					description="Verifica que el enlace sea correcto."
				/>
			</div>
		);
	}

	const profile = profileResult.data;

	// Compute monthly revenue from transactions for chart
	const transactions =
		"error" in transactionsResult ? [] : transactionsResult.data.transactions;

	const revenueByMonth = new Map<string, number>();
	for (const txn of transactions) {
		if (txn.quantityKg == null || txn.pricePerKg == null) continue;
		const month = txn.date.slice(0, 7); // YYYY-MM
		const revenue = txn.quantityKg * txn.pricePerKg;
		revenueByMonth.set(month, (revenueByMonth.get(month) ?? 0) + revenue);
	}

	const monthlyRevenue = Array.from(revenueByMonth.entries())
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([month, revenue]) => ({
			month,
			revenue: Math.round(revenue),
		}));

	// Filter flagged transactions
	const flaggedTransactions = transactions
		.filter((txn) => txn.integrityStatus === "flagged")
		.map((txn) => ({
			id: txn.id,
			product: txn.product,
			quantityKg: txn.quantityKg,
			pricePerKg: txn.pricePerKg,
			photoUrl: txn.photoUrl,
			date: txn.date,
		}));

	return (
		<div className="flex flex-col gap-6">
			<Link
				href="/scoring"
				className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
			>
				<ArrowLeft weight="Linear" size={16} />
				Volver al portafolio
			</Link>
			<IdentityCard profile={profile} creditScore={creditScore} />
			<IncomeKpis creditScore={creditScore} />
			<div className="grid gap-6 lg:grid-cols-2">
				<IncomeTrendChart monthlyRevenue={monthlyRevenue} />
				<VerificationPanel trustScore={trustScore} creditScore={creditScore} />
			</div>
			<div className="grid gap-6 lg:grid-cols-2">
				<RepaymentCapacity creditScore={creditScore} />
				<ProfileCompleteness profile={profile} />
			</div>
			<FlaggedTransactions transactions={flaggedTransactions} />
			<LoanRangeCard loanRange={creditScore.estimatedLoanRange} />
		</div>
	);
}
