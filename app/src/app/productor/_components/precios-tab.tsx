"use client";

import type { ProductPriceData } from "@/lib/types";
import {
	AltArrowDown,
	AltArrowUp,
	TagPrice,
} from "@/components/auth/solar-icons";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function formatCurrency(amount: number): string {
	return amount.toLocaleString("es-PE", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

function getSignalLabel(
	lastPrice: number,
	benchmark: { floor: number; ceiling: number; average: number },
): { label: string; variant: "success" | "destructive" | "secondary" } {
	if (lastPrice > benchmark.ceiling) {
		return { label: "Buen precio", variant: "success" };
	}
	if (lastPrice < benchmark.floor) {
		return { label: "Precio bajo", variant: "destructive" };
	}
	return { label: "Precio normal", variant: "secondary" };
}

function getTrend(
	lastPrice: number | null,
	previousPrice: number | null,
): "up" | "down" | "stable" | null {
	if (lastPrice === null || previousPrice === null) return null;
	const diff = lastPrice - previousPrice;
	const threshold = previousPrice * 0.02; // 2% threshold
	if (diff > threshold) return "up";
	if (diff < -threshold) return "down";
	return "stable";
}

function TrendIndicator({ trend }: { trend: "up" | "down" | "stable" | null }) {
	if (!trend) return null;
	if (trend === "up") {
		return (
			<span className="inline-flex items-center gap-0.5 text-sm font-medium text-success">
				<AltArrowUp weight="BoldDuotone" size={16} />
				Subiendo
			</span>
		);
	}
	if (trend === "down") {
		return (
			<span className="inline-flex items-center gap-0.5 text-sm font-medium text-destructive">
				<AltArrowDown weight="BoldDuotone" size={16} />
				Bajando
			</span>
		);
	}
	return (
		<span className="text-sm font-medium text-muted-foreground">Estable</span>
	);
}

function PriceRangeBar({
	floor,
	ceiling,
	average,
	lastPrice,
}: {
	floor: number;
	ceiling: number;
	average: number;
	lastPrice: number | null;
}) {
	// Position average and lastPrice on the bar relative to floor-ceiling range
	const range = ceiling - floor;
	if (range <= 0) return null;

	const avgPos = Math.min(Math.max(((average - floor) / range) * 100, 0), 100);
	const lastPricePos =
		lastPrice !== null
			? Math.min(Math.max(((lastPrice - floor) / range) * 100, 0), 100)
			: null;

	return (
		<div className="flex flex-col gap-1.5">
			<div className="relative h-3 w-full rounded-full bg-muted">
				{/* Full range bar */}
				<div className="absolute inset-y-0 left-0 right-0 rounded-full bg-primary/20" />
				{/* Average marker */}
				<div
					className="absolute top-0 h-3 w-1 rounded-full bg-primary/60"
					style={{ left: `${avgPos}%`, transform: "translateX(-50%)" }}
				/>
				{/* Producer's last price marker */}
				{lastPricePos !== null && (
					<div
						className="absolute top-0 h-3 w-2 rounded-full bg-primary"
						style={{ left: `${lastPricePos}%`, transform: "translateX(-50%)" }}
					/>
				)}
			</div>
			<div className="flex items-center justify-between">
				<span className="text-xs text-muted-foreground">
					S/ {formatCurrency(floor)}
				</span>
				<span className="text-xs text-muted-foreground">
					Promedio: S/ {formatCurrency(average)}
				</span>
				<span className="text-xs text-muted-foreground">
					S/ {formatCurrency(ceiling)}
				</span>
			</div>
		</div>
	);
}

function ProductPriceCard({ data }: { data: ProductPriceData }) {
	const { product, benchmark, lastPrice, previousPrice } = data;
	const trend = getTrend(lastPrice, previousPrice);

	if (!benchmark) {
		return (
			<Card>
				<CardContent>
					<div className="flex flex-col gap-2">
						<p className="text-lg font-semibold">{product}</p>
						<p className="text-base text-muted-foreground">
							Aun no hay suficientes datos de precios para esta zona.
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	const signal =
		lastPrice !== null ? getSignalLabel(lastPrice, benchmark) : null;

	return (
		<Card>
			<CardContent className="flex flex-col gap-3">
				{/* Product header with signal */}
				<div className="flex items-center justify-between">
					<p className="text-lg font-semibold">{product}</p>
					<div className="flex items-center gap-2">
						{trend && <TrendIndicator trend={trend} />}
						{signal && (
							<Badge
								className={
									signal.variant === "success"
										? "border-success/20 bg-success/10 text-success"
										: signal.variant === "destructive"
											? ""
											: ""
								}
								variant={
									signal.variant === "destructive"
										? "destructive"
										: signal.variant === "secondary"
											? "secondary"
											: "default"
								}
							>
								{signal.label}
							</Badge>
						)}
					</div>
				</div>

				{/* Price range bar */}
				<PriceRangeBar
					floor={benchmark.floor}
					ceiling={benchmark.ceiling}
					average={benchmark.average}
					lastPrice={lastPrice}
				/>

				{/* Producer's last price vs average */}
				{lastPrice !== null ? (
					<div className="flex items-baseline justify-between rounded-lg bg-muted px-3 py-2">
						<div className="flex flex-col">
							<span className="text-sm text-muted-foreground">
								Tu ultimo precio
							</span>
							<span className="text-xl font-semibold">
								S/ {formatCurrency(lastPrice)}
							</span>
						</div>
						<div className="flex flex-col items-end">
							<span className="text-sm text-muted-foreground">
								Promedio zona
							</span>
							<span className="text-base font-medium text-muted-foreground">
								S/ {formatCurrency(benchmark.average)}
							</span>
						</div>
					</div>
				) : (
					<p className="text-sm text-muted-foreground">
						Registra una venta de {product.toLowerCase()} para ver tu precio.
					</p>
				)}

				{/* Data points info */}
				<p className="text-xs text-muted-foreground">
					Basado en {benchmark.dataPoints} transacciones en tu zona
				</p>
			</CardContent>
		</Card>
	);
}

export function PreciosTab({ products }: { products: ProductPriceData[] }) {
	if (products.length === 0) {
		return (
			<EmptyState
				icon={TagPrice}
				title="Sin productos"
				description="Tu cooperativa aun no ha configurado productos."
			/>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-2xl font-semibold tracking-tight">
				Precios del mercado
			</h2>
			<p className="text-base text-muted-foreground">
				Referencia de precios en tu zona para los productos de tu cooperativa.
			</p>
			<div className="flex flex-col gap-3">
				{products.map((product) => (
					<ProductPriceCard key={product.product} data={product} />
				))}
			</div>
		</div>
	);
}
