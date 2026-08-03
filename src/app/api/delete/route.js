import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getJobById, deleteJob } from "../../../helpers/jobs";

function safeDelete(filePath) {
  if (!filePath) return;

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {}
}

function deleteSidecarFiles(filePath) {
  if (!filePath) return;

  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const base = path.basename(filePath, ext);

  const candidates = [
    path.join(dir, `${base}.info.json`),
    path.join(dir, `${base}.jpg`),
    path.join(dir, `${base}.jpeg`),
    path.join(dir, `${base}.png`),
    path.join(dir, `${base}.webp`),
  ];

  candidates.forEach(safeDelete);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const jobId = Number(body?.jobId);

    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    const job = getJobById(jobId);

    if (!job) {
      return NextResponse.json({ error: "job not found" }, { status: 404 });
    }

    if (Array.isArray(job.files)) {
      for (const file of job.files) {
        safeDelete(file.path);
        deleteSidecarFiles(file.path);
      }
    }

    deleteJob(jobId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "delete failed" },
      { status: 500 },
    );
  }
}
