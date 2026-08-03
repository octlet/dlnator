import { NextResponse } from "next/server";
import {
  createJob,
  updateJob,
  findJobBySourceKey,
} from "../../../helpers/jobs";
import { fetchMetadata } from "../../../helpers/ytDlp";
import { getSourceIdentity } from "../../../helpers/source";
import { processDownload } from "../../../helpers/download";

export async function POST(req) {
  try {
    const body = await req.json();
    const url = body?.url?.trim();
    const mode = body?.mode || null;

    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    const identity = getSourceIdentity(url);
    const existing = identity.sourceKey
      ? findJobBySourceKey(identity.sourceKey)
      : null;

    if (existing) {
      let updated = existing;

      if (!existing.source_key || !existing.canonical_url) {
        updated = updateJob(existing.id, {
          source_key: existing.source_key || identity.sourceKey,
          canonical_url: existing.canonical_url || identity.canonicalUrl,
        });
      }

      if (mode) {
        const files = Array.isArray(updated.files) ? updated.files : [];
        const alreadyHasMode = files.some((f) => f.mode === mode);

        if (!alreadyHasMode && updated.status !== "downloading") {
          updateJob(updated.id, {
            status: "downloading",
            error: null,
          });

          processDownload(
            updated.id,
            updated.canonical_url || updated.webpage_url || updated.url,
            mode,
          );
        }
      }

      return NextResponse.json({
        success: true,
        job: updated,
        duplicate: true,
      });
    }

    const job = createJob({
      url,
      canonicalUrl: identity.canonicalUrl,
      sourceKey: identity.sourceKey,
    });

    try {
      const metadata = await fetchMetadata(identity.canonicalUrl || url);

      const updated = updateJob(job.id, {
        title: metadata.title || null,
        extractor: metadata.extractor_key || metadata.extractor || null,
        uploader: metadata.uploader || metadata.channel || null,
        duration: metadata.duration || null,
        thumbnail: metadata.thumbnail || null,
        webpage_url: metadata.webpage_url || identity.canonicalUrl || url,
        canonical_url: identity.canonicalUrl || metadata.webpage_url || url,
        source_key: identity.sourceKey || null,
        status: mode ? "downloading" : "queued",
        error: null,
      });

      if (mode) {
        processDownload(job.id, identity.canonicalUrl || url, mode);
      }

      return NextResponse.json({ success: true, job: updated });
    } catch (error) {
      const failed = updateJob(job.id, {
        status: "failed",
        error: error.message || "metadata fetch failed",
      });

      return NextResponse.json(
        { success: false, job: failed },
        { status: 500 },
      );
    }
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
}
