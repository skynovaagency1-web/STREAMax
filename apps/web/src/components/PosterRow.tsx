"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Title } from "@streamax/core";
import { PosterCard } from "./PosterCard";

export function PosterRow({
  label,
  titles,
  href,
  ranked = false,
}: {
  label: string;
  titles: Title[];
  href?: string;
  ranked?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) =>
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });

  if (titles.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-8">
      <div className="mb-3 flex items-end justify-between">
        <h2 className="font-display text-lg font-semibold sm:text-xl">{label}</h2>
        <div className="flex items-center gap-2">
          {href && (
            <Link href={href} className="text-sm text-violet-soft hover:text-white">
              See all
            </Link>
          )}
          <button aria-label="Scroll left" onClick={() => scroll(-1)} className="hidden rounded-full p-1.5 text-mist hover:bg-white/10 sm:block">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <button aria-label="Scroll right" onClick={() => scroll(1)} className="hidden rounded-full p-1.5 text-mist hover:bg-white/10 sm:block">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>
      </div>
      <div ref={ref} className="no-scrollbar -mx-1 flex snap-x gap-4 overflow-x-auto px-1 pt-2 pb-4">
        {titles.map((t, i) => (
          <PosterCard key={t.id} title={t} rank={ranked ? i + 1 : undefined} />
        ))}
      </div>
    </section>
  );
}
