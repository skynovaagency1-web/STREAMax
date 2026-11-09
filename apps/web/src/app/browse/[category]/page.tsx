import { notFound } from "next/navigation";
import { TITLES, type Title } from "@streamax/core";
import { PosterCard } from "@/components/PosterCard";

const CATEGORIES: Record<string, { label: string; filter: (t: Title) => boolean }> = {
  series: { label: "Series", filter: (t) => t.kind === "series" },
  movies: { label: "Movies", filter: (t) => t.kind === "movie" },
  free: { label: "Free to watch", filter: (t) => t.minPlan === "free" },
  creators: { label: "From independent creators", filter: (t) => t.source.type === "creator" },
};

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }));
}

export default async function BrowsePage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = CATEGORIES[category];
  if (!cat) notFound();
  const titles = TITLES.filter(cat.filter);

  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-8">
      <h1 className="font-display text-3xl font-bold">{cat.label}</h1>
      <p className="mt-1 text-mist">{titles.length} titles</p>
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] [&>a]:w-full">
        {titles.map((t) => (
          <PosterCard key={t.id} title={t} />
        ))}
      </div>
    </div>
  );
}
