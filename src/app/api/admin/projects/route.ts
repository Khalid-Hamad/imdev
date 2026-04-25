import { NextResponse } from "next/server";
import { createProject } from "@/lib/queries/projects";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const project = await createProject(body);
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
