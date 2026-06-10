"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  events,
  getNotifications,
  saveNotifications,
  setNotificationDelay,
  type NotificationEntry,
  type ReminderDelay,
} from "@/lib/events";

/* ─── DELAY OPTIONS ───────────────────────────────────────────────── */

const delays: { value: ReminderDelay; label: string; short: string }[] = [
  { value: "HOURS_24", label: "24 heures avant", short: "24H" },
  { value: "HOURS_2",  label: "2 heures avant",  short: "2H"  },
  { value: "MINUTES_30", label: "30 min avant",  short: "30MIN" },
];

/* ─── PAGE ────────────────────────────────────────────────────────── */

export default function NotificationsPage() {
  const [entries, setEntries] = useState<NotificationEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(() => {
    setEntries(getNotifications());
  }, []);

  useEffect(() => {
    setMounted(true);
    refresh();

    const handler = () => refresh();
    window.addEventListener("naked_fest_notifs_change", handler);
    return () => window.removeEventListener("naked_fest_notifs_change", handler);
  }, [refresh]);

  const handleDelay = (eventId: string, delay: ReminderDelay) => {
    setNotificationDelay(eventId, delay);
    refresh();
  };

  const handleRemove = (eventId: string) => {
    const updated = getNotifications().filter((n) => n.eventId !== eventId);
    saveNotifications(updated);
    setEntries(updated);
    window.dispatchEvent(new Event("naked_fest_notifs_change"));
  };

  if (!mounted) return null;

  return (
    <>
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <section className="border-b border-[#252525]">
        <div className="px-8 pt-14 pb-10 md:px-12 md:pt-16">
          <span className="font-condensed text-[10px] tracking-[0.4em] uppercase text-pink mb-4 block">
            Rappels
          </span>
          <h1 className="font-display text-[clamp(48px,14vw,100px)] leading-none uppercase text-white">
            Notifications
          </h1>
          <p className="font-condensed text-[11px] tracking-[0.2em] uppercase text-white/30 mt-4">
            {entries.length === 0
              ? "Aucun rappel activé"
              : `${entries.length} rappel${entries.length > 1 ? "s" : ""} actif${entries.length > 1 ? "s" : ""}`}
          </p>
        </div>
      </section>

      {/* ── EMPTY STATE ────────────────────────────────────────────── */}
      {entries.length === 0 && (
        <section className="flex flex-col items-center justify-center px-8 py-24 gap-8 text-center">
          <div className="relative">
            <svg
              width="52" height="52"
              viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.2"
              strokeLinecap="round" strokeLinejoin="round"
              className="text-white/15"
              aria-hidden="true"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-display text-[clamp(28px,8vw,48px)] leading-none uppercase text-white/20">
              Aucun rappel
            </p>
            <p className="font-condensed text-[11px] tracking-[0.2em] uppercase text-white/30 max-w-[260px] leading-relaxed">
              Active la cloche sur un événement pour recevoir un rappel avant le début
            </p>
          </div>
          <Link
            href="/programme"
            className="bg-lime text-dark font-condensed font-bold text-xs px-10 py-4 tracking-[0.3em] uppercase flex items-center gap-3 transition-all duration-300 hover:opacity-80"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Voir le programme
          </Link>
        </section>
      )}

      {/* ── EVENT CARDS ────────────────────────────────────────────── */}
      {entries.length > 0 && (
        <section>
          <div className="divide-y divide-[#252525]">
            {entries.map((entry) => {
              const ev = events[entry.eventId];
              if (!ev) return null;
              return (
                <article key={entry.eventId} className="group relative">

                  {/* Left accent bar */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-[3px] ${ev.accentBgClass}`}
                    aria-hidden="true"
                  />

                  <div className="pl-6 pr-8 py-8 md:px-12">

                    {/* Top row — image + info + remove */}
                    <div className="flex items-start gap-5">

                      {/* Thumbnail */}
                      <Link href={`/programme/${ev.id}`} className="shrink-0">
                        <div className="relative w-[72px] h-[72px] overflow-hidden">
                          <Image
                            src={ev.image}
                            alt={ev.artist}
                            fill
                            className="object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-500"
                          />
                          <div className="absolute inset-0 bg-black/30" />
                        </div>
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`${ev.accentBgClass} ${ev.accentTextClass} font-condensed font-bold text-[9px] tracking-[0.3em] uppercase px-2 py-1`}>
                            {ev.category}
                          </span>
                        </div>
                        <Link href={`/programme/${ev.id}`}>
                          <h2 className={`font-display text-[clamp(28px,7vw,44px)] leading-none uppercase ${ev.accentClass} hover:opacity-80 transition-opacity`}>
                            {ev.artist}
                          </h2>
                        </Link>
                        <p className="font-condensed text-[10px] tracking-[0.2em] uppercase text-white/40 mt-1">
                          {ev.date} · {ev.time} — {ev.stage}
                        </p>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => handleRemove(ev.id)}
                        aria-label={`Supprimer le rappel pour ${ev.artist}`}
                        className="shrink-0 flex items-center justify-center w-8 h-8 text-white/25 hover:text-white/60 transition-colors duration-200 mt-1"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                          <path d="M2 2L12 12M12 2L2 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Delay selector */}
                    <div className="mt-6">
                      <p className="font-condensed text-[9px] tracking-[0.35em] uppercase text-white/30 mb-3">
                        Rappel
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {delays.map((d) => {
                          const selected = entry.delay === d.value;
                          return (
                            <button
                              key={d.value}
                              onClick={() => handleDelay(ev.id, d.value)}
                              aria-pressed={selected}
                              className={`
                                font-condensed font-bold text-[10px] tracking-[0.25em] uppercase
                                px-5 py-2.5 border transition-all duration-200
                                ${selected
                                  ? `${ev.accentBgClass} ${ev.accentTextClass} border-transparent`
                                  : "bg-transparent text-white/40 border-[#3a3a3a] hover:border-white/30 hover:text-white/70"
                                }
                              `}
                            >
                              {d.short}
                              <span className="sr-only"> ({d.label})</span>
                            </button>
                          );
                        })}
                      </div>
                      {/* Readable label for selected delay */}
                      <p className="font-condensed text-[9px] tracking-[0.2em] uppercase text-white/25 mt-2">
                        {delays.find((d) => d.value === entry.delay)?.label}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* ── FOOTER HINT ────────────────────────────────────────────── */}
      {entries.length > 0 && (
        <div className="px-8 py-8 md:px-12 border-t border-[#252525]">
          <p className="font-condensed text-[10px] tracking-[0.2em] uppercase text-white/20 leading-relaxed">
            Les notifications seront envoyées selon le délai choisi avant chaque début de set.
          </p>
        </div>
      )}
    </>
  );
}
