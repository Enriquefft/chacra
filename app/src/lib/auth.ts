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
			producerName: {
				type: "string",
				required: false,
				defaultValue: null,
				input: true,
			},
			producerRegion: {
				type: "string",
				required: false,
				defaultValue: null,
				input: true,
			},
			producerHectares: {
				type: "number",
				required: false,
				defaultValue: null,
				input: true,
			},
			producerPhone: {
				type: "string",
				required: false,
				defaultValue: null,
				input: true,
			},
			producerCrops: {
				type: "string",
				required: false,
				defaultValue: null,
				input: true,
			},
			producerDistrict: {
				type: "string",
				required: false,
				defaultValue: null,
				input: true,
			},
			producerExperience: {
				type: "number",
				required: false,
				defaultValue: null,
				input: true,
			},
			producerLandOwnership: {
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

export async function requireProducer() {
	const session = await requireAuth();
	if (session.user.role !== "producer") {
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
