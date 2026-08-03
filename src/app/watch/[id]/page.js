"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { formatDuration } from "../../../helpers/format";
import Button from "@ui/Button";
import EmptyState from "@ui/EmptyState";

function getLabel(mode) {
  if (mode === "video-mp4") return "mp4 video";
  if (mode === "audio-mp3") return "mp3 audio";
  if (mode === "audio-m4a") return "m4a audio";
  return mode;
}

function getDefaultSelectedMode(files = []) {
  if (!files.length) return null;

  const mp4 = files.find((file) => file.mode === "video-mp4");
  if (mp4) return mp4.mode;

  return files[0].mode;
}

export default function WatchPage() {
  const params = useParams();
  const id = params.id;

  const [job, setJob] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);

  async function fetchJob() {
    const res = await fetch("/api/jobs");
    const data = await res.json();

    const found = (data.jobs || []).find(
      (item) => String(item.id) === String(id),
    );

    setJob(found || null);

    if (found) {
      const defaultMode = getDefaultSelectedMode(found.files || []);
      setSelectedMode((current) => current || defaultMode);
    }
  }

  useEffect(() => {
    fetchJob();
  }, [id]);

  const selectedFile = useMemo(() => {
    if (!job || !selectedMode) return null;
    return (job.files || []).find((file) => file.mode === selectedMode) || null;
  }, [job, selectedMode]);

  const isAudio = selectedFile?.media_kind === "audio";

  if (!job) {
    return (
      <section className="px-4 py-6 md:px-6 md:py-8">
        <div className="rounded-2xl border border-white/8 p-5 text-sm text-white/50">
          media not found
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-8 px-4 py-6 md:px-6 md:py-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          {job.title || "watch"}
        </h1>
        <p className="mt-2 text-sm text-white/50">
          {job.uploader || "unknown uploader"}
        </p>
      </div>

      <div className="rounded-2xl border border-white/8 p-5">
        <div className="flex flex-col gap-4">
          {(job.files || []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {job.files.map((file) => (
                <Button
                  key={file.mode}
                  variant={selectedMode === file.mode ? "primary" : "outline"}
                  className="px-4 py-2"
                  onClick={() => setSelectedMode(file.mode)}
                >
                  {getLabel(file.mode)}
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

              <audio
                key={selectedFile.path}
                controls
                preload="metadata"
                className="w-full max-w-[700px]"
                src={`/api/stream/${job.id}?mode=${encodeURIComponent(selectedFile.mode)}`}
              />
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-white/8">
              <video
                key={selectedFile.path}
                controls
                preload="metadata"
                className="aspect-video w-full"
                src={`/api/stream/${job.id}?mode=${encodeURIComponent(selectedFile.mode)}`}
              />
            </div>
          )}

          <div className="flex flex-wrap gap-3 font-mono text-xs text-white/35">
            {job.extractor && <span>{job.extractor}</span>}
            {job.duration && <span>{formatDuration(job.duration)}</span>}
            {selectedFile?.mode && <span>{selectedFile.mode}</span>}
            {selectedFile?.media_kind && <span>{selectedFile.media_kind}</span>}
            <span>{job.status}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
