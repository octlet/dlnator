"use client";

import Link from "next/link";
import { useJobs } from "../../../helpers/useJobs";
import EmptyState from "@ui/EmptyState";

export default function RecentJobs() {
  const jobs = useJobs();

  return (
    <section className="rounded-2xl border border-white/8 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-white">recent jobs</p>
          <p className="mt-1 text-sm text-white/45">
            latest activity and source history
          </p>
        </div>

        <p className="font-mono text-xs text-white/25">{jobs.length} total</p>
      </div>

      {jobs.length === 0 ? (
        <div className="mt-6">
          <EmptyState>no jobs yet</EmptyState>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {jobs.slice(0, 5).map((job) => (
            <Link
              key={job.id}
              href="/downloads"
              className="rounded-xl border border-white/8 px-4 py-3"
            >
              <p className="text-sm text-white">{job.title || job.url}</p>
              <p className="mt-1 font-mono text-xs text-white/35">
                {job.status}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
