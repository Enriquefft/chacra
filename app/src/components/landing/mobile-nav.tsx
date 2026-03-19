"use client";

import { HamburgerMenu } from "@solar-icons/react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/landing/logo";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

const links = [
	{ label: "Problema", href: "#problema" },
	{ label: "Productores", href: "#productores" },
	{ label: "Cooperativas", href: "#cooperativas" },
	{ label: "Financieras", href: "#financieras" },
];

export function MobileNav() {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="lg:hidden">
					<HamburgerMenu weight="Linear" size={20} />
					<span className="sr-only">Menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="w-full sm:max-w-sm">
				<SheetHeader>
					<SheetTitle>
						<Logo className="h-6" />
					</SheetTitle>
				</SheetHeader>
				<nav className="flex flex-col gap-1 px-4">
					{links.map((link) => (
						<a
							key={link.href}
							href={link.href}
							onClick={() => setOpen(false)}
							className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
						>
							{link.label}
						</a>
					))}
				</nav>
				<div className="mt-auto flex flex-col gap-2 p-4">
					<Button size="lg" className="w-full" asChild>
						<Link href="/dashboard" onClick={() => setOpen(false)}>
							Registra tu cooperativa
						</Link>
					</Button>
					<Button size="lg" variant="outline" className="w-full" asChild>
						<a
							href="https://cal.com/enrique-flores/chacra"
							target="_blank"
							rel="noopener noreferrer"
							onClick={() => setOpen(false)}
						>
							Habla con el equipo
						</a>
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
