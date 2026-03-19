import {
	getCooperativeStats,
	getMonthlyProduction,
} from "@/actions/cooperatives";
import { getTransactionsByCooperative } from "@/actions/transactions";
import { Home } from "@/components/auth/solar-icons";
import { EmptyState } from "@/components/empty-state";
import { getSession } from "@/lib/auth";
import { getBenchmarksForCooperative } from "@/lib/prices";
import { ExportGoalProgress } from "./_components/export-goal-progress";
import { KpiRow } from "./_components/kpi-row";
import { PriceBenchmarkChart } from "./_components/price-benchmark-chart";
import { ProductionChart } from "./_components/production-chart";
import { TraceabilityTable } from "./_components/traceability-table";

export default async function DashboardPage() {
	const session = await getSession();
	if (!session || !session.user.cooperativeId) {
		return (
			<div className="flex flex-col gap-6">
				<h1 className="text-2xl font-semibold tracking-tight">Panel</h1>
				<EmptyState
					icon={Home}
					title="Bienvenido"
					description="Invita a tus productores para comenzar."
				/>
			</div>
		);
	}

	const cooperativeId = session.user.cooperativeId;

	const [statsResult, txResult, benchmarksMap, productionResult] =
		await Promise.all([
			getCooperativeStats(),
			getTransactionsByCooperative({ limit: 10 }),
			getBenchmarksForCooperative(cooperativeId),
			getMonthlyProduction(),
		]);

	// If stats failed, show empty state
	if ("error" in statsResult) {
		return (
			<div className="flex flex-col gap-6">
				<h1 className="text-2xl font-semibold tracking-tight">Panel</h1>
				<EmptyState
					icon={Home}
					title="Bienvenido"
					description="Invita a tus productores para comenzar."
				/>
			</div>
		);
	}

	const stats = statsResult.data;
	const transactions = "error" in txResult ? [] : txResult.data.transactions;

	// Transform benchmarks Map to array for chart
	const benchmarks: Array<{
		product: string;
		floor: number;
		ceiling: number;
		average: number;
		dataPoints: number;
	}> = [];
	for (const [, benchmark] of benchmarksMap) {
		if (benchmark) {
			benchmarks.push(benchmark);
		}
	}

	// Transform monthly production data: pivot from flat to chart format
	const monthlyRaw =
		"error" in productionResult ? [] : productionResult.data.months;
	const productSet = new Set<string>();
	const monthMap = new Map<string, Record<string, number | string>>();

	for (const row of monthlyRaw) {
		productSet.add(row.product);
		const existing = monthMap.get(row.month) ?? { month: row.month };
		existing[row.product] = row.totalKg;
		monthMap.set(row.month, existing);
	}

	const products = Array.from(productSet);
	const productionData = Array.from(monthMap.values());

	// Check if everything is empty
	const allEmpty =
		stats.totalFarmers === 0 &&
		transactions.length === 0 &&
		benchmarks.length === 0 &&
		productionData.length === 0;

	if (allEmpty) {
		return (
			<div className="flex flex-col gap-6">
				<h1 className="text-2xl font-semibold tracking-tight">Panel</h1>
				<EmptyState
					icon={Home}
					title="Bienvenido"
					description="Invita a tus productores para comenzar."
				/>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-2xl font-semibold tracking-tight">Panel</h1>
			<KpiRow stats={stats} />
			<ExportGoalProgress goals={stats.exportGoalProgress} />
			<div className="grid gap-6 lg:grid-cols-2">
				<PriceBenchmarkChart benchmarks={benchmarks} />
				<ProductionChart data={productionData} products={products} />
			</div>
			<TraceabilityTable transactions={transactions} />
		</div>
	);
}
