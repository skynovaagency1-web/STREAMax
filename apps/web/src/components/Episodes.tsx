"use client";

import Link from "next/link";
import { useState } from "react";
import type { Season } from "@streamax/core";

export function Episodes({ slug, seasons }: { slug: string; seasons: Season[] }) {
  const [n, setN] = useState(seasons[0].number);
  const season = seasons.find((s) => s.number === n) ?? seasons[0];

  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-semibold">Episodes</h2>
        <div className="flex gap-1 rounded-xl bg-white/5 p-1">
          {seasons.map((s) => (
            <button
              key={s.number}
              onClick={() => setN(s.number)}
              className={`rounded-lg px-3 py-1 text-sm ${s.number === n ? "bg-white/15 text-white" : "text-mist"}`}
            >
              Season {s.number}
            </button>
          ))}
        </div>
      </div>
      <ol className="grid gap-3 md:grid-cols-2">
        {season.episodes.map((ep) => (
          <li key={ep.id}>
            <Link
              href={`/watch/${slug}?s=${season.number}&e=${ep.number}`}
              className="flex gap-4 rounded-2xl border border-white/5 bg-ink-900 p-4 transition hover:border-violet/50 hover:bg-ink-800"
            >
              <span className="font-display w-8 text-2xl font-bold text-white/30">{ep.number}</span>
              <div className="min-w-0">
                <p className="font-semibold">{ep.title}</p>
                <p className="mt-0.5 text-sm text-mist">{ep.synopsis}</p>
                <p className="mt-1 text-xs text-mist/70">{ep.durationMin} min</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
