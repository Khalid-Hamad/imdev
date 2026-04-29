import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

let cached: S3Client | null = null;

function getClient(): S3Client {
  if (cached) return cached;
  const endpoint = process.env.S3_ENDPOINT;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error("S3 credentials missing (S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY)");
  }
  cached = new S3Client({
    region: process.env.S3_REGION ?? "auto",
    endpoint,
    forcePathStyle: false,
    credentials: { accessKeyId, secretAccessKey },
  });
  return cached;
}

export function isS3Configured(): boolean {
  return Boolean(
    process.env.S3_BUCKET &&
      process.env.S3_ENDPOINT &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY &&
      process.env.S3_PUBLIC_URL
  );
}

export async function uploadObject(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  const client = getClient();
  const bucket = process.env.S3_BUCKET;
  const publicBase = process.env.S3_PUBLIC_URL;
  if (!bucket || !publicBase) {
    throw new Error("S3 bucket / public URL missing (S3_BUCKET, S3_PUBLIC_URL)");
  }
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
  const base = publicBase.replace(/\/+$/, "");
  return `${base}/${key}`;
}
