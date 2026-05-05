/**
 * Smart seed for uses_items.
 *
 * Sync data/seed/uses.json into the DB without wiping admin-only rows:
 *   - Backfill seed_key for legacy rows whose name+category matches the JSON
 *   - Upsert (update or insert) every JSON row by seed_key
 *   - Delete previously-seeded rows whose key is no longer in the JSON
 *
 * Admin-created items (seed_key IS NULL) are left untouched.
 */
import "dotenv/config";
import { readFile } from "fs/promises";
import { join } from "path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { and, eq, inArray, isNotNull, notInArray } from "drizzle-orm";
import { usesItems } from "../src/db/schema/uses";
import { clampRating } from "../src/lib/uses-constants";
import { slugify } from "../src/lib/utils";

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

function usesSeedKey(name: string, category: string): string | null {
  const n = slugify(name ?? "");
  const c = slugify(category ?? "");
  if (!n || !c) return null;
  return `uses:${c}:${n}`;
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("seed-uses: DATABASE_URL missing");
    process.exit(1);
  }

  const seedPath = join(process.cwd(), "data/seed/uses.json");
  const json = await readFile(seedPath, "utf-8");
  const rows: SeedRow[] = JSON.parse(json);
  if (!Array.isArray(rows)) {
    console.error("seed-uses: uses.json must be an array");
    process.exit(1);
  }

  const indexed = rows
    .filter((r) => r.name?.trim() && r.category?.trim())
    .map((row, sortOrder) => ({
      row,
      key: usesSeedKey(row.name, row.category),
      sortOrder,
    }))
    .filter((x): x is { row: SeedRow; key: string; sortOrder: number } => x.key !== null);

  const jsonKeys = Array.from(new Set(indexed.map((x) => x.key)));
  const jsonKeySet = new Set(jsonKeys);

  const client = postgres(url);
  const db = drizzle(client, { schema: { usesItems } });

  let backfilled = 0;
  const existing = await db.select().from(usesItems);
  for (const dbRow of existing) {
    if (dbRow.seedKey) continue;
    const candidate = usesSeedKey(dbRow.name, dbRow.category);
    if (candidate && jsonKeySet.has(candidate)) {
      await db
        .update(usesItems)
        .set({ seedKey: candidate })
        .where(eq(usesItems.id, dbRow.id));
      backfilled++;
    }
  }

  let inserted = 0;
  let updated = 0;
  for (const { row, key, sortOrder } of indexed) {
    const matches = await db
      .select({ id: usesItems.id })
      .from(usesItems)
      .where(eq(usesItems.seedKey, key))
      .limit(1);

    const values = {
      name: row.name.trim(),
      descriptionEn: row.descriptionEn ?? "",
      descriptionAr: row.descriptionAr ?? "",
      category: row.category.trim(),
      tags: Array.isArray(row.tags) ? row.tags : [],
      rating: clampRating(row.rating ?? 0),
      iconUrl: row.iconUrl ?? "",
      sortOrder: row.sortOrder ?? sortOrder,
    };

    if (matches.length > 0) {
      await db
        .update(usesItems)
        .set(values)
        .where(eq(usesItems.id, matches[0].id));
      updated++;
    } else {
      await db.insert(usesItems).values({ ...values, seedKey: key });
      inserted++;
    }
  }

  let deleted = 0;
  if (jsonKeys.length > 0) {
    const stale = await db
      .select({ id: usesItems.id })
      .from(usesItems)
      .where(
        and(
          isNotNull(usesItems.seedKey),
          notInArray(usesItems.seedKey, jsonKeys),
        ),
      );
    if (stale.length > 0) {
      await db
        .delete(usesItems)
        .where(inArray(usesItems.id, stale.map((s) => s.id)));
      deleted = stale.length;
    }
  }

  console.log(
    `seed-uses: backfilled=${backfilled}, inserted=${inserted}, updated=${updated}, deleted=${deleted}`,
  );
  await client.end();
  process.exit(0);
}

main().catch((e) => {
  console.error("seed-uses failed:", e);
  process.exit(1);
});
