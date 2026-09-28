import { NextResponse } from "next/server";
import { getJobById, deleteJob } from "../../../helpers/jobs";
import { deleteJobFiles } from "../../../helpers/library";

export async function POST(req) {
  try {
    const body = await req.json();
    const jobId = Number(body?.jobId);

    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    const job = await getJobById(jobId);

    if (!job) {
      return NextResponse.json({ error: "job not found" }, { status: 404 });
    }

    deleteJobFiles(job);
    await deleteJob(jobId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "delete failed" },
      { status: 500 },
    );
  }
}
