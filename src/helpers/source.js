export function extractYouTubeId(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1) || null;
    }

    const v = parsed.searchParams.get("v");
    if (v) return v;

    const shorts = parsed.pathname.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
    if (shorts) return shorts[1];

    return null;
  } catch {
    return null;
  }
}

export function normalizeYouTubeUrl(url) {
  const id = extractYouTubeId(url);
  if (!id) return null;

  return `https://www.youtube.com/watch?v=${id}`;
}

export function getSourceIdentity(url) {
  const youtubeId = extractYouTubeId(url);

  if (youtubeId) {
    return {
      extractor: "youtube",
      id: youtubeId,
      canonicalUrl: normalizeYouTubeUrl(url),
      sourceKey: `youtube:${youtubeId}`,
    };
  }

  return {
    extractor: "unknown",
    id: url,
    canonicalUrl: url,
    sourceKey: `raw:${url}`,
  };
}
