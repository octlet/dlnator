import { NextResponse } from "next/server";
import { getJobById, updateJob } from "../../../../../helpers/jobs";

export async function POST(req, context) {
  try {
    const { id } = await context.params;
    const jobId = Number(id);

    if (!Number.isInteger(jobId)) {
      return NextResponse.json({ error: "invalid id" }, { status: 400 });
    }

    const job = await getJobById(jobId);

    if (!job) {
      return NextResponse.json({ error: "job not found" }, { status: 404 });
    }

    const updated = await updateJob(jobId, { favorite: !job.favorite });

    return NextResponse.json({ success: true, job: updated });
  } catch {
    return NextResponse.json(
      { error: "failed to update favorite" },
      { status: 500 },
    );
  }
}
