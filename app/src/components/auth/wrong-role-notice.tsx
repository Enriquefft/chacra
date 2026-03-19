import Link from "next/link";
import { Logo } from "@/components/landing/logo";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const roleURLs: Record<string, string> = {
	farmer: "/farmer",
	cooperative: "/dashboard",
	financiera: "/scoring",
};

const roleLabels: Record<string, string> = {
	farmer: "agricultor",
	cooperative: "cooperativa",
	financiera: "financiera",
};

export function WrongRoleNotice({
	currentRole,
}: {
	currentRole: string;
	expectedRole: string;
}) {
	const label = roleLabels[currentRole] ?? currentRole;
	const url = roleURLs[currentRole] ?? "/";

	return (
		<div className="flex min-h-screen items-center justify-center px-4">
			<Card className="w-full max-w-sm">
				<CardHeader className="flex flex-col items-center gap-2">
					<Logo className="h-10 w-auto text-foreground" />
					<CardTitle className="text-xl font-semibold tracking-tight">
						Cuenta existente
					</CardTitle>
					<CardDescription className="text-center text-base text-muted-foreground">
						Tu cuenta esta registrada como {label}.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex justify-center">
					<Button asChild>
						<Link href={url}>Ir a mi panel</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
