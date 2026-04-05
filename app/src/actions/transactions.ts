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
	product: string | null;
	quantityKg: number | null;
	pricePerKg: number | null;
	buyer: string | null;
	photoUrl: string | null;
	date: string;
	integrityStatus: "confirmed" | "flagged" | "pending";
	createdAt: Date;
};

type TransactionWithProducer = TransactionRow & {
	producerId: string;
	producerName: string | null;
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
	if (!session || session.user.role !== "producer") {
		return { error: "No autorizado" };
	}
	if (!session.user.cooperativeId) {
		return { error: "No hay cooperativa asociada" };
	}

	// Validate UUID
	if (!input.uuid || !UUID_REGEX.test(input.uuid)) {
		return { error: "UUID invalido o ausente" };
	}

	const hasPhoto = !!input.photoUrl;
	const hasManualData =
		!!input.product && input.quantityKg != null && input.pricePerKg != null;

	// Require at least photo or manual data
	if (!hasPhoto && !hasManualData) {
		return {
			error:
				"Se requiere al menos una foto o los datos manuales (producto, cantidad, precio)",
		};
	}

	// Fetch cooperative product list (needed for product validation)
	const [coop] = await db
		.select({ productList: cooperative.productList })
		.from(cooperative)
		.where(eq(cooperative.id, session.user.cooperativeId))
		.limit(1);

	if (!coop) {
		return { error: "Cooperativa no encontrada" };
	}

	// Validate manual fields only when provided
	let productValue: string | null = null;
	let quantityValue: string | null = null;
	let priceValue: string | null = null;

	if (hasManualData) {
		const validProducts = new Set<string>(coop.productList ?? []);
		if (!validProducts.has(input.product!)) {
			return { error: "Producto no valido" };
		}

		if (Number.isNaN(input.quantityKg!) || input.quantityKg! <= 0) {
			return { error: "Cantidad debe ser un numero positivo" };
		}
		if (input.quantityKg! > 99999.99) {
			return { error: "Cantidad excede el maximo permitido (99999.99 kg)" };
		}

		if (Number.isNaN(input.pricePerKg!) || input.pricePerKg! <= 0) {
			return { error: "Precio debe ser un numero positivo" };
		}
		if (input.pricePerKg! > 99999.99) {
			return { error: "Precio excede el maximo permitido (S/99999.99)" };
		}

		productValue = input.product!;
		quantityValue = input.quantityKg!.toFixed(2);
		priceValue = input.pricePerKg!.toFixed(2);
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
			producerId: session.user.id,
			cooperativeId: session.user.cooperativeId,
			product: productValue,
			quantityKg: quantityValue,
			pricePerKg: priceValue,
			buyer: buyerValue,
			photoUrl: input.photoUrl ?? null,
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

	revalidatePath("/productor");

	return { success: true, data: { id: result[0].id, uuid: result[0].uuid } };
}

// ─── getTransactionsByProducer ─────────────────────────────────────────

export async function getTransactionsByProducer(
	producerId?: string,
	options?: { limit?: number; offset?: number },
): Promise<ActionResult<{ transactions: TransactionRow[]; total: number }>> {
	const session = await getSession();
	if (!session) {
		return { error: "No autorizado" };
	}

	const limit = options?.limit ?? 50;
	const offset = options?.offset ?? 0;
	let targetProducerId: string;

	if (session.user.role === "producer") {
		// Producers can only see their own transactions
		if (producerId && producerId !== session.user.id) {
			return { error: "No autorizado" };
		}
		targetProducerId = session.user.id;
	} else if (session.user.role === "cooperative") {
		if (!producerId) {
			return { error: "Se requiere el ID del productor" };
		}
		if (!session.user.cooperativeId) {
			return { error: "No hay cooperativa asociada" };
		}
		// Verify producer belongs to the cooperative
		const [producer] = await db
			.select({ id: user.id })
			.from(user)
			.where(
				and(
					eq(user.id, producerId),
					eq(user.cooperativeId, session.user.cooperativeId),
					eq(user.role, "producer"),
				),
			)
			.limit(1);
		if (!producer) {
			return { error: "Productor no encontrado en la cooperativa" };
		}
		targetProducerId = producerId;
	} else if (session.user.role === "financiera") {
		if (!producerId) {
			return { error: "Se requiere el ID del productor" };
		}
		// Verify producer exists
		const [producer] = await db
			.select({ id: user.id })
			.from(user)
			.where(and(eq(user.id, producerId), eq(user.role, "producer")))
			.limit(1);
		if (!producer) {
			return { error: "Productor no encontrado" };
		}
		targetProducerId = producerId;
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
				photoUrl: transaction.photoUrl,
				date: transaction.date,
				integrityStatus: transaction.integrityStatus,
				createdAt: transaction.createdAt,
			})
			.from(transaction)
			.where(eq(transaction.producerId, targetProducerId))
			.orderBy(sql`${transaction.date} DESC`)
			.limit(limit)
			.offset(offset),
		db
			.select({ total: count() })
			.from(transaction)
			.where(eq(transaction.producerId, targetProducerId)),
	]);

	const rows: TransactionRow[] = transactions.map((t) => ({
		id: t.id,
		uuid: t.uuid,
		product: t.product,
		quantityKg: t.quantityKg != null ? Number(t.quantityKg) : null,
		pricePerKg: t.pricePerKg != null ? Number(t.pricePerKg) : null,
		buyer: t.buyer,
		photoUrl: t.photoUrl,
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

export async function getTransactionsByCooperative(options?: {
	limit?: number;
	offset?: number;
	product?: string;
	status?: string;
}): Promise<
	ActionResult<{ transactions: TransactionWithProducer[]; total: number }>
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
	const conditions = [
		eq(transaction.cooperativeId, session.user.cooperativeId),
	];

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
				photoUrl: transaction.photoUrl,
				date: transaction.date,
				integrityStatus: transaction.integrityStatus,
				createdAt: transaction.createdAt,
				producerId: transaction.producerId,
				producerName: user.producerName,
			})
			.from(transaction)
			.innerJoin(user, eq(transaction.producerId, user.id))
			.where(whereClause)
			.orderBy(sql`${transaction.date} DESC`)
			.limit(limit)
			.offset(offset),
		db.select({ total: count() }).from(transaction).where(whereClause),
	]);

	const rows: TransactionWithProducer[] = transactions.map((t) => ({
		id: t.id,
		uuid: t.uuid,
		product: t.product,
		quantityKg: t.quantityKg != null ? Number(t.quantityKg) : null,
		pricePerKg: t.pricePerKg != null ? Number(t.pricePerKg) : null,
		buyer: t.buyer,
		photoUrl: t.photoUrl,
		date: t.date,
		integrityStatus: t.integrityStatus as "confirmed" | "flagged" | "pending",
		createdAt: t.createdAt,
		producerId: t.producerId,
		producerName: t.producerName,
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
