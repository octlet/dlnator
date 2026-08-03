import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getJobById } from "../../../../helpers/jobs";

export async function GET(req, context) {
  try {
    const { id } = await context.params;
    const jobId = Number(id);
    const url = new URL(req.url);
    const mode = url.searchParams.get("mode");

    const job = getJobById(jobId);

    if (!job) {
      return new NextResponse("file not found", { status: 404 });
    }

    const files = Array.isArray(job.files) ? job.files : [];
    if (!files.length) {
      return new NextResponse("no media available", { status: 404 });
    }

    let selected = null;

    if (mode) {
      selected = files.find((file) => file.mode === mode) || null;
    }

    if (!selected) {
      selected = files.find((file) => file.media_kind === "video") || files[0];
    }

    const filePath = selected?.path;

    if (!filePath || !fs.existsSync(filePath)) {
      return new NextResponse("missing file", { status: 404 });
    }

    const ext = path.extname(filePath).toLowerCase();

    const mimeMap = {
      ".mp4": "video/mp4",
      ".webm": "video/webm",
      ".mp3": "audio/mpeg",
      ".m4a": "audio/mp4",
      ".wav": "audio/wav",
      ".ogg": "audio/ogg",
    };

    const contentType = mimeMap[ext] || "application/octet-stream";
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.get("range");

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");

      let start = parts[0] ? parseInt(parts[0], 10) : NaN;
      let end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (Number.isNaN(start)) {
        const suffixLength = parseInt(parts[1], 10);
        start = Number.isNaN(suffixLength)
          ? 0
          : Math.max(fileSize - suffixLength, 0);
        end = fileSize - 1;
      }

      start = Math.max(0, start);
      end = Math.min(end, fileSize - 1);

      if (Number.isNaN(end) || end < start) {
        return new NextResponse(null, {
          status: 416,
          headers: { "Content-Range": `bytes */${fileSize}` },
        });
      }

      const chunkSize = end - start + 1;
      const stream = fs.createReadStream(filePath, { start, end });

      return new NextResponse(stream, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize.toString(),
          "Content-Type": contentType,
        },
      });
    }

    const stream = fs.createReadStream(filePath);

    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Length": fileSize.toString(),
        "Content-Type": contentType,
        "Accept-Ranges": "bytes",
      },
    });
  } catch (error) {
    console.error("stream failed:", error);
    return new NextResponse("stream failed", { status: 500 });
  }
}
