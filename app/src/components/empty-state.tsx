import type { ComponentType } from "react";

// biome-ignore lint/suspicious/noExplicitAny: Solar icons have complex prop types
type IconComponent = ComponentType<any>;

export function EmptyState({
	icon: Icon,
	title,
	description,
}: {
	icon: IconComponent;
	title: string;
	description: string;
}) {
	return (
		<div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
			<div className="rounded-xl bg-muted p-4">
				<Icon size={32} weight="BoldDuotone" />
			</div>
			<div className="flex flex-col gap-1">
				<p className="text-lg font-medium">{title}</p>
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>
		</div>
	);
}
