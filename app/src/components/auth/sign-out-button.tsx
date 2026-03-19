"use client";

import { useRouter } from "next/navigation";
import { Logout } from "@/components/auth/solar-icons";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";

export function SignOutButton({
	variant = "ghost",
	size = "default",
}: {
	variant?: "ghost" | "outline" | "secondary";
	size?: "default" | "sm" | "xs";
}) {
	const router = useRouter();

	async function handleSignOut() {
		await signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/");
				},
			},
		});
	}

	return (
		<Button variant={variant} size={size} onClick={handleSignOut}>
			<Logout weight="Linear" size={16} data-icon="inline-start" />
			Salir
		</Button>
	);
}
