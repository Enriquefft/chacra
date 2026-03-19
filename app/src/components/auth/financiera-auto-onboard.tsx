"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { completeFinancieraOnboarding } from "@/actions/onboarding";
import { Logo } from "@/components/landing/logo";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function FinancieraAutoOnboard() {
	const router = useRouter();
	const called = useRef(false);

	useEffect(() => {
		if (called.current) return;
		called.current = true;

		completeFinancieraOnboarding().then(() => {
			router.refresh();
		});
	}, [router]);

	return (
		<div className="flex min-h-screen items-center justify-center px-4">
			<Card className="w-full max-w-sm">
				<CardHeader className="flex flex-col items-center gap-2">
					<Logo className="h-10 w-auto text-foreground" />
					<CardTitle className="text-xl font-semibold tracking-tight">
						Configurando tu cuenta...
					</CardTitle>
					<CardDescription className="text-center text-base text-muted-foreground">
						Un momento por favor
					</CardDescription>
				</CardHeader>
			</Card>
		</div>
	);
}
