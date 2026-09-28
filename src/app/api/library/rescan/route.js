import { NextResponse } from "next/server";
import { rescanLibrary } from "../../../../helpers/rescan";

export async function POST() {
  try {
    const result = await rescanLibrary();
    return NextResponse.json({ success: true, ...result });
  } catch {
    return NextResponse.json(
      { error: "failed to rescan library" },
      { status: 500 },
    );
  }
}
