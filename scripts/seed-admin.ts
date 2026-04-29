/**
 * Creates the admin account from ADMIN_EMAIL + ADMIN_PASSWORD env vars.
 * Idempotent: skips if the email already exists in the user table.
 * Uses better-auth's own scrypt hasher for password compatibility.
 */
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { user, account } from "../src/db/schema/auth";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD?.trim();

async function main() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.log("seed-admin: ADMIN_EMAIL or ADMIN_PASSWORD not set, skipping");
    process.exit(0);
  }

  if (ADMIN_PASSWORD.length < 8) {
    console.error("seed-admin: ADMIN_PASSWORD must be at least 8 characters");
    process.exit(1);
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("seed-admin: DATABASE_URL missing");
    process.exit(1);
  }

  const { hashPassword } = await import("better-auth/crypto");

  const client = postgres(url);
  const db = drizzle(client, { schema: { user, account } });

  const existing = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, ADMIN_EMAIL))
    .limit(1);

  if (existing.length > 0) {
    console.log(`seed-admin: user ${ADMIN_EMAIL} already exists, skipping`);
    await client.end();
    process.exit(0);
  }

  const id = randomBytes(16).toString("hex");
  const hashedPassword = await hashPassword(ADMIN_PASSWORD);

  await db.insert(user).values({
    id,
    name: "Admin",
    email: ADMIN_EMAIL,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.insert(account).values({
    id: randomBytes(16).toString("hex"),
    userId: id,
    accountId: id,
    providerId: "credential",
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log(`seed-admin: created admin account for ${ADMIN_EMAIL}`);
  await client.end();
  process.exit(0);
}

main().catch((e) => {
  console.error("seed-admin failed:", e);
  process.exit(1);
});
