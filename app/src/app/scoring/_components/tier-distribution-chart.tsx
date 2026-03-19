"use client";

import { Cell, Label, Pie, PieChart } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

export function TierDistributionChart({
	distribution,
	totalProducers,
}: {
	distribution: Array<{ tier: string; count: number; fill: string }>;
	totalProducers: number;
}) {
	if (distribution.length === 0 || totalProducers === 0) {
		return (
			<Card className="border-border/50 bg-card/80">
				<CardContent className="flex items-center justify-center py-16">
					<p className="text-sm text-muted-foreground">
						No hay datos de distribucion
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="border-border/50 bg-card/80">
			<CardContent className="pt-5">
				<p className="text-sm font-medium text-muted-foreground">
					Distribucion por tier
				</p>
				<ChartContainer
					config={{
						A: { label: "Tier A", color: "var(--success)" },
						B: { label: "Tier B", color: "var(--warning)" },
						C: { label: "Tier C", color: "var(--destructive)" },
					}}
					className="mx-auto h-[220px] w-full"
				>
					<PieChart>
						<ChartTooltip content={<ChartTooltipContent hideLabel />} />
						<Pie
							data={distribution}
							dataKey="count"
							nameKey="tier"
							innerRadius={60}
							outerRadius={85}
							strokeWidth={2}
							stroke="var(--background)"
						>
							{distribution.map((entry) => (
								<Cell key={entry.tier} fill={entry.fill} />
							))}
							<Label
								content={({ viewBox }) => {
									if (viewBox && "cx" in viewBox && "cy" in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="middle"
											>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) - 6}
													className="fill-foreground text-2xl font-semibold"
												>
													{totalProducers}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 14}
													className="fill-muted-foreground text-xs"
												>
													productores
												</tspan>
											</text>
										);
									}
								}}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
				<div className="mt-2 flex items-center justify-center gap-4">
					{distribution.map((d) => (
						<div key={d.tier} className="flex items-center gap-1.5">
							<div
								className="size-2.5 rounded-sm"
								style={{ backgroundColor: d.fill }}
							/>
							<span className="text-xs text-muted-foreground">
								Tier {d.tier}: {d.count}
							</span>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
