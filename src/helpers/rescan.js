import fs from "fs";
import path from "path";
import { getLibraryRoot } from "./paths";
import {
  findJobBySourceKey,
  createJob,
  updateJob,
  addFileToJob,
  getKnownFilePaths,
} from "./jobs";

const EXT_MODE = {
  ".mp4": "video-mp4",
  ".mp3": "audio-mp3",
  ".m4a": "audio-m4a",
};

const AUDIO_EXTS = new Set([".mp3", ".m4a", ".wav", ".ogg"]);

function walk(dir) {
  const out = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }

  return out;
}

function parseFilename(filePath) {
  const ext = path.extname(filePath);
  const base = path.basename(filePath, ext);
  const match = base.match(/^(.*) \[([a-zA-Z0-9_-]+)\]$/);

  return match ? { title: match[1], id: match[2] } : { title: base, id: null };
}

function readSidecarInfo(filePath) {
  const ext = path.extname(filePath);
  const infoPath = `${filePath.slice(0, -ext.length)}.info.json`;

  try {
    return JSON.parse(fs.readFileSync(infoPath, "utf-8"));
  } catch {
    return null;
  }
}

async function scanFolder(root) {
  const mediaFiles = walk(root).filter(
    (f) => EXT_MODE[path.extname(f).toLowerCase()],
  );

  const knownPaths = await getKnownFilePaths();
  const orphans = mediaFiles.filter((f) => !knownPaths.has(f));

  let addedFiles = 0;
  let addedJobs = 0;

  for (const filePath of orphans) {
    const ext = path.extname(filePath).toLowerCase();
    const mode = EXT_MODE[ext];
    const mediaKind = AUDIO_EXTS.has(ext) ? "audio" : "video";
    const info = readSidecarInfo(filePath);
    const parsed = parseFilename(filePath);

    const extractor = info?.extractor_key || info?.extractor || null;
    const sourceId = info?.id || parsed.id;
    const sourceKey =
      extractor && sourceId
        ? `${extractor.toLowerCase()}:${sourceId}`
        : `raw:${filePath}`;

    let job = await findJobBySourceKey(sourceKey);

    if (!job) {
      job = await createJob({
        url: info?.webpage_url || filePath,
        canonicalUrl: info?.webpage_url || null,
        sourceKey,
      });

      await updateJob(job.id, {
        title: info?.title || parsed.title,
        extractor,
        uploader: info?.uploader || info?.channel || null,
        duration: info?.duration || null,
        thumbnail: info?.thumbnail || null,
        webpageUrl: info?.webpage_url || null,
      });

      addedJobs++;
    }

    await addFileToJob(job.id, { mode, path: filePath, mediaKind });

    if (job.status !== "completed") {
      await updateJob(job.id, { status: "completed", error: null });
    }

    addedFiles++;
  }

  return { addedFiles, addedJobs };
}

export function rescanLibrary() {
  const root = getLibraryRoot();
  if (!fs.existsSync(root)) return { addedFiles: 0, addedJobs: 0 };
  return scanFolder(root);
}

export function importFolder(folderPath) {
  if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
    throw new Error("folder not found");
  }

  return scanFolder(folderPath);
}
