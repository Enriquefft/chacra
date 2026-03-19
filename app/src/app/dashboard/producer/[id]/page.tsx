import Link from "next/link";
import { getFarmerProfile } from "@/actions/farmers";
import { getTransactionsByFarmer } from "@/actions/transactions";
import { ArrowLeft, UserRounded } from "@/components/auth/solar-icons";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { computeTrustScore } from "@/lib/integrity";
import { FarmerProfileCard } from "./_components/farmer-profile-card";
import { ProducerTransactionsTable } from "./_components/producer-transactions-table";

export default async function ProducerDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const [profileResult, txResult, trustScore] = await Promise.all([
		getFarmerProfile(id),
		getTransactionsByFarmer(id),
		computeTrustScore(id),
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

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center gap-3">
				<Button variant="outline" size="default" asChild>
					<Link href="/dashboard/producers">
						<ArrowLeft size={16} aria-hidden="true" />
						Productores
					</Link>
				</Button>
			</div>
			<FarmerProfileCard profile={profile} trustScore={trustScore} />
			<ProducerTransactionsTable transactions={transactions} total={total} />
		</div>
	);
}
