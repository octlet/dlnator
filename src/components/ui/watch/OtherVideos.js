import Link from "next/link";
import { formatDuration } from "../../../helpers/format";
import EmptyState from "@ui/EmptyState";

export default function OtherVideos({ items }) {
  return (
    <aside className="flex flex-col gap-3 rounded-2xl border border-white/8 p-4 lg:max-h-[640px] lg:overflow-y-auto">
      <p className="text-sm text-white">more from your library</p>

      {items.length === 0 ? (
        <EmptyState>nothing else downloaded yet</EmptyState>
      ) : (
        items.map((item) => (
          <Link
            key={item.id}
            href={`/watch/${item.id}`}
            className="flex gap-3 rounded-xl border border-white/8 p-2 hover:border-white/20"
          >
            {item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt={item.title || "thumbnail"}
                className="aspect-video w-28 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="flex aspect-video w-28 shrink-0 items-center justify-center rounded-lg border border-white/8 text-[10px] text-white/30">
                no preview
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm text-white">
                {item.title || item.url}
              </p>

              <div className="mt-1 flex flex-wrap gap-2 font-mono text-xs text-white/35">
                {item.uploader && <span>{item.uploader}</span>}
                {item.duration && <span>{formatDuration(item.duration)}</span>}
              </div>
            </div>
          </Link>
        ))
      )}
    </aside>
  );
}
