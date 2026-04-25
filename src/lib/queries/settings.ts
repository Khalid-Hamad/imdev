"use server";

import { db } from "@/db";
import { siteSettings } from "@/db/schema/settings";
import { aboutSections, type NewAboutSection } from "@/db/schema/about";
import { eq, asc } from "drizzle-orm";

export async function getSetting(key: string) {
  const result = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, key))
    .limit(1);
  return result[0]?.value ?? null;
}

export async function setSetting(key: string, value: unknown) {
  await db
    .insert(siteSettings)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value, updatedAt: new Date() },
    });
}

export async function getAllSettings() {
  const rows = await db.select().from(siteSettings);
  const map: Record<string, unknown> = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
}

export async function getAboutSections() {
  return db
    .select()
    .from(aboutSections)
    .orderBy(asc(aboutSections.sortOrder));
}

export async function upsertAboutSection(
  id: string | undefined,
  data: NewAboutSection
) {
  if (id) {
    const result = await db
      .update(aboutSections)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(aboutSections.id, id))
      .returning();
    return result[0];
  }
  const result = await db.insert(aboutSections).values(data).returning();
  return result[0];
}

export async function deleteAboutSection(id: string) {
  return db.delete(aboutSections).where(eq(aboutSections.id, id));
}
