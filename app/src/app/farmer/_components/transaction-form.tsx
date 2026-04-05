"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { createTransaction } from "@/actions/transactions";
import { Camera, Cart, CloseCircle } from "@/components/auth/solar-icons";
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
import { compressImage } from "@/lib/compress-image";
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
	const [photoPreview, setPhotoPreview] = useState<string | null>(null);
	const [photoData, setPhotoData] = useState<ArrayBuffer | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Cleanup object URL on unmount or re-select
	useEffect(() => {
		return () => {
			if (photoPreview) URL.revokeObjectURL(photoPreview);
		};
	}, [photoPreview]);

	const handlePhotoSelect = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;

			try {
				const compressed = await compressImage(file);
				if (photoPreview) URL.revokeObjectURL(photoPreview);
				const preview = URL.createObjectURL(
					new Blob([compressed], { type: "image/jpeg" }),
				);
				setPhotoData(compressed);
				setPhotoPreview(preview);
			} catch {
				toast.error("No se pudo procesar la imagen");
			}
			// Reset input so the same file can be re-selected
			if (fileInputRef.current) fileInputRef.current.value = "";
		},
		[photoPreview],
	);

	function removePhoto() {
		if (photoPreview) URL.revokeObjectURL(photoPreview);
		setPhotoPreview(null);
		setPhotoData(null);
	}

	function resetForm() {
		setProduct("");
		setQuantityKg("");
		setPricePerKg("");
		setBuyer("");
		setDate(getTodayString());
		removePhoto();
	}

	const hasPhoto = !!photoData;
	const hasManualData = !!(product && quantityKg && pricePerKg);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		// Require at least photo or manual data
		if (!hasPhoto && !hasManualData) {
			toast.error("Sube una foto de la boleta o ingresa los datos manualmente");
			return;
		}

		// Validate manual fields only when provided
		let qty: number | undefined;
		let price: number | undefined;

		if (hasManualData) {
			qty = Number.parseFloat(quantityKg);
			price = Number.parseFloat(pricePerKg);

			if (Number.isNaN(qty) || qty <= 0) {
				toast.error("Cantidad debe ser un numero positivo");
				return;
			}
			if (Number.isNaN(price) || price <= 0) {
				toast.error("Precio debe ser un numero positivo");
				return;
			}
		}

		if (!date) {
			toast.error("Selecciona una fecha");
			return;
		}

		setIsSubmitting(true);
		const uuid = crypto.randomUUID();

		try {
			if (isOnline) {
				// Upload photo first if present
				let photoUrl: string | undefined;
				if (photoData) {
					const form = new FormData();
					form.append(
						"photo",
						new File([photoData], `${uuid}.jpg`, { type: "image/jpeg" }),
					);
					form.append("uuid", uuid);
					const uploadRes = await fetch("/api/upload", {
						method: "POST",
						body: form,
					});
					if (uploadRes.ok) {
						const { url } = await uploadRes.json();
						photoUrl = url;
					} else if (!hasManualData) {
						// Photo upload failed and no manual data — can't proceed
						toast.error("Error al subir la foto. Intenta de nuevo.");
						return;
					}
					// If upload fails but we have manual data, continue without photo
				}

				const result = await createTransaction({
					uuid,
					product: hasManualData ? product : undefined,
					quantityKg: qty,
					pricePerKg: price,
					buyer: buyer.trim() || undefined,
					photoUrl,
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
					product: hasManualData ? product : null,
					quantityKg: qty ?? null,
					pricePerKg: price ?? null,
					buyer: buyer.trim() || null,
					date,
					createdAt: Date.now(),
					syncStatus: "pending",
					photoData: photoData ?? undefined,
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
						product: hasManualData ? product : null,
						quantityKg: qty ?? null,
						pricePerKg: price ?? null,
						buyer: buyer.trim() || null,
						date,
						createdAt: Date.now(),
						syncStatus: "pending",
						photoData: photoData ?? undefined,
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

			{/* Foto de boleta — primary action */}
			<div className="flex flex-col gap-1.5">
				<label className="text-base font-medium">Foto de boleta</label>
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					capture="environment"
					onChange={handlePhotoSelect}
					className="hidden"
				/>
				{photoPreview ? (
					<div className="relative w-fit">
						<img
							src={photoPreview}
							alt="Boleta"
							className="h-24 w-24 rounded-lg border object-cover"
						/>
						<button
							type="button"
							onClick={removePhoto}
							className="absolute -right-2 -top-2 rounded-full bg-background"
						>
							<CloseCircle
								weight="Bold"
								size={24}
								className="text-destructive"
							/>
						</button>
					</div>
				) : (
					<Button
						type="button"
						variant="outline"
						size="lg"
						className="w-full gap-2"
						onClick={() => fileInputRef.current?.click()}
					>
						<Camera weight="BoldDuotone" size={20} />
						Tomar foto
					</Button>
				)}
			</div>

			{/* Divider */}
			<div className="flex items-center gap-3">
				<div className="h-px flex-1 bg-border" />
				<span className="text-sm text-muted-foreground">
					{hasPhoto ? "Datos adicionales (opcional)" : "o ingresa los datos"}
				</span>
				<div className="h-px flex-1 bg-border" />
			</div>

			{/* Producto */}
			<div className="flex flex-col gap-1.5">
				<label htmlFor={`${formId}-product`} className="text-base font-medium">
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
				<label htmlFor={`${formId}-quantity`} className="text-base font-medium">
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
				/>
			</div>

			{/* Precio */}
			<div className="flex flex-col gap-1.5">
				<label htmlFor={`${formId}-price`} className="text-base font-medium">
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
				/>
			</div>

			{/* Comprador */}
			<div className="flex flex-col gap-1.5">
				<label htmlFor={`${formId}-buyer`} className="text-base font-medium">
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
				<label htmlFor={`${formId}-date`} className="text-base font-medium">
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
					<p className="text-base text-muted-foreground">Total estimado</p>
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
