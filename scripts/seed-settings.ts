/**
 * Seeds site_settings with defaults from data/seed/settings.json.
 * Only inserts keys that don't already exist (preserves admin edits).
 */
import "dotenv/config";
import { readFile } from "fs/promises";
import { join } from "path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { siteSettings } from "../src/db/schema/settings";
import { eq } from "drizzle-orm";

const seedPath = join(process.cwd(), "data/seed/settings.json");

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("seed-settings: DATABASE_URL missing");
    process.exit(1);
  }

  const json = await readFile(seedPath, "utf-8");
  const entries: Record<string, unknown> = JSON.parse(json);
  const keys = Object.keys(entries);
  if (keys.length === 0) {
    console.log("seed-settings: no entries in settings.json, skipping");
    process.exit(0);
  }

  const client = postgres(url);
  const db = drizzle(client, { schema: { siteSettings } });

  let inserted = 0;
  for (const key of keys) {
    const existing = await db
      .select({ key: siteSettings.key })
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(siteSettings).values({
        key,
        value: entries[key] as string,
        updatedAt: new Date(),
      });
      inserted++;
    }
  }

  if (inserted > 0) {
    console.log(`seed-settings: inserted ${inserted} default setting(s)`);
  } else {
    console.log("seed-settings: all keys already exist, skipping");
  }

  await client.end();
  process.exit(0);
}

main().catch((e) => {
  console.error("seed-settings failed:", e);
  process.exit(1);
});
