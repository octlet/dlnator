import { NextResponse } from "next/server";
import { getAllJobs, reapStuckJobs } from "../../../helpers/jobs";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    await reapStuckJobs();
    let jobs = await getAllJobs();

    if (status) {
      jobs = jobs.filter((job) => job.status === status);
    }

    return NextResponse.json({ jobs });
  } catch {
    return NextResponse.json(
      { error: "failed to fetch jobs" },
      { status: 500 },
    );
  }
}
