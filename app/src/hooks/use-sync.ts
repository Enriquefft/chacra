"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { offlineDb } from "@/lib/offline-db";
import type { SyncResponse } from "@/lib/types";

export function useSync() {
	const [isSyncing, setIsSyncing] = useState(false);
	const [lastResult, setLastResult] = useState<SyncResponse | null>(null);
	const router = useRouter();

	const sync = useCallback(async () => {
		const pending = await offlineDb.pendingTransactions
			.where("syncStatus")
			.anyOf(["pending", "failed"])
			.toArray();

		if (pending.length === 0) {
			return;
		}

		setIsSyncing(true);

		try {
			// Mark as syncing
			await offlineDb.pendingTransactions
				.where("syncStatus")
				.anyOf(["pending", "failed"])
				.modify({ syncStatus: "syncing" });

			const response = await fetch("/api/sync", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					transactions: pending.map((t) => ({
						uuid: t.uuid,
						product: t.product,
						quantityKg: t.quantityKg,
						pricePerKg: t.pricePerKg,
						buyer: t.buyer ?? undefined,
						date: t.date,
					})),
				}),
			});

			if (!response.ok) {
				const errorBody = await response.json().catch(() => null);
				throw new Error(
					errorBody?.error ?? `Error del servidor (${response.status})`,
				);
			}

			const result: SyncResponse = await response.json();
			setLastResult(result);

			// Delete synced + duplicate UUIDs from Dexie
			const idsToDelete = [...result.syncedIds, ...result.duplicateIds];
			if (idsToDelete.length > 0) {
				await offlineDb.pendingTransactions.bulkDelete(idsToDelete);
			}

			// Mark rejected as failed
			for (const rejectedId of result.rejectedIds) {
				const flag = result.flags.find((f) => f.transactionUuid === rejectedId);
				await offlineDb.pendingTransactions.update(rejectedId, {
					syncStatus: "failed",
					errorMessage: flag?.message ?? "Rechazado por el servidor",
				});
			}

			const syncedCount = result.syncedIds.length + result.duplicateIds.length;
			if (syncedCount > 0) {
				toast.success(
					`${syncedCount} ${syncedCount === 1 ? "registro sincronizado" : "registros sincronizados"}`,
				);
			}
			if (result.rejectedIds.length > 0) {
				toast.error(
					`${result.rejectedIds.length} ${result.rejectedIds.length === 1 ? "registro rechazado" : "registros rechazados"}`,
				);
			}

			router.refresh();
		} catch (error) {
			// Revert syncing status back to pending
			await offlineDb.pendingTransactions
				.where("syncStatus")
				.equals("syncing")
				.modify({ syncStatus: "pending" });

			toast.error(
				error instanceof Error ? error.message : "Error al sincronizar",
			);
		} finally {
			setIsSyncing(false);
		}
	}, [router]);

	return { sync, isSyncing, lastResult };
}
