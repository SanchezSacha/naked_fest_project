"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";

type PushTopic = {
  id: number;
  key: string;
  label: string;
  color: string | null;
};

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
  const [topicKey, setTopicKey] = useState<string>("");
  const [topics, setTopics] = useState<PushTopic[]>([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      try {
        const res = await fetch("/api/push/topics");
        if (!cancelled && res.ok) {
          const data = await res.json();
          setTopics(data);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          url: url || "/",
          topicKey: topicKey || undefined,
        }),
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

      {topics.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className={labelClass}>Motif / Source (optionnel)</span>
          <p className="text-xs text-white/40 -mt-1">
            Laissez vide pour notifier tous les abonnés, ou choisissez un motif ciblé.
          </p>
          <div className="flex flex-col gap-1.5 mt-1">
            {/* Option "Tous" */}
            <button
              type="button"
              onClick={() => setTopicKey("")}
              className={`flex items-center gap-3 px-4 py-3 border transition-all duration-200 text-left ${
                topicKey === ""
                  ? "border-lime/40 bg-lime/10"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              }`}
            >
              <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-white/30" />
              <span className="flex-1 font-condensed text-xs font-bold uppercase tracking-[0.15em] text-white/70">
                Tous les abonnés
              </span>
              <span className={`shrink-0 w-4 h-4 border flex items-center justify-center transition-all ${topicKey === "" ? "border-lime bg-lime" : "border-white/20 bg-transparent"}`}>
                {topicKey === "" && (
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            </button>

            {topics.map((topic) => {
              const active = topicKey === topic.key;
              const dotColor = topic.color ?? "#a3e635";
              return (
                <button
                  key={topic.key}
                  type="button"
                  onClick={() => setTopicKey(active ? "" : topic.key)}
                  className={`flex items-center gap-3 px-4 py-3 border transition-all duration-200 text-left ${
                    active
                      ? "border-lime/40 bg-lime/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20"
                  }`}
                >
                  <span
                    className="shrink-0 w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: dotColor }}
                  />
                  <span className="flex-1 font-condensed text-xs font-bold uppercase tracking-[0.15em] text-white/70">
                    {topic.label}
                  </span>
                  <span className={`shrink-0 w-4 h-4 border flex items-center justify-center transition-all ${active ? "border-lime bg-lime" : "border-white/20 bg-transparent"}`}>
                    {active && (
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                        <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <Button type="submit" color="lime" variant="solid" size="lg" disabled={busy} className="self-start">
        {busy
          ? "Envoi..."
          : topicKey
            ? `Envoyer aux abonnes de "${
                topics.find((t) => t.key === topicKey)?.label || topicKey
              }"`
            : "Envoyer a tous les abonnes"}
      </Button>

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
