"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { History } from "@/components/auth/solar-icons";
import { EmptyState } from "@/components/empty-state";
import { IntegrityBadge } from "@/components/integrity-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { offlineDb } from "@/lib/offline-db";

interface SyncedTransaction {
	id: number;
	uuid: string;
	product: string | null;
	quantityKg: number | null;
	pricePerKg: number | null;
	buyer: string | null;
	photoUrl: string | null;
	date: string;
	integrityStatus: "confirmed" | "flagged" | "pending";
	priceSignal: "above" | "below" | "at" | null;
}

function formatCurrency(amount: number): string {
	return amount.toLocaleString("es-PE", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

function formatDate(dateStr: string): string {
	const [year, month, day] = dateStr.split("-");
	return `${day}/${month}/${year}`;
}

function PriceSignalBadge({
	signal,
}: {
	signal: "above" | "below" | "at" | null;
}) {
	if (!signal) return null;

	if (signal === "above") {
		return (
			<Badge className="border-success/20 bg-success/10 text-success">
				Por encima del mercado
			</Badge>
		);
	}
	if (signal === "below") {
		return <Badge variant="destructive">Por debajo del mercado</Badge>;
	}
	return <Badge variant="secondary">En mercado</Badge>;
}

export function TransactionHistory({
	syncedTransactions,
}: {
	syncedTransactions: SyncedTransaction[];
}) {
	const pendingTransactions = useLiveQuery(
		() =>
			offlineDb.pendingTransactions.orderBy("createdAt").reverse().toArray(),
		[],
		[],
	);

	const hasPending = pendingTransactions.length > 0;
	const hasSynced = syncedTransactions.length > 0;

	if (!hasPending && !hasSynced) {
		return (
			<div className="flex flex-col gap-6">
				<h1 className="text-2xl font-semibold tracking-tight">Historial</h1>
				<EmptyState
					icon={History}
					title="No hay registros"
					description="Tus ventas apareceran aqui."
				/>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-2xl font-semibold tracking-tight">Historial</h1>

			{/* Pending transactions */}
			{hasPending && (
				<div className="flex flex-col gap-3">
					<h2 className="text-lg font-medium text-warning">
						Pendientes ({pendingTransactions.length})
					</h2>
					{pendingTransactions.map((tx) => (
						<Card key={tx.uuid} className="border-warning/30 bg-warning/5">
							<CardContent>
								<div className="flex items-start justify-between">
									<div className="flex flex-col gap-1">
										{tx.product ? (
											<>
												<p className="text-lg font-semibold">{tx.product}</p>
												{tx.quantityKg != null && tx.pricePerKg != null && (
													<p className="text-base text-muted-foreground">
														{formatCurrency(tx.quantityKg)} kg × S/
														{formatCurrency(tx.pricePerKg)} ={" "}
														<span className="font-medium text-foreground">
															S/
															{formatCurrency(tx.quantityKg * tx.pricePerKg)}
														</span>
													</p>
												)}
											</>
										) : (
											<p className="text-lg font-semibold text-muted-foreground">
												Solo foto de boleta
											</p>
										)}
										{tx.buyer && (
											<p className="text-base text-muted-foreground">
												{tx.buyer}
											</p>
										)}
									</div>
									<div className="flex flex-col items-end gap-1.5">
										<span className="text-sm text-muted-foreground">
											{formatDate(tx.date)}
										</span>
										<Badge className="border-warning/20 bg-warning/10 text-warning">
											{tx.syncStatus === "failed"
												? "Error"
												: tx.syncStatus === "syncing"
													? "Sincronizando"
													: "Pendiente"}
										</Badge>
									</div>
								</div>
								{tx.errorMessage && (
									<p className="mt-2 text-xs text-destructive">
										{tx.errorMessage}
									</p>
								)}
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Synced transactions */}
			{hasSynced && (
				<div className="flex flex-col gap-3">
					{hasPending && (
						<h2 className="text-lg font-medium">
							Sincronizados ({syncedTransactions.length})
						</h2>
					)}
					{syncedTransactions.map((tx) => (
						<Card key={tx.uuid}>
							<CardContent>
								<div className="flex items-start justify-between">
									<div className="flex flex-col gap-1">
										{tx.product ? (
											<>
												<p className="text-lg font-semibold">{tx.product}</p>
												{tx.quantityKg != null && tx.pricePerKg != null && (
													<p className="text-base text-muted-foreground">
														{formatCurrency(tx.quantityKg)} kg × S/
														{formatCurrency(tx.pricePerKg)} ={" "}
														<span className="font-medium text-foreground">
															S/
															{formatCurrency(tx.quantityKg * tx.pricePerKg)}
														</span>
													</p>
												)}
											</>
										) : (
											<p className="text-lg font-semibold text-muted-foreground">
												Solo foto de boleta
											</p>
										)}
										{tx.buyer && (
											<p className="text-base text-muted-foreground">
												{tx.buyer}
											</p>
										)}
									</div>
									<div className="flex flex-col items-end gap-1.5">
										<span className="text-sm text-muted-foreground">
											{formatDate(tx.date)}
										</span>
										{tx.photoUrl && (
											<a
												href={tx.photoUrl}
												target="_blank"
												rel="noopener noreferrer"
											>
												<img
													src={tx.photoUrl}
													alt="Boleta"
													className="h-10 w-10 rounded border object-cover"
												/>
											</a>
										)}
									</div>
								</div>
								<div className="mt-2 flex flex-wrap items-center gap-2">
									<IntegrityBadge status={tx.integrityStatus} />
									<PriceSignalBadge signal={tx.priceSignal} />
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
