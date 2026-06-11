"use client";

import { useEffect, useState } from "react";

// Type pour les événements Strapi
type StrapiEvent = {
  slug: string;
  title: string;
  time: string;
  artist: string;
  image: string;
  stage: string;
  day: string;
};

type SubscribedEvent = {
  subscriptionId: number;
  slug: string;
  title: string | null;
  startsAt: string | null;
};

type Props = {
  endpoint: string;
};

export default function PushEventSelector({ endpoint }: Props) {
  const [strapiEvents, setStrapiEvents] = useState<StrapiEvent[]>([]);
  const [subscribedSlugs, setSubscribedSlugs] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchStrapiEvents();
    fetchSubscribedEvents();
  }, [endpoint]);

  async function fetchStrapiEvents() {
    try {
      const res = await fetch("/api/strapi/events");
      if (res.ok) {
        const data = await res.json();
        setStrapiEvents(data.events || []);
      }
    } catch {
      // ignore
    }
  }

  async function fetchSubscribedEvents() {
    try {
      const res = await fetch(
        `/api/push/my-events?endpoint=${encodeURIComponent(endpoint)}`
      );
      if (res.ok) {
        const data = await res.json();
        setSubscribedSlugs(new Set(data.map((e: SubscribedEvent) => e.slug)));
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function toggleEvent(event: StrapiEvent, subscribe: boolean) {
    setSaving(event.slug);
    try {
      // Parser l'heure et le jour pour créer une date
      const eventDate = parseEventDate(event.day, event.time);
      
      const res = await fetch("/api/push/subscribe-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint,
          eventSlug: event.slug,
          eventTitle: event.title || event.artist,
          eventStartsAt: eventDate?.toISOString(),
          subscribe,
        }),
      });

      if (res.ok) {
        setSubscribedSlugs((prev) => {
          const next = new Set(prev);
          if (subscribe) {
            next.add(event.slug);
          } else {
            next.delete(event.slug);
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

  function parseEventDate(day: string, time: string): Date | null {
    // Mapper les jours du festival (ex: VEN, SAM, DIM)
    const year = new Date().getFullYear();
    const dayMap: Record<string, number> = {
      VEN: 12, // Vendredi 12 juin 2026
      SAM: 13, // Samedi 13 juin 2026  
      DIM: 14, // Dimanche 14 juin 2026
    };
    
    const dayNum = dayMap[day];
    if (!dayNum) return null;
    
    const [hours, minutes] = time.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    
    return new Date(year, 5, dayNum, hours, minutes); // Juin = mois 5
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return <p className="text-sm text-white/50">Chargement des alertes...</p>;
  }

  if (strapiEvents.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-3">
      <p className="font-condensed text-sm uppercase tracking-[0.1em] text-white/70">
        Alertes événements :
      </p>
      <p className="text-xs text-white/40">
        Sélectionnez les événements pour lesquels vous souhaitez recevoir des rappels (30min avant)
      </p>

      <div className="max-h-64 space-y-2 overflow-y-auto pr-2">
        {strapiEvents.map((event: StrapiEvent) => {
          const isSubscribed = subscribedSlugs.has(event.slug);
          const isSaving = saving === event.slug;

          return (
            <div
              key={event.slug}
              className={`flex items-center gap-3 border p-3 transition-all ${
                isSubscribed
                  ? "border-lime/30 bg-lime/5"
                  : "border-white/10 bg-white/5"
              }`}
            >
              {event.image && (
                <img
                  src={event.image}
                  alt=""
                  className="h-12 w-12 object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="truncate font-condensed text-sm font-bold uppercase text-white">
                  {event.title || event.artist}
                </p>
                <p className="text-xs text-white/50">
                  {event.day} {event.time} · {event.stage}
                </p>
                {event.artist && event.title && event.artist !== event.title && (
                  <p className="truncate text-xs text-white/30">
                    {event.artist}
                  </p>
                )}
              </div>
              <button
                onClick={() => toggleEvent(event, !isSubscribed)}
                disabled={isSaving}
                className={`shrink-0 rounded px-3 py-2 text-xs font-condensed uppercase transition-all ${
                  isSubscribed
                    ? "border border-lime bg-lime/20 text-lime hover:bg-lime/30"
                    : "border border-white/20 bg-white/10 text-white/70 hover:bg-white/20"
                } ${isSaving ? "opacity-50" : ""}`}
              >
                {isSaving ? "..." : isSubscribed ? "Suivi ✓" : "Suivre +"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
