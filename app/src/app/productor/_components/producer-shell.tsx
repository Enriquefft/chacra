"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
	Cart,
	CloudCross,
	Download,
	History,
	Logout,
	Refresh,
} from "@/components/auth/solar-icons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useInstallPrompt } from "@/hooks/use-install-prompt";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { usePendingCount } from "@/hooks/use-pending-count";
import { useSync } from "@/hooks/use-sync";
import { signOut } from "@/lib/auth-client";
import { offlineDb } from "@/lib/offline-db";

export function ProducerShell({
	producerName,
	cooperativeId,
	productList,
	children,
}: {
	producerName: string;
	cooperativeId: string;
	productList: string[];
	children: React.ReactNode;
}) {
	const isOnline = useOnlineStatus();
	const pendingCount = usePendingCount();
	const { sync, isSyncing } = useSync();
	const { canInstall, install, dismiss } = useInstallPrompt();
	const pathname = usePathname();
	const wasOffline = useRef(!isOnline);

	// Cache product list to Dexie on mount
	useEffect(() => {
		offlineDb.cachedProducts.put({
			cooperativeId,
			products: productList,
			cachedAt: Date.now(),
		});
	}, [cooperativeId, productList]);

	// Register service worker on mount
	useEffect(() => {
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.register("/sw.js").catch(() => {
				// Service worker registration failed silently
			});
		}
	}, []);

	// Auto-sync: on mount when online, and on reconnection (offline -> online)
	useEffect(() => {
		if (isOnline && pendingCount > 0) {
			sync();
		}
		wasOffline.current = !isOnline;
	}, [isOnline, pendingCount, sync]);

	return (
		<div className="mx-auto flex min-h-dvh max-w-md flex-col">
			{/* Header */}
			<header className="flex items-center justify-between px-4 pt-4 pb-2">
				<div className="flex flex-col gap-0">
					<span className="text-lg font-semibold tracking-tight">Chacra</span>
					<span className="text-sm text-muted-foreground">{producerName}</span>
				</div>
				<div className="flex items-center gap-2">
					<SyncButton
						pendingCount={pendingCount}
						isSyncing={isSyncing}
						isOnline={isOnline}
						onSync={sync}
					/>
					<Button
						variant="ghost"
						size="default"
						className="min-h-11"
						onClick={() =>
							signOut({
								fetchOptions: { onSuccess: () => window.location.assign("/") },
							})
						}
					>
						<Logout weight="Linear" size={16} data-icon="inline-start" />
						Salir
					</Button>
				</div>
			</header>

			{/* Offline banner */}
			{!isOnline && (
				<div className="px-4 pt-2">
					<Alert className="border-warning/30 bg-warning/10">
						<CloudCross
							weight="BoldDuotone"
							size={16}
							className="text-warning"
						/>
						<AlertDescription className="text-warning">
							Sin conexion — tus datos se guardan localmente
						</AlertDescription>
					</Alert>
				</div>
			)}

			{/* Install banner */}
			{canInstall && (
				<div className="px-4 pt-2">
					<Alert className="border-primary/30 bg-primary/5">
						<Download
							weight="BoldDuotone"
							size={16}
							className="text-primary"
						/>
						<AlertDescription className="flex items-center justify-between gap-2 text-foreground">
							<span>Instala Chacra para acceso rapido</span>
							<span className="flex shrink-0 gap-1.5">
								<Button size="sm" variant="ghost" onClick={dismiss}>
									Ahora no
								</Button>
								<Button size="sm" onClick={install}>
									Instalar
								</Button>
							</span>
						</AlertDescription>
					</Alert>
				</div>
			)}

			{/* Content */}
			<main className="flex-1 px-4 py-4">{children}</main>

			{/* Bottom navigation */}
			<nav className="sticky bottom-0 flex border-t bg-background">
				<Link
					href="/productor"
					className={`flex flex-1 flex-col items-center gap-1 py-3 text-sm transition-colors ${
						pathname === "/productor" ? "text-primary" : "text-muted-foreground"
					}`}
				>
					<Cart
						weight={pathname === "/productor" ? "BoldDuotone" : "Linear"}
						size={24}
					/>
					<span>Registrar</span>
				</Link>
				<Link
					href="/productor/history"
					className={`flex flex-1 flex-col items-center gap-1 py-3 text-sm transition-colors ${
						pathname === "/productor/history"
							? "text-primary"
							: "text-muted-foreground"
					}`}
				>
					<History
						weight={pathname === "/productor/history" ? "BoldDuotone" : "Linear"}
						size={24}
					/>
					<span>Historial</span>
				</Link>
			</nav>
		</div>
	);
}

function SyncButton({
	pendingCount,
	isSyncing,
	isOnline,
	onSync,
}: {
	pendingCount: number;
	isSyncing: boolean;
	isOnline: boolean;
	onSync: () => void;
}) {
	if (pendingCount === 0 && !isSyncing) {
		return null;
	}

	return (
		<Button
			variant="ghost"
			size="default"
			onClick={onSync}
			disabled={isSyncing || !isOnline}
			className="relative min-h-11"
		>
			<Refresh
				weight="Linear"
				size={16}
				className={isSyncing ? "animate-spin" : ""}
				data-icon="inline-start"
			/>
			Sincronizar
			{pendingCount > 0 && (
				<Badge className="ml-1 bg-warning text-warning-foreground">
					{pendingCount}
				</Badge>
			)}
		</Button>
	);
}
