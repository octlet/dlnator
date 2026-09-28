import { NextResponse } from "next/server";
import { getSettings, updateSettings } from "../../../helpers/settings";
import { FORMATS } from "../../../helpers/format";

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json(
      { error: "failed to load settings" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const defaultFormat = body?.defaultFormat;

    if (!FORMATS.includes(defaultFormat)) {
      return NextResponse.json({ error: "invalid format" }, { status: 400 });
    }

    const settings = await updateSettings({ defaultFormat });
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json(
      { error: "failed to update settings" },
      { status: 500 },
    );
  }
}
