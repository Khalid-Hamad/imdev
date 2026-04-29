import { NextResponse } from "next/server";
import { updateProject, deleteProject } from "@/lib/queries/projects";
import { normalizeKind } from "@/lib/projects-constants";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const next = body.kind === undefined ? body : { ...body, kind: normalizeKind(body.kind) };
    const project = await updateProject(id, next);
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await deleteProject(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
