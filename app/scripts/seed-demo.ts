/**
 * Demo seed script for Chacra — palta association demo (2026-03-26)
 *
 * Seeds 3 real Google OAuth accounts + 3 additional fake farmers,
 * one cooperative, transactions, input advances, and all supporting data.
 *
 * Usage:
 *   cd app && npx tsx --tsconfig tsconfig.json scripts/seed-demo.ts
 *
 * Idempotent: deletes existing demo data and re-seeds.
 */

import { neon } from "@neondatabase/serverless";
import { and, eq, inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import {
	account,
	cooperative,
	inputAdvance,
	session,
	transaction,
	user,
} from "../src/db/schema";

// ─── Config ─────────────────────────────────────────────────────────

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
	console.error("DATABASE_URL is not set. Did you forget to load .env?");
	process.exit(1);
}

const client = neon(DATABASE_URL);
const db = drizzle({ client });

// ─── Constants ──────────────────────────────────────────────────────

const COOP_ID = "demo-coop-palta-001";
const INVITE_CODE = "PALTA1";

// Demo users (real Google OAuth emails)
const FARMER_EMAIL = "enriquefft2001@gmail.com";
const COOP_EMAIL = "enriquefft@404tf.com";
const FINANCIERA_EMAIL = "enrique.flores@utec.edu.pe";

// Farmer IDs (deterministic for idempotency)
const FARMER_ID = "demo-farmer-main";
const COOP_USER_ID = "demo-coop-user";
const FINANCIERA_USER_ID = "demo-financiera-user";

// Additional fake farmers
const FARMER_2_ID = "demo-farmer-rosa";
const FARMER_3_ID = "demo-farmer-carlos";
const FARMER_4_ID = "demo-farmer-maria";

const ALL_USER_IDS = [
	FARMER_ID,
	COOP_USER_ID,
	FINANCIERA_USER_ID,
	FARMER_2_ID,
	FARMER_3_ID,
	FARMER_4_ID,
];

// ─── Helpers ────────────────────────────────────────────────────────

function dateNDaysAgo(days: number): string {
	const date = new Date();
	date.setDate(date.getDate() - days);
	return date.toISOString().split("T")[0];
}

function uuid(): string {
	return crypto.randomUUID();
}

// ─── Clean existing demo data ───────────────────────────────────────

async function cleanDemoData() {
	console.log("Cleaning existing demo data...");

	// Delete transactions for demo farmers
	await db
		.delete(transaction)
		.where(inArray(transaction.farmerId, ALL_USER_IDS));

	// Delete input advances for demo farmers
	await db
		.delete(inputAdvance)
		.where(inArray(inputAdvance.farmerId, ALL_USER_IDS));

	// Delete sessions for demo users
	await db.delete(session).where(inArray(session.userId, ALL_USER_IDS));

	// Delete accounts for demo users
	await db.delete(account).where(inArray(account.userId, ALL_USER_IDS));

	// Delete demo users
	await db.delete(user).where(inArray(user.id, ALL_USER_IDS));

	// Delete demo cooperative
	await db.delete(cooperative).where(eq(cooperative.id, COOP_ID));

	// Also clean by email in case IDs changed
	for (const email of [FARMER_EMAIL, COOP_EMAIL, FINANCIERA_EMAIL]) {
		const existing = await db
			.select({ id: user.id })
			.from(user)
			.where(eq(user.email, email));
		for (const u of existing) {
			await db.delete(transaction).where(eq(transaction.farmerId, u.id));
			await db.delete(inputAdvance).where(eq(inputAdvance.farmerId, u.id));
			await db.delete(session).where(eq(session.userId, u.id));
			await db.delete(account).where(eq(account.userId, u.id));
			await db.delete(user).where(eq(user.id, u.id));
		}
	}

	// Clean fake farmer emails too
	for (const email of [
		"rosa.quispe@demo.chacra.pe",
		"carlos.huaman@demo.chacra.pe",
		"maria.condori@demo.chacra.pe",
	]) {
		const existing = await db
			.select({ id: user.id })
			.from(user)
			.where(eq(user.email, email));
		for (const u of existing) {
			await db.delete(transaction).where(eq(transaction.farmerId, u.id));
			await db.delete(inputAdvance).where(eq(inputAdvance.farmerId, u.id));
			await db.delete(session).where(eq(session.userId, u.id));
			await db.delete(account).where(eq(account.userId, u.id));
			await db.delete(user).where(eq(user.id, u.id));
		}
	}

	// Clean cooperative by invite code too
	await db.delete(cooperative).where(eq(cooperative.inviteCode, INVITE_CODE));

	console.log("  Done cleaning.");
}

