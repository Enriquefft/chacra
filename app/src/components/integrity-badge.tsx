import { Badge } from "@/components/ui/badge";

export function IntegrityBadge({
	status,
}: { status: "confirmed" | "flagged" | "pending" }) {
	if (status === "confirmed")
		return (
			<Badge className="border-success/20 bg-success/10 text-success">
				Confirmado
			</Badge>
		);
	if (status === "flagged") return <Badge variant="destructive">Flaggeado</Badge>;
	return (
		<Badge className="border-warning/20 bg-warning/10 text-warning">
			Pendiente
		</Badge>
	);
}
