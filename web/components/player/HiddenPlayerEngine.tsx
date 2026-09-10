"use client";

import React, { useEffect } from "react";

export default function HiddenPlayerEngine() {
  useEffect(() => {
    // Load YouTube IFrame Player API if not already present
    if (typeof window !== "undefined" && !window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }
  }, []);

  return (
    <div
      id="mj-pulse-hidden-audio-container"
      aria-hidden="true"
      style={{
        position: "fixed",
        top: -9999,
        left: -9999,
        width: 1,
        height: 1,
        opacity: 0,
        pointerEvents: "none",
        zIndex: -1,
      }}
    >
      <div id="hidden-yt-player" />
    </div>
  );
}
