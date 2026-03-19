import { getFarmersForCooperative } from "@/actions/farmers";
import { UsersGroupRounded } from "@/components/auth/solar-icons";
import { EmptyState } from "@/components/empty-state";
import { ProducersList } from "./_components/producers-list";

export default async function ProducersPage() {
	const result = await getFarmersForCooperative();

	if ("error" in result) {
		return (
			<div className="flex flex-col gap-6">
				<h1 className="text-2xl font-semibold tracking-tight">Productores</h1>
				<EmptyState
					icon={UsersGroupRounded}
					title="No hay productores registrados"
					description="Comparte tu codigo de invitacion para que se unan."
				/>
			</div>
		);
	}

	const { farmers } = result.data;

	if (farmers.length === 0) {
		return (
			<div className="flex flex-col gap-6">
				<h1 className="text-2xl font-semibold tracking-tight">Productores</h1>
				<EmptyState
					icon={UsersGroupRounded}
					title="No hay productores registrados"
					description="Comparte tu codigo de invitacion para que se unan."
				/>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-2xl font-semibold tracking-tight">Productores</h1>
			<ProducersList farmers={farmers} />
		</div>
	);
}
