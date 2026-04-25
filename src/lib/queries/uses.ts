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
  return grouped;
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
