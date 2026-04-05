import Dexie, { type Table } from "dexie";

export interface PendingTransaction {
	uuid: string;
	product: string | null;
	quantityKg: number | null;
	pricePerKg: number | null;
	buyer: string | null;
	date: string;
	createdAt: number;
	syncStatus: "pending" | "syncing" | "failed";
	errorMessage?: string;
	photoData?: ArrayBuffer;
}

export interface CachedProductList {
	cooperativeId: string;
	products: string[];
	cachedAt: number;
}

class ChacraOfflineDB extends Dexie {
	pendingTransactions!: Table<PendingTransaction, string>;
	cachedProducts!: Table<CachedProductList, string>;

	constructor() {
		super("chacra-offline");
		this.version(1).stores({
			pendingTransactions: "uuid, syncStatus, createdAt",
			cachedProducts: "cooperativeId",
		});
		// v2: adds photoData (ArrayBuffer) to pendingTransactions — additive, no index change
		this.version(2).stores({
			pendingTransactions: "uuid, syncStatus, createdAt",
			cachedProducts: "cooperativeId",
		});
	}
}

export const offlineDb = new ChacraOfflineDB();
