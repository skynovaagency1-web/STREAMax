import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TITLES, getCreator, getPlan, getTitleBySlug } from "@streamax/core";
import { KeyArt } from "@/components/KeyArt";
import { AccessBadge, Meta } from "@/components/Badges";
import { PosterRow } from "@/components/PosterRow";
import { Episodes } from "@/components/Episodes";

export function generateStaticParams() {
  return TITLES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = getTitleBySlug((await params).slug);
  return t ? { title: t.name, description: t.synopsis } : {};
}

export default async function TitlePage({ params }: { params: Promise<{ slug: string }> }) {
  const t = getTitleBySlug((await params).slug);
  if (!t) notFound();
  const creator = t.source.type === "creator" ? getCreator(t.source.creatorId) : undefined;
  const similar = TITLES.filter((o) => o.id !== t.id && o.genres.some((g) => t.genres.includes(g)));

  return (
    <div className="space-y-12">
      <section className="relative">
        <KeyArt title={t} variant="backdrop" className="absolute inset-0 h-[560px] opacity-70" />
        <div className="absolute inset-0 h-[560px] bg-gradient-to-b from-transparent via-ink-950/70 to-ink-950" />
        <div className="relative mx-auto grid max-w-[1400px] gap-8 px-4 pt-16 sm:px-8 md:grid-cols-[260px_1fr] md:pt-24">
          <KeyArt title={t} className="hidden aspect-[2/3] rounded-3xl shadow-2xl ring-1 ring-white/15 md:block" />
          <div className="max-w-2xl self-end">
            <div className="mb-3 flex items-center gap-2">
              <AccessBadge title={t} />
              {t.source.type === "public-domain" && (
                <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-mist">Public domain classic</span>
              )}
              {creator && (
                <span className="rounded-md bg-violet/20 px-2 py-0.5 text-xs text-violet-soft">
                  Creator original · @{creator.handle}
                </span>
              )}
            </div>
            <h1 className="font-display text-4xl font-extrabold sm:text-5xl">{t.name}</h1>
            <p className="mt-2 text-lg text-white/80 italic">{t.tagline}</p>
            <div className="mt-4"><Meta title={t} /></div>
            <p className="mt-4 text-mist">{t.synopsis}</p>
            {t.director && <p className="mt-2 text-sm text-mist">Directed by <span className="text-white">{t.director}</span></p>}
            {t.source.type === "public-domain" && (
              <p className="mt-1 text-xs text-mist/70">
                Silent film. Video courtesy of the{" "}
                <a
                  href={`https://archive.org/details/${encodeURIComponent(t.source.archiveId)}`}
                  className="underline hover:text-white"
                  target="_blank"
                  rel="noreferrer"
                >
                  Internet Archive
                </a>
                .
              </p>
            )}
            {t.source.type === "creative-commons" && (
              <p className="mt-1 text-xs text-mist/70">
                © {t.source.credit} · {t.source.license} ·{" "}
                <a
                  href={`https://archive.org/details/${encodeURIComponent(t.source.archiveId)}`}
                  className="underline hover:text-white"
                  target="_blank"
                  rel="noreferrer"
                >
                  source
                </a>
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={`/watch/${t.slug}`}
                className="brand-gradient inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-semibold text-ink-950"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                {t.kind === "series" ? "Play S1 E1" : "Play"}
              </Link>
              <span className="text-sm text-mist">
                {t.minPlan === "free" ? "Free with ads, or ad-free on any paid plan" : `Included with ${getPlan(t.minPlan).name}`}
              </span>
            </div>
          </div>
        </div>
      </section>

      {t.seasons && <Episodes slug={t.slug} seasons={t.seasons} />}

      <PosterRow label="More like this" titles={similar} />
    </div>
  );
}
