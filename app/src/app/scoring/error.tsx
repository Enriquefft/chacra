"use client";

import Link from "next/link";
import { DangerTriangle } from "@/components/auth/solar-icons";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function ScoringError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="flex min-h-[60vh] items-center justify-center px-4">
			<Card className="w-full max-w-sm text-center">
				<CardHeader className="flex flex-col items-center gap-3">
					<div className="rounded-xl bg-destructive/10 p-3">
						<DangerTriangle
							weight="BoldDuotone"
							size={32}
							className="text-destructive"
						/>
					</div>
					<CardTitle className="text-xl">Algo salio mal</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						{error.message?.slice(0, 200) ||
							"Ocurrio un error inesperado."}
					</p>
				</CardContent>
				<CardFooter className="flex flex-col gap-2">
					<Button onClick={reset} className="w-full">
						Intentar de nuevo
					</Button>
					<Button variant="ghost" className="w-full" asChild>
						<Link href="/">Volver al inicio</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
