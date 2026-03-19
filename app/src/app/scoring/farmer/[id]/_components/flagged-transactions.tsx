import { DangerTriangle } from "@/components/auth/solar-icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface FlaggedTransaction {
	id: number;
	product: string;
	quantityKg: number;
	pricePerKg: number;
	date: string;
}

export function FlaggedTransactions({
	transactions,
}: {
	transactions: FlaggedTransaction[];
}) {
	if (transactions.length === 0) {
		return null;
	}

	return (
		<Card className="border-2 border-destructive/30 bg-destructive/5">
			<CardContent className="pt-5">
				<div className="flex items-start gap-3">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
						<DangerTriangle
							weight="BoldDuotone"
							size={22}
							className="text-destructive"
							aria-hidden="true"
						/>
					</div>
					<div className="flex-1">
						<p className="text-sm font-medium">Transacciones Flaggeadas</p>
						<p className="mt-0.5 text-xs text-muted-foreground">
							{transactions.length}{" "}
							{transactions.length === 1
								? "transaccion requiere revision"
								: "transacciones requieren revision"}
						</p>
					</div>
					<Badge variant="destructive" className="shrink-0">
						Requiere revision
					</Badge>
				</div>
				<div className="mt-4 flex flex-col gap-2">
					{transactions.map((txn) => (
						<div
							key={txn.id}
							className="rounded-lg border border-destructive/20 bg-background p-4"
						>
							<div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
								<div>
									<p className="text-xs text-muted-foreground">Producto</p>
									<p className="mt-0.5 font-medium">{txn.product}</p>
								</div>
								<div>
									<p className="text-xs text-muted-foreground">Cantidad</p>
									<p className="mt-0.5 font-medium tabular-nums">
										{txn.quantityKg} kg
									</p>
								</div>
								<div>
									<p className="text-xs text-muted-foreground">Precio</p>
									<p className="mt-0.5 font-medium tabular-nums">
										S/{txn.pricePerKg.toFixed(2)}/kg
									</p>
								</div>
								<div>
									<p className="text-xs text-muted-foreground">Fecha</p>
									<p className="mt-0.5 font-medium">{txn.date}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
