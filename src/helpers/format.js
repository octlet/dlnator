const FORMAT_LABELS = {
  "video-mp4": "mp4 video",
  "audio-mp3": "mp3 audio",
  "audio-m4a": "m4a audio",
};

export const FORMATS = Object.keys(FORMAT_LABELS);

export function getFormatLabel(mode) {
  return FORMAT_LABELS[mode] || mode;
}

export function formatDuration(seconds) {
  if (!seconds) return null;

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  return `${mins}:${String(secs).padStart(2, "0")}`;
}
