import type { Title } from "@streamax/core";

/**
 * Generated key art used until real posters are uploaded. Each title gets a
 * unique gradient composition and typographic treatment from its colours.
 */
export function KeyArt({
  title,
  variant = "poster",
  showName = true,
  className = "",
}: {
  title: Title;
  variant?: "poster" | "backdrop";
  showName?: boolean;
  className?: string;
}) {
  const { from, to, poster, backdrop } = title.artwork;
  const img = variant === "poster" ? poster : backdrop;
  const seed = [...title.id].reduce((s, c) => s + c.charCodeAt(0), 0);
  const angle = (seed * 37) % 360;
  const orbX = 20 + ((seed * 13) % 60);
  const orbY = 15 + ((seed * 7) % 50);

  return (
    <div
      className={`grain relative overflow-hidden ${className}`}
      style={{
        backgroundImage: img
          ? `url(${img})`
          : `radial-gradient(circle at ${orbX}% ${orbY}%, ${to}cc 0%, transparent 45%), linear-gradient(${angle}deg, ${from} 0%, #07060d 85%)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!img && (
        <>
          <div
            className="absolute rounded-full blur-2xl"
            style={{
              width: "70%",
              aspectRatio: "1",
              left: `${100 - orbX - 20}%`,
              top: `${orbY + 20}%`,
              background: `${from}55`,
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent" />
        </>
      )}
      {showName && !img && variant === "poster" && (
        <div className="absolute inset-x-0 bottom-0 p-3">
          <p className="font-display text-[0.65rem] tracking-[0.2em] text-white/60 uppercase">
            {title.kind === "series" ? "Series" : "Film"}
          </p>
          <p className="font-display text-lg leading-tight font-extrabold text-balance text-white drop-shadow">
            {title.name}
          </p>
        </div>
      )}
    </div>
  );
}
