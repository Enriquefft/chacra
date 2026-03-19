"use server";

import { and, count, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cooperative, transaction, user } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkTransaction } from "@/lib/integrity";
import type { ActionResult, TransactionInput } from "@/lib/types";

// ─── Internal types ──────────────────────────────────────────────────

type TransactionRow = {
	id: number;
	uuid: string;
	product: string;
	quantityKg: number;
	pricePerKg: number;
	buyer: string | null;
	date: string;
	integrityStatus: "confirmed" | "flagged" | "pending";
	createdAt: Date;
};

type TransactionWithFarmer = TransactionRow & {
	farmerId: string;
	farmerName: string | null;
};

// ─── Validation helpers ──────────────────────────────────────────────

const UUID_REGEX =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// ─── createTransaction ──────────────────────────────────────────────

export async function createTransaction(
	input: TransactionInput,
): Promise<ActionResult<{ id: number; uuid: string }>> {
	const session = await getSession();
	if (!session || session.user.role !== "farmer") {
		return { error: "No autorizado" };
	}
	if (!session.user.cooperativeId) {
		return { error: "No hay cooperativa asociada" };
	}

	// Validate UUID
	if (!input.uuid || !UUID_REGEX.test(input.uuid)) {
		return { error: "UUID invalido o ausente" };
	}

	// Validate product against cooperative's product list
	const [coop] = await db
		.select({ productList: cooperative.productList })
		.from(cooperative)
		.where(eq(cooperative.id, session.user.cooperativeId))
		.limit(1);

	if (!coop) {
		return { error: "Cooperativa no encontrada" };
	}

	const validProducts = new Set<string>(coop.productList ?? []);
	if (!input.product || !validProducts.has(input.product)) {
		return { error: "Producto no valido" };
	}

	// Validate quantityKg
	if (
		typeof input.quantityKg !== "number" ||
		Number.isNaN(input.quantityKg) ||
		input.quantityKg <= 0
	) {
		return { error: "Cantidad debe ser un numero positivo" };
	}
	if (input.quantityKg > 99999.99) {
		return { error: "Cantidad excede el maximo permitido (99999.99 kg)" };
	}

	// Validate pricePerKg
	if (
		typeof input.pricePerKg !== "number" ||
		Number.isNaN(input.pricePerKg) ||
		input.pricePerKg <= 0
	) {
		return { error: "Precio debe ser un numero positivo" };
	}
	if (input.pricePerKg > 99999.99) {
		return { error: "Precio excede el maximo permitido (S/99999.99)" };
	}

	// Validate date
	if (!input.date || !DATE_REGEX.test(input.date)) {
		return { error: "Fecha debe tener formato YYYY-MM-DD" };
	}
	const parsed = new Date(`${input.date}T00:00:00`);
	if (Number.isNaN(parsed.getTime())) {
		return { error: "Fecha invalida" };
	}
	const today = new Date();
	today.setHours(23, 59, 59, 999);
	if (parsed > today) {
		return { error: "Fecha no puede ser en el futuro" };
	}

	// Validate buyer (optional)
	let buyerValue: string | null = null;
	if (input.buyer !== undefined && input.buyer !== null) {
		const trimmedBuyer = input.buyer.trim();
		if (trimmedBuyer.length > 200) {
			return { error: "Nombre del comprador excede 200 caracteres" };
		}
		buyerValue = trimmedBuyer || null;
	}

	// Insert with UUID dedup
	const result = await db
		.insert(transaction)
		.values({
			uuid: input.uuid,
			farmerId: session.user.id,
			cooperativeId: session.user.cooperativeId,
			product: input.product,
			quantityKg: input.quantityKg.toFixed(2),
			pricePerKg: input.pricePerKg.toFixed(2),
			buyer: buyerValue,
			date: input.date,
			integrityStatus: "pending",
		})
		.onConflictDoNothing({ target: transaction.uuid })
		.returning({ id: transaction.id, uuid: transaction.uuid });

	if (result.length === 0) {
		return { error: "Transaccion duplicada" };
	}

	// Run integrity checks
	await checkTransaction(result[0].id);

	revalidatePath("/farmer");

	return { success: true, data: { id: result[0].id, uuid: result[0].uuid } };
}

