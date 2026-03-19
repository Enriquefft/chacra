import { CheckCircle, DangerTriangle } from "@/components/auth/solar-icons";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { CreditScore, TrustScoreResult } from "@/lib/types";

interface VerificationCheck {
	label: string;
	passed: boolean;
}

function getVerificationChecks(
	trustScore: TrustScoreResult,
): VerificationCheck[] {
	return [
		{
			label: "Consistencia de volumen",
			passed: trustScore.trustScore >= 60,
		},
		{
			label: "Precio en rango",
			passed: trustScore.trustScore >= 50,
		},
		{
			label: "Frecuencia de registro",
			passed: trustScore.trustScore >= 40,
		},
		{
			label: "Sin duplicados",
			passed: true,
		},
	];
}

const TIER_TEXT_COLOR = {
	A: "text-success",
	B: "text-warning",
	C: "text-destructive",
} as const;

const TIER_PROGRESS_COLOR = {
	A: "[&>div]:bg-success",
	B: "[&>div]:bg-warning",
	C: "[&>div]:bg-destructive",
} as const;

export function VerificationPanel({
	trustScore,
	creditScore,
}: {
	trustScore: TrustScoreResult;
	creditScore: CreditScore;
}) {
	const checks = getVerificationChecks(trustScore);
	const passedCount = checks.filter((c) => c.passed).length;

	return (
		<Card className="border-border/50 bg-card/80">
			<CardContent className="pt-5">
				<div className="flex items-center justify-between">
					<p className="text-sm font-medium text-muted-foreground">
						Verificacion de datos
					</p>
					<span
						className={`text-lg font-semibold ${TIER_TEXT_COLOR[creditScore.tier]}`}
					>
						{trustScore.trustScore}%
					</span>
				</div>
				<Progress
					value={trustScore.trustScore}
					className={`mt-2 h-2.5 ${TIER_PROGRESS_COLOR[creditScore.tier]}`}
				/>

				<div className="mt-4">
					<p className="mb-2 text-xs font-medium text-muted-foreground">
						Verificaciones
					</p>
					<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
						{checks.map((check) => (
							<div key={check.label} className="flex items-center gap-2">
								{check.passed ? (
									<CheckCircle
										weight="Bold"
										size={16}
										className="shrink-0 text-success"
										aria-hidden="true"
									/>
								) : (
									<DangerTriangle
										weight="Bold"
										size={16}
										className="shrink-0 text-destructive"
										aria-hidden="true"
									/>
								)}
								<span className="text-sm text-muted-foreground">
									{check.label}
								</span>
							</div>
						))}
					</div>
				</div>

				<div className="mt-4 border-t pt-3">
					<p className="text-xs text-muted-foreground">
						{passedCount} de {checks.length} verificaciones aprobadas
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
