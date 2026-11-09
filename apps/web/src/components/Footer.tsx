import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mx-auto mt-10 max-w-[1400px] border-t border-white/5 px-4 py-10 text-sm text-mist sm:px-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <Logo />
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/plans" className="hover:text-white">Plans</Link>
          <Link href="/studio" className="hover:text-white">Become a creator</Link>
          <Link href="/browse/free" className="hover:text-white">Watch free</Link>
          <Link href="/search" className="hover:text-white">Search</Link>
        </nav>
      </div>
      <p className="mt-6 text-xs text-mist/60">
        © {new Date().getFullYear()} Streamax. Demo catalogue — all titles are fictional placeholders.
      </p>
    </footer>
  );
}
