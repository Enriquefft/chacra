import { ShieldCheck } from "@/components/auth/solar-icons";
import { Card, CardContent } from "@/components/ui/card";

export function LoanRangeCard({
	loanRange,
}: {
	loanRange: { min: number; max: number } | null;
}) {
	if (loanRange) {
		return (
			<Card className="border-2 border-primary/20 bg-primary/5">
				<CardContent className="pt-5">
					<p className="text-sm font-medium text-muted-foreground">
						Rango estimado de credito
					</p>
					<p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
						S/{loanRange.min.toLocaleString()} — S/
						{loanRange.max.toLocaleString()}
					</p>
					<p className="mt-1 text-sm text-muted-foreground">
						Basado en datos verificados. Sujeto a su evaluacion crediticia.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="border-border/50 bg-card/80">
			<CardContent className="py-8 text-center">
				<ShieldCheck
					weight="BoldDuotone"
					size={28}
					className="mx-auto text-muted-foreground"
					aria-hidden="true"
				/>
				<p className="mt-3 text-sm font-medium">
					Datos insuficientes para estimar rango de credito
				</p>
				<p className="mt-1 text-xs text-muted-foreground">
					Se requiere mas historial. Los datos disponibles se muestran arriba.
				</p>
			</CardContent>
		</Card>
	);
}
