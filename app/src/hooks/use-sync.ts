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
		const pendingUuids = pending.map((t) => t.uuid);

		try {
			// Mark only the fetched transactions as syncing (by UUID)
			await offlineDb.pendingTransactions
				.where("uuid")
				.anyOf(pendingUuids)
				.modify({ syncStatus: "syncing" });

			// Upload photos for transactions that have photoData
			const photoUrls: Record<string, string> = {};
			for (const t of pending) {
				if (t.photoData) {
					try {
						const form = new FormData();
						form.append("photo", new File([t.photoData], `${t.uuid}.jpg`, { type: "image/jpeg" }));
						form.append("uuid", t.uuid);
						const uploadRes = await fetch("/api/upload", { method: "POST", body: form });
						if (uploadRes.ok) {
							const { url } = await uploadRes.json();
							photoUrls[t.uuid] = url;
						}
					} catch {
						// Photo upload failed — continue without photo
					}
				}
			}

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
						photoUrl: photoUrls[t.uuid],
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
			// Revert only the transactions we marked as syncing
			await offlineDb.pendingTransactions
				.where("uuid")
				.anyOf(pendingUuids)
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
