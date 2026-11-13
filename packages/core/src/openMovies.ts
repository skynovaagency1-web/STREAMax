import type { Genre, Title } from "./types";

/**
 * Modern animated and sci-fi shorts from Blender Studio's "open movies".
 *
 * Each one is released under a Creative Commons Attribution licence (CC BY), which
 * allows commercial use as long as the film and its makers are credited. The title
 * page shows that credit. Video files are streamed from the Internet Archive; artwork
 * comes from Wikimedia Commons or the Archive item. Long term, re-host on our own
 * storage (Cloudflare Stream/R2).
 */

const ia = (id: string, file: string) => `https://archive.org/download/${encodeURIComponent(id)}/${encodeURIComponent(file)}`;
const commons = (file: string, width: number) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file.replace(/ /g, "_"))}?width=${width}`;

type Img = { commons: string } | { archive: string };
const img = (archiveId: string, i: Img, width: number) =>
  "commons" in i ? commons(i.commons, width) : ia(archiveId, i.archive);

function openMovie(t: {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  synopsis: string;
  year: number;
  rating: Title["rating"];
  genres: Genre[];
  durationMin: number;
  director: string;
  license: "CC BY 3.0" | "CC BY 4.0";
  archiveId: string;
  file: string;
  poster: Img;
  backdrop?: Img;
  colors: [string, string];
  featured?: boolean;
  isNew?: boolean;
}): Title {
  const { archiveId, file, license, poster, backdrop, colors, ...rest } = t;
  return {
    ...rest,
    kind: "movie",
    source: { type: "creative-commons", archiveId, license, credit: "Blender Studio" },
    minPlan: "free",
    streamUrl: ia(archiveId, file),
    artwork: {
      from: colors[0],
      to: colors[1],
      poster: img(archiveId, poster, 500),
      backdrop: img(archiveId, backdrop ?? poster, 1600),
    },
  };
}

export const OPEN_MOVIES: Title[] = [
  openMovie({
    id: "cc-sprite-fright",
    slug: "sprite-fright",
    name: "Sprite Fright",
    tagline: "Some forests should be left alone.",
    synopsis:
      "A group of rowdy teenagers on a woodland trip in 1980s Britain meet a colony of adorable mushroom sprites — and quickly learn that cute does not mean harmless.",
    year: 2021,
    rating: "PG-13",
    genres: ["Horror", "Comedy", "Animation"],
    durationMin: 11,
    director: "Matthew Luhn & Hjalti Hjálmarsson",
    license: "CC BY 4.0",
    archiveId: "sprite-fright",
    file: "Sprite Fright - Open Movie by Blender Studio-804p.mp4",
    poster: { commons: "Sprite Fright-movie poster.jpg" },
    colors: ["#15803d", "#052e16"],
    featured: true,
    isNew: true,
  }),
  openMovie({
    id: "cc-charge",
    slug: "charge",
    name: "Charge",
    tagline: "In a world running out of power, every watt counts.",
    synopsis:
      "In a bleak, energy-starved future, an old man breaks into a heavily guarded facility to steal one last charge — and runs straight into a relentless security robot.",
    year: 2022,
    rating: "PG-13",
    genres: ["Action", "Sci-Fi", "Animation"],
    durationMin: 4,
    director: "Hjalti Hjálmarsson",
    license: "CC BY 4.0",
    archiveId: "charge-blender-open-movie-1608p",
    file: "Charge - Blender Open Movie 1608p.mp4",
    poster: { commons: "Charge-movie poster.jpg" },
    backdrop: { commons: "Charge - Blender Open Movie-YouTube thumbnail.jpg" },
    colors: ["#ea580c", "#1c1917"],
    isNew: true,
  }),
  openMovie({
    id: "cc-spring",
    slug: "spring",
    name: "Spring",
    tagline: "A shepherd girl, her dog, and the spirits of winter.",
    synopsis:
      "A young shepherd girl and her loyal dog face ancient spirits in a mountain valley to bring the cycle of life back to the land.",
    year: 2019,
    rating: "G",
    genres: ["Animation", "Adventure"],
    durationMin: 8,
    director: "Andy Goralczyk",
    license: "CC BY 4.0",
    archiveId: "springopenmovie",
    file: "springopenmovie.mp4",
    poster: { commons: "Blender Open Movie - Spring (2019).png" },
    colors: ["#0ea5e9", "#082f49"],
  }),
  openMovie({
    id: "cc-cosmos-laundromat",
    slug: "cosmos-laundromat",
    name: "Cosmos Laundromat",
    tagline: "One sheep. Infinite lives.",
    synopsis:
      "On a desolate island, a suicidal sheep named Franck meets a quirky salesman who offers him the gift of a lifetime — a journey through endless other lives.",
    year: 2015,
    rating: "PG-13",
    genres: ["Comedy", "Drama", "Animation"],
    durationMin: 12,
    director: "Mathieu Auvray",
    license: "CC BY 4.0",
    archiveId: "CosmosLaundromatFirstCycle",
    file: "Cosmos Laundromat - First Cycle (1080p).mp4",
    poster: { commons: "CosmosLaundromatPoster.jpg" },
    backdrop: { commons: "CosmosLaundromatYouTubeThumbnail.jpg" },
    colors: ["#a855f7", "#1e1b4b"],
  }),
  openMovie({
    id: "cc-agent-327",
    slug: "agent-327",
    name: "Agent 327: Operation Barbershop",
    tagline: "A secret agent. A suspicious barbershop. A very close shave.",
    synopsis:
      "Dutch secret agent 327 goes undercover in a barbershop to find a missing colleague, and walks into a fight for his life.",
    year: 2017,
    rating: "PG",
    genres: ["Action", "Comedy", "Animation"],
    durationMin: 4,
    director: "Colin Levy & Hjalti Hjálmarsson",
    license: "CC BY 4.0",
    archiveId: "agent327operationbarbershop",
    file: "agent327-1080.mp4",
    poster: { archive: "poster2.jpg" },
    backdrop: { archive: "agent327rewind.jpg" },
    colors: ["#f59e0b", "#1c1917"],
  }),
  openMovie({
    id: "cc-tears-of-steel",
    slug: "tears-of-steel",
    name: "Tears of Steel",
    tagline: "To save the world, they must relive the past.",
    synopsis:
      "In a future Amsterdam overrun by robots, a group of scientists tries to rescue the world by mending a broken relationship from decades ago.",
    year: 2012,
    rating: "PG-13",
    genres: ["Sci-Fi", "Action"],
    durationMin: 12,
    director: "Ian Hubert",
    license: "CC BY 3.0",
    archiveId: "Tears-of-Steel",
    // 1080p WebM: the Archive's MP4 copies are only 360p.
    file: "tears_of_steel_1080p.webm",
    poster: { archive: "tos-poster.jpg" },
    colors: ["#64748b", "#0f172a"],
  }),
  openMovie({
    id: "cc-sintel",
    slug: "sintel",
    name: "Sintel",
    tagline: "A lonely girl. A baby dragon. A journey to find him.",
    synopsis:
      "A young woman named Sintel searches across dangerous lands for the baby dragon she once rescued, only to discover a heartbreaking truth.",
    year: 2010,
    rating: "PG",
    genres: ["Adventure", "Drama", "Animation"],
    durationMin: 15,
    director: "Colin Levy",
    license: "CC BY 3.0",
    archiveId: "Sintel",
    file: "sintel-2048-stereo.mp4",
    poster: { archive: "Poster.jpg" },
    colors: ["#dc2626", "#1c1917"],
  }),
];
