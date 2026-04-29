import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isS3Configured, uploadObject } from "@/lib/storage/s3";

const MAX_BYTES = 3 * 1024 * 1024;
const ALLOWED = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]);

function extFromType(type: string): string {
  if (type === "image/png") return ".png";
  if (type === "image/jpeg" || type === "image/jpg") return ".jpg";
  if (type === "image/gif") return ".gif";
  if (type === "image/webp") return ".webp";
  if (type === "image/svg+xml") return ".svg";
  return ".bin";
}

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 3MB)" }, { status: 400 });
  }

  const type = file.type || "application/octet-stream";
  if (!ALLOWED.has(type)) {
    return NextResponse.json(
      { error: "Unsupported file type" },
      { status: 400 }
    );
  }

  const key = `uses/${randomUUID()}${extFromType(type)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (isS3Configured()) {
    try {
      const url = await uploadObject(key, buffer, type);
      return NextResponse.json({ url, pathname: key });
    } catch (e) {
      console.error("S3 upload failed:", e);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
  }

  const dir = join(process.cwd(), "public", "uploads", "uses");
  await mkdir(dir, { recursive: true });
  const name = key.split("/").pop()!;
  const filePath = join(dir, name);
  await writeFile(filePath, buffer);

  const publicPath = `/uploads/uses/${name}`;
  return NextResponse.json({
    url: publicPath,
    pathname: publicPath,
  });
}
