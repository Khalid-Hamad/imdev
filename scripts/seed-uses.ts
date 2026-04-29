/**
 * If uses_items is empty, inserts rows from data/seed/uses.json (demo / local preview).
 */
import "dotenv/config";
import { readFile } from "fs/promises";
import { join } from "path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { usesItems } from "../src/db/schema/uses";
import { count } from "drizzle-orm";
import { clampRating } from "../src/lib/uses-constants";

const seedPath = join(process.cwd(), "data/seed/uses.json");

type SeedRow = {
  name: string;
  descriptionEn?: string;
  descriptionAr?: string;
  category: string;
  tags?: string[];
  rating?: number;
  iconUrl?: string;
  sortOrder?: number;
};

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("seed-uses: DATABASE_URL missing");
    process.exit(1);
  }

  const json = await readFile(seedPath, "utf-8");
  const rows: SeedRow[] = JSON.parse(json);
  if (!Array.isArray(rows) || rows.length === 0) {
    console.log("seed-uses: no rows in uses.json, skipping");
    process.exit(0);
  }

  const client = postgres(url);
  const db = drizzle(client, { schema: { usesItems } });

  const [row] = await db.select({ n: count() }).from(usesItems);
  const n = Number(row?.n ?? 0);
  if (n > 0) {
    console.log(`seed-uses: uses_items has ${n} row(s), skipping import`);
    await client.end();
    process.exit(0);
  }

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (!r.name?.trim() || !r.category?.trim()) continue;
    await db.insert(usesItems).values({
      name: r.name.trim(),
      descriptionEn: r.descriptionEn ?? "",
      descriptionAr: r.descriptionAr ?? "",
      category: r.category.trim(),
      tags: Array.isArray(r.tags) ? r.tags : [],
      rating: clampRating(r.rating ?? 0),
      iconUrl: r.iconUrl ?? "",
      sortOrder: r.sortOrder ?? i,
    });
  }

  console.log(`seed-uses: inserted ${rows.length} demo tool row(s)`);
  await client.end();
  process.exit(0);
}

main().catch((e) => {
  console.error("seed-uses failed:", e);
  process.exit(1);
});
