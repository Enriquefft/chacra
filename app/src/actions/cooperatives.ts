"use server";

import { and, count, countDistinct, eq, gte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cooperative, transaction, user } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ActionResult, CooperativeStats } from "@/lib/types";

// ─── getProductListForFarmer ─────────────────────────────────────────

export async function getProductListForFarmer(): Promise<
	ActionResult<{ products: string[] }>
> {
	const session = await getSession();
	if (!session || session.user.role !== "farmer") {
		return { error: "No autorizado" };
	}
	if (!session.user.cooperativeId) {
		return { error: "No hay cooperativa asociada" };
	}

	const [coop] = await db
		.select({ productList: cooperative.productList })
		.from(cooperative)
		.where(eq(cooperative.id, session.user.cooperativeId))
		.limit(1);

	if (!coop) {
		return { error: "Cooperativa no encontrada" };
	}

	return { success: true, data: { products: coop.productList ?? [] } };
}

// ─── getMonthlyProduction ────────────────────────────────────────────

export async function getMonthlyProduction(): Promise<
	ActionResult<{
		months: Array<{ month: string; product: string; totalKg: number }>;
	}>
> {
	const session = await getSession();
	if (!session || session.user.role !== "cooperative") {
		return { error: "No autorizado" };
	}
	if (!session.user.cooperativeId) {
		return { error: "No hay cooperativa asociada" };
	}

	const twelveMonthsAgo = new Date();
	twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
	const cutoff = twelveMonthsAgo.toISOString().split("T")[0];

	const rows = await db
		.select({
			month: sql<string>`to_char(${transaction.date}::date, 'YYYY-MM')`,
			product: transaction.product,
			totalKg: sql<string>`COALESCE(SUM(${transaction.quantityKg}), 0)`,
		})
		.from(transaction)
		.where(
			and(
				eq(transaction.cooperativeId, session.user.cooperativeId),
				gte(transaction.date, cutoff),
			),
		)
		.groupBy(
			sql`to_char(${transaction.date}::date, 'YYYY-MM')`,
			transaction.product,
		)
		.orderBy(sql`to_char(${transaction.date}::date, 'YYYY-MM') ASC`);

	const months = rows.map((row) => ({
		month: row.month,
		product: row.product,
		totalKg: Number(row.totalKg),
	}));

	return { success: true, data: { months } };
}

export async function addProduct(
	product: string,
): Promise<{ error?: string; success?: boolean }> {
	const session = await getSession();
	if (!session || session.user.role !== "cooperative") {
		return { error: "No autorizado" };
	}
	if (!session.user.cooperativeId) {
		return { error: "No hay cooperativa asociada" };
	}

	const trimmed = product.trim();
	if (!trimmed) {
		return { error: "El nombre del producto es requerido" };
	}

	const [coop] = await db
		.select({ productList: cooperative.productList })
		.from(cooperative)
		.where(eq(cooperative.id, session.user.cooperativeId))
		.limit(1);

	if (!coop) {
		return { error: "Cooperativa no encontrada" };
	}

	const currentProducts = coop.productList ?? [];
	if (currentProducts.includes(trimmed)) {
		return { error: "Este producto ya existe" };
	}

	await db
		.update(cooperative)
		.set({ productList: [...currentProducts, trimmed] })
		.where(eq(cooperative.id, session.user.cooperativeId));

	revalidatePath("/dashboard/settings");
	return { success: true };
}

export async function removeProduct(
	product: string,
): Promise<{ error?: string; success?: boolean }> {
	const session = await getSession();
	if (!session || session.user.role !== "cooperative") {
		return { error: "No autorizado" };
	}
	if (!session.user.cooperativeId) {
		return { error: "No hay cooperativa asociada" };
	}

	const [coop] = await db
		.select({ productList: cooperative.productList })
		.from(cooperative)
		.where(eq(cooperative.id, session.user.cooperativeId))
		.limit(1);

	if (!coop) {
		return { error: "Cooperativa no encontrada" };
	}

	const currentProducts = coop.productList ?? [];
	const updated = currentProducts.filter((p) => p !== product);

	await db
		.update(cooperative)
		.set({ productList: updated })
		.where(eq(cooperative.id, session.user.cooperativeId));

	revalidatePath("/dashboard/settings");
	return { success: true };
}

// ─── setExportGoal ───────────────────────────────────────────────────

export async function setExportGoal(
	product: string,
	targetKg: number,
): Promise<ActionResult<void>> {
	const session = await getSession();
	if (!session || session.user.role !== "cooperative") {
		return { error: "No autorizado" };
	}
	if (!session.user.cooperativeId) {
		return { error: "No hay cooperativa asociada" };
	}

	if (
		typeof targetKg !== "number" ||
		Number.isNaN(targetKg) ||
		targetKg <= 0
	) {
		return { error: "Meta debe ser un numero positivo" };
	}

	const [coop] = await db
		.select({
			productList: cooperative.productList,
			exportGoals: cooperative.exportGoals,
		})
		.from(cooperative)
		.where(eq(cooperative.id, session.user.cooperativeId))
		.limit(1);

	if (!coop) {
		return { error: "Cooperativa no encontrada" };
	}

	const validProducts = new Set<string>(coop.productList ?? []);
	if (!validProducts.has(product)) {
		return { error: "Producto no valido" };
	}

	const currentGoals = (coop.exportGoals ?? {}) as Record<string, number>;
	const updatedGoals = { ...currentGoals, [product]: targetKg };

	await db
		.update(cooperative)
		.set({ exportGoals: updatedGoals })
		.where(eq(cooperative.id, session.user.cooperativeId));

	revalidatePath("/dashboard");

	return { success: true, data: undefined };
}

