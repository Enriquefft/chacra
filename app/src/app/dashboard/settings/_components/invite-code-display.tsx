"use client";

import { useState } from "react";
import { ClipboardText } from "@/components/auth/solar-icons";
import { Button } from "@/components/ui/button";

export function InviteCodeDisplay({ code }: { code: string }) {
	const [copied, setCopied] = useState(false);

	async function handleCopy() {
		await navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<div className="flex items-center gap-2">
			<span className="font-mono text-lg font-semibold tracking-widest">
				{code}
			</span>
			<Button
				variant="ghost"
				size="icon-sm"
				onClick={handleCopy}
				aria-label="Copiar codigo"
			>
				<ClipboardText weight="Linear" size={16} />
			</Button>
			{copied && <span className="text-xs text-muted-foreground">Copiado</span>}
		</div>
	);
}
