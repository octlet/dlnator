import { NextResponse } from "next/server";
import { getAllJobs } from "../../../helpers/jobs";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let jobs = getAllJobs();

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
