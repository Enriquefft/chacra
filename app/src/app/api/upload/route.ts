import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = new Set([
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/heic",
	"image/heif",
]);

export async function POST(request: Request) {
	const session = await getSession();
	if (!session || session.user.role !== "producer") {
		return Response.json({ error: "No autorizado" }, { status: 401 });
	}

	const formData = await request.formData();
	const photo = formData.get("photo");

	if (!(photo instanceof File) || photo.size === 0) {
		return Response.json(
			{ error: "Se requiere una foto" },
			{ status: 400 },
		);
	}

	if (!ALLOWED_TYPES.has(photo.type)) {
		return Response.json(
			{ error: "Tipo de archivo no permitido" },
			{ status: 400 },
		);
	}

	if (photo.size > MAX_FILE_SIZE) {
		return Response.json(
			{ error: "La foto excede el tamano maximo (2MB)" },
			{ status: 400 },
		);
	}

	const uuid = formData.get("uuid");
	const filename = `boletas/${session.user.id}/${uuid || crypto.randomUUID()}.jpg`;

	const blob = await put(filename, photo, { access: "public" });

	return Response.json({ url: blob.url });
}
