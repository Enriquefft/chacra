"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { toast } from "sonner";
import { createAdvance } from "@/actions/advances";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { AdvanceCategory } from "@/lib/types";

const CATEGORY_LABELS: Record<AdvanceCategory, string> = {
	fertilizante: "Fertilizante",
	semillas: "Semillas",
	herramientas: "Herramientas",
	mano_de_obra: "Mano de obra",
	transporte: "Transporte",
	otro: "Otro",
};

function getTodayString(): string {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function AdvanceForm({ producerId }: { producerId: string }) {
	const formId = useId();
	const router = useRouter();

	const [category, setCategory] = useState<string>("");
	const [description, setDescription] = useState("");
	const [amount, setAmount] = useState("");
	const [date, setDate] = useState(getTodayString);
	const [isSubmitting, setIsSubmitting] = useState(false);

	function resetForm() {
		setCategory("");
		setDescription("");
		setAmount("");
		setDate(getTodayString());
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (!category) {
			toast.error("Selecciona una categoria");
			return;
		}

		const parsedAmount = Number.parseFloat(amount);
		if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
			toast.error("Monto debe ser un numero positivo");
			return;
		}

		if (!date) {
			toast.error("Selecciona una fecha");
			return;
		}

		setIsSubmitting(true);

		try {
			const result = await createAdvance({
				producerId,
				category: category as AdvanceCategory,
				description: description.trim() || undefined,
				amount: parsedAmount,
				date,
			});

			if ("error" in result) {
				toast.error(result.error);
				return;
			}

			toast.success("Adelanto registrado");
			resetForm();
			router.refresh();
		} catch {
			toast.error("Error al registrar el adelanto");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="text-base">Registrar adelanto</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="flex flex-col gap-3">
					{/* Categoria */}
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor={`${formId}-category`}
							className="text-sm font-medium"
						>
							Categoria
						</label>
						<Select value={category} onValueChange={setCategory}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Selecciona una categoria" />
							</SelectTrigger>
							<SelectContent>
								{(
									Object.entries(CATEGORY_LABELS) as [AdvanceCategory, string][]
								).map(([value, label]) => (
									<SelectItem key={value} value={value}>
										{label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Descripcion */}
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor={`${formId}-description`}
							className="text-sm font-medium"
						>
							Descripcion (opcional)
						</label>
						<Input
							id={`${formId}-description`}
							type="text"
							placeholder="Ej: Urea 50kg"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>

					{/* Monto */}
					<div className="flex flex-col gap-1.5">
						<label htmlFor={`${formId}-amount`} className="text-sm font-medium">
							Monto (S/)
						</label>
						<Input
							id={`${formId}-amount`}
							type="number"
							step="0.01"
							min="0.01"
							inputMode="decimal"
							placeholder="0.00"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							required
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
							required
						/>
					</div>

					{/* Submit */}
					<Button
						type="submit"
						size="default"
						className="mt-1 w-full"
						disabled={isSubmitting}
					>
						{isSubmitting ? "Registrando..." : "Registrar adelanto"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
