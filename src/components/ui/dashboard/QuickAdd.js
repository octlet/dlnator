"use client";

import { useState } from "react";
import Button from "@ui/Button";

function shortError(msg) {
  if (!msg) return "failed";
  const oneLine = msg.split("\n")[0];
  return oneLine.length > 120 ? `${oneLine.slice(0, 120)}...` : oneLine;
}

export default function QuickAdd() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSubmit() {
    if (!url.trim()) return;

    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (res.ok) {
        setUrl("");
        setStatus(data?.duplicate ? "already exists" : "added");
      } else {
        setStatus(shortError(data?.error));
      }
    } catch {
      setStatus("error");
    }

    setLoading(false);
  }

  return (
    <aside className="rounded-2xl border border-white/8 p-5">
      <div>
        <p className="text-sm text-white">quick add</p>
        <p className="mt-1 text-sm text-white/45">
          paste a source to create a job
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <input
          type="text"
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="rounded-xl border border-white/8 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/25"
        />

        <Button
          variant="primary"
          className="self-start px-5 py-2.5"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "adding..." : "probe url"}
        </Button>

        {status && <p className="font-mono text-xs text-white/35">{status}</p>}
      </div>
    </aside>
  );
}
