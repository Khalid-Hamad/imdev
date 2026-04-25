"use server";

import { db } from "@/db";
import { usesItems, type NewUsesItem } from "@/db/schema/uses";
import { eq, asc } from "drizzle-orm";

export async function getAllUsesItems() {
  return db
    .select()
    .from(usesItems)
    .orderBy(usesItems.category, asc(usesItems.sortOrder));
}

export async function getUsesItemsByCategory() {
  const items = await getAllUsesItems();
  const grouped: Record<string, typeof items> = {};
  for (const item of items) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }
  for (const key of Object.keys(grouped)) {
    grouped[key].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }
  const categoryOrder = Object.keys(grouped).sort((a, b) => {
    const minA = Math.min(...grouped[a].map((i) => i.sortOrder ?? 0));
    const minB = Math.min(...grouped[b].map((i) => i.sortOrder ?? 0));
    return minA - minB;
  });
  const ordered: Record<string, (typeof items)[number][]> = {};
  for (const cat of categoryOrder) {
    ordered[cat] = grouped[cat]!;
  }
  return ordered;
}

export async function createUsesItem(data: NewUsesItem) {
  const result = await db.insert(usesItems).values(data).returning();
  return result[0];
}

export async function updateUsesItem(id: string, data: Partial<NewUsesItem>) {
  const result = await db
    .update(usesItems)
    .set(data)
    .where(eq(usesItems.id, id))
    .returning();
  return result[0];
}

export async function deleteUsesItem(id: string) {
  return db.delete(usesItems).where(eq(usesItems.id, id));
}
