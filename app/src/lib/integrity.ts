import { and, eq, gte, ne, sql } from "drizzle-orm";
import { transaction, user } from "@/db/schema";
import { db } from "@/lib/db";
import type { IntegrityFlag, TrustScoreResult } from "@/lib/types";

// ─── Internal helpers ────────────────────────────────────────────────

type TransactionRow = typeof transaction.$inferSelect;

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

/**
 * Check if the transaction volume is a spike compared to producer's history.
 * Flags if current quantity > 3x the producer's average for this product.
 * Requires at least 3 prior transactions to have enough history.
 */
async function checkVolumeSpike(
	txn: TransactionRow,
): Promise<IntegrityFlag | null> {
	if (txn.product == null || txn.quantityKg == null) return null;

	const [result] = await db
		.select({
			avgQty: sql<string>`avg(${transaction.quantityKg})`,
			count: sql<number>`count(*)::int`,
		})
		.from(transaction)
		.where(
			and(
				eq(transaction.producerId, txn.producerId),
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
			producerId: txn.producerId,
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
	if (txn.product == null || txn.pricePerKg == null) return null;

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
			producerId: txn.producerId,
			flagType: "price_outlier",
			message: `Precio atipico: S/${currentPrice.toFixed(2)}/kg esta fuera de 2 desviaciones del promedio S/${avgPrice.toFixed(2)}/kg`,
			details: { currentPrice, avgPrice, stddev, deviation },
		};
	}

	return null;
}

/**
 * Check if the producer has submitted too many transactions recently.
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
				eq(transaction.producerId, txn.producerId),
				ne(transaction.id, txn.id),
				gte(transaction.createdAt, twentyFourHoursAgo),
			),
		);

	if (!result || result.count < 3) {
		return null;
	}

	return {
		transactionUuid: txn.uuid,
		producerId: txn.producerId,
		flagType: "high_frequency",
		message: `Alta frecuencia: ${result.count + 1} transacciones en las ultimas 24 horas`,
		details: { recentCount: result.count + 1 },
	};
}

// ─── Plausibility checks ─────────────────────────────────────────────

/**
 * Approximate maximum yields per crop in kg/ha/year.
 * Used for physical plausibility checks against producer's declared hectareas.
 */
const MAX_YIELD_KG_PER_HA: Record<string, number> = {
	cafe: 1500,
	"caf\u00e9": 1500,
	coffee: 1500,
	cacao: 800,
	arroz: 8000,
	rice: 8000,
	maiz: 5000,
	"ma\u00edz": 5000,
	corn: 5000,
	papa: 20000,
	potato: 20000,
	palta: 12000,
	"palta hass": 12000,
	"palta fuerte": 10000,
	aguacate: 12000,
	avocado: 12000,
};
const DEFAULT_MAX_YIELD = 10000;

function getMaxYield(product: string): number {
	const key = product.toLowerCase().trim();
	return MAX_YIELD_KG_PER_HA[key] ?? DEFAULT_MAX_YIELD;
}

/**
 * Check if a single transaction volume exceeds the producer's annual capacity.
 * Annual capacity = hectareas x max yield per crop.
 * Skips if producer has no hectareas data.
 */
async function checkPlausibilitySingle(
	txn: TransactionRow,
): Promise<IntegrityFlag | null> {
	if (txn.product == null || txn.quantityKg == null) return null;

	const [producer] = await db
		.select({ hectares: user.producerHectares })
		.from(user)
		.where(eq(user.id, txn.producerId))
		.limit(1);

	if (!producer?.hectares) {
		return null;
	}

	const hectares = Number(producer.hectares);
	if (hectares <= 0) {
		return null;
	}

	const maxYield = getMaxYield(txn.product);
	const annualCapacity = hectares * maxYield;
	const currentQty = Number(txn.quantityKg);

	if (currentQty > annualCapacity) {
		return {
			transactionUuid: txn.uuid,
			producerId: txn.producerId,
			flagType: "plausibility_single",
			message: `Volumen implausible: ${currentQty} kg excede la capacidad anual estimada de ${annualCapacity.toFixed(0)} kg (${hectares} ha x ${maxYield} kg/ha)`,
			details: {
				currentQty,
				hectares,
				maxYield,
				annualCapacity,
			},
		};
	}

	return null;
}

/**
 * Check if cumulative volume in the last 12 months exceeds 1.5x annual capacity.
 * Allows some margin for timing variations, storage, etc.
 * Skips if producer has no hectareas data.
 */
