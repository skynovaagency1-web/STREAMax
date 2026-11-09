import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-display text-7xl font-extrabold text-brand">404</p>
      <h1 className="font-display mt-4 text-2xl font-bold">This title has left the building</h1>
      <Link href="/" className="mt-6 inline-block rounded-2xl bg-white px-5 py-2.5 font-semibold text-ink-950">Back home</Link>
    </div>
  );
}
