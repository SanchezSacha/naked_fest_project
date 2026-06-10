"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getNotifications } from "@/lib/events";

export default function BottomNav() {
  const pathname = usePathname();
  const [hasNotifs, setHasNotifs] = useState(false);

  const checkNotifs = () => {
    setHasNotifs(getNotifications().length > 0);
  };

  useEffect(() => {
    checkNotifs();
    const handler = () => checkNotifs();
    window.addEventListener("naked_fest_notifs_change", handler);
    return () => window.removeEventListener("naked_fest_notifs_change", handler);
  }, []);

  const navItems = [
    {
      href: "/programme",
      label: "Programme",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      href: "/carte",
      label: "Carte",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
          <line x1="9" y1="3" x2="9" y2="18" />
          <line x1="15" y1="6" x2="15" y2="21" />
        </svg>
      ),
    },
    {
      href: "/notifications",
      label: "Notifications",
      badge: hasNotifs,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
    },
    {
      href: "/compte",
      label: "Compte",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-dark-border flex items-center justify-around px-4 pt-3 pb-safe">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex flex-col items-center gap-1 text-[10px] font-condensed font-medium tracking-wider uppercase transition-colors min-w-0 px-3 py-1 ${
              active ? "text-lime" : "text-white/70 hover:text-white"
            }`}
          >
            <span className="relative">
              {item.icon}
              {item.badge && (
                <span
                  className="absolute -top-[3px] -right-[3px] w-[8px] h-[8px] rounded-full bg-pink"
                  style={{ boxShadow: "0 0 6px 1px var(--neon-pink)" }}
                  aria-label="Nouvelles notifications"
                />
              )}
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
