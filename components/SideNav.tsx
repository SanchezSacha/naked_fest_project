"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/programme",
    label: "Programme",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
        <line x1="9" y1="3" x2="9" y2="18" />
        <line x1="15" y1="6" x2="15" y2="21" />
      </svg>
    ),
  },
  {
    href: "/favoris",
    label: "Favoris",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 1 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z" />
      </svg>
    ),
  },
  {
    href: "/compte",
    label: "Compte",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex fixed left-0 top-14 bottom-0 w-64 bg-black/95 border-r border-dark-border flex-col z-40 backdrop-blur-sm">
      {/* Logo area */}
      <div className="p-6 border-b border-dark-border">
        <p className="font-condensed text-xs uppercase tracking-[0.3em] text-white/40">
          Navigation
        </p>
      </div>
      
      {/* Nav items */}
      <div className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-condensed font-medium tracking-wider uppercase transition-all duration-200 ${
                active 
                  ? "bg-lime/10 text-lime border-l-2 border-lime" 
                  : "text-white/70 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
              }`}
            >
              <span className={active ? "text-lime" : "text-white/50"}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
      
      {/* Footer info */}
      <div className="p-6 border-t border-dark-border">
        <p className="font-condensed text-xs uppercase tracking-[0.2em] text-white/30">
          Naked Fest Winter&apos;27
        </p>
        <p className="text-[10px] text-white/20 mt-1">
          24-26 Jan 2027 · Ardennes
        </p>
      </div>
    </nav>
  );
}
