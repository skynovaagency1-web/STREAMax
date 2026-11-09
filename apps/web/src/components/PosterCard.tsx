import Link from "next/link";
import type { Title } from "@streamax/core";
import { KeyArt } from "./KeyArt";
import { AccessBadge } from "./Badges";

export function PosterCard({ title, rank }: { title: Title; rank?: number }) {
  return (
    <Link
      href={`/title/${title.slug}`}
      className="group relative block w-[42vw] shrink-0 snap-start sm:w-[180px] lg:w-[200px]"
    >
      <div className="relative transition duration-300 group-hover:-translate-y-1.5">
        <KeyArt
          title={title}
          className="aspect-[2/3] rounded-2xl ring-1 ring-white/10 transition group-hover:ring-violet-soft/70 group-hover:shadow-[0_20px_50px_-15px] group-hover:shadow-violet/50"
        />
        <div className="absolute top-2 left-2 flex gap-1">
          <AccessBadge title={title} />
          {title.isNew && (
            <span className="rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-ink-950">NEW</span>
          )}
        </div>
        {rank !== undefined && (
          <span className="font-display absolute top-1 right-3 text-5xl leading-none font-extrabold text-transparent [-webkit-text-stroke:2px_rgb(251_191_36)]">
            {rank}
          </span>
        )}
      </div>
      <p className="mt-2 truncate text-sm text-mist group-hover:text-white">
        {title.genres[0]} · {title.year}
      </p>
    </Link>
  );
}
