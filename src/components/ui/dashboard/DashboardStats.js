"use client";

import { useJobs } from "../../../helpers/useJobs";
import DashboardStatCard from "./DashboardStatCard";

export default function DashboardStats() {
  const jobs = useJobs();

  const total = jobs.length;
  const processing = jobs.filter(
    (job) => job.status === "metadata" || job.status === "downloading",
  ).length;
  const completed = jobs.filter((job) => job.status === "completed").length;

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <DashboardStatCard label="total jobs" value={total} />
      <DashboardStatCard label="processing" value={processing} />
      <DashboardStatCard label="completed" value={completed} />
    </section>
  );
}
