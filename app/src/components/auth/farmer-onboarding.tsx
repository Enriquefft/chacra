"use client";

import { useActionState, useId } from "react";
import { completeFarmerOnboarding } from "@/actions/onboarding";
import { Logo } from "@/components/landing/logo";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type State = {
	error?: string;
	success?: boolean;
	cooperativeName?: string;
};

function formAction(_prev: State, formData: FormData): Promise<State> {
	const inviteCode = (formData.get("inviteCode") as string) ?? "";
	const farmerName = (formData.get("farmerName") as string) ?? "";
	const farmerRegion = (formData.get("farmerRegion") as string) ?? "";
	return completeFarmerOnboarding(inviteCode, farmerName, farmerRegion);
}

export function FarmerOnboarding({ userName }: { userName: string }) {
	const [state, action, pending] = useActionState(formAction, {});
	const id = useId();
	const inviteCodeId = `${id}-inviteCode`;
	const farmerNameId = `${id}-farmerName`;
	const farmerRegionId = `${id}-farmerRegion`;

	if (state.success) {
		return (
			<div className="flex min-h-screen items-center justify-center px-4">
				<Card className="w-full max-w-sm">
					<CardHeader className="flex flex-col items-center gap-2">
						<Logo className="h-10 w-auto text-foreground" />
						<CardTitle className="text-2xl font-semibold tracking-tight">
							Listo
						</CardTitle>
						<CardDescription className="text-center text-base text-muted-foreground">
							Te uniste a {state.cooperativeName}. Redirigiendo...
						</CardDescription>
					</CardHeader>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center px-4">
			<Card className="w-full max-w-sm">
				<CardHeader className="flex flex-col items-center gap-2">
					<Logo className="h-10 w-auto text-foreground" />
					<CardTitle className="text-2xl font-semibold tracking-tight">
						Bienvenido, {userName}
					</CardTitle>
					<CardDescription className="text-center text-base text-muted-foreground">
						Completa tu registro para comenzar
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={action} className="flex flex-col gap-4">
						<div className="flex flex-col gap-1">
							<label
								htmlFor={inviteCodeId}
								className="text-sm text-muted-foreground"
							>
								Codigo de invitacion
							</label>
							<Input
								id={inviteCodeId}
								name="inviteCode"
								placeholder="Ej: ABC123"
								maxLength={6}
								className="h-11 text-base uppercase"
								required
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label
								htmlFor={farmerNameId}
								className="text-sm text-muted-foreground"
							>
								Tu nombre
							</label>
							<Input
								id={farmerNameId}
								name="farmerName"
								defaultValue={userName}
								className="h-11 text-base"
								required
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label
								htmlFor={farmerRegionId}
								className="text-sm text-muted-foreground"
							>
								Region
							</label>
							<Input
								id={farmerRegionId}
								name="farmerRegion"
								placeholder="Ej: Jaen, Cajamarca"
								className="h-11 text-base"
								required
							/>
						</div>
						{state.error && (
							<p className="text-sm text-destructive">{state.error}</p>
						)}
						<Button type="submit" size="lg" disabled={pending}>
							{pending ? "Registrando..." : "Unirme a la cooperativa"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
