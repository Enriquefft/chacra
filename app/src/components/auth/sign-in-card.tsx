"use client";

import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Logo } from "@/components/landing/logo";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function SignInCard({
	title,
	description,
	callbackURL,
}: {
	title: string;
	description: string;
	callbackURL: string;
}) {
	return (
		<div className="flex min-h-screen items-center justify-center px-4">
			<Card className="w-full max-w-sm">
				<CardHeader className="flex flex-col items-center gap-4">
					<Logo className="h-10 w-auto text-foreground" />
					<div className="flex flex-col items-center gap-1">
						<CardTitle className="text-2xl font-semibold tracking-tight">
							{title}
						</CardTitle>
						<CardDescription className="text-center text-base text-muted-foreground">
							{description}
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<GoogleSignInButton callbackURL={callbackURL} />
				</CardContent>
			</Card>
		</div>
	);
}
