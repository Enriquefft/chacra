import { relations, sql } from "drizzle-orm";
import {
	date,
	index,
	integer,
	jsonb,
	numeric,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

// Re-export all auth tables, relations, and the schema instance
export {
	account,
	accountRelations,
	chacraSchema,
	session,
	sessionRelations,
	user,
	verification,
} from "./auth-schema";

// Import auth tables for references and relations
import { chacraSchema, account, session, user } from "./auth-schema";

// ─── Cooperative ─────────────────────────────────────────────────────

export const cooperative = chacraSchema.table("cooperative", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	region: text("region").notNull(),
	representativeName: text("representative_name"),
	contactPhone: text("contact_phone"),
	inviteCode: text("invite_code").notNull().unique(),
	productList: text("product_list")
		.array()
		.notNull()
		.default(sql`'{}'::text[]`),
	exportGoals: jsonb("export_goals").notNull().default("{}"),
	ruc: text("ruc"),
	orgType: text("org_type"),
	memberCount: integer("member_count"),
	address: text("address"),
	yearFounded: integer("year_founded"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Transaction ─────────────────────────────────────────────────────

export const transaction = chacraSchema.table(
	"transaction",
	{
		id: serial("id").primaryKey(),
		uuid: text("uuid").notNull().unique(),
		farmerId: text("farmer_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		cooperativeId: text("cooperative_id")
			.notNull()
			.references(() => cooperative.id, { onDelete: "cascade" }),
		product: text("product").notNull(),
		quantityKg: numeric("quantity_kg", { precision: 10, scale: 2 }).notNull(),
		pricePerKg: numeric("price_per_kg", { precision: 10, scale: 2 }).notNull(),
		buyer: text("buyer"),
		date: date("date").notNull(),
		integrityStatus: text("integrity_status", {
			enum: ["confirmed", "flagged", "pending"],
		})
			.notNull()
			.default("pending"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		syncedAt: timestamp("synced_at").defaultNow().notNull(),
	},
	(table) => [
		index("transaction_farmer_id_idx").on(table.farmerId),
		index("transaction_cooperative_id_idx").on(table.cooperativeId),
		index("transaction_date_idx").on(table.date),
	],
);

// ─── Input Advance ───────────────────────────────────────────────────

export const inputAdvance = chacraSchema.table(
	"input_advance",
	{
		id: serial("id").primaryKey(),
		uuid: text("uuid").notNull().unique(),
		farmerId: text("farmer_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		cooperativeId: text("cooperative_id")
			.notNull()
			.references(() => cooperative.id, { onDelete: "cascade" }),
		loggedBy: text("logged_by")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		category: text("category").notNull(),
		description: text("description"),
		amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
		date: date("date").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("input_advance_farmer_id_idx").on(table.farmerId),
		index("input_advance_cooperative_id_idx").on(table.cooperativeId),
		index("input_advance_date_idx").on(table.date),
	],
);

// ─── Relations ───────────────────────────────────────────────────────

export const userRelations = relations(user, ({ one, many }) => ({
	sessions: many(session),
	accounts: many(account),
	cooperative: one(cooperative, {
		fields: [user.cooperativeId],
		references: [cooperative.id],
	}),
	transactions: many(transaction),
	inputAdvances: many(inputAdvance),
}));

export const cooperativeRelations = relations(cooperative, ({ many }) => ({
	users: many(user),
	transactions: many(transaction),
	inputAdvances: many(inputAdvance),
}));

export const transactionRelations = relations(transaction, ({ one }) => ({
	farmer: one(user, {
		fields: [transaction.farmerId],
		references: [user.id],
	}),
	cooperative: one(cooperative, {
		fields: [transaction.cooperativeId],
		references: [cooperative.id],
	}),
}));

export const inputAdvanceRelations = relations(inputAdvance, ({ one }) => ({
	farmer: one(user, {
		fields: [inputAdvance.farmerId],
		references: [user.id],
	}),
	cooperative: one(cooperative, {
		fields: [inputAdvance.cooperativeId],
		references: [cooperative.id],
	}),
}));
