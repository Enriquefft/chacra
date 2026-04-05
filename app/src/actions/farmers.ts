"use server";

import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cooperative, transaction, user } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getPriceBenchmark } from "@/lib/prices";
import type {
	ActionResult,
	FarmerListItem,
	FarmerProfile,
	PriceBenchmark,
	ProductPriceData,
	ScoringFarmerItem,
	Tier,
} from "@/lib/types";

// ─── getFarmersForCooperative ────────────────────────────────────────

export async function getFarmersForCooperative(options?: {
	search?: string;
}): Promise<ActionResult<{ farmers: FarmerListItem[] }>> {
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
			trustScore: sql<number>`GREATEST(0, LEAST(100, 50 + COUNT(CASE WHEN ${transaction.integrityStatus} = 'confirmed' THEN 1 END) - 5 * COUNT(CASE WHEN ${transaction.integrityStatus} = 'flagged' THEN 1 END)))::int`,
			flaggedCount: sql<number>`COUNT(CASE WHEN ${transaction.integrityStatus} = 'flagged' THEN 1 END)::int`,
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

	const conditions = [eq(user.id, farmerId), eq(user.role, "farmer")];

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
			farmerPhone: user.farmerPhone,
			farmerCrops: user.farmerCrops,
			farmerDistrict: user.farmerDistrict,
			farmerExperience: user.farmerExperience,
			farmerLandOwnership: user.farmerLandOwnership,
			farmerHectares: user.farmerHectares,
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
			farmerPhone: result.farmerPhone,
			farmerCrops: result.farmerCrops,
			farmerDistrict: result.farmerDistrict,
			farmerExperience: result.farmerExperience,
			farmerLandOwnership: result.farmerLandOwnership,
			farmerHectares: result.farmerHectares
				? Number(result.farmerHectares)
				: null,
		},
	};
}

// ─── getAllFarmersForScoring ─────────────────────────────────────────

