/**
 * Truncate uses_items then re-import data/seed/uses.json.
 */
import "dotenv/config";
import { readFile } from "fs/promises";
import { join } from "path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { usesItems } from "../src/db/schema/uses";
import { clampRating } from "../src/lib/uses-constants";

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
    console.error("seed-uses-reset: DATABASE_URL missing");
    process.exit(1);
  }

  const seedPath = join(process.cwd(), "data/seed/uses.json");
  const json = await readFile(seedPath, "utf-8");
  const rows: SeedRow[] = JSON.parse(json);
  if (!Array.isArray(rows)) {
    console.error("seed-uses-reset: uses.json must be an array");
    process.exit(1);
  }

  const client = postgres(url);
  const db = drizzle(client, { schema: { usesItems } });

  await db.delete(usesItems);

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

  console.log(`seed-uses-reset: replaced uses_items with ${rows.length} row(s)`);
  await client.end();
  process.exit(0);
}

main().catch((e) => {
  console.error("seed-uses-reset failed:", e);
  process.exit(1);
});
