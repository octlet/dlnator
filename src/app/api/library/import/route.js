import { NextResponse } from "next/server";
import { importFolder } from "../../../../helpers/rescan";

export async function POST(req) {
  try {
    const body = await req.json();
    const folderPath = typeof body?.path === "string" ? body.path.trim() : "";

    if (!folderPath) {
      return NextResponse.json({ error: "path is required" }, { status: 400 });
    }

    const result = await importFolder(folderPath);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "failed to import folder" },
      { status: 500 },
    );
  }
}
