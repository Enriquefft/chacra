import { Skeleton } from "@/components/ui/skeleton";

export default function ScoringFarmerLoading() {
	return (
		<div className="flex flex-col gap-6">
			{/* Back link */}
			<Skeleton className="h-4 w-36" />

			{/* Identity card */}
			<div className="rounded-xl p-4 ring-1 ring-foreground/10">
				<div className="flex items-center gap-4">
					<Skeleton className="size-12 rounded-full" />
					<div className="flex flex-col gap-2">
						<Skeleton className="h-6 w-40" />
						<Skeleton className="h-4 w-28" />
					</div>
				</div>
				<div className="mt-4 flex gap-3">
					<Skeleton className="h-6 w-16 rounded-full" />
					<Skeleton className="h-6 w-20 rounded-full" />
				</div>
			</div>

			{/* Income KPIs */}
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<div
						key={`income-kpi-${i}`}
						className="flex flex-col gap-2 rounded-xl p-4 ring-1 ring-foreground/10"
					>
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-7 w-16" />
					</div>
				))}
			</div>

			{/* Chart + verification panel */}
			<div className="grid gap-6 lg:grid-cols-2">
				<div className="rounded-xl p-4 ring-1 ring-foreground/10">
					<Skeleton className="mb-4 h-5 w-40" />
					<Skeleton className="h-48 w-full" />
				</div>
				<div className="rounded-xl p-4 ring-1 ring-foreground/10">
					<Skeleton className="mb-4 h-5 w-36" />
					<div className="flex flex-col gap-3">
						<Skeleton className="h-6 w-full" />
						<Skeleton className="h-6 w-full" />
						<Skeleton className="h-6 w-full" />
					</div>
				</div>
			</div>

			{/* Flagged transactions */}
			<div className="rounded-xl p-4 ring-1 ring-foreground/10">
				<Skeleton className="mb-4 h-5 w-48" />
				<Skeleton className="h-20 w-full" />
			</div>

			{/* Loan range */}
			<div className="rounded-xl p-4 ring-1 ring-foreground/10">
				<Skeleton className="mb-4 h-5 w-40" />
				<Skeleton className="h-12 w-full" />
			</div>
		</div>
	);
}
