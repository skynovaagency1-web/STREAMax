import { notFound } from "next/navigation";
import { TITLES, getTitleBySlug } from "@streamax/core";
import { Player } from "@/components/Player";

export function generateStaticParams() {
  return TITLES.map((t) => ({ slug: t.slug }));
}

export default async function WatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ s?: string; e?: string }>;
}) {
  const t = getTitleBySlug((await params).slug);
  if (!t) notFound();
  const { s, e } = await searchParams;
  const season = t.seasons?.find((x) => x.number === Number(s ?? 1));
  const episode = season?.episodes.find((x) => x.number === Number(e ?? 1));

  return (
    <>
      <Player
        title={t}
        subtitle={episode && season ? `S${season.number} E${episode.number} · ${episode.title}` : undefined}
      />
    </>
  );
}
