"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDuration } from "../../../helpers/format";
import { useJobs, refetchJobs } from "../../../helpers/useJobs";
import { matchesQuery } from "../../../helpers/jobSearch";
import { toggleFavorite } from "../../../helpers/favorites";
import Button from "@ui/Button";
import EmptyState from "@ui/EmptyState";

export default function LibraryGrid() {
  const jobs = useJobs();
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const completed = jobs.filter((job) => job.status === "completed");
  const items = completed
    .filter((job) => matchesQuery(job, query))
    .filter((job) => !favoritesOnly || job.favorite);

  async function handleToggleFavorite(e, jobId) {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(jobId);
    await refetchJobs();
  }

  return (
    <section className="rounded-2xl border border-white/8 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-white">completed media</p>
          <p className="mt-1 text-sm text-white/45">
            browse downloaded local files
          </p>
        </div>

        <p className="font-mono text-xs text-white/25">
          {items.length} of {completed.length}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="search title or url"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-0 flex-1 rounded-xl border border-white/8 bg-transparent px-4 py-2 text-sm text-white outline-none placeholder:text-white/25"
        />

        <Button
          variant={favoritesOnly ? "primary" : "outline"}
          className="px-4 py-2"
          onClick={() => setFavoritesOnly((v) => !v)}
        >
          ★ favorites
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="mt-6">
          <EmptyState>
            {completed.length === 0
              ? "no media yet"
              : "no media matches your filters"}
          </EmptyState>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/watch/${item.id}`}
              className="rounded-2xl border border-white/8 p-4"
            >
              <div className="relative">
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

                <button
                  onClick={(e) => handleToggleFavorite(e, item.id)}
                  className={`absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/8 backdrop-blur ${
                    item.favorite ? "bg-white text-black" : "bg-black/60 text-white"
                  }`}
                >
                  {item.favorite ? "★" : "☆"}
                </button>
              </div>

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
