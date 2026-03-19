"use client";

import { useActionState, useId, useState } from "react";
import { completeCooperativeOnboarding } from "@/actions/onboarding";
import { ClipboardText } from "@/components/auth/solar-icons";
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
	inviteCode?: string;
};

function formAction(_prev: State, formData: FormData): Promise<State> {
	const name = (formData.get("coopName") as string) ?? "";
	const region = (formData.get("coopRegion") as string) ?? "";
	return completeCooperativeOnboarding(name, region);
}

export function CooperativeOnboarding({ userName }: { userName: string }) {
	const [state, action, pending] = useActionState(formAction, {});
	const [copied, setCopied] = useState(false);
	const id = useId();
	const coopNameId = `${id}-coopName`;
	const coopRegionId = `${id}-coopRegion`;

	async function copyCode() {
		if (state.inviteCode) {
			await navigator.clipboard.writeText(state.inviteCode);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	}

	if (state.success && state.inviteCode) {
		return (
			<div className="flex min-h-screen items-center justify-center px-4">
				<Card className="w-full max-w-sm">
					<CardHeader className="flex flex-col items-center gap-2">
						<Logo className="h-10 w-auto text-foreground" />
						<CardTitle className="text-2xl font-semibold tracking-tight">
							Cooperativa creada
						</CardTitle>
						<CardDescription className="text-center text-base text-muted-foreground">
							Comparte este codigo con tus productores
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col items-center gap-4">
						<div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3">
							<span className="font-mono text-2xl font-semibold tracking-widest">
								{state.inviteCode}
							</span>
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={copyCode}
								aria-label="Copiar codigo"
							>
								<ClipboardText weight="Linear" size={20} />
							</Button>
						</div>
						{copied && (
							<p className="text-sm text-muted-foreground">Codigo copiado</p>
						)}
					</CardContent>
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
						Crea tu cooperativa para comenzar
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={action} className="flex flex-col gap-4">
						<div className="flex flex-col gap-1">
							<label
								htmlFor={coopNameId}
								className="text-sm text-muted-foreground"
							>
								Nombre de la cooperativa
							</label>
							<Input id={coopNameId} name="coopName" required />
						</div>
						<div className="flex flex-col gap-1">
							<label
								htmlFor={coopRegionId}
								className="text-sm text-muted-foreground"
							>
								Region
							</label>
							<Input
								id={coopRegionId}
								name="coopRegion"
								placeholder="Ej: Jaen, Cajamarca"
								required
							/>
						</div>
						{state.error && (
							<p className="text-sm text-destructive">{state.error}</p>
						)}
						<Button type="submit" disabled={pending}>
							{pending ? "Creando..." : "Crear cooperativa"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
