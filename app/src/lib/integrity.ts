import { and, eq, gte, ne, sql } from "drizzle-orm";
import { transaction } from "@/db/schema";
import { db } from "@/lib/db";
import type { IntegrityFlag, TrustScoreResult } from "@/lib/types";

// ─── Internal helpers ────────────────────────────────────────────────

type TransactionRow = typeof transaction.$inferSelect;

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

/**
 * Check if the transaction volume is a spike compared to farmer's history.
 * Flags if current quantity > 3x the farmer's average for this product.
 * Requires at least 3 prior transactions to have enough history.
 */
async function checkVolumeSpike(
	txn: TransactionRow,
): Promise<IntegrityFlag | null> {
	const [result] = await db
		.select({
			avgQty: sql<string>`avg(${transaction.quantityKg})`,
			count: sql<number>`count(*)::int`,
		})
		.from(transaction)
		.where(
			and(
				eq(transaction.farmerId, txn.farmerId),
				eq(transaction.product, txn.product),
				ne(transaction.id, txn.id),
			),
		);

	if (!result || result.count < 3) {
		return null;
	}

	const avgQty = Number(result.avgQty);
	const currentQty = Number(txn.quantityKg);

	if (currentQty > 3 * avgQty) {
		return {
			transactionUuid: txn.uuid,
			farmerId: txn.farmerId,
			flagType: "volume_spike",
			message: `Volumen inusual: ${currentQty} kg es mas de 3x el promedio de ${avgQty.toFixed(2)} kg`,
			details: { currentQty, avgQty, ratio: currentQty / avgQty },
		};
	}

	return null;
}

/**
 * Check if the transaction price is an outlier compared to cooperative prices.
 * Flags if |price - avg| > 2 * stddev for this product in the cooperative.
 * Requires at least 5 data points and non-zero stddev.
 */
async function checkPriceOutlier(
	txn: TransactionRow,
): Promise<IntegrityFlag | null> {
	const ninetyDaysAgo = new Date();
	ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
	const cutoff = ninetyDaysAgo.toISOString().split("T")[0];

	const [result] = await db
		.select({
			avgPrice: sql<string>`avg(${transaction.pricePerKg})`,
			stddev: sql<string>`stddev_pop(${transaction.pricePerKg})`,
			count: sql<number>`count(*)::int`,
		})
		.from(transaction)
		.where(
			and(
				eq(transaction.cooperativeId, txn.cooperativeId),
				eq(transaction.product, txn.product),
				ne(transaction.id, txn.id),
				gte(transaction.date, cutoff),
			),
		);

	if (!result || result.count < 5) {
		return null;
	}

	const avgPrice = Number(result.avgPrice);
	const stddev = Number(result.stddev);

	if (stddev === 0) {
		return null;
	}

	const currentPrice = Number(txn.pricePerKg);
	const deviation = Math.abs(currentPrice - avgPrice);

	if (deviation > 2 * stddev) {
		return {
			transactionUuid: txn.uuid,
			farmerId: txn.farmerId,
			flagType: "price_outlier",
			message: `Precio atipico: S/${currentPrice.toFixed(2)}/kg esta fuera de 2 desviaciones del promedio S/${avgPrice.toFixed(2)}/kg`,
			details: { currentPrice, avgPrice, stddev, deviation },
		};
	}

	return null;
}

/**
 * Check if the farmer has submitted too many transactions recently.
 * Flags if 3 or more other transactions in the last 24 hours.
 */
async function checkFrequency(
	txn: TransactionRow,
): Promise<IntegrityFlag | null> {
	const twentyFourHoursAgo = new Date(
		txn.createdAt.getTime() - 24 * 60 * 60 * 1000,
	);

	const [result] = await db
		.select({
			count: sql<number>`count(*)::int`,
		})
		.from(transaction)
		.where(
			and(
				eq(transaction.farmerId, txn.farmerId),
				ne(transaction.id, txn.id),
				gte(transaction.createdAt, twentyFourHoursAgo),
			),
		);

	if (!result || result.count < 3) {
		return null;
	}

	return {
		transactionUuid: txn.uuid,
		farmerId: txn.farmerId,
		flagType: "high_frequency",
		message: `Alta frecuencia: ${result.count + 1} transacciones en las ultimas 24 horas`,
		details: { recentCount: result.count + 1 },
	};
}

