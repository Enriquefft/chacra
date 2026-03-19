import { getProductListForFarmer } from "@/actions/cooperatives";
import { FarmerOnboarding } from "@/components/auth/farmer-onboarding";
import { SignInCard } from "@/components/auth/sign-in-card";
import { WrongRoleNotice } from "@/components/auth/wrong-role-notice";
import { getSession } from "@/lib/auth";
import { FarmerShell } from "./_components/farmer-shell";

export default async function FarmerLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getSession();

	// State A: no session
	if (!session) {
		return (
			<SignInCard
				title="Chacra Agricultor"
				description="Registra tus ventas desde cualquier lugar"
				callbackURL="/farmer"
			/>
		);
	}

	// State B: session but no role
	if (!session.user.role) {
		return <FarmerOnboarding userName={session.user.name} />;
	}

	// State C: wrong role
	if (session.user.role !== "farmer") {
		return (
			<WrongRoleNotice currentRole={session.user.role} expectedRole="farmer" />
		);
	}

	// State D: farmer but no cooperative
	if (!session.user.cooperativeId) {
		return <FarmerOnboarding userName={session.user.name} />;
	}

	// State E: authenticated farmer with cooperative
	const productResult = await getProductListForFarmer();
	const productList =
		"success" in productResult ? productResult.data.products : [];

	return (
		<FarmerShell
			farmerName={session.user.farmerName ?? session.user.name}
			cooperativeId={session.user.cooperativeId}
			productList={productList}
		>
			{children}
		</FarmerShell>
	);
}