// ─── Seed cooperative ───────────────────────────────────────────────

async function seedCooperative() {
	console.log("Seeding cooperative...");

	await db.insert(cooperative).values({
		id: COOP_ID,
		name: "Asociacion de Productores de Palta del Valle de Luringancho",
		region: "Lima",
		representativeName: "Enrique Flores",
		contactPhone: "951234567",
		inviteCode: INVITE_CODE,
		productList: ["Palta Hass", "Palta Fuerte"],
		exportGoals: {
			"Palta Hass": 15000,
			"Palta Fuerte": 8000,
		},
		ruc: "20612345678",
		orgType: "asociacion",
		memberCount: 25,
		address: "Av. Principal 450, Luringancho-Chosica, Lima",
		yearFounded: 2018,
	});

	console.log("  Cooperative created: PALTA1");
}

// ─── Seed users ─────────────────────────────────────────────────────

async function seedUsers() {
	console.log("Seeding users...");

	const now = new Date();

	// ── Cooperative user ──
	await db.insert(user).values({
		id: COOP_USER_ID,
		name: "Enrique Flores",
		email: COOP_EMAIL,
		emailVerified: true,
		image: null,
		createdAt: now,
		updatedAt: now,
		role: "cooperative",
		cooperativeId: COOP_ID,
		farmerName: null,
		farmerRegion: null,
		farmerPhone: null,
		farmerCrops: null,
		farmerDistrict: null,
		farmerHectares: null,
		farmerExperience: null,
		farmerLandOwnership: null,
	});

	await db.insert(account).values({
		id: `acct-${COOP_USER_ID}`,
		accountId: COOP_EMAIL,
		providerId: "google",
		userId: COOP_USER_ID,
		accessToken: null,
		refreshToken: null,
		idToken: null,
		accessTokenExpiresAt: null,
		refreshTokenExpiresAt: null,
		scope: "openid email profile",
		password: null,
		createdAt: now,
		updatedAt: now,
	});

	console.log(`  Cooperative user: ${COOP_EMAIL}`);

	// ── Main farmer (demo) ──
	await db.insert(user).values({
		id: FARMER_ID,
		name: "Enrique Flores T.",
		email: FARMER_EMAIL,
		emailVerified: true,
		image: null,
		createdAt: now,
		updatedAt: now,
		role: "farmer",
		cooperativeId: COOP_ID,
		farmerName: "Enrique Flores T.",
		farmerRegion: "Lima",
		farmerPhone: "987654321",
		farmerCrops: "Palta Hass, Palta Fuerte",
		farmerDistrict: "Luringancho-Chosica",
		farmerHectares: "3",
		farmerExperience: 8,
		farmerLandOwnership: "propia",
	});

	await db.insert(account).values({
		id: `acct-${FARMER_ID}`,
		accountId: FARMER_EMAIL,
		providerId: "google",
		userId: FARMER_ID,
		accessToken: null,
		refreshToken: null,
		idToken: null,
		accessTokenExpiresAt: null,
		refreshTokenExpiresAt: null,
		scope: "openid email profile",
		password: null,
		createdAt: now,
		updatedAt: now,
	});

	console.log(`  Farmer (main): ${FARMER_EMAIL}`);

	// ── Financiera user ──
	await db.insert(user).values({
		id: FINANCIERA_USER_ID,
		name: "Enrique Flores",
		email: FINANCIERA_EMAIL,
		emailVerified: true,
		image: null,
		createdAt: now,
		updatedAt: now,
		role: "financiera",
		cooperativeId: null,
		farmerName: null,
		farmerRegion: null,
		farmerPhone: null,
		farmerCrops: null,
		farmerDistrict: null,
		farmerHectares: null,
		farmerExperience: null,
		farmerLandOwnership: null,
	});

	await db.insert(account).values({
		id: `acct-${FINANCIERA_USER_ID}`,
		accountId: FINANCIERA_EMAIL,
		providerId: "google",
		userId: FINANCIERA_USER_ID,
		accessToken: null,
		refreshToken: null,
		idToken: null,
		accessTokenExpiresAt: null,
		refreshTokenExpiresAt: null,
		scope: "openid email profile",
		password: null,
		createdAt: now,
		updatedAt: now,
	});

	console.log(`  Financiera: ${FINANCIERA_EMAIL}`);

	// ── Additional farmer: Rosa Quispe (good history) ──
	await db.insert(user).values({
		id: FARMER_2_ID,
		name: "Rosa Quispe",
		email: "rosa.quispe@demo.chacra.pe",
		emailVerified: true,
		image: null,
		createdAt: now,
		updatedAt: now,
		role: "farmer",
		cooperativeId: COOP_ID,
		farmerName: "Rosa Quispe Mamani",
		farmerRegion: "Lima",
		farmerPhone: "956789012",
		farmerCrops: "Palta Hass",
		farmerDistrict: "Luringancho-Chosica",
		farmerHectares: "5",
		farmerExperience: 12,
		farmerLandOwnership: "propia",
	});

	await db.insert(account).values({
		id: `acct-${FARMER_2_ID}`,
		accountId: "rosa.quispe@demo.chacra.pe",
		providerId: "google",
		userId: FARMER_2_ID,
		accessToken: null,
		refreshToken: null,
		idToken: null,
		accessTokenExpiresAt: null,
		refreshTokenExpiresAt: null,
		scope: "openid email profile",
		password: null,
		createdAt: now,
		updatedAt: now,
	});

	console.log("  Farmer 2: Rosa Quispe (experienced, good data)");

	// ── Additional farmer: Carlos Huaman (moderate history) ──
	await db.insert(user).values({
		id: FARMER_3_ID,
		name: "Carlos Huaman",
		email: "carlos.huaman@demo.chacra.pe",
		emailVerified: true,
		image: null,
		createdAt: now,
		updatedAt: now,
		role: "farmer",
		cooperativeId: COOP_ID,
		farmerName: "Carlos Huaman Rojas",
		farmerRegion: "Lima",
		farmerPhone: "934567890",
		farmerCrops: "Palta Hass, Palta Fuerte",
		farmerDistrict: "Luringancho-Chosica",
		farmerHectares: "2",
		farmerExperience: 5,
		farmerLandOwnership: "alquilada",
	});

	await db.insert(account).values({
		id: `acct-${FARMER_3_ID}`,
		accountId: "carlos.huaman@demo.chacra.pe",
		providerId: "google",
		userId: FARMER_3_ID,
		accessToken: null,
		refreshToken: null,
		idToken: null,
		accessTokenExpiresAt: null,
		refreshTokenExpiresAt: null,
		scope: "openid email profile",
		password: null,
		createdAt: now,
		updatedAt: now,
	});

	console.log("  Farmer 3: Carlos Huaman (moderate)");

	// ── Additional farmer: Maria Condori (sparse data) ──
	await db.insert(user).values({
		id: FARMER_4_ID,
		name: "Maria Condori",
		email: "maria.condori@demo.chacra.pe",
		emailVerified: true,
		image: null,
		createdAt: now,
		updatedAt: now,
		role: "farmer",
		cooperativeId: COOP_ID,
		farmerName: "Maria Condori Pari",
		farmerRegion: "Lima",
		farmerPhone: null,
		farmerCrops: null,
		farmerDistrict: null,
		farmerHectares: "1.5",
		farmerExperience: null,
		farmerLandOwnership: null,
	});

	await db.insert(account).values({
		id: `acct-${FARMER_4_ID}`,
		accountId: "maria.condori@demo.chacra.pe",
		providerId: "google",
		userId: FARMER_4_ID,
		accessToken: null,
		refreshToken: null,
		idToken: null,
		accessTokenExpiresAt: null,
		refreshTokenExpiresAt: null,
		scope: "openid email profile",
		password: null,
		createdAt: now,
		updatedAt: now,
	});

	console.log("  Farmer 4: Maria Condori (sparse data, incomplete profile)");
}

