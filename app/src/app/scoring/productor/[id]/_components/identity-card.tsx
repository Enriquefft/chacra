import { TierBadge } from "@/components/tier-badge";
import type { CreditScore, ProducerProfile } from "@/lib/types";

export function IdentityCard({
	profile,
	creditScore,
}: {
	profile: ProducerProfile;
	creditScore: CreditScore;
}) {
	const initials = profile.name
		.split(" ")
		.map((w) => w[0])
		.join("");

	const memberSince = profile.createdAt.toLocaleDateString("es-PE", {
		year: "numeric",
		month: "long",
	});

	return (
		<div className="flex items-center gap-3">
			<div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
				{initials}
			</div>
			<div>
				<div className="flex items-center gap-2">
					<h2 className="text-xl font-semibold tracking-tight">
						{profile.name}
					</h2>
					<TierBadge tier={creditScore.tier} />
				</div>
				<p className="text-sm text-muted-foreground">
					{profile.region ?? "Sin region"} &middot; {profile.cooperativeName}{" "}
					&middot; {creditScore.activeMonths} meses activo
				</p>
				<p className="text-xs text-muted-foreground">
					Miembro desde: {memberSince} &middot; {creditScore.cropDiversity}{" "}
					{creditScore.cropDiversity === 1 ? "cultivo" : "cultivos"}
				</p>
			</div>
		</div>
	);
}
