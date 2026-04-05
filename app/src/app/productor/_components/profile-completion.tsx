"use client";

import { useId, useState, useTransition } from "react";
import { toast } from "sonner";
import { updateProducerProfile } from "@/actions/producers";
import { CheckCircle, UserRounded } from "@/components/auth/solar-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface ProfileFields {
	producerPhone: string | null;
	producerCrops: string | null;
	producerDistrict: string | null;
	producerExperience: number | null;
	producerLandOwnership: string | null;
}

const FIELD_LABELS: Record<keyof ProfileFields, string> = {
	producerPhone: "Telefono",
	producerCrops: "Cultivos principales",
	producerDistrict: "Distrito / provincia",
	producerExperience: "Anos de experiencia",
	producerLandOwnership: "Tenencia de tierra",
};

function countFilledFields(fields: ProfileFields): number {
	let count = 0;
	if (fields.producerPhone) count++;
	if (fields.producerCrops) count++;
	if (fields.producerDistrict) count++;
	if (fields.producerExperience !== null && fields.producerExperience !== undefined)
		count++;
	if (fields.producerLandOwnership) count++;
	return count;
}

const TOTAL_FIELDS = 5;

export function ProfileCompletion({
	initialFields,
}: {
	initialFields: ProfileFields;
}) {
	const formId = useId();
	const [isPending, startTransition] = useTransition();
	const [dismissed, setDismissed] = useState(false);
	const [fields, setFields] = useState<ProfileFields>(initialFields);

	// Form state
	const [phone, setPhone] = useState(fields.producerPhone ?? "");
	const [crops, setCrops] = useState(fields.producerCrops ?? "");
	const [district, setDistrict] = useState(fields.producerDistrict ?? "");
	const [experience, setExperience] = useState(
		fields.producerExperience !== null && fields.producerExperience !== undefined
			? String(fields.producerExperience)
			: "",
	);
	const [landOwnership, setLandOwnership] = useState(
		fields.producerLandOwnership ?? "",
	);

	const filledCount = countFilledFields(fields);
	const isComplete = filledCount === TOTAL_FIELDS;

	if (isComplete || dismissed) {
		return null;
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		startTransition(async () => {
			const data: Record<string, string | number | undefined> = {};

			if (phone.trim() && !fields.producerPhone) {
				data.producerPhone = phone.trim();
			}
			if (crops.trim() && !fields.producerCrops) {
				data.producerCrops = crops.trim();
			}
			if (district.trim() && !fields.producerDistrict) {
				data.producerDistrict = district.trim();
			}
			if (
				experience.trim() &&
				(fields.producerExperience === null ||
					fields.producerExperience === undefined)
			) {
				const parsed = Number.parseInt(experience, 10);
				if (!Number.isNaN(parsed)) {
					data.producerExperience = parsed;
				}
			}
			if (landOwnership && !fields.producerLandOwnership) {
				data.producerLandOwnership = landOwnership;
			}

			if (Object.keys(data).length === 0) {
				toast.info("Completa al menos un campo nuevo");
				return;
			}

			const result = await updateProducerProfile(data);

			if ("error" in result) {
				toast.error(result.error);
				return;
			}

			// Update local state to reflect saved fields
			setFields((prev) => ({
				producerPhone: (data.producerPhone as string) ?? prev.producerPhone,
				producerCrops: (data.producerCrops as string) ?? prev.producerCrops,
				producerDistrict: (data.producerDistrict as string) ?? prev.producerDistrict,
				producerExperience:
					data.producerExperience !== undefined
						? (data.producerExperience as number)
						: prev.producerExperience,
				producerLandOwnership:
					(data.producerLandOwnership as string) ?? prev.producerLandOwnership,
			}));

			toast.success("Perfil actualizado");
		});
	}

	const progressPercent = Math.round((filledCount / TOTAL_FIELDS) * 100);

	// Determine which fields still need filling
	const needsPhone = !fields.producerPhone;
	const needsCrops = !fields.producerCrops;
	const needsDistrict = !fields.producerDistrict;
	const needsExperience =
		fields.producerExperience === null || fields.producerExperience === undefined;
	const needsLandOwnership = !fields.producerLandOwnership;

	const remaining = TOTAL_FIELDS - filledCount;

	return (
		<Card className="border-primary/20 bg-primary/5">
			<CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
				<div className="flex items-center gap-2">
					<UserRounded
						weight="BoldDuotone"
						size={20}
						className="text-primary"
					/>
					<h2 className="text-lg font-semibold">Completa tu perfil</h2>
				</div>
				<button
					type="button"
					onClick={() => setDismissed(true)}
					className="text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					Ahora no
				</button>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				{/* Progress indicator */}
				<div className="flex flex-col gap-1.5">
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted-foreground">
							{filledCount} de {TOTAL_FIELDS} campos completos
						</span>
						<span className="text-sm font-medium text-primary">
							{remaining} {remaining === 1 ? "restante" : "restantes"}
						</span>
					</div>
					<Progress value={progressPercent} className="h-2" />
				</div>

				{/* Form with remaining fields */}
				<form onSubmit={handleSubmit} className="flex flex-col gap-3">
					{needsPhone && (
						<div className="flex flex-col gap-1.5">
							<label
								htmlFor={`${formId}-phone`}
								className="text-base font-medium"
							>
								{FIELD_LABELS.producerPhone}
							</label>
							<Input
								id={`${formId}-phone`}
								type="tel"
								inputMode="tel"
								placeholder="Ej: 976543210"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								className="h-11 text-base"
							/>
						</div>
					)}

					{needsCrops && (
						<div className="flex flex-col gap-1.5">
							<label
								htmlFor={`${formId}-crops`}
								className="text-base font-medium"
							>
								{FIELD_LABELS.producerCrops}
							</label>
							<Input
								id={`${formId}-crops`}
								type="text"
								placeholder="Ej: Cafe, cacao"
								value={crops}
								onChange={(e) => setCrops(e.target.value)}
								className="h-11 text-base"
							/>
						</div>
					)}

					{needsDistrict && (
						<div className="flex flex-col gap-1.5">
							<label
								htmlFor={`${formId}-district`}
								className="text-base font-medium"
							>
								{FIELD_LABELS.producerDistrict}
							</label>
							<Input
								id={`${formId}-district`}
								type="text"
								placeholder="Ej: Jaen, Cajamarca"
								value={district}
								onChange={(e) => setDistrict(e.target.value)}
								className="h-11 text-base"
							/>
						</div>
					)}

					{needsExperience && (
						<div className="flex flex-col gap-1.5">
							<label
								htmlFor={`${formId}-experience`}
								className="text-base font-medium"
							>
								{FIELD_LABELS.producerExperience}
							</label>
							<Input
								id={`${formId}-experience`}
								type="number"
								inputMode="numeric"
								min="0"
								max="100"
								step="1"
								placeholder="Ej: 10"
								value={experience}
								onChange={(e) => setExperience(e.target.value)}
								className="h-11 text-base"
							/>
						</div>
					)}

					{needsLandOwnership && (
						<div className="flex flex-col gap-1.5">
							<label
								htmlFor={`${formId}-land`}
								className="text-base font-medium"
							>
								{FIELD_LABELS.producerLandOwnership}
							</label>
							<Select value={landOwnership} onValueChange={setLandOwnership}>
								<SelectTrigger className="h-11 w-full text-base">
									<SelectValue placeholder="Selecciona una opcion" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="propia" className="text-base">
										Propia
									</SelectItem>
									<SelectItem value="alquilada" className="text-base">
										Alquilada
									</SelectItem>
									<SelectItem value="comunal" className="text-base">
										Comunal
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					)}

					<Button
						type="submit"
						size="lg"
						className="mt-1 w-full"
						disabled={isPending}
					>
						{isPending ? "Guardando..." : "Guardar"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}

export function ProfileComplete() {
	return (
		<div className="flex items-center gap-2 rounded-lg bg-success/10 px-4 py-3">
			<CheckCircle weight="BoldDuotone" size={20} className="text-success" />
			<span className="text-base font-medium text-success">
				Perfil completo
			</span>
		</div>
	);
}
