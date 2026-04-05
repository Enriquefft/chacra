"use client";

import { useId } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

export function IncomeTrendChart({
	monthlyRevenue,
}: {
	monthlyRevenue: Array<{ month: string; revenue: number }>;
}) {
	const gradientId = `income-gradient-${useId().replace(/:/g, "")}`;
	if (monthlyRevenue.length < 2) {
		return (
			<Card className="border-border/50 bg-card/80">
				<CardContent className="flex items-center justify-center py-16">
					<p className="text-sm text-muted-foreground">
						Datos insuficientes para tendencia
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="border-border/50 bg-card/80">
			<CardContent className="pt-5">
				<p className="mb-3 text-sm font-medium text-muted-foreground">
					Tendencia de ingreso ({monthlyRevenue.length} meses)
				</p>
				<ChartContainer
					config={{
						revenue: { label: "Ingreso", color: "var(--chart-1)" },
					}}
					className="h-[220px] w-full"
				>
					<AreaChart
						data={monthlyRevenue}
						margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
					>
						<defs>
							<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="0%"
									stopColor="var(--color-chart-1)"
									stopOpacity={0.3}
								/>
								<stop
									offset="100%"
									stopColor="var(--color-chart-1)"
									stopOpacity={0.02}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid
							strokeDasharray="3 3"
							vertical={false}
							stroke="var(--color-border)"
						/>
						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							className="text-xs"
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickFormatter={(v) => `S/${v}`}
							className="text-xs"
							width={56}
						/>
						<ChartTooltip content={<ChartTooltipContent />} />
						<Area
							type="monotone"
							dataKey="revenue"
							stroke="var(--color-chart-1)"
							strokeWidth={2}
							fill={`url(#${gradientId})`}
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
