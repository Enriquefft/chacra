"use client";

import { useActionState, useState } from "react";
import { updateCooperativeProfile } from "@/actions/cooperatives";
import {
	type CooperativeProfileData,
	ORG_TYPE_LABELS,
	ORG_TYPES,
	type OrgType,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type FormState = { error?: string; success?: boolean };

interface CooperativeProfileProps {
	initialData: {
		ruc: string | null;
		orgType: string | null;
		memberCount: number | null;
		address: string | null;
		yearFounded: number | null;
	};
}

function countCompleted(data: CooperativeProfileProps["initialData"]): number {
	let count = 0;
	if (data.ruc) count++;
	if (data.orgType) count++;
	if (data.memberCount) count++;
	if (data.address) count++;
	if (data.yearFounded) count++;
	return count;
}

export function CooperativeProfile({ initialData }: CooperativeProfileProps) {
	const [orgType, setOrgType] = useState<string>(initialData.orgType ?? "");
	const completed = countCompleted(initialData);
	const total = 5;
	const percentage = Math.round((completed / total) * 100);

	async function formAction(
		_prev: FormState,
		formData: FormData,
	): Promise<FormState> {
		const ruc = (formData.get("ruc") as string) || null;
		const orgTypeValue = (formData.get("orgType") as string) || null;
		const memberCountStr = formData.get("memberCount") as string;
		const address = (formData.get("address") as string) || null;
		const yearFoundedStr = formData.get("yearFounded") as string;

		const data: CooperativeProfileData = {
			ruc,
			orgType: orgTypeValue as OrgType | null,
			memberCount: memberCountStr ? Number(memberCountStr) : null,
			address,
			yearFounded: yearFoundedStr ? Number(yearFoundedStr) : null,
		};

		const result = await updateCooperativeProfile(data);
		if ("error" in result) {
			return { error: result.error };
		}
		return { success: true };
	}

	const [state, action, pending] = useActionState(formAction, {});

	return (
		<div className="flex flex-col gap-6">
			{/* Progress indicator */}
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<span className="text-sm text-muted-foreground">
						Progreso del perfil
					</span>
					<span className="text-sm font-medium tabular-nums">
						{completed} de {total} campos
					</span>
				</div>
				<Progress value={percentage} className="h-2" />
			</div>

			<form action={action} className="flex flex-col gap-4">
				{/* RUC */}
				<div className="flex flex-col gap-1.5">
					<label htmlFor="ruc" className="text-sm font-medium">
						RUC
					</label>
					<Input
						id="ruc"
						name="ruc"
						placeholder="11 digitos (ej: 20123456789)"
						defaultValue={initialData.ruc ?? ""}
						maxLength={11}
						pattern="\d{11}"
						inputMode="numeric"
					/>
					<span className="text-xs text-muted-foreground">
						Numero de identificacion tributaria SUNAT
					</span>
				</div>

				{/* Tipo de organizacion */}
				<div className="flex flex-col gap-1.5">
					<label htmlFor="orgType" className="text-sm font-medium">
						Tipo de organizacion
					</label>
					<input type="hidden" name="orgType" value={orgType} />
					<Select value={orgType} onValueChange={setOrgType}>
						<SelectTrigger id="orgType">
							<SelectValue placeholder="Selecciona un tipo" />
						</SelectTrigger>
						<SelectContent>
							{ORG_TYPES.map((type) => (
								<SelectItem key={type} value={type}>
									{ORG_TYPE_LABELS[type]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Numero de socios */}
				<div className="flex flex-col gap-1.5">
					<label htmlFor="memberCount" className="text-sm font-medium">
						Numero de socios
					</label>
					<Input
						id="memberCount"
						name="memberCount"
						type="number"
						placeholder="Ej: 120"
						defaultValue={initialData.memberCount ?? ""}
						min={1}
						inputMode="numeric"
					/>
				</div>

				{/* Direccion */}
				<div className="flex flex-col gap-1.5">
					<label htmlFor="address" className="text-sm font-medium">
						Direccion
					</label>
					<Input
						id="address"
						name="address"
						placeholder="Direccion fisica de la cooperativa"
						defaultValue={initialData.address ?? ""}
					/>
				</div>

				{/* Ano de fundacion */}
				<div className="flex flex-col gap-1.5">
					<label htmlFor="yearFounded" className="text-sm font-medium">
						Ano de fundacion
					</label>
					<Input
						id="yearFounded"
						name="yearFounded"
						type="number"
						placeholder="Ej: 1995"
						defaultValue={initialData.yearFounded ?? ""}
						min={1900}
						max={new Date().getFullYear()}
						inputMode="numeric"
					/>
				</div>

				{/* Submit */}
				<Button type="submit" disabled={pending} className="self-start">
					{pending ? "Guardando..." : "Guardar perfil"}
				</Button>

				{state.error && (
					<p className="text-sm text-destructive">{state.error}</p>
				)}
				{state.success && (
					<p className="text-sm text-success">Perfil actualizado correctamente</p>
				)}
			</form>
		</div>
	);
}
