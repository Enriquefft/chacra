"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { TierBadge } from "@/components/tier-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { ScoringFarmerItem, Tier } from "@/lib/types";

type SortKey =
	| "name"
	| "tier"
	| "avgMonthlyRevenue"
	| "activeMonths"
	| "trustScore";
type SortDir = "asc" | "desc";

const TIER_ORDER: Record<Tier, number> = { A: 0, B: 1, C: 2 };

export function CreditCandidateTable({
	farmers,
}: {
	farmers: ScoringFarmerItem[];
}) {
	const router = useRouter();
	const [search, setSearch] = useState("");
	const [sortKey, setSortKey] = useState<SortKey>("tier");
	const [sortDir, setSortDir] = useState<SortDir>("asc");

	function handleSort(key: SortKey) {
		if (sortKey === key) {
			setSortDir(sortDir === "asc" ? "desc" : "asc");
		} else {
			setSortKey(key);
			setSortDir("asc");
		}
	}

	const filtered = useMemo(() => {
		const term = search.toLowerCase();
		let items = farmers;
		if (term) {
			items = items.filter(
				(f) =>
					f.name.toLowerCase().includes(term) ||
					(f.region ?? "").toLowerCase().includes(term),
			);
		}

		return [...items].sort((a, b) => {
			let cmp = 0;
			switch (sortKey) {
				case "name":
					cmp = a.name.localeCompare(b.name);
					break;
				case "tier":
					cmp = TIER_ORDER[a.tier] - TIER_ORDER[b.tier];
					break;
				case "avgMonthlyRevenue":
					cmp = a.avgMonthlyRevenue - b.avgMonthlyRevenue;
					break;
				case "activeMonths":
					cmp = a.activeMonths - b.activeMonths;
					break;
				case "trustScore":
					cmp = a.trustScore - b.trustScore;
					break;
			}
			return sortDir === "asc" ? cmp : -cmp;
		});
	}, [farmers, search, sortKey, sortDir]);

	const sortIndicator = (key: SortKey) => {
		if (sortKey !== key) return "";
		return sortDir === "asc" ? " \u2191" : " \u2193";
	};

	return (
		<Card className="border-border/50 bg-card/80">
			<CardContent className="pt-5 pb-2">
				<div className="mb-3 flex items-center justify-between gap-3">
					<p className="text-sm font-medium text-muted-foreground">
						Candidatos a credito
					</p>
					<Input
						placeholder="Buscar productor..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="max-w-xs"
					/>
				</div>
				<div className="overflow-x-auto rounded-lg border">
					<Table>
						<TableHeader>
							<TableRow className="bg-muted/30 hover:bg-muted/30">
								<TableHead
									className="cursor-pointer select-none"
									onClick={() => handleSort("name")}
								>
									Productor{sortIndicator("name")}
								</TableHead>
								<TableHead className="hidden sm:table-cell">Region</TableHead>
								<TableHead>Cooperativa</TableHead>
								<TableHead
									className="cursor-pointer select-none text-right"
									onClick={() => handleSort("avgMonthlyRevenue")}
								>
									Ingreso/mes (S/){sortIndicator("avgMonthlyRevenue")}
								</TableHead>
								<TableHead
									className="hidden cursor-pointer select-none text-right md:table-cell"
									onClick={() => handleSort("activeMonths")}
								>
									Meses activos{sortIndicator("activeMonths")}
								</TableHead>
								<TableHead
									className="cursor-pointer select-none text-center"
									onClick={() => handleSort("tier")}
								>
									Tier{sortIndicator("tier")}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filtered.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={6}
										className="py-8 text-center text-muted-foreground"
									>
										No se encontraron productores
									</TableCell>
								</TableRow>
							) : (
								filtered.map((farmer) => (
									<TableRow
										key={farmer.id}
										className="cursor-pointer"
										onClick={() => router.push(`/scoring/farmer/${farmer.id}`)}
									>
										<TableCell className="font-medium">{farmer.name}</TableCell>
										<TableCell className="hidden text-muted-foreground sm:table-cell">
											{farmer.region ?? "—"}
										</TableCell>
										<TableCell className="text-muted-foreground">
											{farmer.cooperativeName}
										</TableCell>
										<TableCell className="text-right font-medium tabular-nums">
											S/{farmer.avgMonthlyRevenue.toLocaleString()}
										</TableCell>
										<TableCell className="hidden text-right text-muted-foreground tabular-nums md:table-cell">
											{farmer.activeMonths}
										</TableCell>
										<TableCell className="text-center">
											<TierBadge tier={farmer.tier} />
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}
