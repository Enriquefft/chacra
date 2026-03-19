"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { createTransaction } from "@/actions/transactions";
import { Cart } from "@/components/auth/solar-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { usePendingCount } from "@/hooks/use-pending-count";
import { offlineDb } from "@/lib/offline-db";

function getTodayString(): string {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function TransactionForm({ productList }: { productList: string[] }) {
	const formId = useId();
	const isOnline = useOnlineStatus();
	const pendingCount = usePendingCount();

	const [product, setProduct] = useState("");
	const [quantityKg, setQuantityKg] = useState("");
	const [pricePerKg, setPricePerKg] = useState("");
	const [buyer, setBuyer] = useState("");
	const [date, setDate] = useState(getTodayString);
	const [isSubmitting, setIsSubmitting] = useState(false);

	function resetForm() {
		setProduct("");
		setQuantityKg("");
		setPricePerKg("");
		setBuyer("");
		setDate(getTodayString());
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (!product) {
			toast.error("Selecciona un producto");
			return;
		}

		const qty = Number.parseFloat(quantityKg);
		const price = Number.parseFloat(pricePerKg);

		if (Number.isNaN(qty) || qty <= 0) {
			toast.error("Cantidad debe ser un numero positivo");
			return;
		}
		if (Number.isNaN(price) || price <= 0) {
			toast.error("Precio debe ser un numero positivo");
			return;
		}
		if (!date) {
			toast.error("Selecciona una fecha");
			return;
		}

		setIsSubmitting(true);
		const uuid = crypto.randomUUID();

		try {
			if (isOnline) {
				const result = await createTransaction({
					uuid,
					product,
					quantityKg: qty,
					pricePerKg: price,
					buyer: buyer.trim() || undefined,
					date,
				});

				if ("error" in result) {
					toast.error(result.error);
					return;
				}

				toast.success("Venta registrada");
				resetForm();
			} else {
				await offlineDb.pendingTransactions.add({
					uuid,
					product,
					quantityKg: qty,
					pricePerKg: price,
					buyer: buyer.trim() || null,
					date,
					createdAt: Date.now(),
					syncStatus: "pending",
				});

				const newCount = pendingCount + 1;
				toast.info(`Guardado. Pendientes de sincronizar: ${newCount}`);
				resetForm();
			}
		} catch {
			// If online submission fails (network error), save offline
			if (isOnline) {
				try {
					await offlineDb.pendingTransactions.add({
						uuid,
						product,
						quantityKg: qty,
						pricePerKg: price,
						buyer: buyer.trim() || null,
						date,
						createdAt: Date.now(),
						syncStatus: "pending",
					});
					toast.info(
						"Sin conexion. Guardado localmente para sincronizar despues.",
					);
					resetForm();
				} catch {
					toast.error("Error al guardar localmente");
				}
			} else {
				toast.error("Error al guardar");
			}
		} finally {
			setIsSubmitting(false);
		}
	}

	if (productList.length === 0) {
		return (
			<div className="flex flex-col items-center gap-4 pt-16 text-center">
				<Cart
					weight="BoldDuotone"
					size={48}
					className="text-muted-foreground/50"
				/>
				<div className="flex flex-col gap-1">
					<p className="text-lg font-medium">Sin productos configurados</p>
					<p className="text-base text-muted-foreground">
						Tu cooperativa aun no ha agregado productos. Contacta a tu
						cooperativa.
					</p>
				</div>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<h1 className="text-2xl font-semibold tracking-tight">Registrar venta</h1>

			{/* Producto */}
			<div className="flex flex-col gap-1.5">
				<label htmlFor={`${formId}-product`} className="text-sm font-medium">
					Producto
				</label>
				<Select value={product} onValueChange={setProduct}>
					<SelectTrigger className="h-11 w-full text-base">
						<SelectValue placeholder="Selecciona un producto" />
					</SelectTrigger>
					<SelectContent>
						{productList.map((p) => (
							<SelectItem key={p} value={p} className="text-base">
								{p}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Cantidad */}
			<div className="flex flex-col gap-1.5">
				<label htmlFor={`${formId}-quantity`} className="text-sm font-medium">
					Cantidad (kg)
				</label>
				<Input
					id={`${formId}-quantity`}
					type="number"
					step="0.01"
					min="0.01"
					inputMode="decimal"
					placeholder="0.00"
					value={quantityKg}
					onChange={(e) => setQuantityKg(e.target.value)}
					className="h-11 text-base"
					required
				/>
			</div>

			{/* Precio */}
			<div className="flex flex-col gap-1.5">
				<label htmlFor={`${formId}-price`} className="text-sm font-medium">
					Precio por kg (S/)
				</label>
				<Input
					id={`${formId}-price`}
					type="number"
					step="0.01"
					min="0.01"
					inputMode="decimal"
					placeholder="0.00"
					value={pricePerKg}
					onChange={(e) => setPricePerKg(e.target.value)}
					className="h-11 text-base"
					required
				/>
			</div>

			{/* Comprador */}
			<div className="flex flex-col gap-1.5">
				<label htmlFor={`${formId}-buyer`} className="text-sm font-medium">
					Comprador (opcional)
				</label>
				<Input
					id={`${formId}-buyer`}
					type="text"
					placeholder="Nombre del comprador"
					value={buyer}
					onChange={(e) => setBuyer(e.target.value)}
					className="h-11 text-base"
				/>
			</div>

			{/* Fecha */}
			<div className="flex flex-col gap-1.5">
				<label htmlFor={`${formId}-date`} className="text-sm font-medium">
					Fecha
				</label>
				<Input
					id={`${formId}-date`}
					type="date"
					value={date}
					onChange={(e) => setDate(e.target.value)}
					className="h-11 text-base"
					required
				/>
			</div>

			{/* Total preview */}
			{quantityKg && pricePerKg && (
				<div className="rounded-lg bg-muted px-4 py-3">
					<p className="text-sm text-muted-foreground">Total estimado</p>
					<p className="text-xl font-semibold">
						S/{" "}
						{(
							Number.parseFloat(quantityKg) * Number.parseFloat(pricePerKg)
						).toLocaleString("es-PE", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</p>
				</div>
			)}

			{/* Submit */}
			<Button
				type="submit"
				size="lg"
				className="w-full"
				disabled={isSubmitting}
			>
				{isSubmitting ? "Registrando..." : "Registrar venta"}
			</Button>
		</form>
	);
}
