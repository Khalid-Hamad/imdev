import { NextResponse } from "next/server";
import { createPost } from "@/lib/queries/posts";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.publishedAt) body.publishedAt = new Date(body.publishedAt);
    const post = await createPost(body);
    return NextResponse.json(post);
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