export async function getAllFarmersForScoring(opts?: {
	search?: string;
}): Promise<ActionResult<{ farmers: ScoringFarmerItem[] }>> {
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
			avgMonthlyRevenue: sql<string>`COALESCE(
					CASE WHEN COUNT(DISTINCT to_char(${transaction.date}::date, 'YYYY-MM')) > 0
					THEN SUM(${transaction.quantityKg} * ${transaction.pricePerKg}) / COUNT(DISTINCT to_char(${transaction.date}::date, 'YYYY-MM'))
					ELSE 0
					END,
				0)`,
			activeMonths: sql<number>`COUNT(DISTINCT to_char(${transaction.date}::date, 'YYYY-MM'))::int`,
			trustScore: sql<number>`GREATEST(0, LEAST(100, 50 + COUNT(CASE WHEN ${transaction.integrityStatus} = 'confirmed' THEN 1 END) - 5 * COUNT(CASE WHEN ${transaction.integrityStatus} = 'flagged' THEN 1 END)))::int`,
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
		if (activeMonths >= 6 && avgMonthlyRevenue >= 500 && trustScore >= 70) {
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

// ─── updateFarmerProfile ────────────────────────────────────────────

const LAND_OWNERSHIP_VALUES = ["propia", "alquilada", "comunal"] as const;

export async function updateFarmerProfile(data: {
	farmerPhone?: string;
	farmerCrops?: string;
	farmerDistrict?: string;
	farmerExperience?: number;
	farmerLandOwnership?: string;
}): Promise<ActionResult<void>> {
	const session = await getSession();
	if (!session || session.user.role !== "farmer") {
		return { error: "No autorizado" };
	}

	const updates: Record<string, unknown> = {};

	if (data.farmerPhone !== undefined) {
		const phone = data.farmerPhone.trim();
		if (phone && (phone.length < 6 || phone.length > 20)) {
			return { error: "Telefono debe tener entre 6 y 20 caracteres" };
		}
		updates.farmerPhone = phone || null;
	}

	if (data.farmerCrops !== undefined) {
		const crops = data.farmerCrops.trim();
		if (crops && crops.length > 200) {
			return { error: "Cultivos excede 200 caracteres" };
		}
		updates.farmerCrops = crops || null;
	}

	if (data.farmerDistrict !== undefined) {
		const district = data.farmerDistrict.trim();
		if (district && district.length > 200) {
			return { error: "Distrito excede 200 caracteres" };
		}
		updates.farmerDistrict = district || null;
	}

	if (data.farmerExperience !== undefined) {
		const exp = data.farmerExperience;
		if (exp !== null && (exp < 0 || exp > 100 || !Number.isInteger(exp))) {
			return { error: "Experiencia debe ser un numero entero entre 0 y 100" };
		}
		updates.farmerExperience = exp;
	}

	if (data.farmerLandOwnership !== undefined) {
		const ownership = data.farmerLandOwnership;
		if (
			ownership &&
			!LAND_OWNERSHIP_VALUES.includes(
				ownership as (typeof LAND_OWNERSHIP_VALUES)[number],
			)
		) {
			return { error: "Tenencia de tierra no valida" };
		}
		updates.farmerLandOwnership = ownership || null;
	}

	if (Object.keys(updates).length === 0) {
		return { success: true, data: undefined };
	}

	await db.update(user).set(updates).where(eq(user.id, session.user.id));

	revalidatePath("/farmer");

	return { success: true, data: undefined };
}

// ─── getFarmerPriceData ─────────────────────────────────────────────

export async function getFarmerPriceData(): Promise<
	ActionResult<{ products: ProductPriceData[] }>
> {
	const session = await getSession();
	if (!session || session.user.role !== "farmer") {
		return { error: "No autorizado" };
	}
	if (!session.user.cooperativeId) {
		return { error: "No hay cooperativa asociada" };
	}

	// Get cooperative info (product list + region)
	const [coop] = await db
		.select({
			productList: cooperative.productList,
			region: cooperative.region,
		})
		.from(cooperative)
		.where(eq(cooperative.id, session.user.cooperativeId))
		.limit(1);

	if (!coop) {
		return { error: "Cooperativa no encontrada" };
	}

	const products = coop.productList ?? [];
	if (products.length === 0) {
		return { success: true, data: { products: [] } };
	}

	// Fetch benchmarks and farmer's last prices in parallel
	const [benchmarks, farmerTransactions] = await Promise.all([
		Promise.all(
			products.map((product) => getPriceBenchmark(product, coop.region)),
		),
		db
			.select({
				product: transaction.product,
				pricePerKg: transaction.pricePerKg,
				date: transaction.date,
			})
			.from(transaction)
			.where(eq(transaction.farmerId, session.user.id))
			.orderBy(desc(transaction.date)),
	]);

	// Build lookup: product -> last two prices (skip photo-only transactions)
	const pricesByProduct = new Map<
		string,
		{ lastPrice: number; lastDate: string; previousPrice: number | null }
	>();
	for (const tx of farmerTransactions) {
		if (tx.product == null || tx.pricePerKg == null) continue;
		const existing = pricesByProduct.get(tx.product);
		if (!existing) {
			pricesByProduct.set(tx.product, {
				lastPrice: Number(tx.pricePerKg),
				lastDate: tx.date,
				previousPrice: null,
			});
		} else if (existing.previousPrice === null) {
			existing.previousPrice = Number(tx.pricePerKg);
		}
	}

	const result: ProductPriceData[] = products.map((product, i) => {
		const farmerData = pricesByProduct.get(product);
		return {
			product,
			benchmark: benchmarks[i],
			lastPrice: farmerData?.lastPrice ?? null,
			lastDate: farmerData?.lastDate ?? null,
			previousPrice: farmerData?.previousPrice ?? null,
		};
	});

	return { success: true, data: { products: result } };
}
