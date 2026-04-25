/**
 * If about_sections is empty, inserts rows from data/seed/about.json.
 * Safe to run on every deploy (idempotent when data already exists).
 */
import "dotenv/config";
import { readFile } from "fs/promises";
import { join } from "path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { aboutSections } from "../src/db/schema/about";
import { count } from "drizzle-orm";

const seedPath = join(process.cwd(), "data/seed/about.json");

type SeedRow = { type: string; data: unknown };

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("seed-about: DATABASE_URL missing");
    process.exit(1);
  }

  const json = await readFile(seedPath, "utf-8");
  const rows: SeedRow[] = JSON.parse(json);
  if (!Array.isArray(rows) || rows.length === 0) {
    console.log("seed-about: no rows in about.json, skipping");
    process.exit(0);
  }

  const client = postgres(url);
  const db = drizzle(client, { schema: { aboutSections } });

  const [{ n }] = await db
    .select({ n: count() })
    .from(aboutSections);
  if (n > 0) {
    console.log(`seed-about: about_sections has ${n} row(s), skipping import`);
    await client.end();
    process.exit(0);
  }

  for (let i = 0; i < rows.length; i++) {
    const { type, data } = rows[i];
    if (!type || !data) continue;
    await db.insert(aboutSections).values({
      type,
      data: data as Record<string, unknown>,
      sortOrder: i,
    });
  }
  console.log(`seed-about: inserted ${rows.length} about section(s)`);
  await client.end();
  process.exit(0);
}

main().catch((e) => {
  console.error("seed-about failed:", e);
  process.exit(1);
});
