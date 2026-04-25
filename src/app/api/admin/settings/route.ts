import { NextResponse } from "next/server";
import { getAllSettings, setSetting } from "@/lib/queries/settings";

export async function GET() {
  try {
    const settings = await getAllSettings();
    const flat: Record<string, string> = {};
    for (const [key, value] of Object.entries(settings)) {
      flat[key] = typeof value === "string" ? value : JSON.stringify(value);
    }
    return NextResponse.json(flat);
  } catch {
    return NextResponse.json({});
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    for (const [key, value] of Object.entries(body)) {
      await setSetting(key, value);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
