import Link from "next/link";
import { getAdvancesByProducer } from "@/actions/advances";
import { getProducerProfile } from "@/actions/producers";
import { getTransactionsByProducer } from "@/actions/transactions";
import { ArrowLeft, UserRounded } from "@/components/auth/solar-icons";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { computeTrustScore } from "@/lib/integrity";
import { AdvanceForm } from "./_components/advance-form";
import { AdvanceSummary } from "./_components/advance-summary";
import { ProducerProfileCard } from "./_components/producer-profile-card";
import { ProducerTransactionsTable } from "./_components/producer-transactions-table";

export default async function ProducerDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const [profileResult, txResult, trustScore, advancesResult] =
		await Promise.all([
			getProducerProfile(id),
			getTransactionsByProducer(id),
			computeTrustScore(id),
			getAdvancesByProducer(id),
		]);

	if ("error" in profileResult) {
		return (
			<div className="flex flex-col gap-6">
				<h1 className="text-2xl font-semibold tracking-tight">
					Detalle del productor
				</h1>
				<EmptyState
					icon={UserRounded}
					title="No se encontro este productor"
					description="Verifica que el enlace sea correcto."
				/>
			</div>
		);
	}

	const profile = profileResult.data;
	const transactions = "error" in txResult ? [] : txResult.data.transactions;
	const total = "error" in txResult ? 0 : txResult.data.total;

	const advances =
		"error" in advancesResult ? [] : advancesResult.data.advances;
	const advancesTotal =
		"error" in advancesResult ? 0 : advancesResult.data.total;
	const advancesTotalAmount =
		"error" in advancesResult ? 0 : advancesResult.data.totalAmount;

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center gap-3">
				<Button variant="outline" size="default" asChild>
					<Link href="/dashboard/productores">
						<ArrowLeft size={16} aria-hidden="true" />
						Productores
					</Link>
				</Button>
			</div>
			<ProducerProfileCard profile={profile} trustScore={trustScore} />
			<ProducerTransactionsTable transactions={transactions} total={total} />

			<Separator />

			{/* Adelantos de insumos */}
			<div className="flex flex-col gap-4">
				<h2 className="text-xl font-semibold tracking-tight">
					Adelantos de insumos
				</h2>
				<div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
					<AdvanceForm producerId={id} />
					<AdvanceSummary
						advances={advances}
						total={advancesTotal}
						totalAmount={advancesTotalAmount}
					/>
				</div>
			</div>
		</div>
	);
}
