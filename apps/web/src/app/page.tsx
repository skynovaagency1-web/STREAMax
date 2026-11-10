import { ROWS, TITLES, rowTitles } from "@streamax/core";
import { Hero } from "@/components/Hero";
import { PosterRow } from "@/components/PosterRow";
import { CreatorBanner } from "@/components/CreatorBanner";

export default function HomePage() {
  const featured = TITLES.filter((t) => t.featured);
  const [classics, trending, ...rest] = ROWS;
  const hrefFor: Record<string, string> = {
    classics: "/browse/classics", free: "/browse/free", series: "/browse/series", movies: "/browse/movies" };

  return (
    <div className="space-y-10">
      <Hero titles={featured} />
      <PosterRow label={trending.label} titles={rowTitles(trending)} ranked />
      <PosterRow label={classics.label} titles={rowTitles(classics)} href={hrefFor.classics} />
      {rest.slice(0, 2).map((row) => (
        <PosterRow key={row.id} label={row.label} titles={rowTitles(row)} href={hrefFor[row.id]} />
      ))}
      <CreatorBanner />
      {rest.slice(2).map((row) => (
        <PosterRow key={row.id} label={row.label} titles={rowTitles(row)} href={hrefFor[row.id]} />
      ))}
    </div>
  );
}
