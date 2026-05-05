/**
 * Smart seed for about_sections.
 *
 * Sync data/seed/about.json into the DB without wiping admin-only edits:
 *   - Backfill seed_key for legacy rows whose computed key matches the JSON
 *   - Upsert (update or insert) every JSON row by seed_key
 *   - Delete previously-seeded rows whose key is no longer in the JSON
 *
 * Admin-created rows (seed_key IS NULL and not produced by the JSON) are
 * left untouched.
 */
import "dotenv/config";
import { readFile } from "fs/promises";
import { join } from "path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { and, eq, inArray, isNotNull, notInArray } from "drizzle-orm";
import { aboutSections } from "../src/db/schema/about";
import { slugify } from "../src/lib/utils";

type SeedRow = { type: string; data: Record<string, unknown> };

function aboutSeedKey(row: SeedRow): string | null {
  const d = (row.data ?? {}) as Record<string, unknown>;
  const part = (v: unknown) => slugify(String(v ?? ""));
  switch (row.type) {
    case "overview":
      return "overview";
    case "experience":
      return d.company ? `experience:${part(d.company)}` : null;
    case "education":
      return d.school
        ? `education:${part(d.school)}`
        : d.degree
          ? `education:${part(d.degree)}`
          : null;
    case "skills":
      return d.category ? `skills:${part(d.category)}` : null;
    case "certification":
      return d.title ? `certification:${part(d.title)}` : null;
    case "language":
      return d.name ? `language:${part(d.name)}` : null;
    case "contact":
      return d.label ? `contact:${part(d.label)}` : null;
    default:
      return null;
  }
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("seed-about: DATABASE_URL missing");
    process.exit(1);
  }

  const seedPath = join(process.cwd(), "data/seed/about.json");
  const json = await readFile(seedPath, "utf-8");
  const rows: SeedRow[] = JSON.parse(json);
  if (!Array.isArray(rows)) {
    console.error("seed-about: about.json must be an array");
    process.exit(1);
  }

  const indexed = rows
    .map((row, sortOrder) => ({ row, key: aboutSeedKey(row), sortOrder }))
    .filter((x): x is { row: SeedRow; key: string; sortOrder: number } => x.key !== null);

  const jsonKeys = Array.from(new Set(indexed.map((x) => x.key)));
  const jsonKeySet = new Set(jsonKeys);

  const client = postgres(url);
  const db = drizzle(client, { schema: { aboutSections } });

  let backfilled = 0;
  const existing = await db.select().from(aboutSections);
  for (const dbRow of existing) {
    if (dbRow.seedKey) continue;
    const candidate = aboutSeedKey({
      type: dbRow.type,
      data: dbRow.data as Record<string, unknown>,
    });
    if (candidate && jsonKeySet.has(candidate)) {
      await db
        .update(aboutSections)
        .set({ seedKey: candidate })
        .where(eq(aboutSections.id, dbRow.id));
      backfilled++;
    }
  }

  let inserted = 0;
  let updated = 0;
  for (const { row, key, sortOrder } of indexed) {
    const matches = await db
      .select({ id: aboutSections.id })
      .from(aboutSections)
      .where(eq(aboutSections.seedKey, key))
      .limit(1);
    if (matches.length > 0) {
      await db
        .update(aboutSections)
        .set({
          type: row.type,
          data: row.data,
          sortOrder,
          updatedAt: new Date(),
        })
        .where(eq(aboutSections.id, matches[0].id));
      updated++;
    } else {
      await db.insert(aboutSections).values({
        type: row.type,
        data: row.data,
        sortOrder,
        seedKey: key,
      });
      inserted++;
    }
  }

  let deleted = 0;
  if (jsonKeys.length > 0) {
    const stale = await db
      .select({ id: aboutSections.id })
      .from(aboutSections)
      .where(
        and(
          isNotNull(aboutSections.seedKey),
          notInArray(aboutSections.seedKey, jsonKeys),
        ),
      );
    if (stale.length > 0) {
      await db
        .delete(aboutSections)
        .where(inArray(aboutSections.id, stale.map((s) => s.id)));
      deleted = stale.length;
    }
  }

  console.log(
    `seed-about: backfilled=${backfilled}, inserted=${inserted}, updated=${updated}, deleted=${deleted}`,
  );
  await client.end();
  process.exit(0);
}

main().catch((e) => {
  console.error("seed-about failed:", e);
  process.exit(1);
});
