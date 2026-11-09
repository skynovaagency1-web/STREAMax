import type { PlanId } from "./types";
import { getPlan } from "./plans";

/** Seconds between mid-roll ad breaks for free viewers. */
export const MIDROLL_INTERVAL_SEC = 15 * 60;
export const PREROLL_SEC = 15;

export interface AdBreak {
  /** Playback position in seconds where the break starts (0 = pre-roll). */
  at: number;
  durationSec: number;
}

/** Ad schedule for a piece of content. Paid plans get none. */
export function adSchedule(plan: PlanId, contentDurationSec: number): AdBreak[] {
  if (!getPlan(plan).ads) return [];
  const breaks: AdBreak[] = [{ at: 0, durationSec: PREROLL_SEC }];
  for (let t = MIDROLL_INTERVAL_SEC; t < contentDurationSec - 60; t += MIDROLL_INTERVAL_SEC) {
    breaks.push({ at: t, durationSec: 30 });
  }
  return breaks;
}
