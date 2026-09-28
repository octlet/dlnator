export function matchesQuery(job, query) {
  if (!query) return true;
  const haystack = `${job.title || ""} ${job.url}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}
