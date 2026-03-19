// Shared type definitions for Phase 2 modules. Pure types, no runtime code.

// ActionResult pattern (matches existing onboarding.ts convention)
export type ActionResult<T = void> =
	| { success: true; data: T }
	| { error: string };

// Transaction input from PWA form or sync batch
export interface TransactionInput {
	uuid: string;
	product: string;
	quantityKg: number;
	pricePerKg: number;
	buyer?: string;
	date: string; // YYYY-MM-DD
}

// Sync types
export interface SyncRequest {
	transactions: TransactionInput[];
}

export interface SyncResponse {
	syncedIds: string[];
	rejectedIds: string[];
	duplicateIds: string[];
	flags: IntegrityFlag[];
}

// Integrity types
export type FlagType =
	| "volume_spike"
	| "price_outlier"
	| "high_frequency"
	| "cross_validation_excess";

export interface IntegrityFlag {
	transactionUuid: string;
	farmerId: string;
	flagType: FlagType;
	message: string;
	details: Record<string, number>;
}

export interface TrustScoreResult {
	farmerId: string;
	trustScore: number; // 0-100
	confirmedCount: number;
	flaggedCount: number;
	totalCount: number;
}

// Price types
export interface PriceBenchmark {
	product: string;
	region: string;
	floor: number; // p10
	ceiling: number; // p90
	average: number;
	dataPoints: number;
}

// Scoring types
export type Tier = "A" | "B" | "C";
export type RevenueTrend = "up" | "stable" | "down";

export interface CreditScore {
	tier: Tier;
	totalTransactions: number;
	activeMonths: number;
	avgMonthlyRevenue: number;
	revenueTrend: RevenueTrend;
	cropDiversity: number;
	consistency: number; // 0-100
	trustScore: number; // 0-100
	estimatedLoanRange: { min: number; max: number } | null;
}

// Farmer types
export interface FarmerProfile {
	id: string;
	name: string;
	email: string;
	region: string | null;
	cooperativeId: string;
	cooperativeName: string;
	createdAt: Date;
}

export interface FarmerListItem {
	id: string;
	name: string;
	region: string | null;
	email: string;
	transactionCount: number;
	lastTransactionDate: string | null;
	trustScore: number;
	integrityStatus: "on_track" | "needs_attention";
}

export interface ScoringFarmerItem {
	id: string;
	name: string;
	region: string | null;
	cooperativeName: string;
	tier: Tier;
	avgMonthlyRevenue: number;
	activeMonths: number;
	trustScore: number;
	transactionCount: number;
}

export interface CooperativeStats {
	activeFarmers: number;
	totalFarmers: number;
	totalProductionKg: number;
	periodRevenueTotal: number;
	activeAlerts: number;
	exportGoalProgress: Array<{
		product: string;
		targetKg: number;
		currentKg: number;
		percentage: number;
	}>;
}
