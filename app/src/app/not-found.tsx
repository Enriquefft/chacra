import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
	return (
		<div className="flex min-h-dvh items-center justify-center bg-background px-4">
			<Card className="w-full max-w-sm text-center">
				<CardHeader className="flex flex-col items-center gap-3">
					<span className="text-5xl font-semibold text-muted-foreground">
						404
					</span>
					<CardTitle className="text-xl">Pagina no encontrada</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						La pagina que buscas no existe.
					</p>
				</CardContent>
				<CardFooter>
					<Button className="w-full" asChild>
						<Link href="/">Volver al inicio</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
