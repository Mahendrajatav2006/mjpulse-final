"use client";

import React from "react";

export default function HiddenPlayerEngine() {
  return (
    <div
      id="hidden-yt-engine-container"
      className="absolute top-[-9999px] left-[-9999px] w-[200px] h-[200px] pointer-events-none opacity-0 -z-50 overflow-hidden"
      aria-hidden="true"
    >
      <div id="hidden-yt-player" />
    </div>
  );
}
