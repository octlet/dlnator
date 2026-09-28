"use client";

import { useEffect, useRef } from "react";

export default function Player({ type, src, poster, className }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const media = document.createElement(type === "audio" ? "audio" : "video");
    media.preload = "metadata";
    media.style.width = "100%";
    media.style.height = "100%";
    if (type !== "audio" && poster) media.poster = poster;

    const source = document.createElement("source");
    source.src = src;
    media.appendChild(source);

    container.appendChild(media);

    let player;
    let cancelled = false;

    import("plyr").then(({ default: Plyr }) => {
      if (cancelled) return;
      player = new Plyr(media, { iconUrl: "/plyr.svg" });
    });

    return () => {
      cancelled = true;

      try {
        player?.destroy();
      } catch {
        // plyr may have already rearranged the dom, container reset below covers it
      }

      container.replaceChildren();
    };
  }, [type, src, poster]);

  return <div ref={containerRef} className={className} />;
}
