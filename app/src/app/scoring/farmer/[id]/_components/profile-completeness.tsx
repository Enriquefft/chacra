import { CheckCircle, DangerTriangle } from "@/components/auth/solar-icons";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { FarmerProfile } from "@/lib/types";

interface ProfileField {
	key: string;
	label: string;
	filled: boolean;
}

function getProfileFields(profile: FarmerProfile): ProfileField[] {
	return [
		{
			key: "farmerPhone",
			label: "Telefono",
			filled: profile.farmerPhone !== null && profile.farmerPhone !== "",
		},
		{
			key: "farmerCrops",
			label: "Cultivos principales",
			filled: profile.farmerCrops !== null && profile.farmerCrops !== "",
		},
		{
			key: "farmerDistrict",
			label: "Distrito / provincia",
			filled:
				profile.farmerDistrict !== null && profile.farmerDistrict !== "",
		},
		{
			key: "farmerExperience",
			label: "Anos de experiencia",
			filled: profile.farmerExperience !== null,
		},
		{
			key: "farmerLandOwnership",
			label: "Tenencia de tierra",
			filled:
				profile.farmerLandOwnership !== null &&
				profile.farmerLandOwnership !== "",
		},
	];
}

export function ProfileCompleteness({
	profile,
}: {
	profile: FarmerProfile;
}) {
	const fields = getProfileFields(profile);
	const filledCount = fields.filter((f) => f.filled).length;
	const totalCount = fields.length;
	const percentage = Math.round((filledCount / totalCount) * 100);

	return (
		<Card className="border-border/50 bg-card/80">
			<CardContent className="pt-5">
				<div className="flex items-center justify-between">
					<p className="text-sm font-medium text-muted-foreground">
						Completitud del perfil
					</p>
					<span className="text-sm font-semibold tabular-nums">
						{filledCount}/{totalCount}
					</span>
				</div>

				<Progress
					value={percentage}
					className={`mt-2 h-2.5 ${
						percentage === 100
							? "[&>div]:bg-success"
							: percentage >= 60
								? "[&>div]:bg-warning"
								: "[&>div]:bg-destructive"
					}`}
				/>

				<p className="mt-1 text-xs text-muted-foreground">
					{percentage}% completado
				</p>

				<div className="mt-4 flex flex-col gap-2">
					{fields.map((field) => (
						<div key={field.key} className="flex items-center gap-2">
							{field.filled ? (
								<CheckCircle
									weight="Bold"
									size={16}
									className="shrink-0 text-success"
									aria-hidden="true"
								/>
							) : (
								<DangerTriangle
									weight="Bold"
									size={16}
									className="shrink-0 text-muted-foreground"
									aria-hidden="true"
								/>
							)}
							<span
								className={`text-sm ${
									field.filled
										? "text-foreground"
										: "text-muted-foreground"
								}`}
							>
								{field.label}
							</span>
						</div>
					))}
				</div>

				{filledCount < totalCount && (
					<div className="mt-3 border-t pt-3">
						<p className="text-xs text-muted-foreground">
							Mas datos = mas confianza para la evaluacion crediticia
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
