"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
	prompt(): Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "chacra-install-dismissed";

export function useInstallPrompt() {
	const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
	const [canInstall, setCanInstall] = useState(false);

	useEffect(() => {
		// Already installed or user dismissed recently
		if (window.matchMedia("(display-mode: standalone)").matches) return;
		if (sessionStorage.getItem(DISMISSED_KEY)) return;

		function onBeforeInstall(e: Event) {
			e.preventDefault();
			deferredPrompt.current = e as BeforeInstallPromptEvent;
			setCanInstall(true);
		}

		window.addEventListener("beforeinstallprompt", onBeforeInstall);

		return () => {
			window.removeEventListener("beforeinstallprompt", onBeforeInstall);
		};
	}, []);

	const install = useCallback(async () => {
		const prompt = deferredPrompt.current;
		if (!prompt) return;

		await prompt.prompt();
		const { outcome } = await prompt.userChoice;

		if (outcome === "accepted") {
			setCanInstall(false);
		}
		deferredPrompt.current = null;
	}, []);

	const dismiss = useCallback(() => {
		setCanInstall(false);
		deferredPrompt.current = null;
		sessionStorage.setItem(DISMISSED_KEY, "1");
	}, []);

	return { canInstall, install, dismiss };
}
