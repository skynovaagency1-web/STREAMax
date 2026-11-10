"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { adSchedule, canWatch, getPlan, type AdBreak, type Title } from "@streamax/core";
import { usePlan } from "./PlanProvider";
import { KeyArt } from "./KeyArt";

/**
 * Video player (HLS or MP4) with ad breaks for the free tier.
 * Ads are simulated with a house promo for now; the next step is to request a
 * VAST tag (Google IMA SDK) at each break in `adSchedule`.
 */
export function Player({ title, subtitle }: { title: Title; subtitle?: string }) {
  const { plan } = usePlan();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [breaks, setBreaks] = useState<AdBreak[]>([]);
  const [ad, setAd] = useState<AdBreak | null>(null);
  const [remaining, setRemaining] = useState(0);
  const allowed = canWatch(plan, title.minPlan);

  // Attach the HLS stream.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !allowed) return;
    let destroy: (() => void) | undefined;
    const isHls = /\.m3u8($|\?)/.test(title.streamUrl);
    if (!isHls || video.canPlayType("application/vnd.apple.mpegurl")) {
      // Progressive MP4, or HLS on Safari/iOS which plays it natively.
      video.src = title.streamUrl;
    } else {
      import("hls.js").then(({ default: Hls }) => {
        if (!Hls.isSupported()) return;
        const hls = new Hls({ capLevelToPlayerSize: true });
        hls.loadSource(title.streamUrl);
        hls.attachMedia(video);
        destroy = () => hls.destroy();
      });
    }
    return () => destroy?.();
  }, [title.streamUrl, allowed]);

  // Build the ad schedule once the duration is known (or from catalogue runtime).
  useEffect(() => {
    const fallback = (title.durationMin ?? title.seasons?.[0]?.episodes[0]?.durationMin ?? 45) * 60;
    const list = adSchedule(plan, fallback);
    setBreaks(list);
    const preroll = list.find((b) => b.at === 0);
    if (preroll && allowed) startAd(preroll);
    else setAd(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, title.id, allowed]);

  function startAd(b: AdBreak) {
    videoRef.current?.pause();
    setAd(b);
    setRemaining(b.durationSec);
    setBreaks((list) => list.filter((x) => x !== b));
  }

  // Ad countdown.
  useEffect(() => {
    if (!ad) return;
    if (remaining <= 0) {
      setAd(null);
      videoRef.current?.play().catch(() => {});
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [ad, remaining]);

  function onTimeUpdate() {
    const t = videoRef.current?.currentTime ?? 0;
    const next = breaks.find((b) => b.at > 0 && t >= b.at);
    if (next) startAd(next);
  }

  if (!allowed) {
    const needed = getPlan(title.minPlan);
    return (
      <div className="relative aspect-video overflow-hidden rounded-3xl ring-1 ring-white/10">
        <KeyArt title={title} variant="backdrop" className="absolute inset-0 opacity-60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink-950/70 p-6 text-center">
          <p className="text-sm tracking-wide text-amber uppercase">{needed.name} title</p>
          <h1 className="font-display mt-2 text-3xl font-bold">{title.name}</h1>
          <p className="mt-2 max-w-md text-mist">
            Upgrade to {needed.name} to watch this {title.kind === "series" ? "series" : "film"} in {needed.maxQuality}, with no ads.
          </p>
          <Link href="/plans" className="brand-gradient mt-6 rounded-2xl px-6 py-3 font-semibold text-ink-950">
            See plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-3xl bg-black ring-1 ring-white/10">
        <video
          ref={videoRef}
          className="h-full w-full"
          controls={!ad}
          playsInline
          autoPlay={!ad}
          onTimeUpdate={onTimeUpdate}
          poster={title.artwork.backdrop}
        />
        {ad && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-ink-800 to-ink-950 p-6 text-center">
            <span className="absolute top-4 left-4 rounded-md bg-amber px-2 py-0.5 text-xs font-bold text-ink-950">
              AD · {remaining}s
            </span>
            <p className="text-sm text-mist">Your show starts after this short break</p>
            <h2 className="font-display mt-3 text-2xl font-bold sm:text-4xl">
              Skip the ads with <span className="text-brand">Streamax Standard</span>
            </h2>
            <p className="mt-2 text-mist">Full HD, two screens, downloads. Cancel anytime.</p>
            <Link href="/plans" className="mt-6 rounded-2xl bg-white px-5 py-2.5 font-semibold text-ink-950">
              Upgrade now
            </Link>
          </div>
        )}
      </div>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">{title.name}</h1>
          {subtitle && <p className="text-mist">{subtitle}</p>}
        </div>
        <p className="text-sm text-mist">
          Watching on <span className="text-white">{getPlan(plan).name}</span>
          {getPlan(plan).ads && " · with ads"}
        </p>
      </div>
    </div>
  );
}
