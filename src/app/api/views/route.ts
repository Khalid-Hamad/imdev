import { NextResponse } from "next/server";
import { db } from "@/db";
import { pageViews } from "@/db/schema/reactions";
import { eq, and, sql } from "drizzle-orm";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pagePath, targetType, targetId } = body;

    if (!pagePath) {
      return NextResponse.json({ error: "Invalid" }, { status: 400 });
    }

    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    await db.insert(pageViews).values({
      pagePath,
      targetType: targetType || "",
      targetId: targetId || null,
      visitorIp: ip,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("View tracking error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetType = searchParams.get("targetType");
    const targetId = searchParams.get("targetId");
    const pagePath = searchParams.get("pagePath");

    const conditions = [];
    if (targetType) conditions.push(eq(pageViews.targetType, targetType));
    if (targetId) conditions.push(eq(pageViews.targetId, targetId));
    if (pagePath) conditions.push(eq(pageViews.pagePath, pagePath));

    if (conditions.length === 0) {
      return NextResponse.json({ views: 0 });
    }

    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(pageViews)
      .where(and(...conditions));

    return NextResponse.json({ views: result?.count || 0 });
  } catch {
    return NextResponse.json({ views: 0 });
  }
}
