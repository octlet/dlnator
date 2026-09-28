"use client";

import { useState } from "react";
import Button from "@ui/Button";
import FolderPicker from "./FolderPicker";
import { refetchJobs } from "../../../helpers/useJobs";

export default function SettingsActions() {
  const [action, setAction] = useState(null);
  const [status, setStatus] = useState("");
  const [importPath, setImportPath] = useState("");

  async function handleClearFailed() {
    setAction("clearing");
    setStatus("");

    try {
      const res = await fetch("/api/jobs/clear-failed", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        setStatus(`cleared ${data.count} failed job${data.count === 1 ? "" : "s"}`);
        await refetchJobs();
      } else {
        setStatus("failed to clear jobs");
      }
    } catch {
      setStatus("failed to clear jobs");
    }

    setAction(null);
  }

  async function handleRescan() {
    setAction("rescanning");
    setStatus("");

    try {
      const res = await fetch("/api/library/rescan", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        setStatus(`found ${data.addedFiles} file${data.addedFiles === 1 ? "" : "s"} in ${data.addedJobs} new job${data.addedJobs === 1 ? "" : "s"}`);
        await refetchJobs();
      } else {
        setStatus("failed to rescan library");
      }
    } catch {
      setStatus("failed to rescan library");
    }

    setAction(null);
  }

  async function handleImport() {
    const folderPath = importPath.trim();
    if (!folderPath) return;

    setAction("importing");
    setStatus("");

    try {
      const res = await fetch("/api/library/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: folderPath }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus(`found ${data.addedFiles} file${data.addedFiles === 1 ? "" : "s"} in ${data.addedJobs} new job${data.addedJobs === 1 ? "" : "s"}`);
        setImportPath("");
        await refetchJobs();
      } else {
        setStatus(data.error || "failed to import folder");
      }
    } catch {
      setStatus("failed to import folder");
    }

    setAction(null);
  }

  return (
    <section className="rounded-2xl border border-white/8 p-5">
      <div>
        <p className="text-sm text-white">system actions</p>
        <p className="mt-1 text-sm text-white/45">
          maintenance and cleanup tools
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          className="px-4 py-2"
          onClick={handleRescan}
          disabled={action !== null}
        >
          {action === "rescanning" ? "rescanning..." : "rescan library"}
        </Button>

        <Button
          variant="outline"
          className="px-4 py-2"
          onClick={handleClearFailed}
          disabled={action !== null}
        >
          {action === "clearing" ? "clearing..." : "clear failed jobs"}
        </Button>

        {status && <p className="font-mono text-xs text-white/35">{status}</p>}
      </div>

      <div className="mt-6 flex flex-col gap-2 border-t border-white/8 pt-5">
        <p className="text-sm text-white">import folder</p>
        <p className="text-sm text-white/45">
          index media from another folder into the library (the folder must be
          visible to the app, e.g. mounted into the container)
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="/app/import"
            value={importPath}
            onChange={(e) => setImportPath(e.target.value)}
            className="min-w-64 flex-1 rounded-xl border border-white/8 bg-transparent px-4 py-2 text-sm text-white outline-none placeholder:text-white/25"
          />

          <FolderPicker onSelect={setImportPath} />

          <Button
            variant="outline"
            className="px-4 py-2"
            onClick={handleImport}
            disabled={action !== null || !importPath.trim()}
          >
            {action === "importing" ? "importing..." : "import"}
          </Button>
        </div>
      </div>
    </section>
  );
}