// ─── removeExportGoal ────────────────────────────────────────────────

export async function removeExportGoal(
	product: string,
): Promise<ActionResult<void>> {
	const session = await getSession();
	if (!session || session.user.role !== "cooperative") {
		return { error: "No autorizado" };
	}
	if (!session.user.cooperativeId) {
		return { error: "No hay cooperativa asociada" };
	}

	const [coop] = await db
		.select({ exportGoals: cooperative.exportGoals })
		.from(cooperative)
		.where(eq(cooperative.id, session.user.cooperativeId))
		.limit(1);

	if (!coop) {
		return { error: "Cooperativa no encontrada" };
	}

	const currentGoals = (coop.exportGoals ?? {}) as Record<string, number>;
	const { [product]: _, ...updatedGoals } = currentGoals;

	await db
		.update(cooperative)
		.set({ exportGoals: updatedGoals })
		.where(eq(cooperative.id, session.user.cooperativeId));

	revalidatePath("/dashboard");

	return { success: true, data: undefined };
}

// ─── getCooperativeStats ─────────────────────────────────────────────

export async function getCooperativeStats(): Promise<
	ActionResult<CooperativeStats>
> {
	const session = await getSession();
	if (!session || session.user.role !== "cooperative") {
		return { error: "No autorizado" };
	}
	if (!session.user.cooperativeId) {
		return { error: "No hay cooperativa asociada" };
	}

	const cooperativeId = session.user.cooperativeId;
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
	const cutoff = thirtyDaysAgo.toISOString().split("T")[0];

	// Run queries in parallel
	const [
		[totalFarmersResult],
		[activeFarmersResult],
		[totalProductionResult],
		[periodRevenueResult],
		[activeAlertsResult],
		coopData,
	] = await Promise.all([
		// 1. Total farmers
		db
			.select({ total: count() })
			.from(user)
			.where(
				and(
					eq(user.cooperativeId, cooperativeId),
					eq(user.role, "farmer"),
				),
			),
		// 2. Active farmers (distinct farmer IDs in last 30 days)
		db
			.select({ total: countDistinct(transaction.farmerId) })
			.from(transaction)
			.where(
				and(
					eq(transaction.cooperativeId, cooperativeId),
					gte(transaction.date, cutoff),
				),
			),
		// 3. Total production
		db
			.select({
				total: sql<string>`COALESCE(SUM(${transaction.quantityKg}), 0)`,
			})
			.from(transaction)
			.where(eq(transaction.cooperativeId, cooperativeId)),
		// 4. Period revenue (last 30 days)
		db
			.select({
				total: sql<string>`COALESCE(SUM(${transaction.quantityKg} * ${transaction.pricePerKg}), 0)`,
			})
			.from(transaction)
			.where(
				and(
					eq(transaction.cooperativeId, cooperativeId),
					gte(transaction.date, cutoff),
				),
			),
		// 5. Active alerts (flagged transactions)
		db
			.select({ total: count() })
			.from(transaction)
			.where(
				and(
					eq(transaction.cooperativeId, cooperativeId),
					eq(transaction.integrityStatus, "flagged"),
				),
			),
		// 6. Cooperative data for export goals
		db
			.select({ exportGoals: cooperative.exportGoals })
			.from(cooperative)
			.where(eq(cooperative.id, cooperativeId))
			.limit(1),
	]);

	// Compute export goal progress
	const exportGoals = (coopData[0]?.exportGoals ?? {}) as Record<
		string,
		number
	>;
	const exportGoalProgress: CooperativeStats["exportGoalProgress"] = [];

	if (Object.keys(exportGoals).length > 0) {
		// Get production per product for this cooperative
		const productTotals = await db
			.select({
				product: transaction.product,
				totalKg: sql<string>`COALESCE(SUM(${transaction.quantityKg}), 0)`,
			})
			.from(transaction)
			.where(eq(transaction.cooperativeId, cooperativeId))
			.groupBy(transaction.product);

		const productMap = new Map<string, number>();
		for (const row of productTotals) {
			productMap.set(row.product, Number(row.totalKg));
		}

		for (const [product, targetKg] of Object.entries(exportGoals)) {
			const currentKg = productMap.get(product) ?? 0;
			exportGoalProgress.push({
				product,
				targetKg,
				currentKg,
				percentage: targetKg > 0 ? Math.round((currentKg / targetKg) * 100) : 0,
			});
		}
	}

	return {
		success: true,
		data: {
			totalFarmers: totalFarmersResult.total,
			activeFarmers: activeFarmersResult.total,
			totalProductionKg: Number(totalProductionResult.total),
			periodRevenueTotal: Number(periodRevenueResult.total),
			activeAlerts: activeAlertsResult.total,
			exportGoalProgress,
		},
	};
}
