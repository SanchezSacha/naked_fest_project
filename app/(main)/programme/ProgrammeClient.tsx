"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import FavoriteButton from "@/components/FavoriteButton";
import ProgramFilters, { type FilterState } from "@/components/ProgramFilters";
import ProgrammeUserBar from "@/components/ProgrammeUserBar";
import type { DayId, FestivalEvent } from "@/lib/festival-events";

const days: { id: DayId; label: string; date: string; sub: string; color: string }[] = [
  { id: "VEN", label: "Vendredi", date: "24", sub: "Ouverture", color: "cyan" },
  { id: "SAM", label: "Samedi", date: "25", sub: "Le grand froid", color: "lime" },
  { id: "DIM", label: "Dimanche", date: "26", sub: "Derniere lueur", color: "pink" },
];

const categoryLabels: Record<FestivalEvent["category"], string> = {
  concerts: "Concerts",
  conferences: "Conférences",
  activites: "Activités",
  stands: "Stands",
};

export default function ProgrammeClient({
  initialEvents,
  source,
}: {
  initialEvents: FestivalEvent[];
  source: "strapi" | "fallback";
}) {
  const [activeDay, setActiveDay] = useState<DayId>("SAM");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    dates: [],
    categories: [],
    genres: [],
  });

  const filteredEvents = useMemo(() => {
    return initialEvents
      .filter((event) => event.day === activeDay)
      .filter((event) => filters.dates.length === 0 || filters.dates.includes(event.day))
      .filter(
        (event) =>
          filters.categories.length === 0 || filters.categories.includes(event.category),
      )
      .filter((event) => filters.genres.length === 0 || filters.genres.includes(event.genreId))
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }, [activeDay, filters, initialEvents]);

  const dateOptions = days.map((day) => ({ id: day.id, label: `${day.label} ${day.date}` }));
  const categoryOptions = Array.from(new Set(initialEvents.map((event) => event.category))).map(
    (category) => ({ id: category, label: categoryLabels[category] }),
  );
  const genreOptions = Array.from(
    new Map(initialEvents.map((event) => [event.genreId, event.genre])).entries(),
  ).map(([id, label]) => ({ id, label }));
  const hasFilters = Object.values(filters).some((values) => values.length > 0);

  return (
    <>
      {/* ── HEADER ───────────────────────────────────────────────── */}
      <section className="border-b border-dark-border/60">
        <div className="px-6 py-16 md:px-12 md:py-20 lg:py-24 text-center">
          <span className="font-condensed text-xs tracking-[0.4em] text-pink uppercase">
            24 - 26 Janvier 2027
          </span>
          <h1 className="mt-3 font-display text-[clamp(48px,12vw,120px)] uppercase leading-none text-white">
            Programme
          </h1>
          <p className="mt-4 font-condensed text-sm md:text-base tracking-[0.25em] text-white/50 uppercase">
            Concerts, conférences, activités et stands
          </p>
        </div>
      </section>

      <ProgrammeUserBar />

      {/* ── DAY SELECTOR ───────────────────────────────────────────── */}
      <section className="sticky top-14 lg:top-16 z-40 border-b border-dark-border/60 glass">
        <div className="max-w-5xl mx-auto">
          <div className="flex">
            {days.map((day) => {
              const active = day.id === activeDay;
              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => setActiveDay(day.id)}
                  className={`flex-1 flex flex-col items-center gap-1.5 px-4 py-5 md:py-6 transition-all duration-300 relative ${
                    active ? "text-white" : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {/* Active indicator */}
                  {active && (
                    <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-${day.color}`} />
                  )}
                  <span className={`font-display text-4xl md:text-5xl ${active ? `text-${day.color}` : ""}`}>
                    {day.date}
                  </span>
                  <span className="font-condensed text-xs tracking-[0.2em] uppercase">
                    {day.label}
                  </span>
                  <span className="font-condensed text-[10px] tracking-[0.15em] uppercase opacity-50">
                    {day.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FILTERS BAR ──────────────────────────────────────────── */}
      <section className="border-b border-dark-border/60 bg-dark/50">
        <div className="px-6 py-4 md:px-12">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowFilters(true)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-condensed text-xs font-bold uppercase tracking-[0.15em] transition-all duration-200 ${
                  hasFilters
                    ? "bg-lime/10 border border-lime text-lime"
                    : "border border-white/20 text-white/70 hover:border-white/40 hover:text-white"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                Filtres
              </button>
              {hasFilters && (
                <button
                  type="button"
                  onClick={() => setFilters({ dates: [], categories: [], genres: [] })}
                  className="font-condensed text-xs uppercase tracking-[0.15em] text-white/40 hover:text-white transition-colors"
                >
                  Effacer
                </button>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="font-condensed text-xs uppercase tracking-[0.15em] text-white/40">
                {filteredEvents.length} événement{filteredEvents.length > 1 ? "s" : ""}
              </span>
              <span className="hidden sm:inline-block px-2 py-1 rounded border border-white/10 font-condensed text-[10px] uppercase tracking-[0.15em] text-white/30">
                {source === "strapi" ? "Strapi" : "Demo"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── DAY HEADER ─────────────────────────────────────────────── */}
      <section className="border-b border-dark-border/60">
        <div className="px-6 py-6 md:px-12">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h2 className="font-display text-3xl md:text-4xl uppercase text-white">
              {days.find((day) => day.id === activeDay)?.label}
            </h2>
            <span className="font-condensed text-xs uppercase tracking-[0.2em] text-white/40">
              {days.find((day) => day.id === activeDay)?.sub}
            </span>
          </div>
        </div>
      </section>

      {/* ── EVENTS GRID ──────────────────────────────────────────── */}
      {filteredEvents.length > 0 ? (
        <section className="grid grid-cols-1 divide-y divide-dark-border/60 md:grid-cols-2 md:divide-y-0 md:divide-x lg:grid-cols-3 xl:grid-cols-4">
          {filteredEvents.map((event) => (
            <article key={event.id} className="group relative overflow-hidden">
              <Link href={`/programme/${event.id}`} className="block">
                <div className="relative h-[340px] md:h-[380px] lg:h-[400px]">
                  <Image
                    src={event.image}
                    alt={event.artist}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
                  
                  {/* Genre badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 bg-${event.accent.replace('text-', '')} text-dark font-condensed text-[10px] font-bold tracking-[0.15em] uppercase`}>
                      {event.category}
                    </span>
                  </div>

                  {/* Time badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1.5 glass font-condensed text-[10px] tracking-[0.15em] uppercase text-white">
                      {event.time}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                    <p className={`font-condensed text-xs tracking-[0.2em] ${event.accent} uppercase mb-1`}>
                      {event.stage}
                    </p>
                    <h3 className="font-display text-3xl md:text-4xl uppercase leading-none text-white group-hover:text-lime transition-colors">
                      {event.artist}
                    </h3>
                    <p className="font-condensed text-xs tracking-[0.15em] text-white/50 uppercase mt-2">
                      {event.genre} · {event.origin}
                    </p>
                  </div>
                </div>
              </Link>
              <FavoriteButton
                eventId={event.id}
                className="absolute right-4 top-16 z-10"
              />
            </article>
          ))}
        </section>
      ) : (
        <section className="px-6 py-24 md:py-32 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <p className="font-condensed text-lg tracking-[0.15em] text-white/60 uppercase">
              Aucun événement
            </p>
            <p className="text-white/40 text-sm mt-2">
              Essayez d'ajuster vos filtres
            </p>
          </div>
        </section>
      )}

      {showFilters && (
        <ProgramFilters
          key={JSON.stringify(filters)}
          isOpen
          onClose={() => setShowFilters(false)}
          onApply={(nextFilters) => {
            setFilters(nextFilters);
            if (nextFilters.dates.length === 1) {
              setActiveDay(nextFilters.dates[0] as DayId);
            }
          }}
          onReset={() => setFilters({ dates: [], categories: [], genres: [] })}
          initialFilters={filters}
          resultCount={filteredEvents.length}
          dateOptions={dateOptions}
          categoryOptions={categoryOptions}
          genreOptions={genreOptions}
        />
      )}
    </>
  );
}
