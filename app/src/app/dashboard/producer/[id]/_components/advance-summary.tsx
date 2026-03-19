import { BillList } from "@/components/auth/solar-icons";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdvanceCategory, AdvanceItem } from "@/lib/types";
import { AdvanceDeleteButton } from "./advance-delete-button";

const CATEGORY_LABELS: Record<AdvanceCategory, string> = {
	fertilizante: "Fertilizante",
	semillas: "Semillas",
	herramientas: "Herramientas",
	mano_de_obra: "Mano de obra",
	transporte: "Transporte",
	otro: "Otro",
};

function formatCurrency(amount: number): string {
	return amount.toLocaleString("es-PE", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

function getCategoryBreakdown(advances: AdvanceItem[]): {
	category: AdvanceCategory;
	label: string;
	total: number;
	count: number;
}[] {
	const map = new Map<AdvanceCategory, { total: number; count: number }>();

	for (const a of advances) {
		const existing = map.get(a.category) ?? { total: 0, count: 0 };
		existing.total += a.amount;
		existing.count += 1;
		map.set(a.category, existing);
	}

	return Array.from(map.entries())
		.map(([category, { total, count }]) => ({
			category,
			label: CATEGORY_LABELS[category] ?? category,
			total,
			count,
		}))
		.sort((a, b) => b.total - a.total);
}

export function AdvanceSummary({
	advances,
	total,
	totalAmount,
}: {
	advances: AdvanceItem[];
	total: number;
	totalAmount: number;
}) {
	if (advances.length === 0) {
		return (
			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base">Adelantos registrados</CardTitle>
				</CardHeader>
				<CardContent>
					<EmptyState
						icon={BillList}
						title="Sin adelantos"
						description="No se han registrado adelantos de insumos para este productor."
					/>
				</CardContent>
			</Card>
		);
	}

	const breakdown = getCategoryBreakdown(advances);
	const recentAdvances = advances.slice(0, 10);

	return (
		<div className="flex flex-col gap-4">
			{/* Total + breakdown */}
			<Card>
				<CardHeader className="pb-3">
					<div className="flex items-baseline justify-between">
						<CardTitle className="text-base">Resumen de adelantos</CardTitle>
						<span className="text-xs text-muted-foreground">
							{total} {total === 1 ? "adelanto" : "adelantos"}
						</span>
					</div>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					{/* Total amount */}
					<div className="rounded-lg bg-muted px-4 py-3">
						<p className="text-sm text-muted-foreground">Total adelantos</p>
						<p className="text-2xl font-semibold tabular-nums">
							S/ {formatCurrency(totalAmount)}
						</p>
					</div>

					{/* Category breakdown */}
					<div className="flex flex-col gap-2">
						<p className="text-sm font-medium text-muted-foreground">
							Por categoria
						</p>
						<div className="flex flex-col gap-1.5">
							{breakdown.map((item) => (
								<div
									key={item.category}
									className="flex items-center justify-between text-sm"
								>
									<div className="flex items-center gap-2">
										<Badge variant="secondary" className="text-xs">
											{item.label}
										</Badge>
										<span className="text-xs text-muted-foreground">
											({item.count})
										</span>
									</div>
									<span className="font-medium tabular-nums">
										S/ {formatCurrency(item.total)}
									</span>
								</div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Recent advances list */}
			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base">Adelantos recientes</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-2 px-4 pb-4">
					{recentAdvances.map((advance) => (
						<div
							key={advance.id}
							className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
						>
							<div className="flex flex-col gap-0.5 min-w-0">
								<div className="flex items-center gap-2">
									<Badge variant="outline" className="shrink-0 text-xs">
										{CATEGORY_LABELS[advance.category] ?? advance.category}
									</Badge>
									{advance.description && (
										<span className="truncate text-sm">
											{advance.description}
										</span>
									)}
								</div>
								<span className="text-xs text-muted-foreground">
									{advance.date}
								</span>
							</div>
							<div className="flex items-center gap-2 shrink-0">
								<span className="font-medium tabular-nums text-sm">
									S/ {formatCurrency(advance.amount)}
								</span>
								<AdvanceDeleteButton advanceId={advance.id} />
							</div>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
