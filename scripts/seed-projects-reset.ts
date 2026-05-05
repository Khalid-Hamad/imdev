/**
 * Truncate projects then re-import data/seed/projects.json.
 */
import "dotenv/config";
import { readFile } from "fs/promises";
import { join } from "path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { projects } from "../src/db/schema/projects";
import { normalizeKind } from "../src/lib/projects-constants";

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
    console.error("seed-projects-reset: DATABASE_URL missing");
    process.exit(1);
  }

  const seedPath = join(process.cwd(), "data/seed/projects.json");
  const json = await readFile(seedPath, "utf-8");
  const rows: SeedRow[] = JSON.parse(json);
  if (!Array.isArray(rows)) {
    console.error("seed-projects-reset: projects.json must be an array");
    process.exit(1);
  }

  const client = postgres(url);
  const db = drizzle(client, { schema: { projects } });

  await db.delete(projects);

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

  console.log(`seed-projects-reset: replaced projects with ${rows.length} row(s)`);
  await client.end();
  process.exit(0);
}

main().catch((e) => {
  console.error("seed-projects-reset failed:", e);
  process.exit(1);
});
