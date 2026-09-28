import { NextResponse } from "next/server";
import { getJobsByStatus, deleteJobsByStatus } from "../../../../helpers/jobs";
import { deleteJobFiles } from "../../../../helpers/library";

export async function POST() {
  try {
    const failedJobs = await getJobsByStatus("failed");
    failedJobs.forEach(deleteJobFiles);

    const result = await deleteJobsByStatus("failed");

    return NextResponse.json({ success: true, count: result.count });
  } catch {
    return NextResponse.json(
      { error: "failed to clear failed jobs" },
      { status: 500 },
    );
  }
}
