import { getJobById, updateJob, addFileToJob } from "./jobs";
import { downloadMedia } from "./ytDlp";

export async function processDownload(jobId, url, mode) {
  try {
    const current = getJobById(jobId);
    if (!current) return;

    const files = Array.isArray(current.files) ? current.files : [];
    const alreadyHasMode = files.some((f) => f.mode === mode);

    if (alreadyHasMode) {
      updateJob(jobId, { status: "completed", error: null });
      return;
    }

    const result = await downloadMedia(url, mode);

    addFileToJob(jobId, {
      mode,
      path: result.filePath,
      media_kind: result.mediaKind,
      created_at: new Date().toISOString(),
    });

    updateJob(jobId, { status: "completed", error: null });
  } catch (error) {
    updateJob(jobId, {
      status: "failed",
      error: error.message || "download failed",
    });
  }
}
