import { getJobById, updateJob, addFileToJob } from "./jobs";
import { downloadMedia } from "./ytDlp";

export async function processDownload(jobId, url, mode) {
  try {
    const current = await getJobById(jobId);
    if (!current) return;

    const files = Array.isArray(current.files) ? current.files : [];
    const alreadyHasMode = files.some((f) => f.mode === mode);

    if (alreadyHasMode) {
      await updateJob(jobId, { status: "completed", error: null });
      return;
    }

    const result = await downloadMedia(url, mode);

    await addFileToJob(jobId, {
      mode,
      path: result.filePath,
      mediaKind: result.mediaKind,
    });

    await updateJob(jobId, { status: "completed", error: null });
  } catch (error) {
    await updateJob(jobId, {
      status: "failed",
      error: error.message || "download failed",
    });
  }
}
