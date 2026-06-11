"use client";

import { useEffect, useState } from "react";

type PushTopic = {
  id: number;
  key: string;
  label: string;
  description: string | null;
  color: string | null;
  isDefault: boolean;
};

type Props = {
  endpoint: string;
};

export default function PushTopicSelector({ endpoint }: Props) {
  const [topics, setTopics] = useState<PushTopic[]>([]);
  const [subscribedTopics, setSubscribedTopics] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      try {
        // Charger tous les topics
        const topicsRes = await fetch("/api/push/topics");
        if (!cancelled && topicsRes.ok) {
          const topicsData = await topicsRes.json();
          setTopics(topicsData);

          // Charger les abonnements de cet utilisateur
          const subRes = await fetch(
            `/api/push/my-topics?endpoint=${encodeURIComponent(endpoint)}`
          );
          if (!cancelled && subRes.ok) {
            const subData = await subRes.json();
            setSubscribedTopics(new Set(subData.map((t: PushTopic) => t.key)));
          } else {
            // Par defaut, abonner aux topics par defaut
            const defaults = topicsData
              .filter((t: PushTopic) => t.isDefault)
              .map((t: PushTopic) => t.key);
            setSubscribedTopics(new Set(defaults));
          }
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  async function toggleTopic(topicKey: string, subscribe: boolean) {
    setSaving(topicKey);
    try {
      const res = await fetch("/api/push/subscribe-topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint, topicKey, subscribe }),
      });

      if (res.ok) {
        setSubscribedTopics((prev) => {
          const next = new Set(prev);
          if (subscribe) {
            next.add(topicKey);
          } else {
            next.delete(topicKey);
          }
          return next;
        });
      }
    } catch {
      // ignore
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return (
      <p className="mt-4 text-sm text-white/50">Chargement des sources...</p>
    );
  }

  if (topics.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-2">
      <p className="font-condensed text-sm uppercase tracking-[0.1em] text-white/70">
        Sources de notification :
      </p>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic) => {
          const isSubscribed = subscribedTopics.has(topic.key);
          const isSaving = saving === topic.key;

          return (
            <button
              key={topic.key}
              onClick={() => toggleTopic(topic.key, !isSubscribed)}
              disabled={isSaving}
              className={`flex items-center gap-2 rounded px-3 py-2 text-sm transition-all ${
                isSubscribed
                  ? "border border-lime bg-lime/20 text-lime"
                  : "border border-white/20 bg-white/5 text-white/50 hover:border-white/40"
              } ${isSaving ? "opacity-50" : ""}`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: topic.color || "#ff2d9b" }}
              />
              <span className="font-condensed uppercase tracking-[0.05em]">
                {topic.label}
              </span>
              {isSubscribed ? (
                <span className="text-xs">✓</span>
              ) : (
                <span className="text-xs">+</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
