"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { FarmerListItem } from "@/lib/types";

function TrustBadge({ score }: { score: number }) {
	if (score >= 70) {
		return (
			<Badge className="border-0 bg-success/10 text-success tabular-nums">
				{score}
			</Badge>
		);
	}
	if (score >= 40) {
		return (
			<Badge className="border-0 bg-warning/10 text-warning tabular-nums">
				{score}
			</Badge>
		);
	}
	return (
		<Badge variant="destructive" className="tabular-nums">
			{score}
		</Badge>
	);
}

export function ProducersList({ farmers }: { farmers: FarmerListItem[] }) {
	const router = useRouter();
	const [search, setSearch] = useState("");
	const [, startTransition] = useTransition();

	const onTrack = farmers.filter((f) => f.integrityStatus === "on_track");
	const needsAttention = farmers.filter(
		(f) => f.integrityStatus === "needs_attention",
	);

	const filteredAll = useMemo(() => {
		if (!search) return farmers;
		const term = search.toLowerCase();
		return farmers.filter((f) => f.name.toLowerCase().includes(term));
	}, [farmers, search]);

	const filteredOnTrack = useMemo(() => {
		if (!search) return onTrack;
		const term = search.toLowerCase();
		return onTrack.filter((f) => f.name.toLowerCase().includes(term));
	}, [onTrack, search]);

	const filteredAttention = useMemo(() => {
		if (!search) return needsAttention;
		const term = search.toLowerCase();
		return needsAttention.filter((f) => f.name.toLowerCase().includes(term));
	}, [needsAttention, search]);

	function handleRowClick(farmerId: string) {
		startTransition(() => {
			router.push(`/dashboard/producer/${farmerId}`);
		});
	}

	return (
		<Tabs defaultValue="all">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<TabsList>
					<TabsTrigger value="all">Todos ({farmers.length})</TabsTrigger>
					<TabsTrigger value="on_track">En meta ({onTrack.length})</TabsTrigger>
					<TabsTrigger value="attention">
						Atencion ({needsAttention.length})
					</TabsTrigger>
				</TabsList>
				<Input
					placeholder="Buscar por nombre..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full sm:max-w-xs"
				/>
			</div>

			<TabsContent value="all">
				<FarmerTable farmers={filteredAll} onRowClick={handleRowClick} />
			</TabsContent>
			<TabsContent value="on_track">
				<FarmerTable farmers={filteredOnTrack} onRowClick={handleRowClick} />
			</TabsContent>
			<TabsContent value="attention">
				<FarmerTable farmers={filteredAttention} onRowClick={handleRowClick} />
			</TabsContent>
		</Tabs>
	);
}

function FarmerTable({
	farmers,
	onRowClick,
}: {
	farmers: FarmerListItem[];
	onRowClick: (id: string) => void;
}) {
	if (farmers.length === 0) {
		return (
			<div className="flex items-center justify-center py-12">
				<p className="text-sm text-muted-foreground">
					No se encontraron productores.
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow className="bg-muted/30 hover:bg-muted/30">
						<TableHead>Nombre</TableHead>
						<TableHead className="hidden sm:table-cell">Region</TableHead>
						<TableHead>Transacciones</TableHead>
						<TableHead className="hidden md:table-cell">
							Ultima actividad
						</TableHead>
						<TableHead>Trust Score</TableHead>
						<TableHead>Estado</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{farmers.map((farmer) => (
						<TableRow
							key={farmer.id}
							className="cursor-pointer"
							onClick={() => onRowClick(farmer.id)}
						>
							<TableCell className="font-medium">{farmer.name}</TableCell>
							<TableCell className="hidden text-muted-foreground sm:table-cell">
								{farmer.region ?? "—"}
							</TableCell>
							<TableCell className="tabular-nums">
								{farmer.transactionCount}
							</TableCell>
							<TableCell className="hidden text-muted-foreground md:table-cell">
								{farmer.lastTransactionDate ?? "Sin actividad"}
							</TableCell>
							<TableCell>
								<TrustBadge score={farmer.trustScore} />
							</TableCell>
							<TableCell>
								{farmer.integrityStatus === "on_track" ? (
									<Badge className="border-success/20 bg-success/10 text-success">
										En meta
									</Badge>
								) : (
									<Badge className="border-warning/20 bg-warning/10 text-warning">
										Atencion
									</Badge>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
