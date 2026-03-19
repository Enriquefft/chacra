import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { FarmerProfile, TrustScoreResult } from "@/lib/types";

function getTrustColor(score: number) {
	if (score >= 70) return "text-success";
	if (score >= 40) return "text-warning";
	return "text-destructive";
}

function getTrustProgressClass(score: number) {
	if (score >= 70) return "[&>[data-slot=progress-indicator]]:bg-success";
	if (score >= 40) return "[&>[data-slot=progress-indicator]]:bg-warning";
	return "[&>[data-slot=progress-indicator]]:bg-destructive";
}

export function FarmerProfileCard({
	profile,
	trustScore,
}: {
	profile: FarmerProfile;
	trustScore: TrustScoreResult;
}) {
	const initials = profile.name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	const joinedDate = profile.createdAt.toLocaleDateString("es-PE", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return (
		<Card>
			<CardContent className="flex flex-col gap-6 p-6">
				<div className="flex items-start gap-4">
					<div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
						{initials}
					</div>
					<div className="flex flex-col gap-1">
						<h2 className="text-xl font-semibold tracking-tight">
							{profile.name}
						</h2>
						<p className="text-sm text-muted-foreground">
							{profile.region ?? "Sin region"} · {profile.cooperativeName}
						</p>
						<p className="text-xs text-muted-foreground">
							Miembro desde {joinedDate}
						</p>
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<div className="flex items-baseline justify-between">
						<span className="text-sm text-muted-foreground">Trust Score</span>
						<span
							className={`text-lg font-semibold tabular-nums ${getTrustColor(trustScore.trustScore)}`}
						>
							{trustScore.trustScore}/100
						</span>
					</div>
					<Progress
						value={trustScore.trustScore}
						className={`h-2 ${getTrustProgressClass(trustScore.trustScore)}`}
					/>
					<div className="flex gap-4 text-xs text-muted-foreground">
						<span>{trustScore.confirmedCount} confirmadas</span>
						<span>{trustScore.flaggedCount} flaggeadas</span>
						<span>{trustScore.totalCount} total</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
