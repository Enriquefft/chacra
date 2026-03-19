"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { confirmTransaction, rejectTransaction } from "@/actions/transactions";
import { IntegrityBadge } from "@/components/integrity-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type TransactionRow = {
	id: number;
	uuid: string;
	product: string;
	quantityKg: number;
	pricePerKg: number;
	buyer: string | null;
	date: string;
	integrityStatus: "confirmed" | "flagged" | "pending";
	createdAt: Date;
};

export function ProducerTransactionsTable({
	transactions,
	total,
}: {
	transactions: TransactionRow[];
	total: number;
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	function handleConfirm(txId: number) {
		startTransition(async () => {
			await confirmTransaction(txId);
			router.refresh();
		});
	}

	function handleReject(txId: number) {
		startTransition(async () => {
			await rejectTransaction(txId);
			router.refresh();
		});
	}

	if (transactions.length === 0) {
		return (
			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base">Transacciones</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						Este productor no tiene transacciones registradas.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-baseline justify-between">
					<CardTitle className="text-base">Transacciones</CardTitle>
					<span className="text-xs text-muted-foreground">{total} total</span>
				</div>
			</CardHeader>
			<CardContent className="px-0 pb-0">
				<div className="overflow-x-auto rounded-b-xl border-t">
					<Table>
						<TableHeader>
							<TableRow className="bg-muted/30 hover:bg-muted/30">
								<TableHead>Fecha</TableHead>
								<TableHead>Producto</TableHead>
								<TableHead>Cantidad</TableHead>
								<TableHead>Precio/kg</TableHead>
								<TableHead className="hidden sm:table-cell">Total</TableHead>
								<TableHead>Estado</TableHead>
								<TableHead>Acciones</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{transactions.map((tx) => {
								const total = tx.quantityKg * tx.pricePerKg;
								const isFlagged = tx.integrityStatus === "flagged";
								const isPendingOrFlagged =
									tx.integrityStatus === "flagged" ||
									tx.integrityStatus === "pending";

								return (
									<TableRow
										key={tx.id}
										className={isFlagged ? "bg-destructive/5" : undefined}
									>
										<TableCell className="text-muted-foreground">
											{tx.date}
										</TableCell>
										<TableCell>{tx.product}</TableCell>
										<TableCell
											className={`tabular-nums ${isFlagged ? "font-semibold text-destructive" : ""}`}
										>
											{tx.quantityKg.toLocaleString("es-PE")} kg
										</TableCell>
										<TableCell className="tabular-nums">
											S/{tx.pricePerKg.toFixed(2)}
										</TableCell>
										<TableCell className="hidden tabular-nums sm:table-cell">
											S/
											{total.toLocaleString("es-PE", {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</TableCell>
										<TableCell>
											<IntegrityBadge status={tx.integrityStatus} />
										</TableCell>
										<TableCell>
											{isPendingOrFlagged ? (
												<div className="flex gap-1">
													<Button
														size="xs"
														disabled={isPending}
														onClick={() => handleConfirm(tx.id)}
													>
														Confirmar
													</Button>
													<Button
														size="xs"
														variant="destructive"
														disabled={isPending}
														onClick={() => handleReject(tx.id)}
													>
														Rechazar
													</Button>
												</div>
											) : (
												<span className="text-xs text-muted-foreground">—</span>
											)}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}
