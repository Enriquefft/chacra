import { Badge } from "@/components/ui/badge";
import type { Tier } from "@/lib/types";

export function TierBadge({ tier }: { tier: Tier }) {
	if (tier === "A")
		return (
			<Badge className="border-0 bg-success/15 text-success">Tier A</Badge>
		);
	if (tier === "B")
		return (
			<Badge className="border-0 bg-warning/15 text-warning">Tier B</Badge>
		);
	return <Badge variant="destructive">Tier C</Badge>;
}
