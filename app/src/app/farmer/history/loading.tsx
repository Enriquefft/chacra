import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryLoading() {
	return (
		<div className="flex flex-col gap-6">
			{/* Title */}
			<Skeleton className="h-8 w-32" />

			{/* Transaction cards */}
			{Array.from({ length: 4 }).map((_, i) => (
				<div
					key={`history-skeleton-${i}`}
					className="flex flex-col gap-3 rounded-xl p-4 ring-1 ring-foreground/10"
				>
					<div className="flex items-start justify-between">
						<div className="flex flex-col gap-2">
							<Skeleton className="h-5 w-24" />
							<Skeleton className="h-4 w-48" />
						</div>
						<Skeleton className="h-4 w-20" />
					</div>
					<div className="flex gap-2">
						<Skeleton className="h-5 w-24 rounded-full" />
						<Skeleton className="h-5 w-32 rounded-full" />
					</div>
				</div>
			))}
		</div>
	);
}
