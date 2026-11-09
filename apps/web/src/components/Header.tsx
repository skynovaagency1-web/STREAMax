"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getPlan } from "@streamax/core";
import { Logo } from "./Logo";
import { usePlan } from "./PlanProvider";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/browse/series", label: "Series" },
  { href: "/browse/movies", label: "Movies" },
  { href: "/browse/free", label: "Free" },
  { href: "/studio", label: "Creator Studio" },
];

export function Header() {
  const pathname = usePathname();
  const { plan, mode, signedIn } = usePlan();

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-8">
      <div className="glass mx-auto flex max-w-[1400px] items-center gap-6 rounded-2xl px-4 py-3">
        <Link href="/" aria-label="Streamax home">
          <Logo />
        </Link>
        <nav className="no-scrollbar hidden flex-1 items-center gap-1 overflow-x-auto md:flex">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-1.5 text-sm whitespace-nowrap transition ${
                  active ? "bg-white/10 text-white" : "text-mist hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="rounded-xl p-2 text-mist transition hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </Link>
          {mode === "live" && (
            <Link
              href={signedIn ? "/account" : "/login"}
              className="rounded-xl px-3 py-2 text-sm text-mist transition hover:bg-white/10 hover:text-white"
            >
              {signedIn ? "Account" : "Sign in"}
            </Link>
          )}
          {plan === "free" ? (
            <Link
              href="/plans"
              className="brand-gradient rounded-xl px-4 py-2 text-sm font-semibold text-ink-950 transition hover:opacity-90"
            >
              Go ad-free
            </Link>
          ) : (
            <Link href="/plans" className="rounded-xl border border-white/15 px-3 py-2 text-sm text-mist">
              {getPlan(plan).name}
            </Link>
          )}
        </div>
      </div>
      <nav className="no-scrollbar mx-auto mt-2 flex max-w-[1400px] gap-1 overflow-x-auto md:hidden">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} className="glass rounded-xl px-3 py-1.5 text-xs whitespace-nowrap">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
