"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { completeFinancieraOnboarding } from "@/actions/onboarding";
import { Logo } from "@/components/landing/logo";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function FinancieraAutoOnboard() {
	const router = useRouter();
	const called = useRef(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		if (called.current) return;
		called.current = true;

		completeFinancieraOnboarding()
			.then(() => {
				router.refresh();
			})
			.catch(() => {
				setError(true);
			});
	}, [router]);

	return (
		<div className="flex min-h-screen items-center justify-center px-4">
			<Card className="w-full max-w-sm">
				<CardHeader className="flex flex-col items-center gap-2">
					<Logo className="h-10 w-auto text-foreground" />
					<CardTitle className="text-xl font-semibold tracking-tight">
						{error ? "Error al configurar" : "Configurando tu cuenta..."}
					</CardTitle>
					<CardDescription className="text-center text-base text-muted-foreground">
						{error
							? "No se pudo completar la configuracion. Intenta de nuevo."
							: "Un momento por favor"}
					</CardDescription>
				</CardHeader>
				{error && (
					<CardContent className="flex flex-col gap-2">
						<Button
							onClick={() => {
								setError(false);
								called.current = false;
								completeFinancieraOnboarding()
									.then(() => router.refresh())
									.catch(() => setError(true));
							}}
							className="w-full"
						>
							Reintentar
						</Button>
					</CardContent>
				)}
			</Card>
		</div>
	);
}
