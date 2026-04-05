import { CheckCircle, DangerTriangle } from "@/components/auth/solar-icons";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ProducerProfile } from "@/lib/types";

interface ProfileField {
	key: string;
	label: string;
	filled: boolean;
}

function getProfileFields(profile: ProducerProfile): ProfileField[] {
	return [
		{
			key: "producerPhone",
			label: "Telefono",
			filled: profile.producerPhone !== null && profile.producerPhone !== "",
		},
		{
			key: "producerCrops",
			label: "Cultivos principales",
			filled: profile.producerCrops !== null && profile.producerCrops !== "",
		},
		{
			key: "producerDistrict",
			label: "Distrito / provincia",
			filled:
				profile.producerDistrict !== null && profile.producerDistrict !== "",
		},
		{
			key: "producerExperience",
			label: "Anos de experiencia",
			filled: profile.producerExperience !== null,
		},
		{
			key: "producerLandOwnership",
			label: "Tenencia de tierra",
			filled:
				profile.producerLandOwnership !== null &&
				profile.producerLandOwnership !== "",
		},
	];
}

export function ProfileCompleteness({
	profile,
}: {
	profile: ProducerProfile;
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
