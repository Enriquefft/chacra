import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
	return (
		<div className="flex flex-col gap-6">
			{/* Title */}
			<Skeleton className="h-8 w-40" />

			{/* Cooperative info card */}
			<div className="flex flex-col gap-4 rounded-xl p-4 ring-1 ring-foreground/10">
				<Skeleton className="h-5 w-28" />
				<Skeleton className="h-4 w-48" />
				<div className="flex flex-col gap-3">
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-4 w-24" />
				</div>
				<Skeleton className="h-px w-full" />
				<Skeleton className="h-4 w-36" />
				<Skeleton className="h-8 w-40" />
			</div>

			{/* Products card */}
			<div className="flex flex-col gap-4 rounded-xl p-4 ring-1 ring-foreground/10">
				<Skeleton className="h-5 w-24" />
				<Skeleton className="h-4 w-64" />
				<div className="flex flex-wrap gap-2">
					{Array.from({ length: 3 }).map((_, i) => (
						<Skeleton key={`product-${i}`} className="h-7 w-20 rounded-full" />
					))}
				</div>
			</div>

			{/* Export goals card */}
			<div className="flex flex-col gap-4 rounded-xl p-4 ring-1 ring-foreground/10">
				<Skeleton className="h-5 w-44" />
				<Skeleton className="h-4 w-72" />
				<div className="flex flex-col gap-3">
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
				</div>
			</div>
		</div>
	);
}
