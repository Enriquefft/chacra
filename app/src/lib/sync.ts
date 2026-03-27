import { eq } from "drizzle-orm";
import { cooperative, transaction } from "@/db/schema";
import { db } from "@/lib/db";
import { checkTransaction } from "@/lib/integrity";
import type {
	IntegrityFlag,
	SyncResponse,
	TransactionInput,
} from "@/lib/types";

const UUID_REGEX =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validate a single transaction input.
 * Returns an error message (Spanish) if invalid, null if valid.
 */
function validateTransactionInput(
	input: TransactionInput,
	validProducts: Set<string>,
): string | null {
	// UUID validation
	if (!input.uuid || !UUID_REGEX.test(input.uuid)) {
		return "UUID invalido o ausente";
	}

	// Product validation
	if (!input.product || input.product.trim().length === 0) {
		return "Producto es requerido";
	}
	if (!validProducts.has(input.product)) {
		return `Producto no valido: ${input.product}`;
	}

	// Quantity validation
	if (
		typeof input.quantityKg !== "number" ||
		Number.isNaN(input.quantityKg) ||
		input.quantityKg <= 0
	) {
		return "Cantidad debe ser un numero positivo";
	}
	if (input.quantityKg > 99999.99) {
		return "Cantidad excede el maximo permitido (99999.99 kg)";
	}

	// Price validation
	if (
		typeof input.pricePerKg !== "number" ||
		Number.isNaN(input.pricePerKg) ||
		input.pricePerKg <= 0
	) {
		return "Precio debe ser un numero positivo";
	}
	if (input.pricePerKg > 99999.99) {
		return "Precio excede el maximo permitido (S/99999.99)";
	}

	// Date validation
	if (!input.date || !DATE_REGEX.test(input.date)) {
		return "Fecha debe tener formato YYYY-MM-DD";
	}
	const parsed = new Date(`${input.date}T00:00:00`);
	if (Number.isNaN(parsed.getTime())) {
		return "Fecha invalida";
	}
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	tomorrow.setHours(23, 59, 59, 999);
	if (parsed > tomorrow) {
		return "Fecha no puede ser mas de 1 dia en el futuro";
	}

	// Buyer validation (optional)
	if (input.buyer !== undefined && input.buyer !== null) {
		const trimmedBuyer = input.buyer.trim();
		if (trimmedBuyer.length > 200) {
			return "Nombre del comprador excede 200 caracteres";
		}
	}

	return null;
}

/**
 * Sync a batch of transactions from the PWA.
 * For each transaction: validate, insert (with UUID dedup), run integrity checks.
 * Caller is responsible for auth — this module does not check permissions.
 */
export async function syncBatch(
	farmerId: string,
	cooperativeId: string,
	transactions: TransactionInput[],
): Promise<SyncResponse> {
	// Fetch cooperative's product list once
	const [coop] = await db
		.select({ productList: cooperative.productList })
		.from(cooperative)
		.where(eq(cooperative.id, cooperativeId))
		.limit(1);

	const validProducts = new Set<string>(coop?.productList ?? []);

	const syncedIds: string[] = [];
	const rejectedIds: string[] = [];
	const duplicateIds: string[] = [];
	const flags: IntegrityFlag[] = [];

	for (const input of transactions) {
		// Validate
		const error = validateTransactionInput(input, validProducts);
		if (error) {
			rejectedIds.push(input.uuid || "unknown");
			continue;
		}

		// Insert with UUID dedup via onConflictDoNothing
		const inserted = await db
			.insert(transaction)
			.values({
				uuid: input.uuid,
				farmerId,
				cooperativeId,
				product: input.product,
				quantityKg: input.quantityKg.toFixed(2),
				pricePerKg: input.pricePerKg.toFixed(2),
				buyer: input.buyer?.trim() || null,
				photoUrl: input.photoUrl ?? null,
				date: input.date,
				integrityStatus: "pending",
			})
			.onConflictDoNothing({ target: transaction.uuid })
			.returning({ id: transaction.id });

		if (inserted.length === 0) {
			// Duplicate UUID — already exists
			duplicateIds.push(input.uuid);
			continue;
		}

		// Run integrity checks on the newly inserted transaction
		const txnFlags = await checkTransaction(inserted[0].id);
		flags.push(...txnFlags);
		syncedIds.push(input.uuid);
	}

	return { syncedIds, rejectedIds, duplicateIds, flags };
}
