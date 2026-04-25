/**
 * Exports about_sections from the database to data/seed/about.json
 * (no row ids — suitable for idempotent import on a fresh environment).
 *
 * Usage: `npm run db:export:about` with DATABASE_URL in .env
 */
import "dotenv/config";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { aboutSections } from "../src/db/schema/about";
import { asc } from "drizzle-orm";

const outPath = join(process.cwd(), "data/seed/about.json");

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set. Add it to .env and retry.");
    process.exit(1);
  }

  const client = postgres(url);
  const db = drizzle(client, { schema: { aboutSections } });
  const rows = await db
    .select()
    .from(aboutSections)
    .orderBy(asc(aboutSections.sortOrder));

  const payload = rows.map(({ type, data }) => ({ type, data }));

  await mkdir(join(process.cwd(), "data/seed"), { recursive: true });
  await writeFile(outPath, JSON.stringify(payload, null, 2) + "\n", "utf-8");
  console.log(`Wrote ${rows.length} section(s) to ${outPath}`);

  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
