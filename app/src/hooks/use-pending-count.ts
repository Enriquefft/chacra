"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { offlineDb } from "@/lib/offline-db";

export function usePendingCount(): number {
	const count = useLiveQuery(
		() => offlineDb.pendingTransactions.count(),
		[],
		0,
	);
	return count;
}
