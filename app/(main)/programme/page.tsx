"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import ProgrammeUserBar from "@/components/ProgrammeUserBar";
import ProgramFilters from "@/components/ProgramFilters";

/* ─── DATA ─────────────────────────────────────────────────────── */

type DayId = "VEN" | "SAM" | "DIM";

type Slot = {
  image: string;
  artist: string;
  genre: string;
  origin: string;
  stage: string;
  time: string;
  dateBg: string;
  dateText: string;
  accent: string; // neon text color class
  hoverBorder: string;
  category: string;
  genreId: string;
};

type FilterState = {
  dates: string[];
  categories: string[];
  genres: string[];
};

const days: { id: DayId; label: string; date: string; sub: string }[] = [
  { id: "VEN", label: "Vendredi", date: "24", sub: "Ouverture" },
  { id: "SAM", label: "Samedi", date: "25", sub: "Le grand froid" },
  { id: "DIM", label: "Dimanche", date: "26", sub: "Dernière lueur" },
];

const lineup: Record<DayId, Slot[]> = {
  VEN: [
    {
      image: "/event_3.png", artist: "2nd-Gen", genre: "Glitch Ambient", origin: "FR",
      stage: "Sanctuaire de Glace", time: "22:00",
      dateBg: "bg-cyan", dateText: "text-dark", accent: "text-cyan",
      hoverBorder: "group-hover:[border-top-color:#00f5ff]",
      category: "concerts", genreId: "dark-ambient",
    },
    {
      image: "/event_1.png", artist: "Névé", genre: "Techno Hypnotique", origin: "BE",
      stage: "Scène Glacier", time: "23:30",
      dateBg: "bg-violet", dateText: "text-white", accent: "text-violet",
      hoverBorder: "group-hover:[border-top-color:#bf5fff]",
      category: "concerts", genreId: "techno",
    },
    {
      image: "/Event_2.png", artist: "Whiteout", genre: "Drone / Noise", origin: "IS",
      stage: "Zone Cryo", time: "01:00",
      dateBg: "bg-pink", dateText: "text-white", accent: "text-pink",
      hoverBorder: "group-hover:[border-top-color:#ff2d9b]",
      category: "concerts", genreId: "dark-ambient",
    },
  ],
  SAM: [
    {
      image: "/event_1.png", artist: "Frontex", genre: "Techno Industrielle", origin: "DE",
      stage: "Scène Glacier", time: "23:00",
      dateBg: "bg-lime", dateText: "text-dark", accent: "text-lime",
      hoverBorder: "group-hover:[border-top-color:#c8ff00]",
      category: "concerts", genreId: "industrial",
    },
    {
      image: "/event_3.png", artist: "Permafrost", genre: "EBM / Power", origin: "SE",
      stage: "Zone Cryo", time: "00:30",
      dateBg: "bg-cyan", dateText: "text-dark", accent: "text-cyan",
      hoverBorder: "group-hover:[border-top-color:#00f5ff]",
      category: "concerts", genreId: "electro",
    },
    {
      image: "/Event_2.png", artist: "Blizzard", genre: "Metal Expérimental", origin: "FI",
      stage: "Scène Glacier", time: "02:00",
      dateBg: "bg-lime", dateText: "text-dark", accent: "text-lime",
      hoverBorder: "group-hover:[border-top-color:#c8ff00]",
      category: "concerts", genreId: "metal",
    },
  ],
  DIM: [
    {
      image: "/Event_2.png", artist: "King Vibe", genre: "Experimental Noise", origin: "NO",
      stage: "Sanctuaire de Glace", time: "02:00",
      dateBg: "bg-pink", dateText: "text-white", accent: "text-pink",
      hoverBorder: "group-hover:[border-top-color:#ff2d9b]",
      category: "concerts", genreId: "dark-ambient",
    },
    {
      image: "/event_1.png", artist: "Aurora", genre: "Ambient Cosmique", origin: "NO",
      stage: "Sanctuaire de Glace", time: "04:00",
      dateBg: "bg-violet", dateText: "text-white", accent: "text-violet",
      hoverBorder: "group-hover:[border-top-color:#bf5fff]",
      category: "concerts", genreId: "dark-ambient",
    },
    {
      image: "/event_3.png", artist: "Dégel", genre: "Live Techno", origin: "FR",
      stage: "Scène Glacier", time: "06:00",
      dateBg: "bg-lime", dateText: "text-dark", accent: "text-lime",
      hoverBorder: "group-hover:[border-top-color:#c8ff00]",
      category: "concerts", genreId: "techno",
    },
  ],
};

