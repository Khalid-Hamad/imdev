import { NextResponse } from "next/server";
import { updatePost, deletePost } from "@/lib/queries/posts";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    if (body.publishedAt) body.publishedAt = new Date(body.publishedAt);
    const post = await updatePost(id, body);
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await deletePost(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
