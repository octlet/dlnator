import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { getOutputTemplate } from "./paths";

function runYtDlpJson(args) {
  return new Promise((resolve, reject) => {
    const process = spawn("yt-dlp", args);

    let stdout = "";
    let stderr = "";

    process.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    process.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    process.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr || "yt-dlp failed"));
        return;
      }

      try {
        resolve(JSON.parse(stdout));
      } catch {
        reject(new Error("failed to parse yt-dlp output"));
      }
    });
  });
}

export function fetchMetadata(url) {
  return runYtDlpJson(["--dump-single-json", "--", url]);
}

const MAX_PLAYLIST_ENTRIES = 50;

export async function fetchPlaylistEntries(url) {
  const data = await runYtDlpJson([
    "--flat-playlist",
    "--dump-single-json",
    "--",
    url,
  ]);

  const entries = Array.isArray(data.entries) ? data.entries : [];

  return entries
    .map((entry) => {
      if (entry.url && /^https?:\/\//.test(entry.url)) return entry.url;
      if (entry.id) return `https://www.youtube.com/watch?v=${entry.id}`;
      return null;
    })
    .filter(Boolean)
    .slice(0, MAX_PLAYLIST_ENTRIES);
}

export function downloadMedia(url, mode = "video-mp4") {
  return new Promise((resolve, reject) => {
    const output = getOutputTemplate();

    let modeArgs = [];

    if (mode === "audio-mp3") {
      modeArgs = ["-x", "--audio-format", "mp3"];
    } else if (mode === "audio-m4a") {
      modeArgs = ["-f", "bestaudio[ext=m4a]/bestaudio"];
    } else {
      modeArgs = [
        "-f",
        "bv*[vcodec^=avc1][ext=mp4]+ba[ext=m4a]/b[ext=mp4]/b",
        "--merge-output-format",
        "mp4",
      ];
    }

    // --print reports yt-dlp's own final output path, so we never have to
    // guess it by scanning the library for recently modified files.
    const args = [
      ...modeArgs,
      "-o",
      output,
      "--write-info-json",
      "--write-thumbnail",
      "--embed-metadata",
      "--print",
      "after_move:filepath",
      "--quiet",
      "--no-warnings",
      "--",
      url,
    ];

    const process = spawn("yt-dlp", args);

    let stdout = "";
    let stderr = "";

    process.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    process.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    process.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr || "download failed"));
        return;
      }

      const filePath = stdout
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .pop();

      if (!filePath || !fs.existsSync(filePath)) {
        reject(new Error("download completed but file could not be located"));
        return;
      }

      let mediaKind = "video";
      const ext = path.extname(filePath).toLowerCase();

      if ([".mp3", ".m4a", ".wav", ".ogg"].includes(ext)) {
        mediaKind = "audio";
      }

      resolve({
        success: true,
        filePath,
        mediaKind,
      });
    });
  });
}
