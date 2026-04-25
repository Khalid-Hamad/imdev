import { NextResponse } from "next/server";
import { db } from "@/db";
import { usesItems } from "@/db/schema/uses";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const items = await db
      .select()
      .from(usesItems)
      .orderBy(usesItems.category, usesItems.sortOrder);
    return NextResponse.json(items);
  } catch {
    return NextResponse.json([]);
  }
}

export async function PUT(request: Request) {
  try {
    const items = await request.json();
    const results = [];

    const existingIds = new Set<string>();

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const data = {
        name: item.name,
        descriptionEn: item.descriptionEn || "",
        descriptionAr: item.descriptionAr || "",
        category: item.category,
        rating: item.rating || 0,
        iconUrl: item.iconUrl || "",
        sortOrder: i,
      };

      if (item.id) {
        const [updated] = await db
          .update(usesItems)
          .set(data)
          .where(eq(usesItems.id, item.id))
          .returning();
        if (updated) {
          results.push(updated);
          existingIds.add(updated.id);
        } else {
          const [created] = await db.insert(usesItems).values(data).returning();
          results.push(created);
          existingIds.add(created.id);
        }
      } else {
        const [created] = await db.insert(usesItems).values(data).returning();
        results.push(created);
        existingIds.add(created.id);
      }
    }

    const allItems = await db.select().from(usesItems);
    for (const item of allItems) {
      if (!existingIds.has(item.id)) {
        await db.delete(usesItems).where(eq(usesItems.id, item.id));
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Uses save error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
