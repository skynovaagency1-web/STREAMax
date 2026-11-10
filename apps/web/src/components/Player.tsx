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
  const backHref = `/title/${title.slug}`;

  // Show the top bar on mouse move / tap, hide it after 3s of inactivity.
  const [chrome, setChrome] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  function wake() {
    setChrome(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setChrome(false), 3000);
  }
  useEffect(() => {
    wake();
    // Lock page scroll while the full-screen player is open.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      clearTimeout(hideTimer.current);
    };
  }, []);

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
      <div className="fixed inset-0 z-[60] overflow-hidden bg-black">
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
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <BackButton href={backHref} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black" onMouseMove={wake} onTouchStart={wake}>
      <video
        ref={videoRef}
        className="h-full w-full object-contain"
        controls={!ad}
        playsInline
        autoPlay={!ad}
        onTimeUpdate={onTimeUpdate}
        poster={title.artwork.backdrop}
      />
        {ad && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-ink-800 to-ink-950 p-6 text-center">
            <span className="absolute top-5 right-5 z-10 rounded-md bg-amber px-2 py-0.5 text-xs font-bold text-ink-950">
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
      {/* Top bar: back button and title, fades out while the film plays. */}
      <div
        className={`absolute inset-x-0 top-0 flex items-start gap-4 bg-gradient-to-b from-black/80 to-transparent p-4 pb-16 transition-opacity duration-500 sm:p-6 ${
          chrome || ad ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <BackButton href={backHref} />
        <div className="min-w-0 pt-1">
          <h1 className="font-display truncate text-lg font-bold sm:text-2xl">{title.name}</h1>
          <p className="truncate text-sm text-mist">
            {subtitle ? `${subtitle} · ` : ""}
            {getPlan(plan).name}
            {getPlan(plan).ads && " · with ads"}
          </p>
        </div>
      </div>
    </div>
  );
}

function BackButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      aria-label="Back"
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-black/50 text-white ring-1 ring-white/20 backdrop-blur hover:bg-black/70 "
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </Link>
  );
}
