"use server";

import { and, eq, ilike, sql } from "drizzle-orm";
import { cooperative, transaction, user } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import type {
	ActionResult,
	FarmerListItem,
	FarmerProfile,
	ScoringFarmerItem,
	Tier,
} from "@/lib/types";

// ─── getFarmersForCooperative ────────────────────────────────────────

export async function getFarmersForCooperative(
	options?: { search?: string },
): Promise<ActionResult<{ farmers: FarmerListItem[] }>> {
	const session = await getSession();
	if (!session || session.user.role !== "cooperative") {
		return { error: "No autorizado" };
	}
	if (!session.user.cooperativeId) {
		return { error: "No hay cooperativa asociada" };
	}

	const conditions = [
		eq(user.cooperativeId, session.user.cooperativeId),
		eq(user.role, "farmer"),
	];

	if (options?.search) {
		const searchTerm = `%${options.search}%`;
		conditions.push(ilike(user.farmerName, searchTerm));
	}

	const whereClause = and(...conditions);

	const rows = await db
		.select({
			id: user.id,
			name: user.farmerName,
			region: user.farmerRegion,
			email: user.email,
			transactionCount: sql<number>`count(${transaction.id})::int`,
			lastTransactionDate: sql<string | null>`max(${transaction.date})`,
			trustScore:
				sql<number>`GREATEST(0, LEAST(100, 50 + COUNT(CASE WHEN ${transaction.integrityStatus} = 'confirmed' THEN 1 END) - 5 * COUNT(CASE WHEN ${transaction.integrityStatus} = 'flagged' THEN 1 END)))::int`,
			flaggedCount:
				sql<number>`COUNT(CASE WHEN ${transaction.integrityStatus} = 'flagged' THEN 1 END)::int`,
		})
		.from(user)
		.leftJoin(transaction, eq(user.id, transaction.farmerId))
		.where(whereClause)
		.groupBy(user.id);

	const farmers: FarmerListItem[] = rows.map((row) => ({
		id: row.id,
		name: row.name ?? "",
		region: row.region,
		email: row.email,
		transactionCount: row.transactionCount,
		lastTransactionDate: row.lastTransactionDate,
		trustScore: row.trustScore,
		integrityStatus:
			row.trustScore < 40 || row.flaggedCount > 0
				? "needs_attention"
				: "on_track",
	}));

	return { success: true, data: { farmers } };
}

// ─── getFarmerProfile ────────────────────────────────────────────────

export async function getFarmerProfile(
	farmerId: string,
): Promise<ActionResult<FarmerProfile>> {
	const session = await getSession();
	if (!session) {
		return { error: "No autorizado" };
	}

	const role = session.user.role;

	if (role !== "cooperative" && role !== "financiera") {
		return { error: "No autorizado" };
	}

	const conditions = [
		eq(user.id, farmerId),
		eq(user.role, "farmer"),
	];

	// Cooperative can only see farmers in their cooperative
	if (role === "cooperative") {
		if (!session.user.cooperativeId) {
			return { error: "No hay cooperativa asociada" };
		}
		conditions.push(eq(user.cooperativeId, session.user.cooperativeId));
	}

	const [result] = await db
		.select({
			id: user.id,
			name: user.farmerName,
			email: user.email,
			region: user.farmerRegion,
			cooperativeId: user.cooperativeId,
			cooperativeName: cooperative.name,
			createdAt: user.createdAt,
		})
		.from(user)
		.innerJoin(cooperative, eq(user.cooperativeId, cooperative.id))
		.where(and(...conditions))
		.limit(1);

	if (!result) {
		return { error: "Agricultor no encontrado" };
	}

	return {
		success: true,
		data: {
			id: result.id,
			name: result.name ?? "",
			email: result.email,
			region: result.region,
			cooperativeId: result.cooperativeId!,
			cooperativeName: result.cooperativeName,
			createdAt: result.createdAt,
		},
	};
}

// ─── getAllFarmersForScoring ─────────────────────────────────────────

export async function getAllFarmersForScoring(
	opts?: { search?: string },
): Promise<ActionResult<{ farmers: ScoringFarmerItem[] }>> {
	const session = await getSession();
	if (!session || session.user.role !== "financiera") {
		return { error: "No autorizado" };
	}

	const conditions = [eq(user.role, "farmer")];

	if (opts?.search) {
		const searchTerm = `%${opts.search}%`;
		conditions.push(ilike(user.farmerName, searchTerm));
	}

	const rows = await db
		.select({
			id: user.id,
			name: user.farmerName,
			region: user.farmerRegion,
			cooperativeName: cooperative.name,
			transactionCount: sql<number>`COUNT(${transaction.id})::int`,
			avgMonthlyRevenue:
				sql<string>`COALESCE(
					CASE WHEN COUNT(DISTINCT to_char(${transaction.date}::date, 'YYYY-MM')) > 0
					THEN SUM(${transaction.quantityKg} * ${transaction.pricePerKg}) / COUNT(DISTINCT to_char(${transaction.date}::date, 'YYYY-MM'))
					ELSE 0
					END,
				0)`,
			activeMonths:
				sql<number>`COUNT(DISTINCT to_char(${transaction.date}::date, 'YYYY-MM'))::int`,
			trustScore:
				sql<number>`GREATEST(0, LEAST(100, 50 + COUNT(CASE WHEN ${transaction.integrityStatus} = 'confirmed' THEN 1 END) - 5 * COUNT(CASE WHEN ${transaction.integrityStatus} = 'flagged' THEN 1 END)))::int`,
		})
		.from(user)
		.leftJoin(cooperative, eq(user.cooperativeId, cooperative.id))
		.leftJoin(transaction, eq(user.id, transaction.farmerId))
		.where(and(...conditions))
		.groupBy(user.id, cooperative.name);

	const farmers: ScoringFarmerItem[] = rows.map((row) => {
		const activeMonths = row.activeMonths;
		const avgMonthlyRevenue = Number(row.avgMonthlyRevenue);
		const trustScore = row.trustScore;

		let tier: Tier = "C";
		if (
			activeMonths >= 6 &&
			avgMonthlyRevenue >= 500 &&
			trustScore >= 70
		) {
			tier = "A";
		} else if (
			activeMonths >= 3 &&
			avgMonthlyRevenue >= 200 &&
			trustScore >= 40
		) {
			tier = "B";
		}

		return {
			id: row.id,
			name: row.name ?? "",
			region: row.region,
			cooperativeName: row.cooperativeName ?? "",
			tier,
			avgMonthlyRevenue,
			activeMonths,
			trustScore,
			transactionCount: row.transactionCount,
		};
	});

	return { success: true, data: { farmers } };
}
