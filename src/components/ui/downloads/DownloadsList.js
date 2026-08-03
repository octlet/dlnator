"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDuration } from "../../../helpers/format";
import { useJobs, refetchJobs } from "../../../helpers/useJobs";
import Button from "@ui/Button";
import EmptyState from "@ui/EmptyState";

function hasMode(job, mode) {
  return (job.files || []).some((file) => file.mode === mode);
}

export default function DownloadsList() {
  const jobs = useJobs();
  const [loadingId, setLoadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  async function handleDownload(jobId, mode) {
    setLoadingId(`${jobId}-${mode}`);

    await fetch("/api/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobId, mode }),
    });

    await refetchJobs();
    setLoadingId(null);
  }

  async function handleDelete(jobId) {
    setDeletingId(jobId);

    await fetch("/api/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobId }),
    });

    await refetchJobs();
    setDeletingId(null);
  }

  return (
    <section className="rounded-2xl border border-white/8 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-white">all jobs</p>
          <p className="mt-1 text-sm text-white/45">
            inspect and download available media
          </p>
        </div>

        <p className="font-mono text-xs text-white/25">{jobs.length} total</p>
      </div>

      {jobs.length === 0 ? (
        <div className="mt-6">
          <EmptyState>no jobs yet</EmptyState>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {jobs.map((job) => {
            const hasMp4 = hasMode(job, "video-mp4");
            const hasMp3 = hasMode(job, "audio-mp3");
            const hasM4a = hasMode(job, "audio-m4a");

            return (
              <div
                key={job.id}
                className="rounded-2xl border border-white/8 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white">{job.title || job.url}</p>

                    <p className="mt-1 font-mono text-xs break-all text-white/35">
                      {job.url}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-3 font-mono text-xs text-white/35">
                      {job.extractor && <span>{job.extractor}</span>}
                      {job.uploader && <span>{job.uploader}</span>}
                      {job.duration && (
                        <span>{formatDuration(job.duration)}</span>
                      )}
                      {(job.files || []).map((file) => (
                        <span key={file.mode}>{file.mode}</span>
                      ))}
                    </div>

                    {job.error && (
                      <p className="mt-3 text-xs text-red-300">{job.error}</p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {(job.files || []).length > 0 && (
                        <Link
                          href={`/watch/${job.id}`}
                          className="rounded-xl border border-white/8 px-4 py-2 text-sm text-white/80"
                        >
                          watch
                        </Link>
                      )}

                      {!hasMp4 && (
                        <Button
                          variant="primary"
                          className="px-4 py-2"
                          onClick={() => handleDownload(job.id, "video-mp4")}
                          disabled={loadingId !== null}
                        >
                          {loadingId === `${job.id}-video-mp4`
                            ? "starting..."
                            : "download mp4"}
                        </Button>
                      )}

                      {!hasMp3 && (
                        <Button
                          variant="outline"
                          className="px-4 py-2"
                          onClick={() => handleDownload(job.id, "audio-mp3")}
                          disabled={loadingId !== null}
                        >
                          {loadingId === `${job.id}-audio-mp3`
                            ? "starting..."
                            : "download mp3"}
                        </Button>
                      )}

                      {!hasM4a && (
                        <Button
                          variant="outline"
                          className="px-4 py-2"
                          onClick={() => handleDownload(job.id, "audio-m4a")}
                          disabled={loadingId !== null}
                        >
                          {loadingId === `${job.id}-audio-m4a`
                            ? "starting..."
                            : "download m4a"}
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        className="px-4 py-2"
                        onClick={() => handleDelete(job.id)}
                        disabled={deletingId === job.id}
                      >
                        {deletingId === job.id ? "deleting..." : "delete"}
                      </Button>
                    </div>
                  </div>

                  <div className="shrink-0 rounded-full border border-white/8 px-3 py-1 font-mono text-xs text-white/50">
                    {job.status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
