"use client";

import { useEffect, useState } from "react";
import Button from "@ui/Button";
import { FORMATS, getFormatLabel } from "../../../helpers/format";

function shortError(msg) {
  if (!msg) return "failed";
  const oneLine = msg.split("\n")[0];
  return oneLine.length > 120 ? `${oneLine.slice(0, 120)}...` : oneLine;
}

function parseUrls(value) {
  return value
    .split(/[\n,]/)
    .map((u) => u.trim())
    .filter(Boolean);
}

export default function QuickAdd() {
  const [input, setInput] = useState("");
  const [format, setFormat] = useState(FORMATS[0]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings?.defaultFormat) setFormat(data.settings.defaultFormat);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit() {
    const urls = parseUrls(input);
    if (!urls.length) return;

    setLoading(true);
    setStatus("");

    let queued = 0;
    let failed = 0;
    let lastError = "";

    for (const url of urls) {
      try {
        const res = await fetch("/api/ingest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, mode: format }),
        });

        const data = await res.json();

        if (res.ok) {
          queued += data?.count || 1;
        } else {
          failed++;
          lastError = data?.error;
        }
      } catch {
        failed++;
      }
    }

    setInput("");
    setStatus(
      failed
        ? `queued ${queued}, ${failed} failed${lastError ? `: ${shortError(lastError)}` : ""}`
        : `queued ${queued}`,
    );

    setLoading(false);
  }

  return (
    <aside className="rounded-2xl border border-white/8 p-5">
      <div>
        <p className="text-sm text-white">quick add</p>
        <p className="mt-1 text-sm text-white/45">
          paste one or more urls, or a playlist link, one per line
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <textarea
          rows={3}
          placeholder="https://..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="rounded-xl border border-white/8 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/25"
        />

        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="rounded-xl border border-white/8 bg-transparent px-4 py-3 text-sm text-white outline-none"
        >
          {FORMATS.map((f) => (
            <option key={f} value={f} className="bg-black">
              {getFormatLabel(f)}
            </option>
          ))}
        </select>

        <Button
          variant="primary"
          className="self-start px-5 py-2.5"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "adding..." : "add and download"}
        </Button>

        {status && <p className="font-mono text-xs text-white/35">{status}</p>}
      </div>
    </aside>
  );
}
