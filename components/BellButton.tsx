"use client";

import { useState, useEffect } from "react";
import { isEventNotified, toggleNotification } from "@/lib/events";

type Props = {
  eventId: string;
  accentClass: string;
};

export default function BellButton({ eventId, accentClass }: Props) {
  const [active, setActive] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setActive(isEventNotified(eventId));
  }, [eventId]);

  const handleClick = () => {
    const next = toggleNotification(eventId);
    setActive(next);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 350);
    // Notify BottomNav to re-check
    window.dispatchEvent(new Event("naked_fest_notifs_change"));
  };

  return (
    <button
      onClick={handleClick}
      aria-label={active ? "Désactiver les notifications" : "Activer les notifications"}
      className={`
        relative flex items-center justify-center w-11 h-11
        border transition-all duration-300
        ${active
          ? `${accentClass} border-current bg-white/5`
          : "text-white/40 border-white/15 hover:text-white/70 hover:border-white/30"
        }
        ${animating ? "scale-110" : "scale-100"}
      `}
      style={{ transition: "transform 0.2s cubic-bezier(.34,1.56,.64,1), color 0.3s, border-color 0.3s, background-color 0.3s" }}
    >
      {active ? (
        /* Filled bell */
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" fill="none" />
        </svg>
      ) : (
        /* Empty bell */
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      )}

      {/* Neon glow ring on active */}
      {active && (
        <span
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `0 0 12px 2px currentColor`, opacity: 0.25 }}
          aria-hidden="true"
        />
      )}
    </button>
  );
}