// ─── getTransactionsByFarmer ─────────────────────────────────────────

export async function getTransactionsByFarmer(
	farmerId?: string,
	options?: { limit?: number; offset?: number },
): Promise<
	ActionResult<{ transactions: TransactionRow[]; total: number }>
> {
	const session = await getSession();
	if (!session) {
		return { error: "No autorizado" };
	}

	const limit = options?.limit ?? 50;
	const offset = options?.offset ?? 0;
	let targetFarmerId: string;

	if (session.user.role === "farmer") {
		// Farmers can only see their own transactions
		if (farmerId && farmerId !== session.user.id) {
			return { error: "No autorizado" };
		}
		targetFarmerId = session.user.id;
	} else if (session.user.role === "cooperative") {
		if (!farmerId) {
			return { error: "Se requiere el ID del agricultor" };
		}
		if (!session.user.cooperativeId) {
			return { error: "No hay cooperativa asociada" };
		}
		// Verify farmer belongs to the cooperative
		const [farmer] = await db
			.select({ id: user.id })
			.from(user)
			.where(
				and(
					eq(user.id, farmerId),
					eq(user.cooperativeId, session.user.cooperativeId),
					eq(user.role, "farmer"),
				),
			)
			.limit(1);
		if (!farmer) {
			return { error: "Agricultor no encontrado en la cooperativa" };
		}
		targetFarmerId = farmerId;
	} else if (session.user.role === "financiera") {
		if (!farmerId) {
			return { error: "Se requiere el ID del agricultor" };
		}
		// Verify farmer exists
		const [farmer] = await db
			.select({ id: user.id })
			.from(user)
			.where(and(eq(user.id, farmerId), eq(user.role, "farmer")))
			.limit(1);
		if (!farmer) {
			return { error: "Agricultor no encontrado" };
		}
		targetFarmerId = farmerId;
	} else {
		return { error: "No autorizado" };
	}

	const [transactions, [countResult]] = await Promise.all([
		db
			.select({
				id: transaction.id,
				uuid: transaction.uuid,
				product: transaction.product,
				quantityKg: transaction.quantityKg,
				pricePerKg: transaction.pricePerKg,
				buyer: transaction.buyer,
				date: transaction.date,
				integrityStatus: transaction.integrityStatus,
				createdAt: transaction.createdAt,
			})
			.from(transaction)
			.where(eq(transaction.farmerId, targetFarmerId))
			.orderBy(sql`${transaction.date} DESC`)
			.limit(limit)
			.offset(offset),
		db
			.select({ total: count() })
			.from(transaction)
			.where(eq(transaction.farmerId, targetFarmerId)),
	]);

	const rows: TransactionRow[] = transactions.map((t) => ({
		id: t.id,
		uuid: t.uuid,
		product: t.product,
		quantityKg: Number(t.quantityKg),
		pricePerKg: Number(t.pricePerKg),
		buyer: t.buyer,
		date: t.date,
		integrityStatus: t.integrityStatus as "confirmed" | "flagged" | "pending",
		createdAt: t.createdAt,
	}));

	return {
		success: true,
		data: { transactions: rows, total: countResult.total },
	};
}

// ─── getTransactionsByCooperative ────────────────────────────────────

export async function getTransactionsByCooperative(
	options?: {
		limit?: number;
		offset?: number;
		product?: string;
		status?: string;
	},
): Promise<
	ActionResult<{ transactions: TransactionWithFarmer[]; total: number }>
