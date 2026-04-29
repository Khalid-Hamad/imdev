import { NextResponse } from "next/server";
import { createProject } from "@/lib/queries/projects";
import { normalizeKind } from "@/lib/projects-constants";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const project = await createProject({
      ...body,
      kind: normalizeKind(body.kind),
    });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
