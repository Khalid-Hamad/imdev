/**
 * If projects has no rows, inserts demo rows from data/seed/projects.json (kind filters / cards preview).
 */
import "dotenv/config";
import { readFile } from "fs/promises";
import { join } from "path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { projects } from "../src/db/schema/projects";
import { count } from "drizzle-orm";
import { normalizeKind } from "../src/lib/projects-constants";

const seedPath = join(process.cwd(), "data/seed/projects.json");

type SeedRow = {
  slug: string;
  titleEn: string;
  titleAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  kind?: string;
  status?: string;
  featured?: boolean;
  techStack?: string[];
  githubUrl?: string;
  demoUrl?: string;
  sortOrder?: number;
};

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("seed-projects: DATABASE_URL missing");
    process.exit(1);
  }

  const json = await readFile(seedPath, "utf-8");
  const rows: SeedRow[] = JSON.parse(json);
  if (!Array.isArray(rows) || rows.length === 0) {
    console.log("seed-projects: no rows in projects.json, skipping");
    process.exit(0);
  }

  const client = postgres(url);
  const db = drizzle(client, { schema: { projects } });

  const [row] = await db.select({ n: count() }).from(projects);
  const n = Number(row?.n ?? 0);
  if (n > 0) {
    console.log(`seed-projects: projects has ${n} row(s), skipping import`);
    await client.end();
    process.exit(0);
  }

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (!r.slug?.trim() || !r.titleEn?.trim()) continue;
    await db.insert(projects).values({
      slug: r.slug.trim(),
      titleEn: r.titleEn.trim(),
      titleAr: r.titleAr ?? "",
      descriptionEn: r.descriptionEn ?? "",
      descriptionAr: r.descriptionAr ?? "",
      kind: normalizeKind(r.kind ?? "personal"),
      status: r.status === "draft" ? "draft" : "published",
      featured: Boolean(r.featured),
      techStack: Array.isArray(r.techStack) ? r.techStack : [],
      githubUrl: r.githubUrl ?? "",
      huggingfaceUrl: "",
      demoUrl: r.demoUrl ?? "",
      sortOrder: r.sortOrder ?? i,
    });
  }

  console.log(`seed-projects: inserted ${rows.length} demo project row(s)`);
  await client.end();
  process.exit(0);
}

main().catch((e) => {
  console.error("seed-projects failed:", e);
  process.exit(1);
});
