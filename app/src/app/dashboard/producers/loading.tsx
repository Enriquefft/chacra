import { Skeleton } from "@/components/ui/skeleton";

export default function ProducersLoading() {
	return (
		<div className="flex flex-col gap-6">
			{/* Title */}
			<Skeleton className="h-8 w-36" />

			{/* Filter tabs */}
			<div className="flex gap-2">
				<Skeleton className="h-8 w-20 rounded-full" />
				<Skeleton className="h-8 w-28 rounded-full" />
				<Skeleton className="h-8 w-36 rounded-full" />
			</div>

			{/* Producer cards */}
			{Array.from({ length: 5 }).map((_, i) => (
				<div
					key={`producer-skeleton-${i}`}
					className="flex items-center justify-between rounded-xl p-4 ring-1 ring-foreground/10"
				>
					<div className="flex flex-col gap-2">
						<Skeleton className="h-5 w-36" />
						<Skeleton className="h-4 w-24" />
					</div>
					<div className="flex items-center gap-3">
						<Skeleton className="h-5 w-16 rounded-full" />
						<Skeleton className="h-8 w-8 rounded-md" />
					</div>
				</div>
			))}
		</div>
	);
}
