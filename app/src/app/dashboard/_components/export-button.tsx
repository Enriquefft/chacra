"use client";

import { useTransition } from "react";
import { exportTransactionsCSV } from "@/actions/export";
import { Download } from "@/components/auth/solar-icons";
import { Button } from "@/components/ui/button";

export function ExportButton({ disabled }: { disabled?: boolean }) {
	const [isPending, startTransition] = useTransition();

	function handleExport() {
		startTransition(async () => {
			const result = await exportTransactionsCSV();

			if ("error" in result) {
				return;
			}

			const blob = new Blob([result.data.csv], {
				type: "text/csv;charset=utf-8;",
			});
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = result.data.filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		});
	}

	return (
		<Button
			size="default"
			variant="outline"
			onClick={handleExport}
			disabled={disabled || isPending}
		>
			<Download weight="Linear" size={16} data-icon="inline-start" />
			{isPending ? "Exportando..." : "Exportar CSV"}
		</Button>
	);
}
