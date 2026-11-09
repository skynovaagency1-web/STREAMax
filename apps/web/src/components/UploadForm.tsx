"use client";

import { useState } from "react";

/**
 * Upload form. In this MVP the file stays in the browser; next step is a
 * server route that creates a Mux direct-upload URL and a draft title row.
 */
export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setProgress(0);
    const id = setInterval(() => {
      setProgress((p) => {
        const next = (p ?? 0) + 8;
        if (next >= 100) {
          clearInterval(id);
          setDone(true);
          return 100;
        }
        return next;
      });
    }, 150);
  }

  const field = "mt-1 w-full rounded-xl border border-white/10 bg-ink-950 px-3 py-2.5 outline-none focus:border-violet";

  return (
    <section className="rounded-3xl border border-white/5 bg-ink-900 p-6">
      <h2 className="font-display text-lg font-semibold">Upload a new title</h2>
      {done ? (
        <div className="mt-6 rounded-2xl bg-emerald-400/10 p-5 text-emerald-200">
          <p className="font-semibold">Submitted for review</p>
          <p className="mt-1 text-sm">We check every upload for rights and quality. You’ll hear back within 48 hours.</p>
          <button onClick={() => { setDone(false); setFile(null); setProgress(null); }} className="mt-4 text-sm underline">
            Upload another
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-5 space-y-4 text-sm">
          <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-white/15 p-6 text-center transition hover:border-violet">
            <input type="file" accept="video/*" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <p className="font-semibold">{file ? file.name : "Drop your video or click to choose"}</p>
            <p className="mt-1 text-xs text-mist">MP4 or MOV, up to 4K. We transcode it for every device.</p>
          </label>
          <label className="block">
            Title
            <input required className={field} placeholder="My first feature" />
          </label>
          <label className="block">
            Synopsis
            <textarea required rows={3} className={field} placeholder="What's it about?" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              Type
              <select className={field}>
                <option>Film</option>
                <option>Series episode</option>
              </select>
            </label>
            <label className="block">
              Availability
              <select className={field}>
                <option value="free">Free with ads</option>
                <option value="standard">Subscribers only</option>
              </select>
            </label>
          </div>
          <label className="flex items-start gap-2 text-mist">
            <input required type="checkbox" className="mt-1" />I own the rights to this content and agree to the 70/30 revenue share.
          </label>
          {progress !== null && (
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="brand-gradient h-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
          <button
            disabled={!file || progress !== null}
            className="brand-gradient w-full rounded-2xl px-5 py-3 font-semibold text-ink-950 disabled:opacity-40"
          >
            {progress !== null ? `Uploading… ${progress}%` : "Upload and submit"}
          </button>
        </form>
      )}
    </section>
  );
}
