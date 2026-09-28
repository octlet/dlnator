import fs from "fs";
import path from "path";

function safeDelete(filePath) {
  if (!filePath) return;

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    // best effort, file may already be gone
  }
}

function deleteSidecarFiles(filePath) {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const base = path.basename(filePath, ext);

  const candidates = [
    path.join(dir, `${base}.info.json`),
    path.join(dir, `${base}.jpg`),
    path.join(dir, `${base}.jpeg`),
    path.join(dir, `${base}.png`),
    path.join(dir, `${base}.webp`),
  ];

  candidates.forEach(safeDelete);
}

export function deleteJobFiles(job) {
  if (!Array.isArray(job?.files)) return;

  for (const file of job.files) {
    if (!file.path) continue;
    safeDelete(file.path);
    deleteSidecarFiles(file.path);
  }
}