// ─── Seed transactions ──────────────────────────────────────────────

async function seedTransactions() {
	console.log("Seeding transactions...");

	const txns: Array<{
		uuid: string;
		farmerId: string;
		cooperativeId: string;
		product: string;
		quantityKg: string;
		pricePerKg: string;
		buyer: string | null;
		date: string;
		integrityStatus: "confirmed" | "flagged" | "pending";
	}> = [];

	// ── Main farmer: 18 transactions over 6 months ──
	// Palta Hass: 2.50-4.50 soles/kg, 200-800 kg
	// Palta Fuerte: 1.50-3.00 soles/kg, 100-500 kg
	const hassEntries = [
		{ daysAgo: 7, qty: 450, price: 3.8, buyer: "Mercado Mayorista" },
		{ daysAgo: 14, qty: 320, price: 3.5, buyer: "Exportadora Camposol" },
		{ daysAgo: 21, qty: 600, price: 4.2, buyer: "Exportadora Camposol" },
		{ daysAgo: 35, qty: 280, price: 3.2, buyer: "Acopiador local" },
		{ daysAgo: 49, qty: 500, price: 3.9, buyer: "Mercado Mayorista" },
		{ daysAgo: 63, qty: 380, price: 3.6, buyer: null },
		{ daysAgo: 77, qty: 700, price: 4.1, buyer: "Exportadora Camposol" },
		{ daysAgo: 91, qty: 250, price: 2.8, buyer: "Acopiador local" },
		{ daysAgo: 105, qty: 400, price: 3.4, buyer: "Mercado Mayorista" },
		{ daysAgo: 119, qty: 550, price: 3.7, buyer: "Exportadora Camposol" },
		{ daysAgo: 140, qty: 300, price: 3.1, buyer: null },
		{ daysAgo: 161, qty: 480, price: 4.0, buyer: "Mercado Mayorista" },
	];

	for (const entry of hassEntries) {
		txns.push({
			uuid: uuid(),
			farmerId: FARMER_ID,
			cooperativeId: COOP_ID,
			product: "Palta Hass",
			quantityKg: entry.qty.toFixed(2),
			pricePerKg: entry.price.toFixed(2),
			buyer: entry.buyer,
			date: dateNDaysAgo(entry.daysAgo),
			integrityStatus: "confirmed",
		});
	}

	const fuerteEntries = [
		{ daysAgo: 10, qty: 200, price: 2.5, buyer: "Mercado local" },
		{ daysAgo: 28, qty: 350, price: 2.2, buyer: null },
		{ daysAgo: 56, qty: 150, price: 2.8, buyer: "Acopiador local" },
		{ daysAgo: 84, qty: 280, price: 1.9, buyer: "Mercado local" },
		{ daysAgo: 112, qty: 420, price: 2.4, buyer: "Acopiador local" },
		{ daysAgo: 147, qty: 180, price: 2.1, buyer: null },
	];

	for (const entry of fuerteEntries) {
		txns.push({
			uuid: uuid(),
			farmerId: FARMER_ID,
			cooperativeId: COOP_ID,
			product: "Palta Fuerte",
			quantityKg: entry.qty.toFixed(2),
			pricePerKg: entry.price.toFixed(2),
			buyer: entry.buyer,
			date: dateNDaysAgo(entry.daysAgo),
			integrityStatus: entry.daysAgo < 30 ? "pending" : "confirmed",
		});
	}

	console.log(
		`  Main farmer: ${hassEntries.length + fuerteEntries.length} transactions`,
	);

	// ── Rosa Quispe: 15 transactions (experienced, good data, Tier A candidate) ──
	const rosaHass = [
		{ daysAgo: 5, qty: 800, price: 4.0, buyer: "Exportadora Camposol" },
		{ daysAgo: 18, qty: 650, price: 3.8, buyer: "Exportadora Camposol" },
		{ daysAgo: 32, qty: 720, price: 4.3, buyer: "Mercado Mayorista" },
		{ daysAgo: 46, qty: 550, price: 3.5, buyer: "Exportadora Camposol" },
		{ daysAgo: 60, qty: 680, price: 3.9, buyer: "Mercado Mayorista" },
		{ daysAgo: 74, qty: 500, price: 3.7, buyer: null },
		{ daysAgo: 88, qty: 750, price: 4.1, buyer: "Exportadora Camposol" },
		{ daysAgo: 102, qty: 600, price: 3.6, buyer: "Mercado Mayorista" },
		{ daysAgo: 116, qty: 700, price: 4.2, buyer: "Exportadora Camposol" },
		{ daysAgo: 130, qty: 580, price: 3.4, buyer: "Acopiador local" },
		{ daysAgo: 144, qty: 620, price: 3.8, buyer: "Exportadora Camposol" },
		{ daysAgo: 158, qty: 480, price: 3.3, buyer: null },
		{ daysAgo: 172, qty: 550, price: 3.9, buyer: "Mercado Mayorista" },
	];

	for (const entry of rosaHass) {
		txns.push({
			uuid: uuid(),
			farmerId: FARMER_2_ID,
			cooperativeId: COOP_ID,
			product: "Palta Hass",
			quantityKg: entry.qty.toFixed(2),
			pricePerKg: entry.price.toFixed(2),
			buyer: entry.buyer,
			date: dateNDaysAgo(entry.daysAgo),
			integrityStatus: "confirmed",
		});
	}

	const rosaFuerte = [
		{ daysAgo: 25, qty: 300, price: 2.6 },
		{ daysAgo: 67, qty: 250, price: 2.3 },
	];

	for (const entry of rosaFuerte) {
		txns.push({
			uuid: uuid(),
			farmerId: FARMER_2_ID,
			cooperativeId: COOP_ID,
			product: "Palta Fuerte",
			quantityKg: entry.qty.toFixed(2),
			pricePerKg: entry.price.toFixed(2),
			buyer: "Mercado local",
			date: dateNDaysAgo(entry.daysAgo),
			integrityStatus: "confirmed",
		});
	}

	console.log(
		`  Rosa Quispe: ${rosaHass.length + rosaFuerte.length} transactions`,
	);

	// ── Carlos Huaman: 8 transactions (moderate, Tier B candidate) ──
	const carlosEntries = [
		{
			daysAgo: 12,
			product: "Palta Hass",
			qty: 200,
			price: 3.3,
			status: "pending" as const,
		},
		{
			daysAgo: 30,
			product: "Palta Hass",
			qty: 350,
			price: 3.6,
			status: "confirmed" as const,
		},
		{
			daysAgo: 55,
			product: "Palta Fuerte",
			qty: 180,
			price: 2.2,
			status: "confirmed" as const,
		},
		{
			daysAgo: 70,
			product: "Palta Hass",
			qty: 280,
			price: 3.4,
			status: "confirmed" as const,
		},
		{
			daysAgo: 90,
			product: "Palta Hass",
			qty: 150,
			price: 3.1,
			status: "confirmed" as const,
		},
		{
			daysAgo: 110,
			product: "Palta Fuerte",
			qty: 220,
			price: 2.5,
			status: "confirmed" as const,
		},
		{
			daysAgo: 130,
			product: "Palta Hass",
			qty: 300,
			price: 3.5,
			status: "confirmed" as const,
		},
		{
			daysAgo: 155,
			product: "Palta Fuerte",
			qty: 140,
			price: 1.8,
			status: "flagged" as const,
		},
	];

	for (const entry of carlosEntries) {
		txns.push({
			uuid: uuid(),
			farmerId: FARMER_3_ID,
			cooperativeId: COOP_ID,
			product: entry.product,
			quantityKg: entry.qty.toFixed(2),
			pricePerKg: entry.price.toFixed(2),
			buyer: null,
			date: dateNDaysAgo(entry.daysAgo),
			integrityStatus: entry.status,
		});
	}

	console.log(`  Carlos Huaman: ${carlosEntries.length} transactions`);

	// ── Maria Condori: 3 transactions (sparse, Tier C) ──
	const mariaEntries = [
		{
			daysAgo: 20,
			product: "Palta Hass",
			qty: 100,
			price: 3.0,
			status: "pending" as const,
		},
		{
			daysAgo: 60,
			product: "Palta Hass",
			qty: 150,
			price: 2.8,
			status: "confirmed" as const,
		},
		{
			daysAgo: 120,
			product: "Palta Fuerte",
			qty: 80,
			price: 2.0,
			status: "confirmed" as const,
		},
	];

	for (const entry of mariaEntries) {
		txns.push({
			uuid: uuid(),
			farmerId: FARMER_4_ID,
			cooperativeId: COOP_ID,
			product: entry.product,
			quantityKg: entry.qty.toFixed(2),
			pricePerKg: entry.price.toFixed(2),
			buyer: null,
			date: dateNDaysAgo(entry.daysAgo),
			integrityStatus: entry.status,
		});
	}

	console.log(`  Maria Condori: ${mariaEntries.length} transactions`);

	// Insert all transactions
	if (txns.length > 0) {
		await db.insert(transaction).values(txns);
	}

	console.log(`  Total: ${txns.length} transactions seeded.`);
}

