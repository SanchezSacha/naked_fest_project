"use client";

import { useEffect, useState } from "react";
import {
  getCurrentSubscription,
  isPushSupported,
  subscribeToPush,
} from "@/lib/push-client";

type Props = {
  eventId: string;
  eventTitle: string;
  eventStartsAt?: string;
};

export default function EventNotifyButton({ eventId, eventTitle, eventStartsAt }: Props) {
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSupported(isPushSupported());
    checkSubscription();
  }, [eventId]);

  async function checkSubscription() {
    try {
      const sub = await getCurrentSubscription();
      if (!sub) return;
      
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

  async function toggleSubscription() {
    setLoading(true);
    try {
      let sub = await getCurrentSubscription();
      if (!sub) {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          alert("Autorisez les notifications pour recevoir des rappels");
          return;
        }
        sub = await subscribeToPush();
      }

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
        setSubscribed(!subscribed);
      }
    } catch (err) {
      console.error("Erreur subscription:", err);
    } finally {
      setLoading(false);
    }
  }

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={toggleSubscription}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-condensed text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-200 ${
        subscribed
          ? "bg-lime/10 border border-lime text-lime"
          : "bg-white/5 border border-white/20 text-white/70 hover:border-lime hover:text-lime"
      } ${loading ? "opacity-50" : ""}`}
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
  );
}
