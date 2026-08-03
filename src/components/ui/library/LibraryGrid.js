"use client";

import Link from "next/link";
import { formatDuration } from "../../../helpers/format";
import { useJobs } from "../../../helpers/useJobs";
import EmptyState from "@ui/EmptyState";

export default function LibraryGrid() {
  const jobs = useJobs();
  const items = jobs.filter((job) => job.status === "completed");

  return (
    <section className="rounded-2xl border border-white/8 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-white">completed media</p>
          <p className="mt-1 text-sm text-white/45">
            browse downloaded local files
          </p>
        </div>

        <p className="font-mono text-xs text-white/25">{items.length} total</p>
      </div>

      {items.length === 0 ? (
        <div className="mt-6">
          <EmptyState>no media yet</EmptyState>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/watch/${item.id}`}
              className="rounded-2xl border border-white/8 p-4"
            >
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt={item.title || "thumbnail"}
                  className="aspect-video w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-white/8 text-xs text-white/30">
                  no preview
                </div>
              )}

              <p className="mt-4 text-sm text-white">
                {item.title || item.url}
              </p>

              <div className="mt-2 flex flex-wrap gap-3 font-mono text-xs text-white/35">
                {item.uploader && <span>{item.uploader}</span>}
                {item.duration && <span>{formatDuration(item.duration)}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
