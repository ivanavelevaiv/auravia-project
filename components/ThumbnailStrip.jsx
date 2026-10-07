"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Car } from "lucide-react";

// A single horizontal row of framed thumbnails under a gallery's main image. Each thumbnail shows
// its whole photo (object-contain in a 4:3 card), the active one is ringed in teal, and the row
// scrolls sideways when there are more thumbnails than fit, on any screen size, instead of
// wrapping into a stack.
export default function ThumbnailStrip({ images, activeIndex, onSelect, labelFor, failed = {} }) {
  const stripRef = useRef(null);
  const firstRun = useRef(true);

  // Keep the active thumbnail in view when it changes (not on first render, so loading the page
  // never scrolls anything). Only the strip scrolls; "nearest" leaves the page itself alone.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const strip = stripRef.current;
    const thumb = strip?.children[activeIndex];
    if (!strip || !thumb) return;
    const left = thumb.offsetLeft - strip.offsetLeft;
    if (left < strip.scrollLeft || left + thumb.offsetWidth > strip.scrollLeft + strip.clientWidth) {
      strip.scrollTo({ left: left - (strip.clientWidth - thumb.offsetWidth) / 2, behavior: "smooth" });
    }
  }, [activeIndex]);

  return (
    <div
      ref={stripRef}
      className="flex snap-x snap-proximity flex-row items-center gap-3 overflow-x-auto px-1 py-1.5 [scrollbar-color:rgb(148_163_184/0.3)_transparent] [scrollbar-width:thin]"
    >
      {images.map((src, idx) => {
        const isActive = idx === activeIndex;
        return (
          <button
            key={src}
            type="button"
            onClick={() => onSelect(idx)}
            aria-label={labelFor(idx)}
            aria-current={isActive ? "true" : undefined}
            className={`relative aspect-[4/3] w-24 shrink-0 snap-start overflow-hidden rounded-lg bg-obsidian/30 p-1.5 transition-all duration-200 sm:w-28 ${
              isActive
                ? "opacity-100 shadow-[0_0_18px_-6px_var(--color-teal)] ring-2 ring-inset ring-teal"
                : "opacity-60 ring-1 ring-inset ring-white/10 hover:opacity-100 hover:ring-white/25"
            }`}
          >
            <span className="relative block h-full w-full">
              {failed[idx] ? (
                <span className="flex h-full items-center justify-center">
                  <Car className="h-4 w-4 text-silver/50" />
                </span>
              ) : (
                <Image src={src} alt="" fill sizes="112px" className="rounded-md object-contain" />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
