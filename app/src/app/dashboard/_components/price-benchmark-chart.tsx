"use client";

import {
	Bar,
	BarChart,
	CartesianGrid,
	ReferenceLine,
	XAxis,
	YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig: ChartConfig = {
	average: { label: "Precio Promedio", color: "var(--chart-1)" },
};

type Benchmark = {
	product: string;
	floor: number;
	ceiling: number;
	average: number;
	dataPoints: number;
};

export function PriceBenchmarkChart({
	benchmarks,
}: {
	benchmarks: Benchmark[];
}) {
	if (benchmarks.length === 0) {
		return (
			<Card className="flex h-full flex-col">
				<CardHeader className="pb-3">
					<CardTitle className="text-base">Precios por Producto</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-1 items-center justify-center">
					<p className="text-sm text-muted-foreground">
						Aun no hay datos de precios suficientes.
					</p>
				</CardContent>
			</Card>
		);
	}

	// Use the first benchmark's floor/ceiling for reference lines (approximate)
	const avgFloor =
		benchmarks.reduce((sum, b) => sum + b.floor, 0) / benchmarks.length;
	const avgCeiling =
		benchmarks.reduce((sum, b) => sum + b.ceiling, 0) / benchmarks.length;

	const data = benchmarks.map((b) => ({
		product: b.product,
		average: b.average,
		dataPoints: b.dataPoints,
		fill: b.average < b.floor ? "var(--chart-3)" : "var(--chart-1)",
	}));

	return (
		<Card className="flex h-full flex-col">
			<CardHeader className="pb-3">
				<CardTitle className="text-base">Precios por Producto</CardTitle>
				<p className="text-xs text-muted-foreground">
					S/ por kg — promedio ultimos 90 dias
				</p>
			</CardHeader>
			<CardContent className="flex-1 pb-4">
				<ChartContainer config={chartConfig} className="aspect-[4/3] w-full">
					<BarChart
						data={data}
						margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
					>
						<CartesianGrid vertical={false} strokeDasharray="3 3" />
						<XAxis
							dataKey="product"
							tickLine={false}
							axisLine={false}
							fontSize={11}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickFormatter={(v: number) => `S/${v}`}
							fontSize={11}
						/>
						<ReferenceLine
							y={avgFloor}
							stroke="var(--color-warning)"
							strokeDasharray="4 4"
							strokeWidth={1.5}
							label={{
								value: `Piso S/${avgFloor.toFixed(2)}`,
								position: "insideTopLeft",
								fontSize: 10,
								fill: "var(--color-warning)",
							}}
						/>
						<ReferenceLine
							y={avgCeiling}
							stroke="var(--color-success)"
							strokeDasharray="4 4"
							strokeWidth={1.5}
							label={{
								value: `Techo S/${avgCeiling.toFixed(2)}`,
								position: "insideTopLeft",
								fontSize: 10,
								fill: "var(--color-success)",
							}}
						/>
						<ChartTooltip
							content={
								<ChartTooltipContent
									formatter={(value, _name, item) => (
										<div className="flex flex-col gap-0.5">
											<span className="font-medium">
												S/{(value as number).toFixed(2)}/kg
											</span>
											<span className="text-muted-foreground">
												{item.payload.dataPoints} transacciones
											</span>
										</div>
									)}
								/>
							}
						/>
						<Bar
							dataKey="average"
							radius={[4, 4, 0, 0]}
							animationDuration={800}
							animationEasing="ease-out"
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
