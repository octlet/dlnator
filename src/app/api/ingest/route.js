import { NextResponse } from "next/server";
import {
  createJob,
  updateJob,
  findJobBySourceKey,
} from "../../../helpers/jobs";
import { fetchMetadata, fetchPlaylistEntries } from "../../../helpers/ytDlp";
import { getSourceIdentity } from "../../../helpers/source";
import { processDownload } from "../../../helpers/download";

function isValidSourceUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function isPlaylistUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.searchParams.has("list") || parsed.pathname.includes("/playlist");
  } catch {
    return false;
  }
}

async function ingestOne(url, mode) {
  const identity = getSourceIdentity(url);
  const existing = identity.sourceKey
    ? await findJobBySourceKey(identity.sourceKey)
    : null;

  if (existing) {
    let updated = existing;

    if (!existing.sourceKey || !existing.canonicalUrl) {
      updated = await updateJob(existing.id, {
        sourceKey: existing.sourceKey || identity.sourceKey,
        canonicalUrl: existing.canonicalUrl || identity.canonicalUrl,
      });
    }

    if (mode) {
      const files = Array.isArray(updated.files) ? updated.files : [];
      const alreadyHasMode = files.some((f) => f.mode === mode);

      if (!alreadyHasMode && updated.status !== "downloading") {
        updated = await updateJob(updated.id, {
          status: "downloading",
          error: null,
        });

        processDownload(
          updated.id,
          updated.canonicalUrl || updated.webpageUrl || updated.url,
          mode,
        );
      }
    }

    return { success: true, job: updated, duplicate: true };
  }

  const job = await createJob({
    url,
    canonicalUrl: identity.canonicalUrl,
    sourceKey: identity.sourceKey,
  });

  try {
    const metadata = await fetchMetadata(identity.canonicalUrl || url);

    const updated = await updateJob(job.id, {
      title: metadata.title || null,
      extractor: metadata.extractor_key || metadata.extractor || null,
      uploader: metadata.uploader || metadata.channel || null,
      duration: metadata.duration || null,
      thumbnail: metadata.thumbnail || null,
      webpageUrl: metadata.webpage_url || identity.canonicalUrl || url,
      canonicalUrl: identity.canonicalUrl || metadata.webpage_url || url,
      sourceKey: identity.sourceKey || null,
      status: mode ? "downloading" : "queued",
      error: null,
    });

    if (mode) {
      processDownload(job.id, identity.canonicalUrl || url, mode);
    }

    return { success: true, job: updated };
  } catch (error) {
    const failed = await updateJob(job.id, {
      status: "failed",
      error: error.message || "metadata fetch failed",
    });

    return { success: false, job: failed };
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const url = body?.url?.trim();
    const mode = body?.mode || null;

    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    if (!isValidSourceUrl(url)) {
      return NextResponse.json(
        { error: "url must be a valid http(s) address" },
        { status: 400 },
      );
    }

    if (isPlaylistUrl(url)) {
      let entries = [];

      try {
        entries = await fetchPlaylistEntries(url);
      } catch {
        // fall through to single-url ingest below
      }

      if (entries.length) {
        const results = [];
        for (const entryUrl of entries) {
          results.push(await ingestOne(entryUrl, mode));
        }

        return NextResponse.json({
          success: true,
          playlist: true,
          count: results.length,
          jobs: results.map((r) => r.job),
        });
      }
    }

    const result = await ingestOne(url, mode);

    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
}
