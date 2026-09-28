export async function toggleFavorite(jobId) {
  const res = await fetch(`/api/jobs/${jobId}/favorite`, { method: "POST" });
  return res.ok;
}
