"use server";

import { eq, sql } from "drizzle-orm";
import { cooperative, transaction, user } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ActionResult } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
	confirmed: "Confirmado",
	flagged: "Flaggeado",
	pending: "Pendiente",
};

function escapeCSV(value: string): string {
	if (value.includes(",") || value.includes('"') || value.includes("\n")) {
		return `"${value.replace(/"/g, '""')}"`;
	}
	return value;
}

export async function exportTransactionsCSV(): Promise<
	ActionResult<{ csv: string; filename: string }>
> {
	const session = await getSession();
	if (!session || session.user.role !== "cooperative") {
		return { error: "No autorizado" };
	}
	if (!session.user.cooperativeId) {
		return { error: "No hay cooperativa asociada" };
	}

	const cooperativeId = session.user.cooperativeId;

	// Fetch cooperative name for filename
	const [coop] = await db
		.select({ name: cooperative.name })
		.from(cooperative)
		.where(eq(cooperative.id, cooperativeId))
		.limit(1);

	const coopName = coop?.name ?? "cooperativa";

	// Fetch ALL transactions (no pagination)
	const transactions = await db
		.select({
			product: transaction.product,
			quantityKg: transaction.quantityKg,
			pricePerKg: transaction.pricePerKg,
			buyer: transaction.buyer,
			date: transaction.date,
			integrityStatus: transaction.integrityStatus,
			farmerName: user.farmerName,
		})
		.from(transaction)
		.innerJoin(user, eq(transaction.farmerId, user.id))
		.where(eq(transaction.cooperativeId, cooperativeId))
		.orderBy(sql`${transaction.date} DESC`);

	// CSV header
	const headers = [
		"Fecha",
		"Productor",
		"Producto",
		"Cantidad (kg)",
		"Precio/kg (S/)",
		"Total (S/)",
		"Comprador",
		"Estado",
	];

	// CSV rows
	const rows = transactions.map((t) => {
		const qty = t.quantityKg != null ? Number(t.quantityKg) : null;
		const price = t.pricePerKg != null ? Number(t.pricePerKg) : null;
		const total = qty != null && price != null ? qty * price : null;

		return [
			t.date,
			escapeCSV(t.farmerName ?? "Sin nombre"),
			escapeCSV(t.product ?? ""),
			qty != null ? qty.toFixed(2) : "",
			price != null ? price.toFixed(2) : "",
			total != null ? total.toFixed(2) : "",
			escapeCSV(t.buyer ?? ""),
			STATUS_LABELS[t.integrityStatus] ?? t.integrityStatus,
		].join(",");
	});

	// UTF-8 BOM + header + rows
	const csv = `\uFEFF${headers.join(",")}\n${rows.join("\n")}`;

	// Sanitize cooperative name for filename
	const safeName = coopName
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-]/g, "");
	const today = new Date().toISOString().slice(0, 10);
	const filename = `chacra-transacciones-${safeName}-${today}.csv`;

	return { success: true, data: { csv, filename } };
}
