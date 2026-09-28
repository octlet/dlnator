"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { formatDuration, getFormatLabel } from "../../../helpers/format";
import { useJobs, refetchJobs } from "../../../helpers/useJobs";
import { toggleFavorite } from "../../../helpers/favorites";
import Button from "@ui/Button";
import EmptyState from "@ui/EmptyState";
import Player from "@ui/Player";
import OtherVideos from "@ui/watch/OtherVideos";

function getDefaultSelectedMode(files = []) {
  if (!files.length) return null;

  const mp4 = files.find((file) => file.mode === "video-mp4");
  if (mp4) return mp4.mode;

  return files[0].mode;
}

export default function WatchPage() {
  const params = useParams();
  const id = params.id;
  const jobs = useJobs();

  const [selectedMode, setSelectedMode] = useState(null);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const job = useMemo(
    () => jobs.find((item) => String(item.id) === String(id)) || null,
    [jobs, id],
  );

  const mode =
    selectedMode || (job ? getDefaultSelectedMode(job.files || []) : null);

  const selectedFile = useMemo(() => {
    if (!job || !mode) return null;
    return (job.files || []).find((file) => file.mode === mode) || null;
  }, [job, mode]);

  const otherItems = useMemo(
    () =>
      jobs.filter(
        (item) => item.status === "completed" && String(item.id) !== String(id),
      ),
    [jobs, id],
  );

  const isAudio = selectedFile?.mediaKind === "audio";

  if (!job) {
    return (
      <section className="px-4 py-6 md:px-6 md:py-8">
        <div className="rounded-2xl border border-white/8 p-5 text-sm text-white/50">
          media not found
        </div>
      </section>
    );
  }

  async function handleToggleFavorite() {
    setFavoriteLoading(true);
    await toggleFavorite(job.id);
    await refetchJobs();
    setFavoriteLoading(false);
  }

  return (
    <section className="flex flex-col gap-8 px-4 py-6 md:px-6 md:py-8">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-white">
            {job.title || "watch"}
          </h1>
          <p className="mt-2 text-sm text-white/50">
            {job.uploader || "unknown uploader"}
          </p>
        </div>

        <Button
          variant={job.favorite ? "primary" : "outline"}
          className="shrink-0 px-4 py-2"
          onClick={handleToggleFavorite}
          disabled={favoriteLoading}
        >
          {job.favorite ? "★ favorited" : "☆ favorite"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-2xl border border-white/8 p-5">
          <div className="flex flex-col gap-4">
            {(job.files || []).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {job.files.map((file) => (
                  <Button
                    key={file.mode}
                    variant={mode === file.mode ? "primary" : "outline"}
                    className="px-4 py-2"
                    onClick={() => setSelectedMode(file.mode)}
                  >
                    {getFormatLabel(file.mode)}
                  </Button>
                ))}
              </div>
            )}

            {!selectedFile ? (
              <EmptyState>no playable file found</EmptyState>
            ) : isAudio ? (
              <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/8 p-6">
                {job.thumbnail && (
                  <img
                    src={job.thumbnail}
                    alt={job.title || "thumbnail"}
                    className="w-[180px] rounded-xl object-cover"
                  />
                )}

                <Player
                  key={selectedFile.path}
                  type="audio"
                  src={`/api/stream/${job.id}?mode=${encodeURIComponent(selectedFile.mode)}`}
                  className="w-full max-w-[700px]"
                />
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-white/8">
                <Player
                  key={selectedFile.path}
                  type="video"
                  src={`/api/stream/${job.id}?mode=${encodeURIComponent(selectedFile.mode)}`}
                  poster={job.thumbnail}
                  className="aspect-video w-full"
                />
              </div>
            )}

            <div className="flex flex-wrap gap-3 font-mono text-xs text-white/35">
              {job.extractor && <span>{job.extractor}</span>}
              {job.duration && <span>{formatDuration(job.duration)}</span>}
              {selectedFile?.mode && <span>{selectedFile.mode}</span>}
              {selectedFile?.mediaKind && <span>{selectedFile.mediaKind}</span>}
              <span>{job.status}</span>
            </div>
          </div>
        </div>

        <OtherVideos items={otherItems} />
      </div>
    </section>
  );
}
