export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="sx-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="0.55" stopColor="#c084fc" />
          <stop offset="1" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="36" height="36" rx="11" fill="url(#sx-g)" />
      <path d="M16 12.5v15l12-7.5-12-7.5Z" fill="#07060d" />
      <circle cx="30.5" cy="9.5" r="2.5" fill="#07060d" opacity=".85" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="font-display text-xl font-extrabold tracking-tight">
        Stream<span className="text-brand">ax</span>
      </span>
    </span>
  );
}
