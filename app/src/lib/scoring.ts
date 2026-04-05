import { and, asc, eq, ne, sql } from "drizzle-orm";
import { inputAdvance, transaction } from "@/db/schema";
import { db } from "@/lib/db";
import { computeTrustScore } from "@/lib/integrity";
import type { CreditScore, RevenueTrend, Tier } from "@/lib/types";

/**
 * Compute credit score for a producer.
 *
 * Steps:
 * 1. Get trust score from integrity module
 * 2. Fetch all non-flagged transactions ordered by date
 * 3. Fetch all input advances (expenses)
 * 4. Compute metrics: active months, avg monthly revenue, crop diversity,
 *    revenue trend, consistency, net margin, margin ratio
 * 5. Assign tier (A/B/C) and loan range based on net margin
 */
export async function computeCreditScore(
	producerId: string,
): Promise<CreditScore> {
	const [{ trustScore }, rows, expenseData] = await Promise.all([
		computeTrustScore(producerId),
		db
			.select()
			.from(transaction)
			.where(
				and(
					eq(transaction.producerId, producerId),
					ne(transaction.integrityStatus, "flagged"),
				),
			)
			.orderBy(asc(transaction.date)),
		db
			.select({
				category: inputAdvance.category,
				totalAmount: sql<string>`COALESCE(sum(${inputAdvance.amount}), 0)`,
			})
			.from(inputAdvance)
			.where(eq(inputAdvance.producerId, producerId))
			.groupBy(inputAdvance.category),
	]);

	// Compute expense breakdown and total
	const expenseBreakdown = expenseData.map((row) => ({
		category: row.category,
		total: Number(row.totalAmount),
	}));
	const totalExpenses = expenseBreakdown.reduce(
		(sum, item) => sum + item.total,
		0,
	);

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
			totalRevenue: 0,
			totalExpenses,
			netMargin: -totalExpenses,
			marginRatio: 0,
			expenseBreakdown,
		};
	}

	const totalTransactions = rows.length;

	// Group revenue by YYYY-MM (skip photo-only transactions without manual data)
	const revenueByMonth = new Map<string, number>();
	const products = new Set<string>();

	for (const row of rows) {
		if (
			row.quantityKg == null ||
			row.pricePerKg == null ||
			row.product == null
		) {
			continue; // Photo-only transaction — no revenue data
		}
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

	// Net margin = total revenue - total expenses
	const netMargin = totalRevenue - totalExpenses;
	const marginRatio =
		totalRevenue > 0 ? Math.round((netMargin / totalRevenue) * 1000) / 1000 : 0;

	// Revenue trend: compare avg of recent half vs older half
	const revenueTrend = computeRevenueTrend(revenueByMonth);

	// Consistency: months with transactions / total month span
	const consistency = computeConsistency(revenueByMonth);

	// Assign tier (now factors in margin)
	const tier = assignTier(
		activeMonths,
		avgMonthlyRevenue,
		trustScore,
		consistency,
		netMargin,
	);

	// Loan range based on net margin, not gross revenue
	const estimatedLoanRange = computeLoanRange(
		tier,
		netMargin,
		activeMonths,
		marginRatio,
	);

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
		totalRevenue: Math.round(totalRevenue * 100) / 100,
		totalExpenses: Math.round(totalExpenses * 100) / 100,
		netMargin: Math.round(netMargin * 100) / 100,
		marginRatio,
		expenseBreakdown,
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
 * A: activeMonths >= 6, avgMonthlyRevenue >= 500, trustScore >= 70, consistency >= 60, margin > 0
 * B: activeMonths >= 3, avgMonthlyRevenue >= 200, trustScore >= 40
 * C: everything else
 */
function assignTier(
	activeMonths: number,
	avgMonthlyRevenue: number,
	trustScore: number,
	consistency: number,
	netMargin: number,
): Tier {
	if (
		activeMonths >= 6 &&
		avgMonthlyRevenue >= 500 &&
		trustScore >= 70 &&
		consistency >= 60 &&
		netMargin > 0
	) {
		return "A";
	}

	if (activeMonths >= 3 && avgMonthlyRevenue >= 200 && trustScore >= 40) {
		return "B";
	}

	return "C";
}

/**
 * Compute estimated loan range based on tier, net margin, and active months.
 * Uses net margin (revenue - expenses) as the base, not gross revenue.
 * A: 2x-6x avg monthly net margin
 * B: 1x-3x avg monthly net margin
 * C: null (not eligible)
 *
 * If marginRatio < 0.2 (expenses eat >80% of revenue), cap loan max at 50%.
 */
function computeLoanRange(
	tier: Tier,
	netMargin: number,
	activeMonths: number,
	marginRatio: number,
): { min: number; max: number } | null {
	if (tier === "C" || netMargin <= 0 || activeMonths === 0) {
		return null;
	}

	const avgMonthlyNet = netMargin / activeMonths;

	let min: number;
	let max: number;

	switch (tier) {
		case "A":
			min = Math.round(avgMonthlyNet * 2);
			max = Math.round(avgMonthlyNet * 6);
			break;
		case "B":
			min = Math.round(avgMonthlyNet * 1);
			max = Math.round(avgMonthlyNet * 3);
			break;
	}

	// If expenses eat >80% of revenue, cap the loan range lower
	if (marginRatio < 0.2 && marginRatio > 0) {
		max = Math.round(max * 0.5);
		if (min > max) {
			min = max;
		}
	}

	// Ensure non-negative
	min = Math.max(0, min);
	max = Math.max(0, max);

	if (max === 0) {
		return null;
	}

	return { min, max };
}
