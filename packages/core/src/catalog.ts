import type { Creator, Episode, Row, Season, Title } from "./types";
import { CLASSICS } from "./classics";
import { OPEN_MOVIES } from "./openMovies";

/**
 * Demo catalogue. All titles are fictional placeholders so the app runs
 * without a database. Replace with Supabase queries in the data layer.
 */

/** Public HLS test stream (Big Buck Bunny, CC-BY, hosted by Mux for testing). */
export const DEMO_STREAM = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

export const CREATORS: Creator[] = [
  { id: "c-ayo", name: "Ayo Bankole", handle: "ayofilms" },
  { id: "c-lina", name: "Lina Okafor", handle: "linamakes" },
  { id: "c-marco", name: "Marco Ruiz", handle: "ruizdocs" },
];

function season(n: number, names: string[]): Season {
  const episodes: Episode[] = names.map((title, i) => ({
    id: `s${n}e${i + 1}`,
    number: i + 1,
    title,
    synopsis: "A new chapter unfolds as old loyalties are tested.",
    durationMin: 42 + ((i * 7) % 15),
  }));
  return { number: n, episodes };
}

const base = { streamUrl: DEMO_STREAM } as const;

const DEMO_TITLES: Title[] = [
  {
    ...base,
    id: "t1",
    slug: "neon-tide",
    kind: "series",
    name: "Neon Tide",
    tagline: "The city never sleeps. Neither does she.",
    synopsis:
      "A night-shift harbour pilot uncovers a smuggling ring hidden inside the port's automated cranes, and has one week to prove it before the evidence sails away.",
    year: 2026,
    rating: "TV-14",
    genres: ["Thriller", "Drama"],
    seasons: [
      season(1, ["Low Water", "Ballast", "The Ninth Crane", "Undertow", "Breakwater", "High Tide"]),
      season(2, ["Drift", "Signal Fire", "Dead Reckoning", "Harbour Lights"]),
    ],
    artwork: { from: "#7c3aed", to: "#0ea5e9" },
    source: { type: "licensed" },
    minPlan: "standard",
    featured: true,
    isNew: true,
  },
  {
    ...base,
    id: "t2",
    slug: "the-last-orchard",
    kind: "movie",
    name: "The Last Orchard",
    tagline: "Some roots run deeper than land.",
    synopsis:
      "Three estranged siblings return to their late mother's failing orchard and must bring in one final harvest together.",
    year: 2025,
    rating: "PG",
    genres: ["Drama"],
    durationMin: 112,
    artwork: { from: "#f59e0b", to: "#b91c1c" },
    source: { type: "licensed" },
    minPlan: "free",
    featured: true,
  },
  {
    ...base,
    id: "t3",
    slug: "orbitals",
    kind: "series",
    name: "Orbitals",
    tagline: "Four hundred kilometres up. Nowhere to run.",
    synopsis:
      "The crew of a private space station fight to keep it running after the company that owns it goes bankrupt overnight.",
    year: 2026,
    rating: "TV-14",
    genres: ["Sci-Fi", "Drama"],
    seasons: [season(1, ["Insolvency", "Decay", "Burn", "Docking", "Re-entry"])],
    artwork: { from: "#0f766e", to: "#1e1b4b" },
    source: { type: "licensed" },
    minPlan: "premium",
    featured: true,
    isNew: true,
  },
  {
    ...base,
    id: "t4",
    slug: "lagos-after-dark",
    kind: "movie",
    name: "Lagos After Dark",
    tagline: "One night. One city. One chance.",
    synopsis: "A rideshare driver gets pulled into a heist when a passenger leaves a briefcase in the back seat.",
    year: 2026,
    rating: "R",
    genres: ["Action", "Thriller"],
    durationMin: 98,
    artwork: { from: "#db2777", to: "#f59e0b" },
    source: { type: "creator", creatorId: "c-ayo" },
    minPlan: "free",
    isNew: true,
  },
  {
    ...base,
    id: "t5",
    slug: "paper-kites",
    kind: "movie",
    name: "Paper Kites",
    tagline: "Let go to fly.",
    synopsis: "An animated tale of a girl who builds kites that carry wishes over the mountains.",
    year: 2024,
    rating: "G",
    genres: ["Animation", "Adventure"],
    durationMin: 86,
    artwork: { from: "#38bdf8", to: "#a3e635" },
    source: { type: "licensed" },
    minPlan: "free",
  },
  {
    ...base,
    id: "t6",
    slug: "salt-and-stone",
    kind: "movie",
    name: "Salt & Stone",
    tagline: "The sea gives. The sea takes.",
    synopsis: "A documentary following the last salt harvesters on a windswept Atlantic coast.",
    year: 2025,
    rating: "PG",
    genres: ["Documentary"],
    durationMin: 74,
    artwork: { from: "#64748b", to: "#0c4a6e" },
    source: { type: "creator", creatorId: "c-marco" },
    minPlan: "free",
  },
  {
    ...base,
    id: "t7",
    slug: "second-act",
    kind: "series",
    name: "Second Act",
    tagline: "It's never too late to start over. Probably.",
    synopsis: "A retired opera singer joins a struggling improv troupe and accidentally becomes its star.",
    year: 2025,
    rating: "TV-14",
    genres: ["Comedy"],
    seasons: [season(1, ["Overture", "Yes, And", "Encore", "Curtain Call"])],
    artwork: { from: "#e11d48", to: "#7c3aed" },
    source: { type: "licensed" },
    minPlan: "standard",
  },
  {
    ...base,
    id: "t8",
    slug: "hollow-pines",
    kind: "movie",
    name: "Hollow Pines",
    tagline: "Don't answer the knock.",
    synopsis: "Campers in a remote forest discover the ranger station has been empty for years.",
    year: 2026,
    rating: "R",
    genres: ["Horror", "Thriller"],
    durationMin: 92,
    artwork: { from: "#14532d", to: "#020617" },
    source: { type: "licensed" },
    minPlan: "standard",
    isNew: true,
  },
  {
    ...base,
    id: "t9",
    slug: "sunday-jollof",
    kind: "series",
    name: "Sunday Jollof",
    tagline: "Every family has a recipe. And a secret.",
    synopsis: "A cooking show turned family drama as three generations compete to run the family restaurant.",
    year: 2026,
    rating: "TV-14",
    genres: ["Comedy", "Drama"],
    seasons: [season(1, ["Mise en Place", "Too Much Pepper", "The Critic", "Family Meal"])],
    artwork: { from: "#ea580c", to: "#facc15" },
    source: { type: "creator", creatorId: "c-lina" },
    minPlan: "free",
  },
  {
    ...base,
    id: "t10",
    slug: "glass-hearts",
    kind: "movie",
    name: "Glass Hearts",
    tagline: "Handle with care.",
    synopsis: "Two glassblowers in Venice fall in love while competing for the same commission.",
    year: 2024,
    rating: "PG-13",
    genres: ["Romance", "Drama"],
    durationMin: 104,
    artwork: { from: "#f472b6", to: "#6366f1" },
    source: { type: "licensed" },
    minPlan: "standard",
  },
  {
    ...base,
    id: "t11",
    slug: "redline-rally",
    kind: "movie",
    name: "Redline Rally",
    tagline: "3,000 miles. No rules.",
    synopsis: "An underdog team enters an illegal cross-desert rally to save their garage.",
    year: 2025,
    rating: "PG-13",
    genres: ["Action", "Adventure"],
    durationMin: 118,
    artwork: { from: "#dc2626", to: "#f97316" },
    source: { type: "licensed" },
    minPlan: "premium",
  },
  {
    ...base,
    id: "t12",
    slug: "quiet-signals",
    kind: "movie",
    name: "Quiet Signals",
    tagline: "Someone is listening.",
    synopsis: "A radio astronomer receives a message that seems to come from her own future.",
    year: 2026,
    rating: "PG-13",
    genres: ["Sci-Fi", "Thriller"],
    durationMin: 109,
    artwork: { from: "#4338ca", to: "#06b6d4" },
    source: { type: "creator", creatorId: "c-ayo" },
    minPlan: "free",
    isNew: true,
  },
];

