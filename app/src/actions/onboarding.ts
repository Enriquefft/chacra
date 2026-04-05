"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cooperative, user } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

function generateInviteCode(): string {
	const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	let code = "";
	for (let i = 0; i < 6; i++) {
		code += chars[Math.floor(Math.random() * chars.length)];
	}
	return code;
}

export async function completeProducerOnboarding(
	inviteCode: string,
	producerName: string,
	producerRegion: string,
): Promise<{
	error?: string;
	success?: boolean;
	cooperativeName?: string;
}> {
	const session = await getSession();
	if (!session) {
		return { error: "No hay sesion activa" };
	}
	if (session.user.role) {
		return { error: "Ya tienes un rol asignado" };
	}

	const code = inviteCode.trim().toUpperCase();
	if (code.length !== 6) {
		return { error: "El codigo debe tener 6 caracteres" };
	}

	const [coop] = await db
		.select()
		.from(cooperative)
		.where(eq(cooperative.inviteCode, code))
		.limit(1);

	if (!coop) {
		return { error: "Codigo de invitacion invalido" };
	}

	await db
		.update(user)
		.set({
			role: "producer",
			cooperativeId: coop.id,
			producerName: producerName.trim(),
			producerRegion: producerRegion.trim(),
		})
		.where(eq(user.id, session.user.id));

	revalidatePath("/productor");

	return { success: true, cooperativeName: coop.name };
}

export async function completeCooperativeOnboarding(
	name: string,
	region: string,
): Promise<{
	error?: string;
	success?: boolean;
	inviteCode?: string;
}> {
	const session = await getSession();
	if (!session) {
		return { error: "No hay sesion activa" };
	}
	if (session.user.role) {
		return { error: "Ya tienes un rol asignado" };
	}

	const trimmedName = name.trim();
	const trimmedRegion = region.trim();

	if (!trimmedName || !trimmedRegion) {
		return { error: "Nombre y region son requeridos" };
	}

	// Generate unique invite code
	let code = generateInviteCode();
	let attempts = 0;
	while (attempts < 10) {
		const [existing] = await db
			.select({ id: cooperative.id })
			.from(cooperative)
			.where(eq(cooperative.inviteCode, code))
			.limit(1);
		if (!existing) break;
		code = generateInviteCode();
		attempts++;
	}

	const coopId = crypto.randomUUID();

	await db.insert(cooperative).values({
		id: coopId,
		name: trimmedName,
		region: trimmedRegion,
		representativeName: null,
		contactPhone: null,
		inviteCode: code,
		productList: [],
		exportGoals: {},
		ruc: null,
		orgType: null,
		memberCount: null,
		address: null,
		yearFounded: null,
	});

	await db
		.update(user)
		.set({
			role: "cooperative",
			cooperativeId: coopId,
		})
		.where(eq(user.id, session.user.id));

	revalidatePath("/dashboard");

	return { success: true, inviteCode: code };
}

export async function completeFinancieraOnboarding(): Promise<{
	error?: string;
	success?: boolean;
}> {
	const session = await getSession();
	if (!session) {
		return { error: "No hay sesion activa" };
	}
	if (session.user.role) {
		return { error: "Ya tienes un rol asignado" };
	}

	await db
		.update(user)
		.set({ role: "financiera" })
		.where(eq(user.id, session.user.id));

	revalidatePath("/scoring");

	return { success: true };
}
