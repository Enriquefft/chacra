import { FinancieraAutoOnboard } from "@/components/auth/financiera-auto-onboard";
import { SignInCard } from "@/components/auth/sign-in-card";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { WrongRoleNotice } from "@/components/auth/wrong-role-notice";
import { getSession } from "@/lib/auth";

export default async function ScoringLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getSession();

	// State A: no session
	if (!session) {
		return (
			<SignInCard
				title="Chacra Scoring"
				description="Perfiles crediticios basados en datos reales"
				callbackURL="/scoring"
			/>
		);
	}

	// State B: session but no role — auto-onboard financiera
	if (!session.user.role) {
		return <FinancieraAutoOnboard />;
	}

	// State C: wrong role
	if (session.user.role !== "financiera") {
		return (
			<WrongRoleNotice
				currentRole={session.user.role}
				expectedRole="financiera"
			/>
		);
	}

	// State E: authenticated financiera user
	return (
		<div className="min-h-screen">
			<header className="flex h-12 items-center justify-between border-b px-6">
				<span className="text-base font-semibold tracking-tight">
					Chacra Scoring
				</span>
				<SignOutButton variant="ghost" size="sm" />
			</header>
			<main className="p-6">{children}</main>
		</div>
	);
}
