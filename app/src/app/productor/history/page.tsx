import { getTransactionsByProducer } from "@/actions/transactions";
import { getSession } from "@/lib/auth";
import { getPriceBenchmark } from "@/lib/prices";
import { TransactionHistory } from "../_components/transaction-history";

export default async function ProducerHistoryPage() {
	const session = await getSession();
	if (!session) return null;

	const result = await getTransactionsByProducer();
	if ("error" in result) return null;

	const { transactions } = result.data;

	// Build price benchmarks for unique (product, region) pairs
	const region = session.user.producerRegion ?? "";
	const uniqueProducts = [
		...new Set(
			transactions.map((t) => t.product).filter((p): p is string => p != null),
		),
	];
	const benchmarks = new Map<
		string,
		Awaited<ReturnType<typeof getPriceBenchmark>>
	>();

	if (region) {
		const benchmarkResults = await Promise.all(
			uniqueProducts.map((product) => getPriceBenchmark(product, region)),
		);
		for (let i = 0; i < uniqueProducts.length; i++) {
			benchmarks.set(uniqueProducts[i], benchmarkResults[i]);
		}
	}

	// Compute price signal per transaction
	const syncedTransactions = transactions.map((t) => {
		let priceSignal: "above" | "below" | "at" | null = null;

		if (region && t.product && t.pricePerKg != null) {
			const benchmark = benchmarks.get(t.product);
			if (benchmark) {
				if (t.pricePerKg > benchmark.ceiling) {
					priceSignal = "above";
				} else if (t.pricePerKg < benchmark.floor) {
					priceSignal = "below";
				} else {
					priceSignal = "at";
				}
			}
		}

		return {
			id: t.id,
			uuid: t.uuid,
			product: t.product,
			quantityKg: t.quantityKg,
			pricePerKg: t.pricePerKg,
			buyer: t.buyer,
			photoUrl: t.photoUrl,
			date: t.date,
			integrityStatus: t.integrityStatus,
			priceSignal,
		};
	});

	return <TransactionHistory syncedTransactions={syncedTransactions} />;
}
