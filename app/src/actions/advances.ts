"use server";

import { and, count, desc, eq, sum } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { inputAdvance, user } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {
	type ActionResult,
	ADVANCE_CATEGORIES,
	type AdvanceCategory,
	type AdvanceInput,
	type AdvanceItem,
} from "@/lib/types";

// ─── Validation helpers ──────────────────────────────────────────────

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isValidCategory(value: string): value is AdvanceCategory {
	return (ADVANCE_CATEGORIES as readonly string[]).includes(value);
}

// ─── createAdvance ───────────────────────────────────────────────────

export async function createAdvance(
	input: AdvanceInput,
): Promise<ActionResult<{ id: number; uuid: string }>> {
	const session = await getSession();
	if (!session || session.user.role !== "cooperative") {
		return { error: "No autorizado" };
	}
	if (!session.user.cooperativeId) {
		return { error: "No hay cooperativa asociada" };
	}

	// Validate category
	if (!input.category || !isValidCategory(input.category)) {
		return { error: "Categoria no valida" };
	}

	// Validate amount
	if (
		typeof input.amount !== "number" ||
		Number.isNaN(input.amount) ||
		input.amount <= 0
	) {
		return { error: "Monto debe ser un numero positivo" };
	}
	if (input.amount > 99999999.99) {
		return { error: "Monto excede el maximo permitido" };
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

	// Validate producerId
	if (!input.producerId) {
		return { error: "Se requiere el ID del productor" };
	}

	// Verify producer belongs to the caller's cooperative
	const [producer] = await db
		.select({ id: user.id })
		.from(user)
		.where(
			and(
				eq(user.id, input.producerId),
				eq(user.cooperativeId, session.user.cooperativeId),
				eq(user.role, "producer"),
			),
		)
		.limit(1);

	if (!producer) {
		return { error: "Productor no encontrado en la cooperativa" };
	}

	// Validate description (optional)
	let descriptionValue: string | null = null;
	if (input.description !== undefined && input.description !== null) {
		const trimmed = input.description.trim();
		if (trimmed.length > 500) {
			return { error: "Descripcion excede 500 caracteres" };
		}
		descriptionValue = trimmed || null;
	}

	// Generate UUID server-side
	const uuid = crypto.randomUUID();

	// Insert
	const result = await db
		.insert(inputAdvance)
		.values({
			uuid,
			producerId: input.producerId,
			cooperativeId: session.user.cooperativeId,
			loggedBy: session.user.id,
			category: input.category,
			description: descriptionValue,
			amount: input.amount.toFixed(2),
			date: input.date,
		})
		.onConflictDoNothing({ target: inputAdvance.uuid })
		.returning({ id: inputAdvance.id, uuid: inputAdvance.uuid });

	if (result.length === 0) {
		return { error: "Adelanto duplicado" };
	}

	revalidatePath("/dashboard");

	return { success: true, data: { id: result[0].id, uuid: result[0].uuid } };
}

// ─── getAdvancesByProducer ─────────────────────────────────────────────

export async function getAdvancesByProducer(
	producerId: string,
): Promise<
	ActionResult<{ advances: AdvanceItem[]; total: number; totalAmount: number }>
> {
	const session = await getSession();
	if (!session) {
		return { error: "No autorizado" };
	}

	// Cooperative and financiera can read advances
	if (
		session.user.role !== "cooperative" &&
		session.user.role !== "financiera"
	) {
		return { error: "No autorizado" };
	}

	if (!producerId) {
		return { error: "Se requiere el ID del productor" };
	}

	// For cooperatives, verify producer belongs to their cooperative
	if (session.user.role === "cooperative") {
		if (!session.user.cooperativeId) {
			return { error: "No hay cooperativa asociada" };
		}
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
	} else {
		// Financiera: verify producer exists
		const [producer] = await db
			.select({ id: user.id })
			.from(user)
			.where(and(eq(user.id, producerId), eq(user.role, "producer")))
			.limit(1);
		if (!producer) {
			return { error: "Productor no encontrado" };
		}
	}

	const [advances, [countResult], [sumResult]] = await Promise.all([
		db
			.select({
				id: inputAdvance.id,
				uuid: inputAdvance.uuid,
				producerId: inputAdvance.producerId,
				producerName: user.producerName,
				category: inputAdvance.category,
				description: inputAdvance.description,
				amount: inputAdvance.amount,
				date: inputAdvance.date,
				createdAt: inputAdvance.createdAt,
			})
			.from(inputAdvance)
			.innerJoin(user, eq(inputAdvance.producerId, user.id))
			.where(eq(inputAdvance.producerId, producerId))
			.orderBy(desc(inputAdvance.date)),
		db
			.select({ total: count() })
			.from(inputAdvance)
			.where(eq(inputAdvance.producerId, producerId)),
		db
			.select({ totalAmount: sum(inputAdvance.amount) })
			.from(inputAdvance)
			.where(eq(inputAdvance.producerId, producerId)),
	]);

	const rows: AdvanceItem[] = advances.map((a) => ({
		id: a.id,
		uuid: a.uuid,
		producerId: a.producerId,
		producerName: a.producerName ?? "Sin nombre",
		category: a.category as AdvanceCategory,
		description: a.description,
		amount: Number(a.amount),
		date: a.date,
		createdAt: a.createdAt,
	}));

	return {
		success: true,
		data: {
			advances: rows,
			total: countResult.total,
			totalAmount: Number(sumResult.totalAmount ?? 0),
		},
	};
}

// ─── getAdvancesByCooperative ────────────────────────────────────────

export async function getAdvancesByCooperative(opts?: {
	limit?: number;
	offset?: number;
}): Promise<
	ActionResult<{ advances: AdvanceItem[]; total: number; totalAmount: number }>
> {
	const session = await getSession();
	if (!session || session.user.role !== "cooperative") {
		return { error: "No autorizado" };
	}
	if (!session.user.cooperativeId) {
		return { error: "No hay cooperativa asociada" };
	}

	const limit = opts?.limit ?? 50;
	const offset = opts?.offset ?? 0;

	const whereClause = eq(
		inputAdvance.cooperativeId,
		session.user.cooperativeId,
	);

	const [advances, [countResult], [sumResult]] = await Promise.all([
		db
			.select({
				id: inputAdvance.id,
				uuid: inputAdvance.uuid,
				producerId: inputAdvance.producerId,
				producerName: user.producerName,
				category: inputAdvance.category,
				description: inputAdvance.description,
				amount: inputAdvance.amount,
				date: inputAdvance.date,
				createdAt: inputAdvance.createdAt,
			})
			.from(inputAdvance)
			.innerJoin(user, eq(inputAdvance.producerId, user.id))
			.where(whereClause)
			.orderBy(desc(inputAdvance.date))
			.limit(limit)
			.offset(offset),
		db.select({ total: count() }).from(inputAdvance).where(whereClause),
		db
			.select({ totalAmount: sum(inputAdvance.amount) })
			.from(inputAdvance)
			.where(whereClause),
	]);

	const rows: AdvanceItem[] = advances.map((a) => ({
		id: a.id,
		uuid: a.uuid,
		producerId: a.producerId,
		producerName: a.producerName ?? "Sin nombre",
		category: a.category as AdvanceCategory,
		description: a.description,
		amount: Number(a.amount),
		date: a.date,
		createdAt: a.createdAt,
	}));

	return {
		success: true,
		data: {
			advances: rows,
			total: countResult.total,
			totalAmount: Number(sumResult.totalAmount ?? 0),
		},
	};
}

// ─── deleteAdvance ───────────────────────────────────────────────────

export async function deleteAdvance(
	advanceId: number,
): Promise<ActionResult<void>> {
	const session = await getSession();
	if (!session || session.user.role !== "cooperative") {
		return { error: "No autorizado" };
	}
	if (!session.user.cooperativeId) {
		return { error: "No hay cooperativa asociada" };
	}

	// Verify advance belongs to the caller's cooperative
	const [advance] = await db
		.select({ id: inputAdvance.id })
		.from(inputAdvance)
		.where(
			and(
				eq(inputAdvance.id, advanceId),
				eq(inputAdvance.cooperativeId, session.user.cooperativeId),
			),
		)
		.limit(1);

	if (!advance) {
		return { error: "Adelanto no encontrado" };
	}

	await db.delete(inputAdvance).where(eq(inputAdvance.id, advanceId));

	revalidatePath("/dashboard");

	return { success: true, data: undefined };
}
