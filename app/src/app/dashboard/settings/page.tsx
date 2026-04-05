import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cooperative } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CooperativeProfile } from "./_components/cooperative-profile";
import { ExportGoalManager } from "./_components/export-goal-manager";
import { InviteCodeDisplay } from "./_components/invite-code-display";
import { ProductManager } from "./_components/product-manager";

export default async function SettingsPage() {
	const session = await getSession();
	if (
		!session ||
		session.user.role !== "cooperative" ||
		!session.user.cooperativeId
	) {
		redirect("/dashboard");
	}

	const [coop] = await db
		.select()
		.from(cooperative)
		.where(eq(cooperative.id, session.user.cooperativeId))
		.limit(1);

	if (!coop) {
		redirect("/dashboard");
	}

	// Parse export goals into the shape the component expects
	const rawGoals = (coop.exportGoals ?? {}) as Record<string, number>;
	const exportGoals: Record<string, { targetKg: number }> = {};
	for (const [product, targetKg] of Object.entries(rawGoals)) {
		exportGoals[product] = { targetKg };
	}

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-2xl font-semibold tracking-tight">Configuracion</h1>

			<Card>
				<CardHeader>
					<CardTitle>Cooperativa</CardTitle>
					<CardDescription>Informacion de tu cooperativa</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<span className="text-sm text-muted-foreground">Nombre</span>
						<span className="text-base font-medium">{coop.name}</span>
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-sm text-muted-foreground">Region</span>
						<span className="text-base font-medium">{coop.region}</span>
					</div>
					<Separator />
					<div className="flex flex-col gap-1">
						<span className="text-sm text-muted-foreground">
							Codigo de invitacion
						</span>
						<InviteCodeDisplay code={coop.inviteCode} />
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Perfil de la cooperativa</CardTitle>
					<CardDescription>
						Completa tu perfil para ser visible a financieras
					</CardDescription>
				</CardHeader>
				<CardContent>
					<CooperativeProfile
						initialData={{
							ruc: coop.ruc,
							orgType: coop.orgType,
							memberCount: coop.memberCount,
							address: coop.address,
							yearFounded: coop.yearFounded,
						}}
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Productos</CardTitle>
					<CardDescription>
						Productos que tus productores pueden registrar
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ProductManager initialProducts={coop.productList ?? []} />
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Metas de Exportacion</CardTitle>
					<CardDescription>
						Define metas de produccion por producto para tu cooperativa
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ExportGoalManager
						products={coop.productList ?? []}
						initialGoals={exportGoals}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
