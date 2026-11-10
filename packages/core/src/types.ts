export type TitleKind = "movie" | "series";

export type Genre =
  | "Action"
  | "Drama"
  | "Comedy"
  | "Sci-Fi"
  | "Thriller"
  | "Documentary"
  | "Romance"
  | "Animation"
  | "Horror"
  | "Adventure";

/** Who supplied the title: licensed by Streamax or uploaded by a creator. */
export type TitleSource =
  | { type: "licensed" }
  | { type: "creator"; creatorId: string }
  /** Public-domain film. `archiveId` is its Internet Archive identifier. */
  | { type: "public-domain"; archiveId: string };

export interface Artwork {
  /** Two hex colours used to render generated key art until real posters are uploaded. */
  from: string;
  to: string;
  /** Optional real image URLs (poster 2:3, backdrop 16:9). */
  poster?: string;
  backdrop?: string;
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  synopsis: string;
  durationMin: number;
}

export interface Season {
  number: number;
  episodes: Episode[];
}

export interface Title {
  id: string;
  slug: string;
  kind: TitleKind;
  name: string;
  tagline: string;
  synopsis: string;
  year: number;
  rating: "G" | "PG" | "PG-13" | "R" | "TV-14" | "TV-MA";
  genres: Genre[];
  /** Movie runtime in minutes (movies only). */
  durationMin?: number;
  seasons?: Season[];
  artwork: Artwork;
  source: TitleSource;
  /** Minimum plan required. "free" titles are playable with ads. */
  minPlan: PlanId;
  /** Stream URL: HLS (.m3u8) or progressive MP4. Demo titles share a public test stream. */
  streamUrl: string;
  /** Director credit, shown on the title page. */
  director?: string;
  featured?: boolean;
  isNew?: boolean;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  /** Stripe Connect account id once onboarded. */
  payoutAccountId?: string;
}

export type PlanId = "free" | "standard" | "premium";

export interface Plan {
  id: PlanId;
  name: string;
  priceMonthlyCents: number;
  priceYearlyCents: number;
  ads: boolean;
  maxQuality: "720p" | "1080p" | "4K HDR";
  screens: number;
  downloads: boolean;
  highlights: string[];
}

export interface Row {
  id: string;
  label: string;
  titleIds: string[];
}
