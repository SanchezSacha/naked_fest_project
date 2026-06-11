"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    label: "Accueil",
    description: "Page d'accueil",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/programme",
    label: "Programme",
    description: "Concerts & événements",
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
    description: "Plan interactif",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
        <line x1="9" y1="3" x2="9" y2="18" />
        <line x1="15" y1="6" x2="15" y2="21" />
      </svg>
    ),
  },
  {
    href: "/favoris",
    label: "Favoris",
    description: "Votre sélection",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 1 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z" />
      </svg>
    ),
  },
  {
    href: "/compte",
    label: "Compte",
    description: "Paramètres & profil",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex fixed left-0 top-[3.5rem] xl:top-16 bottom-0 w-60 xl:w-64 glass border-r border-dark-border/60 flex-col z-40">
      {/* Nav items avec espacement optimisé */}
      <div className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                active 
                  ? "bg-gradient-to-r from-lime/15 to-lime/5 text-lime" 
                  : "text-white/60 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              {/* Icône avec fond au hover */}
              <span className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                active 
                  ? "bg-lime/20 text-lime" 
                  : "bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-white/70"
              }`}>
                {item.icon}
              </span>
              
              {/* Label et description */}
              <div className="flex flex-col">
                <span className="font-condensed text-sm font-semibold uppercase tracking-[0.08em]">
                  {item.label}
                </span>
                <span className={`text-[10px] tracking-[0.05em] transition-colors ${
                  active ? "text-lime/60" : "text-white/30 group-hover:text-white/40"
                }`}>
                  {item.description}
                </span>
              </div>
              
              {/* Indicateur actif */}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-lime shadow-[0_0_8px_rgba(200,255,0,0.8)]" />
              )}
            </Link>
          );
        })}
      </div>
      
      {/* Footer info stylisé */}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
          <span className="font-condensed text-[10px] uppercase tracking-[0.2em] text-lime/80">
            Live
          </span>
        </div>
        <p className="font-condensed text-xs uppercase tracking-[0.15em] text-white/50">
          Naked Fest
        </p>
        <p className="text-[10px] text-white/30 mt-0.5">
          24-26 Jan 2027 · Ardennes
        </p>
      </div>
    </nav>
  );
}