export const TITLES: Title[] = [...OPEN_MOVIES, ...CLASSICS, ...DEMO_TITLES];

export const ROWS: Row[] = [
  { id: "classics", label: "Timeless classics · free to watch", titleIds: CLASSICS.map((t) => t.id) },
  { id: "shorts", label: "Animated & sci-fi shorts · free", titleIds: OPEN_MOVIES.map((t) => t.id) },
  { id: "trending", label: "Trending on Streamax", titleIds: ["cc-sprite-fright", "pd-nosferatu", "cc-charge", "pd-phantom", "cc-cosmos-laundromat", "t1", "cc-spring"] },
  { id: "new", label: "New this week", titleIds: TITLES.filter((t) => t.isNew).map((t) => t.id) },
  { id: "free", label: "Free to watch", titleIds: TITLES.filter((t) => t.minPlan === "free").map((t) => t.id) },
  {
    id: "creators",
    label: "From independent creators",
    titleIds: TITLES.filter((t) => t.source.type === "creator").map((t) => t.id),
  },
  { id: "series", label: "Series to binge", titleIds: TITLES.filter((t) => t.kind === "series").map((t) => t.id) },
  { id: "movies", label: "Movie night", titleIds: TITLES.filter((t) => t.kind === "movie").map((t) => t.id) },
];

export function getTitleBySlug(slug: string): Title | undefined {
  return TITLES.find((t) => t.slug === slug);
}

export function getTitleById(id: string): Title | undefined {
  return TITLES.find((t) => t.id === id);
}

export function getCreator(id: string): Creator | undefined {
  return CREATORS.find((c) => c.id === id);
}

export function rowTitles(row: Row): Title[] {
  return row.titleIds.map(getTitleById).filter((t): t is Title => Boolean(t));
}

export function searchTitles(query: string): Title[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return TITLES.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.genres.some((g) => g.toLowerCase().includes(q)) ||
      t.synopsis.toLowerCase().includes(q),
  );
}
