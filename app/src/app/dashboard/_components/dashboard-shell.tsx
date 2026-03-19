"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import {
	Home,
	Settings,
	UsersGroupRounded,
} from "@/components/auth/solar-icons";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

const navItems = [
	{ label: "Inicio", href: "/dashboard", icon: Home },
	{
		label: "Productores",
		href: "/dashboard/producers",
		icon: UsersGroupRounded,
	},
	{ label: "Configuracion", href: "/dashboard/settings", icon: Settings },
];

export function DashboardShell({
	cooperativeName,
	children,
}: {
	cooperativeName: string;
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	return (
		<SidebarProvider>
			<Sidebar>
				<SidebarHeader className="px-4 py-4">
					<span className="text-base font-semibold tracking-tight">
						{cooperativeName}
					</span>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarMenu>
								{navItems.map((item) => (
									<SidebarMenuItem key={item.href}>
										<SidebarMenuButton
											asChild
											isActive={pathname === item.href}
										>
											<Link href={item.href}>
												<item.icon weight="BoldDuotone" size={20} />
												<span>{item.label}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter className="px-4 py-4">
					<SignOutButton variant="ghost" size="sm" />
				</SidebarFooter>
			</Sidebar>
			<SidebarInset>
				<header className="flex h-12 items-center gap-2 border-b px-4">
					<SidebarTrigger />
					<span className="text-sm font-medium text-muted-foreground">
						{cooperativeName}
					</span>
				</header>
				<main className="flex-1 p-4">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