const accentByDay: Record<DayId, string> = {
  VEN: "text-cyan",
  SAM: "text-lime",
  DIM: "text-pink",
};

/* ─── PAGE ──────────────────────────────────────────────────────── */

export default function ProgrammePage() {
  const [activeDay, setActiveDay] = useState<DayId>("SAM");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    dates: [],
    categories: [],
    genres: [],
  });

  // Filtrer les slots en fonction des filtres actifs
  const filteredSlots = useMemo(() => {
    let slots = lineup[activeDay];

    // Filtrer par catégories
    if (filters.categories.length > 0) {
      if (filters.categories.includes("tout")) {
        // "Tout Voir" ne filtre pas par catégorie
      } else {
        slots = slots.filter(slot => filters.categories.includes(slot.category));
      }
    }

    // Filtrer par genres
    if (filters.genres.length > 0) {
      slots = slots.filter(slot => filters.genres.includes(slot.genreId));
    }

    // Trier par heure
    return slots.sort((a, b) => {
      const timeA = parseInt(a.time.replace(':', ''));
      const timeB = parseInt(b.time.replace(':', ''));
      return timeA - timeB;
    });
  }, [activeDay, filters]);

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({ dates: [], categories: [], genres: [] });
  };

  const hasActiveFilters = filters.categories.length > 0 || filters.genres.length > 0;

  return (
    <>
      {/* ── HEADER SECTION ────────────────────────────────────────── */}
      <section className="border-b border-[#252525]">
        <div className="px-8 py-20 md:px-12 md:py-24 text-center">
          <span className="font-condensed text-pink text-xs tracking-[0.4em] uppercase">
            24 — 26 Jan · 2027
          </span>
          <h1 className="font-display text-[clamp(56px,15vw,120px)] leading-none text-white uppercase mt-3">
            Programme
          </h1>
          <p className="font-condensed text-cyan text-sm tracking-[0.3em] uppercase mt-3">
            Trois nuits sans fin · cinq scènes
          </p>
        </div>
      </section>

      <ProgrammeUserBar />

      {/* ── DAY TABS ──────────────────────────────────────────────── */}
      <section className="border-b border-[#252525] sticky top-14 z-40 bg-dark/95 backdrop-blur">
        <div className="grid grid-cols-3 divide-x divide-[#252525]">
          {days.map((d) => {
            const active = d.id === activeDay;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setActiveDay(d.id)}
                className={`group flex flex-col items-center gap-1 px-4 py-7 transition-colors duration-300 ${
                  active ? "bg-white/[0.03]" : "hover:bg-white/[0.02]"
                }`}
              >
                <span
                  className={`font-display text-4xl md:text-5xl leading-none transition-colors ${
                    active ? accentByDay[d.id] : "text-white/30 group-hover:text-white/60"
                  }`}
                >
                  {d.date}
                </span>
                <span
                  className={`font-condensed text-[10px] tracking-[0.3em] uppercase transition-colors ${
                    active ? "text-white" : "text-white/40"
                  }`}
                >
                  {d.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── FILTER BAR ───────────────────────────────────────────── */}
      <section className="border-b border-[#252525] bg-dark/95 backdrop-blur sticky top-[88px] z-30">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(true)}
              className={`flex items-center gap-2 font-condensed text-[11px] tracking-[0.2em] uppercase transition-all ${
                hasActiveFilters
                  ? "text-lime border border-lime px-3 py-2"
                  : "text-white/70 hover:text-white border border-[#252525] px-3 py-2 hover:border-white/30"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 4h12M4 8h8M6 12h4" strokeLinecap="round" />
              </svg>
              Filtres
              {hasActiveFilters && (
                <span className="bg-lime/20 text-lime px-2 py-0.5 text-[10px] rounded">
                  {filters.categories.length + filters.genres.length}
                </span>
              )}
            </button>
            
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="font-condensed text-[10px] text-white/50 hover:text-white uppercase tracking-[0.15em] transition-colors"
              >
                Effacer
              </button>
            )}
          </div>
          
          <span className="font-condensed text-[11px] text-white/40 tracking-[0.2em] uppercase">
            {filteredSlots.length} {filteredSlots.length === 1 ? "résultat" : "résultats"}
          </span>
        </div>
      </section>

      {/* ── DAY INTRO ─────────────────────────────────────────────── */}
      <section className="border-b border-[#252525]">
        <div className="flex items-baseline justify-between px-8 py-7 md:px-10">
          <h2 className="font-display text-3xl md:text-4xl text-white uppercase tracking-wide">
            {days.find((d) => d.id === activeDay)?.label}
          </h2>
          <span className="font-condensed text-[11px] text-white/40 tracking-[0.2em] uppercase">
            {days.find((d) => d.id === activeDay)?.sub} · {filteredSlots.length} sets
          </span>
        </div>

        {/* ── CARDS ───────────────────────────────────────────────── */}
        {filteredSlots.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-[#252525]">
            {filteredSlots.map((e, index) => (
              <div
                key={`${e.artist}-${e.time}`}
                className={`relative overflow-hidden group border-t-2 lg:border-t-0 border-l-2 border-transparent transition-all duration-300 ${e.hoverBorder} ${
                  index === 0 ? 'lg:border-l-0' : ''
                }`}
              >
                <div className="relative aspect-[4/3] lg:aspect-[3/4] w-full h-[280px] lg:h-[400px]">
                  <Image
                    src={e.image}
                    alt={e.artist}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Top badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <div className="flex items-center gap-px font-condensed font-bold text-[10px] tracking-[0.15em] uppercase overflow-hidden">
                      <span className={`${e.dateBg} ${e.dateText} px-2.5 py-1.5`}>{e.time}</span>
                      <span className={`${e.dateBg} ${e.dateText} px-2.5 py-1.5 opacity-75`}>
                        {activeDay}
                      </span>
                    </div>
                    <span className={`font-condensed text-[10px] tracking-[0.25em] uppercase ${e.accent} bg-black/60 px-2.5 py-1.5`}>
                      {e.stage}
                    </span>
                  </div>

                  {/* Genre badge */}
                  <div className="absolute top-4 right-4">
                    <span className="font-condensed text-[9px] tracking-[0.2em] uppercase text-white/80 bg-black/60 px-2 py-1 border border-white/20">
                      {e.genreId.replace('-', ' ')}
                    </span>
                  </div>

                  {/* Artist info — bottom */}
                  <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-display text-[clamp(28px,5vw,36px)] leading-none text-white uppercase mb-2">
                      {e.artist}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="font-condensed text-[11px] tracking-[0.15em] text-white/60 uppercase">
                        {e.genre}
                      </p>
                      <p className="font-condensed text-[11px] tracking-[0.15em] text-white/40 uppercase">
                        {e.origin}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-8 py-20 text-center">
            <p className="font-condensed text-white/50 text-sm tracking-[0.2em] uppercase">
              Aucun événement trouvé pour ces filtres
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 font-condensed text-lime text-sm tracking-[0.2em] uppercase hover:text-white transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="border-t-2 border-pink mt-2">
        <div className="px-8 py-20 pb-28 md:px-12 md:py-24 md:pb-32 flex flex-col items-center text-center">
          <h2 className="font-display text-[clamp(40px,10vw,68px)] leading-none text-white uppercase">
            Ne ratez rien
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-sm mt-5">
            Le line-up complet se dévoile nuit après nuit. Réservez votre place
            avant la fonte des derniers billets.
          </p>
          <Link
            href="/billetterie"
            className="mt-10 border-2 border-lime bg-lime text-dark font-condensed font-bold text-sm px-14 py-5 tracking-[0.35em] uppercase transition-all duration-300 hover:bg-[#111113] hover:[color:var(--neon-lime)]"
          >
            Billetterie
          </Link>
        </div>
      </section>

      {/* ── FILTERS MODAL ─────────────────────────────────────────── */}
      <ProgramFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        initialFilters={filters}
        resultCount={filteredSlots.length}
      />
    </>
  );
}
