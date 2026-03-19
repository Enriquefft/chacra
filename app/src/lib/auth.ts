import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";

export const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL,
	trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:3000"],
	database: drizzleAdapter(db, { provider: "pg" }),
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID ?? "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
		},
	},
	user: {
		additionalFields: {
			role: {
				type: "string",
				required: false,
				defaultValue: null,
				input: false,
			},
			cooperativeId: {
				type: "string",
				required: false,
				defaultValue: null,
				input: false,
			},
			farmerName: {
				type: "string",
				required: false,
				defaultValue: null,
				input: true,
			},
			farmerRegion: {
				type: "string",
				required: false,
				defaultValue: null,
				input: true,
			},
			farmerHectares: {
				type: "number",
				required: false,
				defaultValue: null,
				input: true,
			},
			farmerPhone: {
				type: "string",
				required: false,
				defaultValue: null,
				input: true,
			},
			farmerCrops: {
				type: "string",
				required: false,
				defaultValue: null,
				input: true,
			},
			farmerDistrict: {
				type: "string",
				required: false,
				defaultValue: null,
				input: true,
			},
			farmerExperience: {
				type: "number",
				required: false,
				defaultValue: null,
				input: true,
			},
			farmerLandOwnership: {
				type: "string",
				required: false,
				defaultValue: null,
				input: true,
			},
		},
	},
	onAPIError: {
		errorURL: "/",
	},
	plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;

export async function getSession() {
	return auth.api.getSession({
		headers: await headers(),
	});
}

export async function requireAuth() {
	const session = await getSession();
	if (!session) {
		redirect("/");
	}
	return session;
}

export async function requireFarmer() {
	const session = await requireAuth();
	if (session.user.role !== "farmer") {
		redirect("/");
	}
	return session;
}

export async function requireCooperative() {
	const session = await requireAuth();
	if (session.user.role !== "cooperative") {
		redirect("/");
	}
	return session;
}

export async function requireFinanciera() {
	const session = await requireAuth();
	if (session.user.role !== "financiera") {
		redirect("/");
	}
	return session;
}
