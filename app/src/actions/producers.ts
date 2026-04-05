"use server";

import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cooperative, transaction, user } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getPriceBenchmark } from "@/lib/prices";
import type {
	ActionResult,
	PriceBenchmark,
	ProducerListItem,
	ProducerProfile,
	ProductPriceData,
	ScoringProducerItem,
	Tier,
} from "@/lib/types";

// ─── getProducersForCooperative ────────────────────────────────────────

export async function getProducersForCooperative(options?: {
	search?: string;
}): Promise<ActionResult<{ producers: ProducerListItem[] }>> {
	const session = await getSession();
	if (!session || session.user.role !== "cooperative") {
		return { error: "No autorizado" };
	}
	if (!session.user.cooperativeId) {
		return { error: "No hay cooperativa asociada" };
	}

	const conditions = [
		eq(user.cooperativeId, session.user.cooperativeId),
		eq(user.role, "producer"),
	];

	if (options?.search) {
		const searchTerm = `%${options.search}%`;
		conditions.push(ilike(user.producerName, searchTerm));
	}

	const whereClause = and(...conditions);

	const rows = await db
		.select({
			id: user.id,
			name: user.producerName,
			region: user.producerRegion,
			email: user.email,
			transactionCount: sql<number>`count(${transaction.id})::int`,
			lastTransactionDate: sql<string | null>`max(${transaction.date})`,
			trustScore: sql<number>`GREATEST(0, LEAST(100, 50 + COUNT(CASE WHEN ${transaction.integrityStatus} = 'confirmed' THEN 1 END) - 5 * COUNT(CASE WHEN ${transaction.integrityStatus} = 'flagged' THEN 1 END)))::int`,
			flaggedCount: sql<number>`COUNT(CASE WHEN ${transaction.integrityStatus} = 'flagged' THEN 1 END)::int`,
		})
		.from(user)
		.leftJoin(transaction, eq(user.id, transaction.producerId))
		.where(whereClause)
		.groupBy(user.id);

	const producers: ProducerListItem[] = rows.map((row) => ({
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

	return { success: true, data: { producers } };
}

// ─── getProducerProfile ────────────────────────────────────────────────

export async function getProducerProfile(
	producerId: string,
): Promise<ActionResult<ProducerProfile>> {
	const session = await getSession();
	if (!session) {
		return { error: "No autorizado" };
	}

	const role = session.user.role;

	if (role !== "cooperative" && role !== "financiera") {
		return { error: "No autorizado" };
	}

	const conditions = [eq(user.id, producerId), eq(user.role, "producer")];

	// Cooperative can only see producers in their cooperative
	if (role === "cooperative") {
		if (!session.user.cooperativeId) {
			return { error: "No hay cooperativa asociada" };
		}
		conditions.push(eq(user.cooperativeId, session.user.cooperativeId));
	}

	const [result] = await db
		.select({
			id: user.id,
			name: user.producerName,
			email: user.email,
			region: user.producerRegion,
			cooperativeId: user.cooperativeId,
			cooperativeName: cooperative.name,
			createdAt: user.createdAt,
			producerPhone: user.producerPhone,
			producerCrops: user.producerCrops,
			producerDistrict: user.producerDistrict,
			producerExperience: user.producerExperience,
			producerLandOwnership: user.producerLandOwnership,
			producerHectares: user.producerHectares,
		})
		.from(user)
		.innerJoin(cooperative, eq(user.cooperativeId, cooperative.id))
		.where(and(...conditions))
		.limit(1);

	if (!result) {
		return { error: "Productor no encontrado" };
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
			producerPhone: result.producerPhone,
			producerCrops: result.producerCrops,
			producerDistrict: result.producerDistrict,
			producerExperience: result.producerExperience,
			producerLandOwnership: result.producerLandOwnership,
			producerHectares: result.producerHectares
				? Number(result.producerHectares)
				: null,
		},
	};
}

// ─── getAllProducersForScoring ─────────────────────────────────────────

export async function getAllProducersForScoring(opts?: {
	search?: string;
}): Promise<ActionResult<{ producers: ScoringProducerItem[] }>> {
	const session = await getSession();
	if (!session || session.user.role !== "financiera") {
		return { error: "No autorizado" };
	}

	const conditions = [eq(user.role, "producer")];

	if (opts?.search) {
		const searchTerm = `%${opts.search}%`;
		conditions.push(ilike(user.producerName, searchTerm));
	}

	const rows = await db
		.select({
			id: user.id,
			name: user.producerName,
			region: user.producerRegion,
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
		.leftJoin(transaction, eq(user.id, transaction.producerId))
		.where(and(...conditions))
		.groupBy(user.id, cooperative.name);

	const producers: ScoringProducerItem[] = rows.map((row) => {
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

	return { success: true, data: { producers } };
}

// ─── updateProducerProfile ────────────────────────────────────────────

const LAND_OWNERSHIP_VALUES = ["propia", "alquilada", "comunal"] as const;

export async function updateProducerProfile(data: {
	producerPhone?: string;
	producerCrops?: string;
	producerDistrict?: string;
	producerExperience?: number;
	producerLandOwnership?: string;
}): Promise<ActionResult<void>> {
	const session = await getSession();
	if (!session || session.user.role !== "producer") {
		return { error: "No autorizado" };
	}

	const updates: Record<string, unknown> = {};

	if (data.producerPhone !== undefined) {
		const phone = data.producerPhone.trim();
		if (phone && (phone.length < 6 || phone.length > 20)) {
			return { error: "Telefono debe tener entre 6 y 20 caracteres" };
		}
		updates.producerPhone = phone || null;
	}

	if (data.producerCrops !== undefined) {
		const crops = data.producerCrops.trim();
		if (crops && crops.length > 200) {
			return { error: "Cultivos excede 200 caracteres" };
		}
		updates.producerCrops = crops || null;
	}

	if (data.producerDistrict !== undefined) {
		const district = data.producerDistrict.trim();
		if (district && district.length > 200) {
			return { error: "Distrito excede 200 caracteres" };
		}
		updates.producerDistrict = district || null;
	}

	if (data.producerExperience !== undefined) {
		const exp = data.producerExperience;
		if (exp !== null && (exp < 0 || exp > 100 || !Number.isInteger(exp))) {
			return { error: "Experiencia debe ser un numero entero entre 0 y 100" };
		}
		updates.producerExperience = exp;
	}

	if (data.producerLandOwnership !== undefined) {
		const ownership = data.producerLandOwnership;
		if (
			ownership &&
			!LAND_OWNERSHIP_VALUES.includes(
				ownership as (typeof LAND_OWNERSHIP_VALUES)[number],
			)
		) {
			return { error: "Tenencia de tierra no valida" };
		}
		updates.producerLandOwnership = ownership || null;
	}

	if (Object.keys(updates).length === 0) {
		return { success: true, data: undefined };
	}

	await db.update(user).set(updates).where(eq(user.id, session.user.id));

	revalidatePath("/productor");

	return { success: true, data: undefined };
}

// ─── getProducerPriceData ─────────────────────────────────────────────

export async function getProducerPriceData(): Promise<
	ActionResult<{ products: ProductPriceData[] }>
> {
	const session = await getSession();
	if (!session || session.user.role !== "producer") {
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

	// Fetch benchmarks and producer's last prices in parallel
	const [benchmarks, producerTransactions] = await Promise.all([
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
			.where(eq(transaction.producerId, session.user.id))
			.orderBy(desc(transaction.date)),
	]);

	// Build lookup: product -> last two prices (skip photo-only transactions)
	const pricesByProduct = new Map<
		string,
		{ lastPrice: number; lastDate: string; previousPrice: number | null }
	>();
	for (const tx of producerTransactions) {
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
		const producerData = pricesByProduct.get(product);
		return {
			product,
			benchmark: benchmarks[i],
			lastPrice: producerData?.lastPrice ?? null,
			lastDate: producerData?.lastDate ?? null,
			previousPrice: producerData?.previousPrice ?? null,
		};
	});

	return { success: true, data: { products: result } };
}
