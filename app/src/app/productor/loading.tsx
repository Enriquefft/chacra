import { Skeleton } from "@/components/ui/skeleton";

export default function ProducerLoading() {
	return (
		<div className="flex flex-col gap-4">
			{/* Title */}
			<Skeleton className="h-8 w-48" />

			{/* Form fields */}
			<div className="flex flex-col gap-1.5">
				<Skeleton className="h-4 w-20" />
				<Skeleton className="h-11 w-full" />
			</div>
			<div className="flex flex-col gap-1.5">
				<Skeleton className="h-4 w-28" />
				<Skeleton className="h-11 w-full" />
			</div>
			<div className="flex flex-col gap-1.5">
				<Skeleton className="h-4 w-36" />
				<Skeleton className="h-11 w-full" />
			</div>
			<div className="flex flex-col gap-1.5">
				<Skeleton className="h-4 w-36" />
				<Skeleton className="h-11 w-full" />
			</div>
			<div className="flex flex-col gap-1.5">
				<Skeleton className="h-4 w-16" />
				<Skeleton className="h-11 w-full" />
			</div>

			{/* Submit button */}
			<Skeleton className="h-11 w-full" />
		</div>
	);
}
