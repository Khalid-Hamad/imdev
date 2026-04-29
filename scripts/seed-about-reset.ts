/**
 * Truncate about_sections then re-import data/seed/about.json.
 * Use when the seed file changes and you want the About page to mirror it.
 */
import "dotenv/config";
import { readFile } from "fs/promises";
import { join } from "path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { aboutSections } from "../src/db/schema/about";

type SeedRow = { type: string; data: unknown };

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("seed-about-reset: DATABASE_URL missing");
    process.exit(1);
  }

  const seedPath = join(process.cwd(), "data/seed/about.json");
  const json = await readFile(seedPath, "utf-8");
  const rows: SeedRow[] = JSON.parse(json);
  if (!Array.isArray(rows)) {
    console.error("seed-about-reset: about.json must be an array");
    process.exit(1);
  }

  const client = postgres(url);
  const db = drizzle(client, { schema: { aboutSections } });

  await db.delete(aboutSections);

  for (let i = 0; i < rows.length; i++) {
    const { type, data } = rows[i];
    if (!type || !data) continue;
    await db.insert(aboutSections).values({
      type,
      data: data as Record<string, unknown>,
      sortOrder: i,
    });
  }

  console.log(`seed-about-reset: replaced about_sections with ${rows.length} row(s)`);
  await client.end();
  process.exit(0);
}

main().catch((e) => {
  console.error("seed-about-reset failed:", e);
  process.exit(1);
});
