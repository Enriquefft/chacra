import { and, eq, gte, ne } from "drizzle-orm";
import { user } from "@/db/auth-schema";
import { cooperative, transaction } from "@/db/schema";
import { db } from "@/lib/db";
import type { PriceBenchmark } from "@/lib/types";

/**
 * Get price benchmark for a product in a region.
 * Uses non-flagged transactions from the last 90 days where the farmer's region matches.
 * Returns null if fewer than 5 data points.
 */
export async function getPriceBenchmark(
	product: string,
	region: string,
): Promise<PriceBenchmark | null> {
	const ninetyDaysAgo = new Date();
	ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
	const cutoff = ninetyDaysAgo.toISOString().split("T")[0];

	const rows = await db
		.select({ pricePerKg: transaction.pricePerKg })
		.from(transaction)
		.innerJoin(user, eq(transaction.farmerId, user.id))
		.where(
			and(
				eq(transaction.product, product),
				eq(user.farmerRegion, region),
				ne(transaction.integrityStatus, "flagged"),
				gte(transaction.date, cutoff),
			),
		);

	if (rows.length < 5) {
		return null;
	}

	const prices = rows.map((r) => Number(r.pricePerKg)).sort((a, b) => a - b);
	const n = prices.length;

	const p10Index = Math.floor(n * 0.1);
	const p90Index = Math.min(Math.floor(n * 0.9), n - 1);
	const floor = prices[p10Index];
	const ceiling = prices[p90Index];
	const average = prices.reduce((sum, p) => sum + p, 0) / n;

	return {
		product,
		region,
		floor,
		ceiling,
		average: Math.round(average * 100) / 100,
		dataPoints: n,
	};
}

/**
 * Compare a price against the benchmark for a product/region.
 * Returns "above" if price > ceiling, "below" if price < floor, "at" otherwise.
 * Returns null if insufficient data for benchmark.
 */
export async function getPriceSignal(
	pricePerKg: number,
	product: string,
	region: string,
): Promise<"above" | "below" | "at" | null> {
	const benchmark = await getPriceBenchmark(product, region);
	if (!benchmark) {
		return null;
	}

	if (pricePerKg > benchmark.ceiling) return "above";
	if (pricePerKg < benchmark.floor) return "below";
	return "at";
}

/**
 * Get price benchmarks for all products of a cooperative.
 * Returns a map of product name to benchmark (or null if insufficient data).
 */
export async function getBenchmarksForCooperative(
	cooperativeId: string,
): Promise<Map<string, PriceBenchmark | null>> {
	const [coop] = await db
		.select({
			productList: cooperative.productList,
			region: cooperative.region,
		})
		.from(cooperative)
		.where(eq(cooperative.id, cooperativeId))
		.limit(1);

	const result = new Map<string, PriceBenchmark | null>();

	if (!coop) {
		return result;
	}

	const products = coop.productList ?? [];
	const benchmarks = await Promise.all(
		products.map((product) => getPriceBenchmark(product, coop.region)),
	);

	for (let i = 0; i < products.length; i++) {
		result.set(products[i], benchmarks[i]);
	}

	return result;
}
