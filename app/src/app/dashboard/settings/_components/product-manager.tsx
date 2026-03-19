"use client";

import { useActionState, useState } from "react";
import { addProduct, removeProduct } from "@/actions/cooperatives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AddState = { error?: string; success?: boolean };

function addFormAction(_prev: AddState, formData: FormData): Promise<AddState> {
	const product = (formData.get("product") as string) ?? "";
	return addProduct(product);
}

export function ProductManager({
	initialProducts,
}: {
	initialProducts: string[];
}) {
	const [addState, addAction, addPending] = useActionState(addFormAction, {});
	const [removing, setRemoving] = useState<string | null>(null);

	async function handleRemove(product: string) {
		setRemoving(product);
		await removeProduct(product);
		setRemoving(null);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-wrap gap-2">
				{initialProducts.length === 0 && (
					<p className="text-sm text-muted-foreground">
						No hay productos configurados.
					</p>
				)}
				{initialProducts.map((product) => (
					<Badge key={product} variant="secondary" className="gap-1.5 pr-1">
						{product}
						<button
							type="button"
							onClick={() => handleRemove(product)}
							disabled={removing === product}
							className="ml-1 rounded-sm p-0.5 hover:bg-foreground/10"
							aria-label={`Eliminar ${product}`}
						>
							{removing === product ? (
								<svg
									className="size-3 animate-spin"
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
									className="size-3"
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
					</Badge>
				))}
			</div>

			<form action={addAction} className="flex gap-2">
				<Input
					name="product"
					placeholder="Nuevo producto (ej: Cafe)"
					required
					className="flex-1"
				/>
				<Button type="submit" size="default" disabled={addPending}>
					{addPending ? "Agregando..." : "Agregar"}
				</Button>
			</form>
			{addState.error && (
				<p className="text-sm text-destructive">{addState.error}</p>
			)}
		</div>
	);
}