async function checkPlausibilityCumulative(
	txn: TransactionRow,
): Promise<IntegrityFlag | null> {
	if (txn.product == null || txn.quantityKg == null) return null;

	const [producer] = await db
		.select({ hectares: user.producerHectares })
		.from(user)
		.where(eq(user.id, txn.producerId))
		.limit(1);

	if (!producer?.hectares) {
		return null;
	}

	const hectares = Number(producer.hectares);
	if (hectares <= 0) {
		return null;
	}

	const maxYield = getMaxYield(txn.product);
	const annualCapacity = hectares * maxYield;
	const threshold = annualCapacity * 1.5;

	// Sum all volume for this product in the last 12 months
	const twelveMonthsAgo = new Date();
	twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);
	const cutoff = twelveMonthsAgo.toISOString().split("T")[0];

	const [result] = await db
		.select({
			totalKg: sql<string>`COALESCE(sum(${transaction.quantityKg}), 0)`,
		})
		.from(transaction)
		.where(
			and(
				eq(transaction.producerId, txn.producerId),
				eq(transaction.product, txn.product),
				gte(transaction.date, cutoff),
			),
		);

	const cumulativeKg = Number(result?.totalKg ?? 0);

	if (cumulativeKg > threshold) {
		return {
			transactionUuid: txn.uuid,
			producerId: txn.producerId,
			flagType: "plausibility_cumulative",
			message: `Volumen acumulado implausible: ${cumulativeKg.toFixed(0)} kg de ${txn.product} en 12 meses excede 1.5x la capacidad anual (${threshold.toFixed(0)} kg)`,
			details: {
				cumulativeKg,
				hectares,
				maxYield,
				annualCapacity,
				threshold,
			},
		};
	}

	return null;
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

	// Skip volume/price/plausibility checks for photo-only transactions (no manual data)
	const hasManualData =
		txn.product != null && txn.quantityKg != null && txn.pricePerKg != null;

	const results = await Promise.all([
		hasManualData ? checkVolumeSpike(txn) : null,
		hasManualData ? checkPriceOutlier(txn) : null,
		checkFrequency(txn),
		hasManualData ? checkPlausibilitySingle(txn) : null,
		hasManualData ? checkPlausibilityCumulative(txn) : null,
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
 * Compute trust score for a producer.
 * Formula: clamp(50 + confirmed - 5 * flagged, 0, 100)
 * New producer with 0 transactions gets score 50.
 */
export async function computeTrustScore(
	producerId: string,
): Promise<TrustScoreResult> {
	const [result] = await db
		.select({
			totalCount: sql<number>`count(*)::int`,
			confirmedCount: sql<number>`count(case when ${transaction.integrityStatus} = 'confirmed' then 1 end)::int`,
			flaggedCount: sql<number>`count(case when ${transaction.integrityStatus} = 'flagged' then 1 end)::int`,
		})
		.from(transaction)
		.where(eq(transaction.producerId, producerId));

	const totalCount = result?.totalCount ?? 0;
	const confirmedCount = result?.confirmedCount ?? 0;
	const flaggedCount = result?.flaggedCount ?? 0;

	const trustScore = clamp(50 + confirmedCount - 5 * flaggedCount, 0, 100);

	return {
		producerId,
		trustScore,
		confirmedCount,
		flaggedCount,
		totalCount,
	};
}

/**
 * Cross-validation: compare producer's production vs cooperative total per product.
 * Flags if producer accounts for > 50% of cooperative's volume for any product.
 */
export async function checkCrossValidation(
	producerId: string,
	cooperativeId: string,
	period: { start: string; end: string },
): Promise<IntegrityFlag[]> {
	// Get producer's totals per product in period
	const producerTotals = await db
		.select({
			product: transaction.product,
			totalKg: sql<string>`sum(${transaction.quantityKg})`,
		})
		.from(transaction)
		.where(
			and(
				eq(transaction.producerId, producerId),
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
		if (row.product != null) {
			coopMap.set(row.product, Number(row.totalKg));
		}
	}

	const flags: IntegrityFlag[] = [];

	for (const row of producerTotals) {
		if (row.product == null) continue;
		const producerKg = Number(row.totalKg);
		const coopKg = coopMap.get(row.product) ?? 0;

		if (coopKg > 0 && producerKg / coopKg > 0.5) {
			flags.push({
				transactionUuid: "",
				producerId,
				flagType: "cross_validation_excess",
				message: `Concentracion excesiva: ${row.product} — productor representa ${((producerKg / coopKg) * 100).toFixed(1)}% del volumen de la cooperativa`,
				details: {
					producerKg,
					coopKg,
					percentage: (producerKg / coopKg) * 100,
				},
			});
		}
	}

	return flags;
}
