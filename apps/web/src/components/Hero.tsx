"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Title } from "@streamax/core";
import { KeyArt } from "./KeyArt";
import { AccessBadge, Meta } from "./Badges";

export function Hero({ titles }: { titles: Title[] }) {
  const [i, setI] = useState(0);
  const t = titles[i];

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % titles.length), 8000);
    return () => clearInterval(id);
  }, [titles.length]);

  return (
    <section className="mx-auto max-w-[1400px] px-4 pt-6 sm:px-8">
      <div className="relative overflow-hidden rounded-[28px] ring-1 ring-white/10">
        <KeyArt key={t.id} title={t} variant="backdrop" className="absolute inset-0 animate-[fade_0.8s_ease]" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/95 via-ink-950/60 to-transparent" />
        <div className="relative grid min-h-[460px] items-end gap-8 p-6 sm:p-10 md:min-h-[520px] md:grid-cols-[1.2fr_1fr] md:items-center">
          <div className="max-w-xl">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-amber">
                {t.isNew ? "New on Streamax" : "Featured"}
              </span>
              <AccessBadge title={t} />
            </div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-balance sm:text-6xl">{t.name}</h1>
            <p className="mt-3 text-lg text-white/80 italic">{t.tagline}</p>
            <div className="mt-4"><Meta title={t} /></div>
            <p className="mt-4 line-clamp-3 text-mist">{t.synopsis}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`/watch/${t.slug}`}
                className="brand-gradient inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-semibold text-ink-950 transition hover:opacity-90"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                Watch now
              </Link>
              <Link
                href={`/title/${t.slug}`}
                className="glass inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-semibold transition hover:bg-white/15"
              >
                More info
              </Link>
            </div>
          </div>
          <div className="hidden justify-end md:flex">
            <KeyArt title={t} className="aspect-[2/3] w-60 rotate-3 rounded-3xl shadow-2xl ring-1 ring-white/20 lg:w-72" />
          </div>
        </div>
        <div className="absolute right-6 bottom-6 flex gap-2">
          {titles.map((ft, n) => (
            <button
              key={ft.id}
              aria-label={`Show ${ft.name}`}
              onClick={() => setI(n)}
              className={`h-1.5 rounded-full transition-all ${n === i ? "w-8 bg-amber" : "w-3 bg-white/40"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
