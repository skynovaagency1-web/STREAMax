import type { Title } from "./types";

/**
 * Public-domain classics streamed from the Internet Archive.
 *
 * Each film was picked because it is public domain in the US (published before 1931)
 * AND in the EU/UK (every director, screenwriter and original composer died more
 * than 70 years ago). Films whose makers died later (Chaplin, Keaton, Lang,
 * Romero...) are deliberately left out because they are still protected in Europe.
 *
 * Before charging for access, check each file's soundtrack: some Internet Archive
 * uploads add modern music that may have its own copyright. Long term, re-host the
 * files on our own storage (Cloudflare Stream/R2) instead of linking to archive.org.
 */

const ia = (id: string, file: string) => `https://archive.org/download/${encodeURIComponent(id)}/${file}`;
/** A public-domain still from the film, served by Wikimedia Commons at the given width. */
const still = (file: string, width: number) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file.replace(/ /g, "_"))}?width=${width}`;

function classic(
  t: Omit<Title, "kind" | "source" | "minPlan" | "streamUrl" | "artwork"> & {
    archiveId: string;
    file: string;
    /** Wikimedia Commons file name of a still from the film (public domain). */
    stillFile: string;
    colors: [string, string];
  },
): Title {
  const { archiveId, file, stillFile, colors, ...rest } = t;
  return {
    ...rest,
    kind: "movie",
    source: { type: "public-domain", archiveId },
    minPlan: "free",
    streamUrl: ia(archiveId, file),
    artwork: {
      from: colors[0],
      to: colors[1],
      poster: still(stillFile, 500),
      backdrop: still(stillFile, 1600),
    },
  };
}

export const CLASSICS: Title[] = [
  classic({
    id: "pd-nosferatu",
    slug: "nosferatu",
    name: "Nosferatu",
    tagline: "A symphony of horror.",
    synopsis:
      "Estate agent Thomas Hutter travels to the Carpathian castle of the mysterious Count Orlok, who has bought a house across from his own, and unknowingly brings a plague back to his town.",
    year: 1922,
    rating: "PG",
    genres: ["Horror"],
    durationMin: 93,
    director: "F. W. Murnau",
    archiveId: "Nosferatu_most_complete_version_93_mins.",
    stillFile: "Nosferatu (1922) - Count Orlok Standing In A Wooden Doorway.png",
    file: "Nosferatu_1922_Symphony_of_Horror_512kb.mp4",
    colors: ["#475569", "#020617"],
    featured: true,
  }),
  classic({
    id: "pd-caligari",
    slug: "the-cabinet-of-dr-caligari",
    name: "The Cabinet of Dr. Caligari",
    tagline: "You must become Caligari.",
    synopsis:
      "At a travelling fair, the sinister Dr. Caligari shows off a sleepwalker who can predict the future. Then the murders begin. The landmark of German Expressionism.",
    year: 1920,
    rating: "PG",
    genres: ["Horror", "Thriller"],
    durationMin: 51,
    director: "Robert Wiene",
    archiveId: "DasKabinettdesDoktorCaligariTheCabinetofDrCaligari",
    stillFile: "Publicity still for The Cabinet of Dr. Caligari (1920) 03.jpg",
    file: "The_Cabinet_of_Dr._Caligari_512kb.mp4",
    colors: ["#a16207", "#1c1917"],
  }),
  classic({
    id: "pd-phantom",
    slug: "the-phantom-of-the-opera",
    name: "The Phantom of the Opera",
    tagline: "Beneath the Paris Opera, someone is listening.",
    synopsis:
      "A masked, disfigured genius haunting the Paris Opera House falls for a young soprano and will stop at nothing to make her a star. Lon Chaney's legendary performance.",
    year: 1925,
    rating: "PG",
    genres: ["Horror", "Romance"],
    durationMin: 106,
    director: "Rupert Julian",
    archiveId: "ThePhantomoftheOpera",
    stillFile: "Lon Chaney as The Phantom.jpg",
    file: "Phantom_of_the_Opera_512kb.mp4",
    colors: ["#7f1d1d", "#0c0a09"],
    featured: true,
  }),
  classic({
    id: "pd-potemkin",
    slug: "battleship-potemkin",
    name: "Battleship Potemkin",
    tagline: "The mutiny that shook an empire.",
    synopsis:
      "Sailors on the battleship Potemkin rise up against their officers in 1905, sparking a confrontation on the Odessa Steps that changed film editing forever.",
    year: 1925,
    rating: "PG-13",
    genres: ["Drama"],
    durationMin: 73,
    director: "Sergei Eisenstein",
    archiveId: "BattleshipPotemkin",
    stillFile: "Battleship Potemkin-Ship portrait.jpg",
    file: "Battleship_Potemkin_512kb.mp4",
    colors: ["#334155", "#7f1d1d"],
  }),
  classic({
    id: "pd-20000-leagues",
    slug: "20000-leagues-under-the-sea",
    name: "20,000 Leagues Under the Sea",
    tagline: "The first film shot underwater.",
    synopsis:
      "Captain Nemo and his submarine Nautilus roam the oceans in this adaptation of Jules Verne, famous for its pioneering underwater photography.",
    year: 1916,
    rating: "G",
    genres: ["Adventure", "Sci-Fi"],
    durationMin: 105,
    director: "Stuart Paton",
    archiveId: "20000LeaguesUndertheSea",
    stillFile: "Jane Gail dans 20,000 leagues under.the.Sea.jpg",
    file: "20000_Leagues_Under_the_Sea_512kb.mp4",
    colors: ["#0e7490", "#082f49"],
  }),
  classic({
    id: "pd-frankenstein-1910",
    slug: "frankenstein-1910",
    name: "Frankenstein (1910)",
    tagline: "The very first Frankenstein.",
    synopsis:
      "Edison Studios' 13-minute take on Mary Shelley's novel: the first time Frankenstein's creature appeared on film.",
    year: 1910,
    rating: "G",
    genres: ["Horror", "Sci-Fi"],
    durationMin: 13,
    director: "J. Searle Dawley",
    archiveId: "FrankensteinfullMovie",
    stillFile: "Frankenstein1910.jpg",
    file: "Frankenstein1910.mp4",
    colors: ["#57534e", "#1c1917"],
  }),
  classic({
    id: "pd-trip-to-the-moon",
    slug: "a-trip-to-the-moon",
    name: "A Trip to the Moon",
    tagline: "Right in the eye.",
    synopsis:
      "A club of astronomers fires itself to the Moon in a giant shell, meets the Selenites and races home. Georges Méliès' 1902 fantasy is the first great science-fiction film.",
    year: 1902,
    rating: "G",
    genres: ["Sci-Fi", "Adventure"],
    durationMin: 13,
    director: "Georges Méliès",
    archiveId: "ATripToTheMoonGeorgeMelies",
    stillFile: "Le Voyage dans la lune.jpg",
    file: encodeURIComponent("A Trip to the Moon-George Méliès.mp4"),
    colors: ["#1e293b", "#0f172a"],
  }),
  classic({
    id: "pd-great-train-robbery",
    slug: "the-great-train-robbery",
    name: "The Great Train Robbery",
    tagline: "The first Western.",
    synopsis:
      "Masked bandits hold up a steam train, rob the passengers and flee into the hills with a posse on their heels. Edwin S. Porter's 1903 short invented the action movie.",
    year: 1903,
    rating: "PG",
    genres: ["Action", "Western"],
    durationMin: 11,
    director: "Edwin S. Porter",
    archiveId: "silent-the-great-train-robbery",
    stillFile: "Great train robbery Barnes.jpg",
    file: encodeURIComponent("The Great Train Robbery.mp4"),
    colors: ["#78350f", "#1c1917"],
  }),
  classic({
    id: "pd-faust",
    slug: "faust-1926",
    name: "Faust",
    tagline: "A wager for one man's soul.",
    synopsis:
      "To end a plague, the old scholar Faust sells his soul to the demon Mephisto for youth and power, and drags the innocent Gretchen into ruin. F. W. Murnau's dazzling German folk tale.",
    year: 1926,
    rating: "PG",
    genres: ["Fantasy", "Horror", "Drama"],
    durationMin: 106,
    director: "F. W. Murnau",
    archiveId: "faust.-1926",
    stillFile: "Gösta Ekman Senior in Faust (1926).jpg",
    file: "Faust.1926.ia.mp4",
    colors: ["#7f1d1d", "#0c0a09"],
  }),
  classic({
    id: "pd-sunrise",
    slug: "sunrise-1927",
    name: "Sunrise: A Song of Two Humans",
    tagline: "This song of the Man and his Wife is of no place and every place.",
    synopsis:
      "Seduced by a woman from the city, a farmer plots to drown his wife, then spends one long day in the city trying to win her back. Winner of three of the very first Academy Awards.",
    year: 1927,
    rating: "PG",
    genres: ["Romance", "Drama"],
    durationMin: 94,
    director: "F. W. Murnau",
    archiveId: "sunrise_1927",
    stillFile: "Janet Gaynor - Sunrise (1927).jpg",
    file: "sunrise_1927.ia.mp4",
    colors: ["#b45309", "#1e1b4b"],
  }),
];
