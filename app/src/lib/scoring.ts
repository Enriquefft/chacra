import { and, asc, eq, ne } from "drizzle-orm";
import { transaction } from "@/db/schema";
import { db } from "@/lib/db";
import { computeTrustScore } from "@/lib/integrity";
import type { CreditScore, RevenueTrend, Tier } from "@/lib/types";

/**
 * Compute credit score for a farmer.
 *
 * Steps:
 * 1. Get trust score from integrity module
 * 2. Fetch all non-flagged transactions ordered by date
 * 3. Compute metrics: active months, avg monthly revenue, crop diversity,
 *    revenue trend, consistency
 * 4. Assign tier (A/B/C) and loan range
 */
export async function computeCreditScore(
	farmerId: string,
): Promise<CreditScore> {
	const { trustScore } = await computeTrustScore(farmerId);

	const rows = await db
		.select()
		.from(transaction)
		.where(
			and(
				eq(transaction.farmerId, farmerId),
				ne(transaction.integrityStatus, "flagged"),
			),
		)
		.orderBy(asc(transaction.date));

	// Edge case: no valid transactions
	if (rows.length === 0) {
		return {
			tier: "C",
			totalTransactions: 0,
			activeMonths: 0,
			avgMonthlyRevenue: 0,
			revenueTrend: "stable",
			cropDiversity: 0,
			consistency: 0,
			trustScore,
			estimatedLoanRange: null,
		};
	}

	const totalTransactions = rows.length;

	// Group revenue by YYYY-MM
	const revenueByMonth = new Map<string, number>();
	const products = new Set<string>();

	for (const row of rows) {
		const qty = Number(row.quantityKg);
		const price = Number(row.pricePerKg);
		const revenue = qty * price;
		const month = row.date.slice(0, 7); // YYYY-MM

		revenueByMonth.set(month, (revenueByMonth.get(month) ?? 0) + revenue);
		products.add(row.product);
	}

	const activeMonths = revenueByMonth.size;
	const cropDiversity = products.size;

	const totalRevenue = Array.from(revenueByMonth.values()).reduce(
		(sum, r) => sum + r,
		0,
	);
	const avgMonthlyRevenue =
		activeMonths > 0
			? Math.round((totalRevenue / activeMonths) * 100) / 100
			: 0;

	// Revenue trend: compare avg of recent half vs older half
	const revenueTrend = computeRevenueTrend(revenueByMonth);

	// Consistency: months with transactions / total month span
	const consistency = computeConsistency(revenueByMonth);

	// Assign tier
	const tier = assignTier(
		activeMonths,
		avgMonthlyRevenue,
		trustScore,
		consistency,
	);

	// Loan range
	const estimatedLoanRange = computeLoanRange(tier, avgMonthlyRevenue);

	return {
		tier,
		totalTransactions,
		activeMonths,
		avgMonthlyRevenue,
		revenueTrend,
		cropDiversity,
		consistency,
		trustScore,
		estimatedLoanRange,
	};
}

/**
 * Compare average revenue of recent half of months vs older half.
 * > 10% change = "up", < -10% = "down", else "stable".
 * If < 2 months data, always "stable".
 */
function computeRevenueTrend(
	revenueByMonth: Map<string, number>,
): RevenueTrend {
	const months = Array.from(revenueByMonth.keys()).sort();
	if (months.length < 2) {
		return "stable";
	}

	const mid = Math.floor(months.length / 2);
	const olderMonths = months.slice(0, mid);
	const recentMonths = months.slice(mid);

	const olderAvg =
		olderMonths.reduce((sum, m) => sum + (revenueByMonth.get(m) ?? 0), 0) /
		olderMonths.length;
	const recentAvg =
		recentMonths.reduce((sum, m) => sum + (revenueByMonth.get(m) ?? 0), 0) /
		recentMonths.length;

	if (olderAvg === 0) {
		return recentAvg > 0 ? "up" : "stable";
	}

	const change = (recentAvg - olderAvg) / olderAvg;

	if (change > 0.1) return "up";
	if (change < -0.1) return "down";
	return "stable";
}

/**
 * Consistency: (months with transactions / total month span) * 100.
 * If span <= 1 month, consistency = 100.
 */
function computeConsistency(revenueByMonth: Map<string, number>): number {
	const months = Array.from(revenueByMonth.keys()).sort();
	if (months.length <= 1) {
		return months.length === 1 ? 100 : 0;
	}

	const first = months[0];
	const last = months[months.length - 1];

	const [firstYear, firstMonth] = first.split("-").map(Number);
	const [lastYear, lastMonth] = last.split("-").map(Number);

	const totalSpan = (lastYear - firstYear) * 12 + (lastMonth - firstMonth) + 1;

	if (totalSpan <= 1) {
		return 100;
	}

	return Math.round((months.length / totalSpan) * 100);
}

/**
 * Assign credit tier based on metrics.
 * A: activeMonths >= 6, avgMonthlyRevenue >= 500, trustScore >= 70, consistency >= 60
 * B: activeMonths >= 3, avgMonthlyRevenue >= 200, trustScore >= 40
 * C: everything else
 */
function assignTier(
	activeMonths: number,
	avgMonthlyRevenue: number,
	trustScore: number,
	consistency: number,
): Tier {
	if (
		activeMonths >= 6 &&
		avgMonthlyRevenue >= 500 &&
		trustScore >= 70 &&
		consistency >= 60
	) {
		return "A";
	}

	if (activeMonths >= 3 && avgMonthlyRevenue >= 200 && trustScore >= 40) {
		return "B";
	}

	return "C";
}

/**
 * Compute estimated loan range based on tier and avg monthly revenue.
 * A: 2x-6x avg monthly revenue
 * B: 1x-3x avg monthly revenue
 * C: null (not eligible)
 */
function computeLoanRange(
	tier: Tier,
	avgMonthlyRevenue: number,
): { min: number; max: number } | null {
	switch (tier) {
		case "A":
			return {
				min: Math.round(avgMonthlyRevenue * 2),
				max: Math.round(avgMonthlyRevenue * 6),
			};
		case "B":
			return {
				min: Math.round(avgMonthlyRevenue * 1),
				max: Math.round(avgMonthlyRevenue * 3),
			};
		case "C":
			return null;
	}
}
