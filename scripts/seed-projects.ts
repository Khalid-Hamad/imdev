/**
 * Smart seed for projects.
 *
 * Sync data/seed/projects.json into the DB without wiping admin-only rows:
 *   - Backfill seed_key for legacy rows whose slug matches the JSON
 *   - Upsert (update or insert) every JSON row by seed_key
 *   - Delete previously-seeded rows whose slug is no longer in the JSON
 *
 * Admin-created projects (seed_key IS NULL) are left untouched.
 */
import "dotenv/config";
import { readFile } from "fs/promises";
import { join } from "path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { and, eq, inArray, isNotNull, notInArray } from "drizzle-orm";
import { projects } from "../src/db/schema/projects";
import { normalizeKind } from "../src/lib/projects-constants";

type SeedRow = {
  slug: string;
  titleEn: string;
  titleAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  contentEn?: string;
  contentAr?: string;
  coverImage?: string;
  kind?: string;
  status?: string;
  featured?: boolean;
  techStack?: string[];
  githubUrl?: string;
  huggingfaceUrl?: string;
  demoUrl?: string;
  sortOrder?: number;
};

function projectSeedKey(slug: string): string {
  return `project:${slug.trim()}`;
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("seed-projects: DATABASE_URL missing");
    process.exit(1);
  }

  const seedPath = join(process.cwd(), "data/seed/projects.json");
  const json = await readFile(seedPath, "utf-8");
  const rows: SeedRow[] = JSON.parse(json);
  if (!Array.isArray(rows)) {
    console.error("seed-projects: projects.json must be an array");
    process.exit(1);
  }

  const indexed = rows
    .filter((r) => r.slug?.trim() && r.titleEn?.trim())
    .map((row, sortOrder) => ({
      row,
      key: projectSeedKey(row.slug),
      sortOrder,
    }));

  const jsonKeys = Array.from(new Set(indexed.map((x) => x.key)));
  const jsonKeySet = new Set(jsonKeys);

  const client = postgres(url);
  const db = drizzle(client, { schema: { projects } });

  let backfilled = 0;
  const existing = await db.select().from(projects);
  for (const dbRow of existing) {
    if (dbRow.seedKey) continue;
    const candidate = projectSeedKey(dbRow.slug);
    if (jsonKeySet.has(candidate)) {
      await db
        .update(projects)
        .set({ seedKey: candidate })
        .where(eq(projects.id, dbRow.id));
      backfilled++;
    }
  }

  let inserted = 0;
  let updated = 0;
  for (const { row, key, sortOrder } of indexed) {
    const matches = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.seedKey, key))
      .limit(1);

    const values = {
      slug: row.slug.trim(),
      titleEn: row.titleEn.trim(),
      titleAr: row.titleAr ?? "",
      descriptionEn: row.descriptionEn ?? "",
      descriptionAr: row.descriptionAr ?? "",
      contentEn: row.contentEn ?? "",
      contentAr: row.contentAr ?? "",
      coverImage: row.coverImage ?? "",
      techStack: Array.isArray(row.techStack) ? row.techStack : [],
      githubUrl: row.githubUrl ?? "",
      huggingfaceUrl: row.huggingfaceUrl ?? "",
      demoUrl: row.demoUrl ?? "",
      kind: normalizeKind(row.kind ?? "personal"),
      featured: Boolean(row.featured),
      sortOrder: row.sortOrder ?? sortOrder,
      status: row.status === "draft" ? "draft" : "published",
    };

    if (matches.length > 0) {
      await db
        .update(projects)
        .set({ ...values, updatedAt: new Date() })
        .where(eq(projects.id, matches[0].id));
      updated++;
    } else {
      await db.insert(projects).values({ ...values, seedKey: key });
      inserted++;
    }
  }

  let deleted = 0;
  if (jsonKeys.length > 0) {
    const stale = await db
      .select({ id: projects.id })
      .from(projects)
      .where(
        and(
          isNotNull(projects.seedKey),
          notInArray(projects.seedKey, jsonKeys),
        ),
      );
    if (stale.length > 0) {
      await db
        .delete(projects)
        .where(inArray(projects.id, stale.map((s) => s.id)));
      deleted = stale.length;
    }
  }

  console.log(
    `seed-projects: backfilled=${backfilled}, inserted=${inserted}, updated=${updated}, deleted=${deleted}`,
  );
  await client.end();
  process.exit(0);
}

main().catch((e) => {
  console.error("seed-projects failed:", e);
  process.exit(1);
});
