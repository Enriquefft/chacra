import { getProductListForProducer } from "@/actions/cooperatives";
import { ProducerOnboarding } from "@/components/auth/producer-onboarding";
import { SignInCard } from "@/components/auth/sign-in-card";
import { WrongRoleNotice } from "@/components/auth/wrong-role-notice";
import { getSession } from "@/lib/auth";
import { ProducerShell } from "./_components/producer-shell";

export default async function ProducerLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getSession();

	// State A: no session
	if (!session) {
		return (
			<SignInCard
				title="Chacra Productor"
				description="Registra tus ventas desde cualquier lugar"
				callbackURL="/productor"
			/>
		);
	}

	// State B: session but no role
	if (!session.user.role) {
		return <ProducerOnboarding userName={session.user.name} />;
	}

	// State C: wrong role
	if (session.user.role !== "producer") {
		return (
			<WrongRoleNotice currentRole={session.user.role} expectedRole="producer" />
		);
	}

	// State D: producer but no cooperative
	if (!session.user.cooperativeId) {
		return <ProducerOnboarding userName={session.user.name} />;
	}

	// State E: authenticated producer with cooperative
	const productResult = await getProductListForProducer();
	const productList =
		"success" in productResult ? productResult.data.products : [];

	return (
		<ProducerShell
			producerName={session.user.producerName ?? session.user.name}
			cooperativeId={session.user.cooperativeId}
			productList={productList}
		>
			{children}
		</ProducerShell>
	);
}
