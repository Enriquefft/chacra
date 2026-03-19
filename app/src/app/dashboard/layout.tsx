import { eq } from "drizzle-orm";
import { CooperativeOnboarding } from "@/components/auth/cooperative-onboarding";
import { SignInCard } from "@/components/auth/sign-in-card";
import { WrongRoleNotice } from "@/components/auth/wrong-role-notice";
import { cooperative } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardShell } from "./_components/dashboard-shell";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getSession();

	// State A: no session
	if (!session) {
		return (
			<SignInCard
				title="Panel Cooperativa"
				description="Gestiona tu cooperativa y productores"
				callbackURL="/dashboard"
			/>
		);
	}

	// State B: session but no role
	if (!session.user.role) {
		return <CooperativeOnboarding userName={session.user.name} />;
	}

	// State C: wrong role
	if (session.user.role !== "cooperative") {
		return (
			<WrongRoleNotice
				currentRole={session.user.role}
				expectedRole="cooperative"
			/>
		);
	}

	// State D: cooperative role but no cooperative ID (shouldn't happen, but handle)
	if (!session.user.cooperativeId) {
		return <CooperativeOnboarding userName={session.user.name} />;
	}

	// State E: authenticated cooperative user
	const [coop] = await db
		.select({ name: cooperative.name })
		.from(cooperative)
		.where(eq(cooperative.id, session.user.cooperativeId))
		.limit(1);

	const coopName = coop?.name ?? "Cooperativa";

	return <DashboardShell cooperativeName={coopName}>{children}</DashboardShell>;
}