> {
	const session = await getSession();
	if (!session || session.user.role !== "cooperative") {
		return { error: "No autorizado" };
	}
	if (!session.user.cooperativeId) {
		return { error: "No hay cooperativa asociada" };
	}

	const limit = options?.limit ?? 50;
	const offset = options?.offset ?? 0;

	// Build where conditions
	const conditions = [eq(transaction.cooperativeId, session.user.cooperativeId)];

	if (options?.product) {
		conditions.push(eq(transaction.product, options.product));
	}
	if (options?.status) {
		conditions.push(
			eq(
				transaction.integrityStatus,
				options.status as "confirmed" | "flagged" | "pending",
			),
		);
	}

	const whereClause = and(...conditions);

	const [transactions, [countResult]] = await Promise.all([
		db
			.select({
				id: transaction.id,
				uuid: transaction.uuid,
				product: transaction.product,
				quantityKg: transaction.quantityKg,
				pricePerKg: transaction.pricePerKg,
				buyer: transaction.buyer,
				date: transaction.date,
				integrityStatus: transaction.integrityStatus,
				createdAt: transaction.createdAt,
				farmerId: transaction.farmerId,
				farmerName: user.farmerName,
			})
			.from(transaction)
			.innerJoin(user, eq(transaction.farmerId, user.id))
			.where(whereClause)
			.orderBy(sql`${transaction.date} DESC`)
			.limit(limit)
			.offset(offset),
		db
			.select({ total: count() })
			.from(transaction)
			.where(whereClause),
	]);

	const rows: TransactionWithFarmer[] = transactions.map((t) => ({
		id: t.id,
		uuid: t.uuid,
		product: t.product,
		quantityKg: Number(t.quantityKg),
		pricePerKg: Number(t.pricePerKg),
		buyer: t.buyer,
		date: t.date,
		integrityStatus: t.integrityStatus as "confirmed" | "flagged" | "pending",
		createdAt: t.createdAt,
		farmerId: t.farmerId,
		farmerName: t.farmerName,
	}));

	return {
		success: true,
		data: { transactions: rows, total: countResult.total },
	};
}

// ─── confirmTransaction ─────────────────────────────────────────────

export async function confirmTransaction(
	transactionId: number,
): Promise<ActionResult<void>> {
	const session = await getSession();
	if (!session || session.user.role !== "cooperative") {
		return { error: "No autorizado" };
	}
	if (!session.user.cooperativeId) {
		return { error: "No hay cooperativa asociada" };
	}

	// Verify transaction belongs to the cooperative
	const [txn] = await db
		.select({ id: transaction.id })
		.from(transaction)
		.where(
			and(
				eq(transaction.id, transactionId),
				eq(transaction.cooperativeId, session.user.cooperativeId),
			),
		)
		.limit(1);

	if (!txn) {
		return { error: "Transaccion no encontrada" };
	}

	await db
		.update(transaction)
		.set({ integrityStatus: "confirmed" })
		.where(eq(transaction.id, transactionId));

	revalidatePath("/dashboard");

	return { success: true, data: undefined };
}

// ─── rejectTransaction ──────────────────────────────────────────────

export async function rejectTransaction(
	transactionId: number,
): Promise<ActionResult<void>> {
	const session = await getSession();
	if (!session || session.user.role !== "cooperative") {
		return { error: "No autorizado" };
	}
	if (!session.user.cooperativeId) {
		return { error: "No hay cooperativa asociada" };
	}

	// Verify transaction belongs to the cooperative
	const [txn] = await db
		.select({ id: transaction.id })
		.from(transaction)
		.where(
			and(
				eq(transaction.id, transactionId),
				eq(transaction.cooperativeId, session.user.cooperativeId),
			),
		)
		.limit(1);

	if (!txn) {
		return { error: "Transaccion no encontrada" };
	}

	await db
		.update(transaction)
		.set({ integrityStatus: "flagged" })
		.where(eq(transaction.id, transactionId));

	revalidatePath("/dashboard");

	return { success: true, data: undefined };
}
