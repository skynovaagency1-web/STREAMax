import type { Title } from "@streamax/core";

export function AccessBadge({ title }: { title: Title }) {
  if (title.minPlan === "free")
    return <span className="rounded-md bg-emerald-400/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">FREE</span>;
  if (title.minPlan === "premium")
    return <span className="rounded-md bg-amber/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber">PREMIUM</span>;
  return null;
}

export function Meta({ title }: { title: Title }) {
  const length =
    title.kind === "movie"
      ? `${Math.floor((title.durationMin ?? 0) / 60)}h ${(title.durationMin ?? 0) % 60}m`
      : `${title.seasons?.length ?? 0} season${(title.seasons?.length ?? 0) === 1 ? "" : "s"}`;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-mist">
      <span>{title.year}</span>
      <span className="rounded border border-white/20 px-1.5 text-xs">{title.rating}</span>
      <span>{length}</span>
      <span>{title.genres.join(" · ")}</span>
    </div>
  );
}
