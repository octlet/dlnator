import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { getLibraryRoot, getOutputTemplate } from "./paths";

function extractVideoId(url) {
  if (!url) return null;

  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
  if (watchMatch) return watchMatch[1];

  const shortsMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]{6,})/);
  if (shortsMatch) return shortsMatch[1];

  const youtuBeMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (youtuBeMatch) return youtuBeMatch[1];

  return null;
}

function getExpectedExtensionsForMode(mode) {
  if (mode === "video-mp4") return [".mp4"];
  if (mode === "audio-mp3") return [".mp3"];
  if (mode === "audio-m4a") return [".m4a"];
  return [".mp4", ".mp3", ".m4a"];
}

function collectMatches(extensions, filterFn) {
  const libraryRoot = getLibraryRoot();
  if (!fs.existsSync(libraryRoot)) return [];

  const matches = [];

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      const ext = path.extname(entry.name).toLowerCase();
      if (!extensions.includes(ext)) continue;

      const stat = fs.statSync(fullPath);
      if (filterFn(entry, stat)) {
        matches.push({ path: fullPath, mtime: stat.mtimeMs });
      }
    }
  }

  walk(libraryRoot);
  return matches;
}

function findLatestDownloadedFile(mode, startedAt) {
  const expectedExtensions = getExpectedExtensionsForMode(mode);

  const matches = collectMatches(
    expectedExtensions,
    (entry, stat) => stat.mtimeMs >= startedAt - 3000,
  );

  if (!matches.length) return null;

  matches.sort((a, b) => b.mtime - a.mtime);
  return matches[0].path;
}

function findDownloadedFile(url, mode, startedAt) {
  const videoId = extractVideoId(url);

  if (videoId) {
    const expectedExtensions = getExpectedExtensionsForMode(mode);

    const matches = collectMatches(expectedExtensions, (entry) =>
      entry.name.includes(`[${videoId}]`),
    );

    if (matches.length) {
      matches.sort((a, b) => b.mtime - a.mtime);
      return matches[0].path;
    }
  }

  return findLatestDownloadedFile(mode, startedAt);
}

export function fetchMetadata(url) {
  return new Promise((resolve, reject) => {
    const process = spawn("yt-dlp", ["--dump-single-json", "--", url]);

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
        const parsed = JSON.parse(stdout);
        resolve(parsed);
      } catch {
        reject(new Error("failed to parse yt-dlp metadata"));
      }
    });
  });
}

export function downloadMedia(url, mode = "video-mp4") {
  return new Promise((resolve, reject) => {
    const output = getOutputTemplate();
    const startedAt = Date.now();

    let args = [];

    if (mode === "audio-mp3") {
      args = [
        "-x",
        "--audio-format",
        "mp3",
        "-o",
        output,
        "--write-info-json",
        "--write-thumbnail",
        "--embed-metadata",
        "--",
        url,
      ];
    } else if (mode === "audio-m4a") {
      args = [
        "-f",
        "bestaudio[ext=m4a]/bestaudio",
        "-o",
        output,
        "--write-info-json",
        "--write-thumbnail",
        "--embed-metadata",
        "--",
        url,
      ];
    } else {
      args = [
        "-f",
        "bv*[vcodec^=avc1][ext=mp4]+ba[ext=m4a]/b[ext=mp4]/b",
        "--merge-output-format",
        "mp4",
        "-o",
        output,
        "--write-info-json",
        "--write-thumbnail",
        "--embed-metadata",
        "--",
        url,
      ];
    }

    const process = spawn("yt-dlp", args);

    let stderr = "";

    process.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    process.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr || "download failed"));
        return;
      }

      const filePath = findDownloadedFile(url, mode, startedAt);

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
