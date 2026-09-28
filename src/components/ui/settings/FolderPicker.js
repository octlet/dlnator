"use client";

import { useState } from "react";
import Button from "@ui/Button";

export default function FolderPicker({ onSelect }) {
  const [open, setOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("/");
  const [parent, setParent] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load(folderPath) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/library/browse?path=${encodeURIComponent(folderPath)}`,
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "failed to list folder");
      } else {
        setCurrentPath(data.path);
        setParent(data.parent);
        setEntries(data.entries);
      }
    } catch {
      setError("failed to list folder");
    }

    setLoading(false);
  }

  function toggle() {
    if (open) {
      setOpen(false);
      return;
    }

    setOpen(true);
    load(currentPath);
  }

  return (
    <div className="relative">
      <Button variant="outline" className="px-4 py-2" onClick={toggle}>
        browse
      </Button>

      {open && (
        <div className="absolute z-10 mt-2 w-80 rounded-xl border border-white/10 bg-black p-3 shadow-xl">
          <p className="truncate font-mono text-xs text-white/50">{currentPath}</p>

          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

          <div className="mt-2 max-h-56 overflow-y-auto">
            {parent !== null && (
              <button
                type="button"
                onClick={() => load(parent)}
                className="block w-full rounded-lg px-2 py-1.5 text-left text-sm text-white/60 hover:bg-white/5"
              >
                .. (up)
              </button>
            )}

            {loading && (
              <p className="px-2 py-1.5 text-sm text-white/35">loading...</p>
            )}

            {!loading && !entries.length && !error && (
              <p className="px-2 py-1.5 text-sm text-white/35">no subfolders</p>
            )}

            {entries.map((entry) => (
              <button
                key={entry.path}
                type="button"
                onClick={() => load(entry.path)}
                className="block w-full truncate rounded-lg px-2 py-1.5 text-left text-sm text-white hover:bg-white/5"
              >
                {entry.name}
              </button>
            ))}
          </div>

          <div className="mt-3 flex justify-end gap-2 border-t border-white/8 pt-3">
            <Button
              variant="outline"
              className="px-3 py-1.5"
              onClick={() => setOpen(false)}
            >
              cancel
            </Button>

            <Button
              variant="primary"
              className="px-3 py-1.5"
              onClick={() => {
                onSelect(currentPath);
                setOpen(false);
              }}
            >
              select this folder
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
