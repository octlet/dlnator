import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const target = path.resolve(searchParams.get("path") || "/");

    if (!fs.statSync(target).isDirectory()) {
      return NextResponse.json({ error: "not a directory" }, { status: 400 });
    }

    const entries = fs
      .readdirSync(target, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({
        name,
        path: path.join(/* turbopackIgnore: true */ target, name),
      }));

    const parent = path.dirname(target);

    return NextResponse.json({
      path: target,
      parent: parent === target ? null : parent,
      entries,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error.code === "ENOENT" ? "folder not found" : "failed to list folder",
      },
      { status: 400 },
    );
  }
}
