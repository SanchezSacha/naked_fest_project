"use client";

import { useEffect, useState } from "react";
import {
  getCurrentSubscription,
  isPushSupported,
  subscribeToPush,
} from "@/lib/push-client";

type Delay = "HOURS_24" | "HOURS_2" | "MINUTES_30";

const DELAYS: { value: Delay; label: string }[] = [
  { value: "HOURS_24", label: "24h avant" },
  { value: "HOURS_2", label: "2h avant" },
  { value: "MINUTES_30", label: "30min avant" },
];

export default function EventReminderButton({ eventId }: { eventId: number }) {
  const [supported, setSupported] = useState(false);
  const [active, setActive] = useState<Set<Delay>>(new Set());
  const [busy, setBusy] = useState<Delay | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Frontiere async : evite un setState synchrone dans l'effet.
      await Promise.resolve();
      if (!cancelled) setSupported(isPushSupported());
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!supported) return null;

  async function ensureSubscription() {
    let sub = await getCurrentSubscription();
    if (sub) return sub;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Autorisez les notifications pour recevoir un rappel");
    }
    sub = await subscribeToPush();
    return sub;
  }

  async function toggle(delay: Delay) {
    setBusy(delay);
    setError(null);
    const isActive = active.has(delay);

    try {
      const sub = await ensureSubscription();
      const res = await fetch("/api/push/reminders", {
        method: isActive ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, delay, endpoint: sub.endpoint }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Echec du rappel");
      }

      setActive((prev) => {
        const next = new Set(prev);
        if (isActive) next.delete(delay);
        else next.add(delay);
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Echec du rappel");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="font-condensed text-[10px] tracking-[0.4em] uppercase text-pink">
        Me rappeler
      </span>
      <div className="flex flex-wrap gap-3">
        {DELAYS.map(({ value, label }) => {
          const on = active.has(value);
          return (
            <button
              key={value}
              type="button"
              onClick={() => toggle(value)}
              disabled={busy !== null}
              className={`border px-5 py-3 font-condensed text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-50 ${
                on
                  ? "border-lime bg-lime text-dark"
                  : "border-white/30 text-white hover:border-lime hover:text-lime"
              }`}
            >
              {busy === value ? "..." : label}
            </button>
          );
        })}
      </div>
      {error && (
        <p className="font-condensed text-xs uppercase tracking-[0.2em] text-orange">
          {error}
        </p>
      )}
    </div>
  );
}
