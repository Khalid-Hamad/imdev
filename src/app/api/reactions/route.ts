import { NextResponse } from "next/server";
import { db } from "@/db";
import { reactions } from "@/db/schema/reactions";
import { eq, and, sql } from "drizzle-orm";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { targetType, targetId, type } = body;

    if (!targetType || !targetId || !["like", "dislike"].includes(type)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    const existing = await db
      .select()
      .from(reactions)
      .where(
        and(
          eq(reactions.targetType, targetType),
          eq(reactions.targetId, targetId),
          eq(reactions.visitorIp, ip)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      if (existing[0].type === type) {
        await db.delete(reactions).where(eq(reactions.id, existing[0].id));
        return NextResponse.json({ action: "removed" });
      } else {
        await db
          .update(reactions)
          .set({ type })
          .where(eq(reactions.id, existing[0].id));
        return NextResponse.json({ action: "changed" });
      }
    }

    await db.insert(reactions).values({ targetType, targetId, type, visitorIp: ip });
    return NextResponse.json({ action: "added" });
  } catch (error) {
    console.error("Reaction error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetType = searchParams.get("targetType");
    const targetId = searchParams.get("targetId");

    if (!targetType || !targetId) {
      return NextResponse.json({ likes: 0, dislikes: 0 });
    }

    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    const counts = await db
      .select({
        type: reactions.type,
        count: sql<number>`count(*)::int`,
      })
      .from(reactions)
      .where(
        and(eq(reactions.targetType, targetType), eq(reactions.targetId, targetId))
      )
      .groupBy(reactions.type);

    const userReaction = await db
      .select({ type: reactions.type })
      .from(reactions)
      .where(
        and(
          eq(reactions.targetType, targetType),
          eq(reactions.targetId, targetId),
          eq(reactions.visitorIp, ip)
        )
      )
      .limit(1);

    const likes = counts.find((c) => c.type === "like")?.count || 0;
    const dislikes = counts.find((c) => c.type === "dislike")?.count || 0;

    return NextResponse.json({
      likes,
      dislikes,
      userReaction: userReaction[0]?.type || null,
    });
  } catch {
    return NextResponse.json({ likes: 0, dislikes: 0, userReaction: null });
  }
}
