"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteAdvance } from "@/actions/advances";
import { Button } from "@/components/ui/button";

export function AdvanceDeleteButton({ advanceId }: { advanceId: number }) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [confirming, setConfirming] = useState(false);

	function handleClick() {
		if (!confirming) {
			setConfirming(true);
			return;
		}

		startTransition(async () => {
			const result = await deleteAdvance(advanceId);
			if ("error" in result) {
				toast.error(result.error);
			} else {
				toast.success("Adelanto eliminado");
				router.refresh();
			}
			setConfirming(false);
		});
	}

	function handleCancel() {
		setConfirming(false);
	}

	if (confirming) {
		return (
			<div className="flex gap-1">
				<Button
					size="xs"
					variant="destructive"
					disabled={isPending}
					onClick={handleClick}
				>
					{isPending ? "..." : "Si"}
				</Button>
				<Button
					size="xs"
					variant="outline"
					disabled={isPending}
					onClick={handleCancel}
				>
					No
				</Button>
			</div>
		);
	}

	return (
		<Button
			size="xs"
			variant="outline"
			className="text-destructive hover:bg-destructive/10 hover:text-destructive"
			onClick={handleClick}
		>
			Eliminar
		</Button>
	);
}
