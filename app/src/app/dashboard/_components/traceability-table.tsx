import Link from "next/link";
import { IntegrityBadge } from "@/components/integrity-badge";
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
	farmerId: string;
	farmerName: string | null;
	product: string | null;
	quantityKg: number | null;
	pricePerKg: number | null;
	buyer: string | null;
	date: string;
	integrityStatus: "confirmed" | "flagged" | "pending";
};

export function TraceabilityTable({
	transactions,
}: {
	transactions: TransactionRow[];
}) {
	if (transactions.length === 0) {
		return null;
	}

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="text-base">Ultimas Transacciones</CardTitle>
			</CardHeader>
			<CardContent className="px-0 pb-0">
				<div className="overflow-x-auto rounded-b-xl border-t">
					<Table>
						<TableHeader>
							<TableRow className="bg-muted/30 hover:bg-muted/30">
								<TableHead>Productor</TableHead>
								<TableHead>Cultivo</TableHead>
								<TableHead>Cantidad (kg)</TableHead>
								<TableHead>Precio/kg</TableHead>
								<TableHead className="hidden sm:table-cell">Fecha</TableHead>
								<TableHead>Estado</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{transactions.map((tx) => {
								const isFlagged = tx.integrityStatus === "flagged";
								return (
									<TableRow
										key={tx.id}
										className={isFlagged ? "bg-destructive/5" : undefined}
									>
										<TableCell className="max-w-[140px] truncate font-medium">
											<Link
												href={`/dashboard/producer/${tx.farmerId}`}
												className="hover:underline"
											>
												{tx.farmerName ?? "Sin nombre"}
											</Link>
										</TableCell>
										<TableCell>{tx.product ?? "—"}</TableCell>
										<TableCell
											className={`tabular-nums ${isFlagged ? "font-semibold text-destructive" : ""}`}
										>
											{tx.quantityKg != null
												? tx.quantityKg.toLocaleString("es-PE")
												: "—"}
										</TableCell>
										<TableCell className="tabular-nums">
											{tx.pricePerKg != null
												? `S/${tx.pricePerKg.toFixed(2)}`
												: "—"}
										</TableCell>
										<TableCell className="hidden text-muted-foreground sm:table-cell">
											{tx.date}
										</TableCell>
										<TableCell>
											<IntegrityBadge status={tx.integrityStatus} />
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
