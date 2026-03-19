"use client";

import { useActionState, useState } from "react";
import { removeExportGoal, setExportGoal } from "@/actions/cooperatives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type AddState = { error?: string; success?: boolean };

async function addGoalAction(
	_prev: AddState,
	formData: FormData,
): Promise<AddState> {
	const product = (formData.get("product") as string) ?? "";
	const targetKgStr = (formData.get("targetKg") as string) ?? "";
	const targetKg = Number(targetKgStr);

	if (!product) {
		return { error: "Selecciona un producto" };
	}
	if (!targetKg || targetKg <= 0) {
		return { error: "Ingresa una meta valida en kg" };
	}

	const result = await setExportGoal(product, targetKg);
	if ("error" in result) {
		return { error: result.error };
	}
	return { success: true };
}

export function ExportGoalManager({
	products,
	initialGoals,
}: {
	products: string[];
	initialGoals: Record<string, { targetKg: number }>;
}) {
	const [addState, addAction, addPending] = useActionState(addGoalAction, {});
	const [removing, setRemoving] = useState<string | null>(null);
	const [selectedProduct, setSelectedProduct] = useState("");

	const goalEntries = Object.entries(initialGoals);
	const availableProducts = products.filter((p) => !initialGoals[p]);

	async function handleRemove(product: string) {
		setRemoving(product);
		await removeExportGoal(product);
		setRemoving(null);
	}

	return (
		<div className="flex flex-col gap-4">
			{goalEntries.length === 0 ? (
				<p className="text-sm text-muted-foreground">
					No hay metas de exportacion configuradas.
				</p>
			) : (
				<div className="flex flex-col gap-2">
					{goalEntries.map(([product, goal]) => (
						<div
							key={product}
							className="flex items-center justify-between rounded-lg border px-3 py-2"
						>
							<div className="flex items-center gap-2">
								<span className="text-sm font-medium">{product}</span>
								<Badge variant="secondary" className="tabular-nums">
									{goal.targetKg.toLocaleString("es-PE")} kg
								</Badge>
							</div>
							<button
								type="button"
								onClick={() => handleRemove(product)}
								disabled={removing === product}
								className="rounded-sm p-1 text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
								aria-label={`Eliminar meta de ${product}`}
							>
								{removing === product ? (
									<svg
										className="size-4 animate-spin"
										viewBox="0 0 24 24"
										fill="none"
										aria-hidden="true"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
										/>
									</svg>
								) : (
									<svg
										className="size-4"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										aria-hidden="true"
									>
										<path d="M18 6L6 18M6 6l12 12" />
									</svg>
								)}
							</button>
						</div>
					))}
				</div>
			)}

			{availableProducts.length > 0 && (
				<form action={addAction} className="flex flex-col gap-2 sm:flex-row">
					<input type="hidden" name="product" value={selectedProduct} />
					<Select value={selectedProduct} onValueChange={setSelectedProduct}>
						<SelectTrigger className="w-full sm:w-[180px]">
							<SelectValue placeholder="Producto" />
						</SelectTrigger>
						<SelectContent>
							{availableProducts.map((product) => (
								<SelectItem key={product} value={product}>
									{product}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Input
						name="targetKg"
						type="number"
						placeholder="Meta en kg"
						min={1}
						required
						className="w-full sm:w-[140px]"
					/>
					<Button type="submit" size="default" disabled={addPending}>
						{addPending ? "Agregando..." : "Agregar meta"}
					</Button>
				</form>
			)}

			{addState.error && (
				<p className="text-sm text-destructive">{addState.error}</p>
			)}
		</div>
	);
}
