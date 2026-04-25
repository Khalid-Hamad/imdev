import { NextResponse } from "next/server";
import { db } from "@/db";
import { aboutSections } from "@/db/schema/about";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    const sections = await db
      .select()
      .from(aboutSections)
      .orderBy(asc(aboutSections.sortOrder));
    return NextResponse.json(sections);
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
        type: item.type,
        data: item.data,
        sortOrder: i,
      };

      if (item.id) {
        const [updated] = await db
          .update(aboutSections)
          .set({ ...data, updatedAt: new Date() })
          .where(eq(aboutSections.id, item.id))
          .returning();
        if (updated) {
          results.push(updated);
          existingIds.add(updated.id);
        } else {
          const [created] = await db
            .insert(aboutSections)
            .values(data)
            .returning();
          results.push(created);
          existingIds.add(created.id);
        }
      } else {
        const [created] = await db
          .insert(aboutSections)
          .values(data)
          .returning();
        results.push(created);
        existingIds.add(created.id);
      }
    }

    const allItems = await db.select().from(aboutSections);
    for (const item of allItems) {
      if (!existingIds.has(item.id)) {
        await db.delete(aboutSections).where(eq(aboutSections.id, item.id));
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("About save error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
