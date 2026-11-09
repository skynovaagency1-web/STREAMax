/**
 * Creator revenue sharing.
 *
 * Each month, the revenue attributable to creator content (a share of
 * subscription revenue plus ad revenue served on creator titles) forms a pool.
 * The pool is divided between creators by watch time, and each creator keeps
 * CREATOR_SHARE of their portion; Streamax keeps the rest.
 */

export const CREATOR_SHARE = 0.7;
export const PLATFORM_SHARE = 1 - CREATOR_SHARE;

export interface WatchTimeEntry {
  creatorId: string;
  minutes: number;
}

export interface PayoutLine {
  creatorId: string;
  minutes: number;
  /** Gross revenue attributed to this creator's titles, in cents. */
  grossCents: number;
  /** Amount paid to the creator, in cents. */
  creatorCents: number;
  /** Amount kept by Streamax, in cents. */
  platformCents: number;
}

export interface PayoutSummary {
  poolCents: number;
  totalMinutes: number;
  lines: PayoutLine[];
  creatorTotalCents: number;
  platformTotalCents: number;
}

/** Split one amount (cents) into creator and platform parts. Rounds down for the creator. */
export function splitRevenue(grossCents: number, creatorShare = CREATOR_SHARE) {
  if (!Number.isInteger(grossCents) || grossCents < 0) {
    throw new Error("grossCents must be a non-negative integer");
  }
  const creatorCents = Math.floor(grossCents * creatorShare);
  return { creatorCents, platformCents: grossCents - creatorCents };
}

/**
 * Allocate a monthly pool across creators by watch time.
 * Uses the largest-remainder method so allocations always sum to the pool exactly.
 */
export function computePayouts(
  poolCents: number,
  watchTime: WatchTimeEntry[],
  creatorShare = CREATOR_SHARE,
): PayoutSummary {
  if (!Number.isInteger(poolCents) || poolCents < 0) {
    throw new Error("poolCents must be a non-negative integer");
  }

  // Merge duplicate creator entries and drop non-positive minutes.
  const byCreator = new Map<string, number>();
  for (const { creatorId, minutes } of watchTime) {
    if (minutes > 0) byCreator.set(creatorId, (byCreator.get(creatorId) ?? 0) + minutes);
  }
  const entries = [...byCreator.entries()];
  const totalMinutes = entries.reduce((sum, [, m]) => sum + m, 0);

  if (totalMinutes === 0 || poolCents === 0) {
    return {
      poolCents,
      totalMinutes,
      lines: entries.map(([creatorId, minutes]) => ({
        creatorId,
        minutes,
        grossCents: 0,
        creatorCents: 0,
        platformCents: 0,
      })),
      creatorTotalCents: 0,
      platformTotalCents: poolCents,
    };
  }

  const raw = entries.map(([creatorId, minutes]) => {
    const exact = (poolCents * minutes) / totalMinutes;
    return { creatorId, minutes, floor: Math.floor(exact), rem: exact - Math.floor(exact) };
  });
  let leftover = poolCents - raw.reduce((s, r) => s + r.floor, 0);
  const order = [...raw].sort((a, b) => b.rem - a.rem || a.creatorId.localeCompare(b.creatorId));
  const extra = new Map<string, number>();
  for (const r of order) {
    if (leftover <= 0) break;
    extra.set(r.creatorId, 1);
    leftover--;
  }

  const lines: PayoutLine[] = raw.map((r) => {
    const grossCents = r.floor + (extra.get(r.creatorId) ?? 0);
    const { creatorCents, platformCents } = splitRevenue(grossCents, creatorShare);
    return { creatorId: r.creatorId, minutes: r.minutes, grossCents, creatorCents, platformCents };
  });

  const creatorTotalCents = lines.reduce((s, l) => s + l.creatorCents, 0);
  return {
    poolCents,
    totalMinutes,
    lines,
    creatorTotalCents,
    platformTotalCents: poolCents - creatorTotalCents,
  };
}
