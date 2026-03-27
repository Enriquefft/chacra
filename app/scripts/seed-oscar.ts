/**
 * Seed Oscar's 3 demo accounts.
 * Usage: cd app && set -a && source .env && set +a && npx tsx --tsconfig tsconfig.json scripts/seed-oscar.ts
 */

import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { account, session, user } from "../src/db/schema";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
	console.error("DATABASE_URL is not set.");
	process.exit(1);
}

const client = neon(DATABASE_URL);
const db = drizzle({ client });

const COOP_ID = "demo-coop-palta-001";
const now = new Date();

const oscars = [
	{
		id: "demo-oscar-coop",
		name: "Oscar Castro",
		email: "oscar@blume.pe",
		role: "cooperative" as const,
		cooperativeId: COOP_ID,
	},
	{
		id: "demo-oscar-farmer",
		name: "Oscar Castro",
		email: "oscar.castro@utec.edu.pe",
		role: "farmer" as const,
		cooperativeId: COOP_ID,
	},
	{
		id: "demo-oscar-financiera",
		name: "Oscar Castro",
		email: "ocastro@utec.edu.pe",
		role: "financiera" as const,
		cooperativeId: null,
	},
];

async function main() {
	console.log("=== Seeding Oscar's accounts ===\n");

	// Clean existing
	for (const o of oscars) {
		const existing = await db
			.select({ id: user.id })
			.from(user)
			.where(eq(user.email, o.email));
		for (const u of existing) {
			await db.delete(session).where(eq(session.userId, u.id));
			await db.delete(account).where(eq(account.userId, u.id));
			await db.delete(user).where(eq(user.id, u.id));
		}
	}
	console.log("Cleaned existing accounts.");

	// Insert
	for (const o of oscars) {
		await db.insert(user).values({
			id: o.id,
			name: o.name,
			email: o.email,
			emailVerified: true,
			image: null,
			createdAt: now,
			updatedAt: now,
			role: o.role,
			cooperativeId: o.cooperativeId,
			farmerName: o.role === "farmer" ? "Oscar Castro" : null,
			farmerRegion: o.role === "farmer" ? "Lima" : null,
			farmerPhone: o.role === "farmer" ? "912345678" : null,
			farmerCrops: o.role === "farmer" ? "Palta Hass, Palta Fuerte" : null,
			farmerDistrict: o.role === "farmer" ? "Luringancho-Chosica" : null,
			farmerHectares: o.role === "farmer" ? "2" : null,
			farmerExperience: o.role === "farmer" ? 5 : null,
			farmerLandOwnership: o.role === "farmer" ? "propia" : null,
		});

		await db.insert(account).values({
			id: `acct-${o.id}`,
			accountId: o.email,
			providerId: "google",
			userId: o.id,
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

		console.log(`  ${o.role}: ${o.email}`);
	}

	console.log("\nDone. Oscar has 3 accounts.");
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
