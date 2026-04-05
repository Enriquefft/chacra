// Shared type definitions. Pure types + const arrays, no runtime imports.

// ActionResult pattern (matches existing onboarding.ts convention)
export type ActionResult<T = void> =
	| { success: true; data: T }
	| { error: string };

// ─── Input Advance ──────────────────────────────────────────────────

export const ADVANCE_CATEGORIES = [
	"fertilizante",
	"semillas",
	"herramientas",
	"mano_de_obra",
	"transporte",
	"otro",
] as const;

export type AdvanceCategory = (typeof ADVANCE_CATEGORIES)[number];

export interface AdvanceInput {
	farmerId: string;
	category: AdvanceCategory;
	description?: string;
	amount: number;
	date: string; // YYYY-MM-DD
}

export interface AdvanceItem {
	id: number;
	uuid: string;
	farmerId: string;
	farmerName: string;
	category: AdvanceCategory;
	description: string | null;
	amount: number;
	date: string;
	createdAt: Date;
}

// Transaction input from PWA form or sync batch.
// At least one of (photoUrl) or (product + quantityKg + pricePerKg) is required.
export interface TransactionInput {
	uuid: string;
	product?: string;
	quantityKg?: number;
	pricePerKg?: number;
	buyer?: string;
	photoUrl?: string;
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
	| "cross_validation_excess"
	| "plausibility_single"
	| "plausibility_cumulative";

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
	totalRevenue: number;
	totalExpenses: number;
	netMargin: number;
	marginRatio: number; // 0-1, netMargin / totalRevenue
	expenseBreakdown: { category: string; total: number }[];
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
	farmerPhone: string | null;
	farmerCrops: string | null;
	farmerDistrict: string | null;
	farmerExperience: number | null;
	farmerLandOwnership: string | null;
	farmerHectares: number | null;
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

export interface ProductPriceData {
	product: string;
	benchmark: PriceBenchmark | null;
	lastPrice: number | null;
	lastDate: string | null;
	previousPrice: number | null;
}

// ─── Cooperative Profile Types ──────────────────────────────────────

export const ORG_TYPES = [
	"asociacion",
	"cooperativa",
	"comite",
	"empresa_comunal",
] as const;

export type OrgType = (typeof ORG_TYPES)[number];

export const ORG_TYPE_LABELS: Record<OrgType, string> = {
	asociacion: "Asociacion",
	cooperativa: "Cooperativa",
	comite: "Comite",
	empresa_comunal: "Empresa Comunal",
};

export interface CooperativeProfileData {
	ruc?: string | null;
	orgType?: OrgType | null;
	memberCount?: number | null;
	address?: string | null;
	yearFounded?: number | null;
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
