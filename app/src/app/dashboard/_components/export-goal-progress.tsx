import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { CooperativeStats } from "@/lib/types";

export function ExportGoalProgress({
	goals,
}: {
	goals: CooperativeStats["exportGoalProgress"];
}) {
	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="text-base">Metas de Exportacion</CardTitle>
			</CardHeader>
			<CardContent>
				{goals.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						Configura metas en{" "}
						<Link
							href="/dashboard/settings"
							className="font-medium text-primary underline-offset-4 hover:underline"
						>
							Configuracion
						</Link>
					</p>
				) : (
					<div className="flex flex-col gap-4">
						{goals.map((goal) => {
							const isComplete = goal.percentage >= 100;
							return (
								<div key={goal.product} className="flex flex-col gap-1.5">
									<div className="flex items-baseline justify-between">
										<span className="text-sm font-medium">{goal.product}</span>
										<span className="text-xs tabular-nums text-muted-foreground">
											{goal.currentKg.toLocaleString("es-PE")} /{" "}
											{goal.targetKg.toLocaleString("es-PE")} kg
										</span>
									</div>
									<Progress
										value={Math.min(goal.percentage, 100)}
										className={
											isComplete
												? "[&>[data-slot=progress-indicator]]:bg-success"
												: ""
										}
									/>
									<p
										className={`text-right text-xs tabular-nums ${isComplete ? "font-medium text-success" : "text-muted-foreground"}`}
									>
										{goal.percentage}%
									</p>
								</div>
							);
						})}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
