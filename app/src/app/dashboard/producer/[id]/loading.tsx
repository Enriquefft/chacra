import { Skeleton } from "@/components/ui/skeleton";

export default function ProducerDetailLoading() {
	return (
		<div className="flex flex-col gap-6">
			{/* Back button */}
			<Skeleton className="h-8 w-32" />

			{/* Profile card */}
			<div className="rounded-xl p-4 ring-1 ring-foreground/10">
				<div className="flex items-center gap-4">
					<Skeleton className="size-12 rounded-full" />
					<div className="flex flex-col gap-2">
						<Skeleton className="h-5 w-36" />
						<Skeleton className="h-4 w-24" />
					</div>
				</div>
				<div className="mt-4 flex gap-4">
					<Skeleton className="h-5 w-24 rounded-full" />
					<Skeleton className="h-5 w-20 rounded-full" />
				</div>
			</div>

			{/* Transactions table */}
			<div className="rounded-xl p-4 ring-1 ring-foreground/10">
				<Skeleton className="mb-4 h-5 w-40" />
				<div className="flex flex-col gap-2">
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton key={`tx-row-${i}`} className="h-10 w-full" />
					))}
				</div>
			</div>
		</div>
	);
}