// ─── Public API ──────────────────────────────────────────────────────

/**
 * Run all integrity checks on a transaction after insert.
 * Sets integrityStatus to "flagged" if any flags, "confirmed" otherwise.
 * Returns all generated flags.
 */
export async function checkTransaction(
	transactionId: number,
): Promise<IntegrityFlag[]> {
	const [txn] = await db
		.select()
		.from(transaction)
		.where(eq(transaction.id, transactionId))
		.limit(1);

	if (!txn) {
		return [];
	}

	const results = await Promise.all([
		checkVolumeSpike(txn),
		checkPriceOutlier(txn),
		checkFrequency(txn),
	]);

	const flags = results.filter((flag): flag is IntegrityFlag => flag !== null);

	const newStatus = flags.length > 0 ? "flagged" : "confirmed";

	await db
		.update(transaction)
		.set({ integrityStatus: newStatus })
		.where(eq(transaction.id, transactionId));

	return flags;
}

/**
 * Compute trust score for a farmer.
 * Formula: clamp(50 + confirmed - 5 * flagged, 0, 100)
 * New farmer with 0 transactions gets score 50.
 */
export async function computeTrustScore(
	farmerId: string,
): Promise<TrustScoreResult> {
	const [result] = await db
		.select({
			totalCount: sql<number>`count(*)::int`,
			confirmedCount: sql<number>`count(case when ${transaction.integrityStatus} = 'confirmed' then 1 end)::int`,
			flaggedCount: sql<number>`count(case when ${transaction.integrityStatus} = 'flagged' then 1 end)::int`,
		})
		.from(transaction)
		.where(eq(transaction.farmerId, farmerId));

	const totalCount = result?.totalCount ?? 0;
	const confirmedCount = result?.confirmedCount ?? 0;
	const flaggedCount = result?.flaggedCount ?? 0;

	const trustScore = clamp(50 + confirmedCount - 5 * flaggedCount, 0, 100);

	return {
		farmerId,
		trustScore,
		confirmedCount,
		flaggedCount,
		totalCount,
	};
}

/**
 * Cross-validation: compare farmer's production vs cooperative total per product.
 * Flags if farmer accounts for > 50% of cooperative's volume for any product.
 */
export async function checkCrossValidation(
	farmerId: string,
	cooperativeId: string,
	period: { start: string; end: string },
): Promise<IntegrityFlag[]> {
	// Get farmer's totals per product in period
	const farmerTotals = await db
		.select({
			product: transaction.product,
			totalKg: sql<string>`sum(${transaction.quantityKg})`,
		})
		.from(transaction)
		.where(
			and(
				eq(transaction.farmerId, farmerId),
				eq(transaction.cooperativeId, cooperativeId),
				gte(transaction.date, period.start),
				sql`${transaction.date} <= ${period.end}`,
			),
		)
		.groupBy(transaction.product);

	// Get cooperative totals per product in period
	const coopTotals = await db
		.select({
			product: transaction.product,
			totalKg: sql<string>`sum(${transaction.quantityKg})`,
		})
		.from(transaction)
		.where(
			and(
				eq(transaction.cooperativeId, cooperativeId),
				gte(transaction.date, period.start),
				sql`${transaction.date} <= ${period.end}`,
			),
		)
		.groupBy(transaction.product);

	const coopMap = new Map<string, number>();
	for (const row of coopTotals) {
		coopMap.set(row.product, Number(row.totalKg));
	}

	const flags: IntegrityFlag[] = [];

	for (const row of farmerTotals) {
		const farmerKg = Number(row.totalKg);
		const coopKg = coopMap.get(row.product) ?? 0;

		if (coopKg > 0 && farmerKg / coopKg > 0.5) {
			flags.push({
				transactionUuid: "",
				farmerId,
				flagType: "cross_validation_excess",
				message: `Concentracion excesiva: ${row.product} — agricultor representa ${((farmerKg / coopKg) * 100).toFixed(1)}% del volumen de la cooperativa`,
				details: {
					farmerKg,
					coopKg,
					percentage: (farmerKg / coopKg) * 100,
				},
			});
		}
	}

	return flags;
}
