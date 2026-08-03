import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "jobs.json");

function ensureFile() {
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf-8");
  }
}

function readJobs() {
  ensureFile();

  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
}

function writeJobs(jobs) {
  ensureFile();
  fs.writeFileSync(filePath, JSON.stringify(jobs, null, 2), "utf-8");
}

export function getAllJobs() {
  return readJobs().sort((a, b) => b.id - a.id);
}

export function getJobById(id) {
  return readJobs().find((job) => job.id === id) || null;
}

export function findJobBySourceKey(sourceKey) {
  if (!sourceKey) return null;
  return readJobs().find((job) => job.source_key === sourceKey) || null;
}

export function createJob({ url, canonicalUrl, sourceKey }) {
  const jobs = readJobs();

  const newJob = {
    id: Date.now(),

    url,
    canonical_url: canonicalUrl || url,
    source_key: sourceKey || null,

    title: null,
    extractor: null,
    uploader: null,
    duration: null,
    thumbnail: null,
    webpage_url: null,

    files: [],

    downloaded: false,
    status: "metadata",
    error: null,

    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  jobs.push(newJob);
  writeJobs(jobs);

  return newJob;
}

export function updateJob(id, updates) {
  const jobs = readJobs();

  const index = jobs.findIndex((job) => job.id === id);
  if (index === -1) return null;

  jobs[index] = {
    ...jobs[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  writeJobs(jobs);

  return jobs[index];
}

export function deleteJob(id) {
  const jobs = readJobs().filter((job) => job.id !== id);
  writeJobs(jobs);
}

export function addFileToJob(jobId, file) {
  const jobs = readJobs();

  const index = jobs.findIndex((job) => job.id === jobId);
  if (index === -1) return null;

  const job = jobs[index];
  const files = Array.isArray(job.files) ? job.files : [];

  const exists = files.some((f) => f.mode === file.mode);
  if (exists) return job;

  jobs[index] = {
    ...job,
    files: [
      ...files,
      {
        mode: file.mode,
        path: file.path,
        media_kind: file.media_kind,
        created_at: file.created_at || new Date().toISOString(),
      },
    ],
    downloaded: true,
    updated_at: new Date().toISOString(),
  };

  writeJobs(jobs);

  return jobs[index];
}