// ─── Seed input advances (expenses) ─────────────────────────────────

async function seedAdvances() {
	console.log("Seeding input advances...");

	const advances: Array<{
		uuid: string;
		farmerId: string;
		cooperativeId: string;
		loggedBy: string;
		category: string;
		description: string | null;
		amount: string;
		date: string;
	}> = [];

	// ── Main farmer: 7 expense entries ──
	const mainFarmerAdvances = [
		{
			category: "fertilizante",
			description: "Guano de isla - 20 sacos",
			amount: 1200,
			daysAgo: 45,
		},
		{
			category: "fertilizante",
			description: "Urea granulada - 10 sacos",
			amount: 580,
			daysAgo: 90,
		},
		{
			category: "semillas",
			description: "Plantones de palta Hass",
			amount: 450,
			daysAgo: 150,
		},
		{
			category: "herramientas",
			description: "Tijeras de poda + machete",
			amount: 180,
			daysAgo: 120,
		},
		{
			category: "mano_de_obra",
			description: "Cosecha - 3 jornaleros x 2 dias",
			amount: 720,
			daysAgo: 14,
		},
		{
			category: "mano_de_obra",
			description: "Poda y limpieza - 2 jornaleros",
			amount: 360,
			daysAgo: 75,
		},
		{
			category: "transporte",
			description: "Flete al mercado mayorista",
			amount: 250,
			daysAgo: 7,
		},
	];

	for (const entry of mainFarmerAdvances) {
		advances.push({
			uuid: uuid(),
			farmerId: FARMER_ID,
			cooperativeId: COOP_ID,
			loggedBy: COOP_USER_ID,
			category: entry.category,
			description: entry.description,
			amount: entry.amount.toFixed(2),
			date: dateNDaysAgo(entry.daysAgo),
		});
	}

	console.log(`  Main farmer: ${mainFarmerAdvances.length} advances`);

	// ── Rosa Quispe: 5 expenses ──
	const rosaAdvances = [
		{
			category: "fertilizante",
			description: "Compost organico - 30 sacos",
			amount: 900,
			daysAgo: 50,
		},
		{
			category: "fertilizante",
			description: "Sulfato de potasio",
			amount: 420,
			daysAgo: 100,
		},
		{
			category: "mano_de_obra",
			description: "Cosecha temporada - 4 jornaleros x 3 dias",
			amount: 1440,
			daysAgo: 10,
		},
		{
			category: "transporte",
			description: "Flete para exportacion",
			amount: 380,
			daysAgo: 20,
		},
		{
			category: "herramientas",
			description: "Sistema de riego por goteo (reparacion)",
			amount: 650,
			daysAgo: 80,
		},
	];

	for (const entry of rosaAdvances) {
		advances.push({
			uuid: uuid(),
			farmerId: FARMER_2_ID,
			cooperativeId: COOP_ID,
			loggedBy: COOP_USER_ID,
			category: entry.category,
			description: entry.description,
			amount: entry.amount.toFixed(2),
			date: dateNDaysAgo(entry.daysAgo),
		});
	}

	console.log(`  Rosa Quispe: ${rosaAdvances.length} advances`);

	// ── Carlos Huaman: 3 expenses ──
	const carlosAdvances = [
		{
			category: "fertilizante",
			description: "Guano de isla - 10 sacos",
			amount: 600,
			daysAgo: 60,
		},
		{
			category: "mano_de_obra",
			description: "Cosecha - 2 jornaleros",
			amount: 240,
			daysAgo: 15,
		},
		{
			category: "otro",
			description: "Analisis de suelo",
			amount: 150,
			daysAgo: 130,
		},
	];

	for (const entry of carlosAdvances) {
		advances.push({
			uuid: uuid(),
			farmerId: FARMER_3_ID,
			cooperativeId: COOP_ID,
			loggedBy: COOP_USER_ID,
			category: entry.category,
			description: entry.description,
			amount: entry.amount.toFixed(2),
			date: dateNDaysAgo(entry.daysAgo),
		});
	}

	console.log(`  Carlos Huaman: ${carlosAdvances.length} advances`);

	// Maria Condori: no advances (sparse data)

	if (advances.length > 0) {
		await db.insert(inputAdvance).values(advances);
	}

	console.log(`  Total: ${advances.length} advances seeded.`);
}

