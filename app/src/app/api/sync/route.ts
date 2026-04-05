import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { syncBatch } from "@/lib/sync";
import type { SyncRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
	// 1. Auth: require producer role + cooperativeId
	const session = await getSession();
	if (!session || session.user.role !== "producer") {
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });
	}
	if (!session.user.cooperativeId) {
		return NextResponse.json(
			{ error: "No hay cooperativa asociada" },
			{ status: 400 },
		);
	}

	// 2. Parse JSON body
	let body: SyncRequest;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "JSON invalido" }, { status: 400 });
	}

	// 3. Validate
	if (!Array.isArray(body.transactions)) {
		return NextResponse.json(
			{ error: "Se requiere un array de transacciones" },
			{ status: 400 },
		);
	}
	if (body.transactions.length === 0) {
		return NextResponse.json(
			{ error: "No hay transacciones para sincronizar" },
			{ status: 422 },
		);
	}
	if (body.transactions.length > 100) {
		return NextResponse.json(
			{ error: "Maximo 100 transacciones por lote" },
			{ status: 400 },
		);
	}

	// 4. Sync
	try {
		const result = await syncBatch(
			session.user.id,
			session.user.cooperativeId,
			body.transactions,
		);
		return NextResponse.json(result);
	} catch (error) {
		console.error("Sync error:", error);
		return NextResponse.json(
			{ error: "Error interno del servidor" },
			{ status: 500 },
		);
	}
}
