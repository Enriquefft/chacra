"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

const CHART_COLORS = [
	"var(--chart-1)",
	"var(--chart-2)",
	"var(--chart-3)",
	"var(--chart-4)",
	"var(--chart-5)",
];

export function ProductionChart({
	data,
	products,
}: {
	data: Array<Record<string, number | string>>;
	products: string[];
}) {
	if (data.length === 0 || products.length === 0) {
		return (
			<Card className="flex h-full flex-col">
				<CardHeader className="pb-3">
					<CardTitle className="text-base">Produccion por Mes</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-1 items-center justify-center">
					<p className="text-sm text-muted-foreground">
						Aun no hay datos de produccion.
					</p>
				</CardContent>
			</Card>
		);
	}

	const chartConfig: ChartConfig = {};
	for (let i = 0; i < products.length; i++) {
		chartConfig[products[i]] = {
			label: products[i],
			color: CHART_COLORS[i % CHART_COLORS.length],
		};
	}

	return (
		<Card className="flex h-full flex-col">
			<CardHeader className="pb-3">
				<CardTitle className="text-base">Produccion por Mes</CardTitle>
				<p className="text-xs text-muted-foreground">
					Kg acumulados por producto
				</p>
			</CardHeader>
			<CardContent className="flex-1 pb-4">
				<ChartContainer config={chartConfig} className="aspect-[4/3] w-full">
					<AreaChart
						data={data}
						margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
					>
						<CartesianGrid vertical={false} strokeDasharray="3 3" />
						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							fontSize={11}
						/>
						<YAxis tickLine={false} axisLine={false} fontSize={11} />
						<ChartTooltip content={<ChartTooltipContent />} />
						<ChartLegend content={<ChartLegendContent />} />
						{products.map((product, i) => (
							<Area
								key={product}
								type="monotone"
								dataKey={product}
								stackId="1"
								stroke={CHART_COLORS[i % CHART_COLORS.length]}
								fill={CHART_COLORS[i % CHART_COLORS.length]}
								fillOpacity={0.3}
								animationDuration={1000}
								animationEasing="ease-out"
							/>
						))}
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