// ─── Verification ───────────────────────────────────────────────────

async function verify() {
	console.log("\nVerifying seed data...");

	const [userCount] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(user)
		.where(inArray(user.id, ALL_USER_IDS));

	const [txCount] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(transaction)
		.where(inArray(transaction.farmerId, ALL_USER_IDS));

	const [advCount] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(inputAdvance)
		.where(inArray(inputAdvance.farmerId, ALL_USER_IDS));

	const [coopCount] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(cooperative)
		.where(eq(cooperative.id, COOP_ID));

	const [acctCount] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(account)
		.where(inArray(account.userId, ALL_USER_IDS));

	console.log(`  Users: ${userCount.count} (expected 6)`);
	console.log(`  Accounts: ${acctCount.count} (expected 6)`);
	console.log(`  Cooperatives: ${coopCount.count} (expected 1)`);
	console.log(`  Transactions: ${txCount.count} (expected 44)`);
	console.log(`  Input advances: ${advCount.count} (expected 15)`);

	// Check tier distribution expectations
	const farmers = await db
		.select({
			name: user.farmerName,
			txnCount: sql<number>`count(${transaction.id})::int`,
			activeMonths: sql<number>`count(distinct to_char(${transaction.date}::date, 'YYYY-MM'))::int`,
		})
		.from(user)
		.leftJoin(
			transaction,
			and(
				eq(user.id, transaction.farmerId),
				sql`${transaction.integrityStatus} != 'flagged'`,
			),
		)
		.where(and(eq(user.role, "farmer"), inArray(user.id, ALL_USER_IDS)))
		.groupBy(user.id);

	console.log("\n  Farmer summary:");
	for (const f of farmers) {
		console.log(
			`    ${f.name}: ${f.txnCount} txns, ${f.activeMonths} active months`,
		);
	}

	console.log("\n  Demo accounts:");
	console.log(`    Farmer PWA:    ${FARMER_EMAIL} (farmer)`);
	console.log(`    Coop dashboard: ${COOP_EMAIL} (cooperative)`);
	console.log(`    Scoring view:   ${FINANCIERA_EMAIL} (financiera)`);
	console.log(`    Invite code:    ${INVITE_CODE}`);
}

// ─── Main ───────────────────────────────────────────────────────────

async function main() {
	console.log("=== Chacra Demo Seed ===\n");

	try {
		await cleanDemoData();
		await seedCooperative();
		await seedUsers();
		await seedTransactions();
		await seedAdvances();
		await verify();
		console.log("\nSeed complete. Ready for demo.");
	} catch (error) {
		console.error("\nSeed failed:", error);
		process.exit(1);
	}
}

main();
