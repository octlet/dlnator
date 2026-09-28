"use client";

import { useEffect, useState } from "react";
import { FORMATS, getFormatLabel } from "../../../helpers/format";

export default function SettingsSection() {
  const [defaultFormat, setDefaultFormat] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setDefaultFormat(data?.settings?.defaultFormat || FORMATS[0]))
      .catch(() => setDefaultFormat(FORMATS[0]));
  }, []);

  async function handleChange(e) {
    const value = e.target.value;
    setDefaultFormat(value);
    setStatus("saving...");

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ defaultFormat: value }),
      });

      setStatus(res.ok ? "saved" : "failed to save");
    } catch {
      setStatus("failed to save");
    }
  }

  return (
    <section className="rounded-2xl border border-white/8 p-5">
      <div>
        <p className="text-sm text-white">download preferences</p>
        <p className="mt-1 text-sm text-white/45">
          used as the preselected format in quick add
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-white/8 p-4">
        <p className="text-sm text-white">default format</p>

        <select
          value={defaultFormat || ""}
          onChange={handleChange}
          disabled={defaultFormat === null}
          className="mt-3 w-full rounded-xl border border-white/8 bg-transparent px-3 py-2 text-sm text-white outline-none"
        >
          {FORMATS.map((format) => (
            <option key={format} value={format} className="bg-black">
              {getFormatLabel(format)}
            </option>
          ))}
        </select>

        {status && (
          <p className="mt-3 font-mono text-xs text-white/35">{status}</p>
        )}
      </div>
    </section>
  );
}
