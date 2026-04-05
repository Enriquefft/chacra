import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Chacra",
		short_name: "Chacra",
		description: "Registra tus ventas agricolas",
		start_url: "/productor",
		display: "standalone",
		background_color: "#FAF8F5",
		theme_color: "#B7522A",
		icons: [
			{ src: "/icon.png", sizes: "192x192", type: "image/png" },
			{ src: "/apple-icon.png", sizes: "512x512", type: "image/png" },
		],
	};
}
