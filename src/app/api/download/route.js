import { NextResponse } from "next/server";
import { getJobById, updateJob } from "../../../helpers/jobs";
import { processDownload } from "../../../helpers/download";

export async function POST(req) {
  try {
    const body = await req.json();
    const jobId = Number(body?.jobId);
    const mode = body?.mode || "video-mp4";

    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    const job = getJobById(jobId);

    if (!job) {
      return NextResponse.json({ error: "job not found" }, { status: 404 });
    }

    const files = Array.isArray(job.files) ? job.files : [];
    const alreadyExists = files.some((f) => f.mode === mode);

    if (alreadyExists) {
      return NextResponse.json({
        success: true,
        job,
        skipped: true,
      });
    }

    if (job.status === "downloading") {
      return NextResponse.json(
        { error: "job already downloading" },
        { status: 400 },
      );
    }

    updateJob(jobId, {
      status: "downloading",
      error: null,
    });

    processDownload(jobId, job.canonical_url || job.url, mode);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "failed to start download" },
      { status: 500 },
    );
  }
}
