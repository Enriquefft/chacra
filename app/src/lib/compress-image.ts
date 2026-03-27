const MAX_DIMENSION = 1024;
const JPEG_QUALITY = 0.7;
const MAX_COMPRESSED_BYTES = 1_048_576; // 1MB

/**
 * Compress an image file to JPEG using Canvas API.
 * Max 1024px on longest side, JPEG quality 0.7.
 * Returns ArrayBuffer for Dexie storage (avoids Safari Blob bug).
 */
export async function compressImage(file: File): Promise<ArrayBuffer> {
	const bitmap = await createImageBitmap(file);

	let { width, height } = bitmap;
	if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
		const scale = MAX_DIMENSION / Math.max(width, height);
		width = Math.round(width * scale);
		height = Math.round(height * scale);
	}

	const canvas = new OffscreenCanvas(width, height);
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		bitmap.close();
		throw new Error("No se pudo crear el contexto de canvas");
	}

	ctx.drawImage(bitmap, 0, 0, width, height);
	bitmap.close();

	const blob = await canvas.convertToBlob({
		type: "image/jpeg",
		quality: JPEG_QUALITY,
	});

	if (blob.size > MAX_COMPRESSED_BYTES) {
		throw new Error("La imagen comprimida excede 1MB");
	}

	return blob.arrayBuffer();
}
