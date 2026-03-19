import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
	return (
		<div className="flex flex-col gap-6">
			{/* Title */}
			<Skeleton className="h-8 w-24" />

			{/* KPI row — 4 cards */}
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<div
						key={`kpi-skeleton-${i}`}
						className="flex flex-col gap-2 rounded-xl p-4 ring-1 ring-foreground/10"
					>
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-8 w-16" />
					</div>
				))}
			</div>

			{/* Export goal progress */}
			<div className="rounded-xl p-4 ring-1 ring-foreground/10">
				<Skeleton className="mb-4 h-5 w-48" />
				<div className="flex flex-col gap-3">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
				</div>
			</div>

			{/* Charts grid */}
			<div className="grid gap-6 lg:grid-cols-2">
				<div className="rounded-xl p-4 ring-1 ring-foreground/10">
					<Skeleton className="mb-4 h-5 w-40" />
					<Skeleton className="h-48 w-full" />
				</div>
				<div className="rounded-xl p-4 ring-1 ring-foreground/10">
					<Skeleton className="mb-4 h-5 w-40" />
					<Skeleton className="h-48 w-full" />
				</div>
			</div>

			{/* Traceability table */}
			<div className="rounded-xl p-4 ring-1 ring-foreground/10">
				<Skeleton className="mb-4 h-5 w-40" />
				<div className="flex flex-col gap-2">
					{Array.from({ length: 5 }).map((_, i) => (
						<Skeleton key={`table-row-${i}`} className="h-10 w-full" />
					))}
				</div>
			</div>
		</div>
	);
}
