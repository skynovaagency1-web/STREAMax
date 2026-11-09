"use client";

import { useState } from "react";
import { TITLES, searchTitles, type Genre } from "@streamax/core";
import { PosterCard } from "./PosterCard";

const GENRES = [...new Set(TITLES.flatMap((t) => t.genres))] as Genre[];

export function SearchView() {
  const [q, setQ] = useState("");
  const results = q ? searchTitles(q) : TITLES;

  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-8">
      <label className="glass flex items-center gap-3 rounded-2xl px-5 py-4">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-mist" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search titles, genres, stories…"
          className="w-full bg-transparent text-lg outline-none placeholder:text-mist/60"
        />
      </label>
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => setQ(g)}
            className={`rounded-full border px-3 py-1 text-sm whitespace-nowrap ${
              q === g ? "border-amber text-amber" : "border-white/10 text-mist hover:text-white"
            }`}
          >
            {g}
          </button>
        ))}
      </div>
      <p className="mt-6 text-sm text-mist">{q ? `${results.length} results for “${q}”` : "Browse everything"}</p>
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] [&>a]:w-full">
        {results.map((t) => (
          <PosterCard key={t.id} title={t} />
        ))}
      </div>
    </div>
  );
}
