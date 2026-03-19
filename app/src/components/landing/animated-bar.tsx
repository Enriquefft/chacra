"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedBarProps {
	percent: number;
	className?: string;
	duration?: number;
}

export function AnimatedBar({
	percent,
	className = "",
	duration = 800,
}: AnimatedBarProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(0);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setWidth(percent);
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setWidth(percent);
					observer.unobserve(el);
				}
			},
			{ threshold: 0.1 },
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, [percent]);

	return (
		<div
			ref={ref}
			className="h-full w-full overflow-hidden rounded-full bg-muted"
		>
			<div
				className={`h-full rounded-full ${className}`}
				style={{
					width: `${width}%`,
					transition: `width ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
				}}
			/>
		</div>
	);
}
