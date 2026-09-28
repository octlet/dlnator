import { prisma } from "./prisma";

const withFiles = { files: true };

// a job stuck in "downloading" past this age likely belongs to a process
// that crashed or restarted mid-download, so treat it as failed
const STUCK_JOB_TIMEOUT_MS = 60 * 60 * 1000;

export async function reapStuckJobs() {
  const cutoff = new Date(Date.now() - STUCK_JOB_TIMEOUT_MS);

  return prisma.job.updateMany({
    where: { status: "downloading", updatedAt: { lt: cutoff } },
    data: { status: "failed", error: "download timed out" },
  });
}

export function getAllJobs() {
  return prisma.job.findMany({ include: withFiles, orderBy: { id: "desc" } });
}

export function getJobById(id) {
  return prisma.job.findUnique({ where: { id }, include: withFiles });
}

export function findJobBySourceKey(sourceKey) {
  if (!sourceKey) return null;
  return prisma.job.findUnique({ where: { sourceKey }, include: withFiles });
}

export function getJobsByStatus(status) {
  return prisma.job.findMany({ where: { status }, include: withFiles });
}

export async function getKnownFilePaths() {
  const files = await prisma.file.findMany({ select: { path: true } });
  return new Set(files.map((f) => f.path));
}

export async function createJob({ url, canonicalUrl, sourceKey }) {
  try {
    return await prisma.job.create({
      data: {
        url,
        canonicalUrl: canonicalUrl || url,
        sourceKey: sourceKey || null,
      },
      include: withFiles,
    });
  } catch (error) {
    if (error.code === "P2002" && sourceKey) {
      const existing = await findJobBySourceKey(sourceKey);
      if (existing) return existing;
    }
    throw error;
  }
}

export async function updateJob(id, updates) {
  try {
    return await prisma.job.update({
      where: { id },
      data: updates,
      include: withFiles,
    });
  } catch {
    return null;
  }
}

export async function deleteJob(id) {
  try {
    await prisma.job.delete({ where: { id } });
  } catch {
    // job already gone
  }
}

export function deleteJobsByStatus(status) {
  return prisma.job.deleteMany({ where: { status } });
}

export async function addFileToJob(jobId, file) {
  await prisma.file
    .create({
      data: {
        jobId,
        mode: file.mode,
        path: file.path,
        mediaKind: file.mediaKind,
      },
    })
    .catch(() => {});

  return getJobById(jobId);
}
