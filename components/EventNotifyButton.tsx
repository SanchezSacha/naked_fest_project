"use client";

import { useEffect, useRef, useState } from "react";
import {
  getCurrentSubscription,
  isPushSupported,
  subscribeToPush,
} from "@/lib/push-client";

type PushTopic = {
  id: number;
  key: string;
  label: string;
  description: string | null;
  color: string | null;
};

type Props = {
  eventId: string;
  eventTitle: string;
  eventStartsAt?: string;
};

export default function EventNotifyButton({ eventId, eventTitle, eventStartsAt }: Props) {
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [topics, setTopics] = useState<PushTopic[]>([]);
  const [subscribedTopics, setSubscribedTopics] = useState<string[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [savingTopics, setSavingTopics] = useState(false);
  const endpointRef = useRef<string | null>(null);

  useEffect(() => {
    setSupported(isPushSupported());
    checkSubscription();
  }, [eventId]);

  async function checkSubscription() {
    try {
      const sub = await getCurrentSubscription();
      if (!sub) return;
      endpointRef.current = sub.endpoint;

      const res = await fetch(`/api/push/my-events?endpoint=${encodeURIComponent(sub.endpoint)}`);
      if (res.ok) {
        const data = await res.json();
        const isSubscribed = data.some((e: { slug: string }) => e.slug === eventId);
        setSubscribed(isSubscribed);
      }
    } catch {
      // ignore
    }
  }

  async function loadTopicsForModal(endpoint: string) {
    setTopicsLoading(true);
    try {
      const [allRes, myRes] = await Promise.all([
        fetch("/api/push/topics"),
        fetch(`/api/push/my-topics?endpoint=${encodeURIComponent(endpoint)}`),
      ]);
      if (allRes.ok) setTopics(await allRes.json());
      if (myRes.ok) {
        const my: PushTopic[] = await myRes.json();
        setSubscribedTopics(my.map((t) => t.key));
      }
    } catch {
      // ignore
    } finally {
      setTopicsLoading(false);
    }
  }

  async function handleAlertClick() {
    if (loading) return;
    setLoading(true);
    try {
      let sub = await getCurrentSubscription();
      if (!sub) {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          return;
        }
        sub = await subscribeToPush();
      }
      endpointRef.current = sub.endpoint;

      const res = await fetch("/api/push/subscribe-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: sub.endpoint,
          eventSlug: eventId,
          eventTitle,
          eventStartsAt,
          subscribe: !subscribed,
        }),
      });

      if (res.ok) {
        const nextSubscribed = !subscribed;
        setSubscribed(nextSubscribed);
        if (nextSubscribed) {
          await loadTopicsForModal(sub.endpoint);
          setShowModal(true);
        }
      }
    } catch (err) {
      console.error("Erreur subscription:", err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleTopic(topicKey: string) {
    const endpoint = endpointRef.current;
    if (!endpoint) return;
    const isCurrentlySubscribed = subscribedTopics.includes(topicKey);
    setSavingTopics(true);
    try {
      const res = await fetch("/api/push/subscribe-topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint,
          topicKey,
          subscribe: !isCurrentlySubscribed,
        }),
      });
      if (res.ok) {
        setSubscribedTopics((prev) =>
          isCurrentlySubscribed ? prev.filter((k) => k !== topicKey) : [...prev, topicKey],
        );
      }
    } catch {
      // ignore
    } finally {
      setSavingTopics(false);
    }
  }

  if (!supported) return null;

  return (
    <>
      <button
        type="button"
        onClick={handleAlertClick}
        disabled={loading}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg font-condensed text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-200 ${
          subscribed
            ? "bg-lime border border-lime text-dark shadow-[0_0_16px_rgba(163,230,53,0.35)]"
            : "bg-white/5 border border-white/20 text-white/70 hover:border-lime hover:text-lime"
        } ${loading ? "opacity-50 cursor-wait" : ""}`}
        title={subscribed ? "Désactiver les notifications" : "Recevoir une notification 30min avant"}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {subscribed ? (
            <>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              <path d="M9 12l2 2 4-4" />
            </>
          ) : (
            <>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </>
          )}
        </svg>
        {loading ? "..." : subscribed ? "Alerte ✓" : "Alerte"}
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />

          {/* Panel */}
          <div className="relative z-10 w-full max-w-sm glass border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-condensed text-[10px] tracking-[0.3em] text-lime uppercase">
                  Alerte activée
                </p>
                <h3 className="font-display text-2xl uppercase text-white mt-1 leading-tight">
                  {eventTitle}
                </h3>
                <p className="font-condensed text-xs text-white/40 uppercase tracking-[0.15em] mt-1">
                  Rappel 30 min avant l'événement
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="w-full h-px bg-white/10" />

            {/* Topics */}
            <div>
              <p className="font-condensed text-[10px] tracking-[0.3em] text-white/50 uppercase mb-3">
                Quels types de notifications veux-tu recevoir ?
              </p>

              {topicsLoading ? (
                <p className="text-white/30 text-xs font-condensed uppercase tracking-[0.15em]">
                  Chargement…
                </p>
              ) : topics.length === 0 ? (
                <p className="text-white/30 text-xs font-condensed uppercase tracking-[0.15em]">
                  Aucune catégorie disponible
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {topics.map((topic) => {
                    const active = subscribedTopics.includes(topic.key);
                    const dotColor = topic.color ?? "#a3e635";
                    return (
                      <button
                        key={topic.key}
                        type="button"
                        disabled={savingTopics}
                        onClick={() => toggleTopic(topic.key)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-left ${
                          active
                            ? "border-lime/40 bg-lime/10"
                            : "border-white/10 bg-white/[0.03] hover:border-white/20"
                        } ${savingTopics ? "opacity-60" : ""}`}
                      >
                        <span
                          className="shrink-0 w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: dotColor }}
                        />
                        <span className="flex-1">
                          <span className={`block font-condensed text-xs font-bold uppercase tracking-[0.15em] ${active ? "text-lime" : "text-white/70"}`}>
                            {topic.label}
                          </span>
                          {topic.description && (
                            <span className="block font-body text-[11px] text-white/40 mt-0.5">
                              {topic.description}
                            </span>
                          )}
                        </span>
                        <span className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all ${active ? "border-lime bg-lime" : "border-white/20 bg-transparent"}`}>
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
              )}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 bg-lime text-dark font-condensed font-bold text-xs uppercase tracking-[0.3em] rounded-lg hover:bg-lime/90 transition-colors"
            >
              Confirmer
            </button>
          </div>
        </div>
      )}
    </>
  );
}
