"use client";

import { useState } from "react";

type SendResult = {
  recipients: number;
  sent: number;
  failed: number;
  removed: number;
};

export default function AdminPushForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, url: url || "/" }),
      });

      const data = (await res.json().catch(() => null)) as
        | (SendResult & { error?: string })
        | null;

      if (!res.ok) {
        throw new Error(data?.error ?? "Echec de l'envoi");
      }

      setResult(data as SendResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Echec de l'envoi");
    } finally {
      setBusy(false);
    }
  }

  const fieldClass =
    "w-full border border-white/20 bg-white/5 px-4 py-3 font-body text-sm text-white outline-none transition-colors focus:border-lime";
  const labelClass =
    "font-condensed text-[11px] font-bold uppercase tracking-[0.3em] text-white/50";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="push-title" className={labelClass}>
          Titre
        </label>
        <input
          id="push-title"
          type="text"
          required
          maxLength={120}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Changement de scene"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="push-body" className={labelClass}>
          Contenu
        </label>
        <textarea
          id="push-body"
          required
          maxLength={500}
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Frontex joue finalement sur la Scene Glacier a 23h."
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="push-url" className={labelClass}>
          Lien (au clic)
        </label>
        <input
          id="push-url"
          type="text"
          maxLength={500}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="/programme"
          className={fieldClass}
        />
      </div>

      <button
        type="submit"
        disabled={busy}
        className="self-start bg-lime px-10 py-4 font-condensed text-xs font-bold uppercase tracking-[0.3em] text-dark transition-all duration-300 hover:opacity-80 disabled:opacity-50"
      >
        {busy ? "Envoi..." : "Envoyer a tous les abonnes"}
      </button>

      {result && (
        <p className="border border-lime bg-white/5 px-5 py-4 font-condensed text-sm uppercase tracking-[0.15em] text-lime">
          {result.sent} envoyee(s) sur {result.recipients} · {result.failed} echec(s)
          {result.removed > 0 ? ` · ${result.removed} expiree(s) nettoyee(s)` : ""}
        </p>
      )}

      {error && (
        <p className="border border-pink bg-white/5 px-5 py-4 font-condensed text-sm uppercase tracking-[0.15em] text-orange">
          {error}
        </p>
      )}
    </form>
  );
}
