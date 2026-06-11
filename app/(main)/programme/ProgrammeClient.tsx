"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import FavoriteButton from "@/components/FavoriteButton";
import ProgramFilters, { type FilterState } from "@/components/ProgramFilters";
import ProgrammeUserBar from "@/components/ProgrammeUserBar";
import type { DayId, FestivalEvent } from "@/lib/festival-events";

const days: { id: DayId; label: string; date: string; sub: string }[] = [
  { id: "VEN", label: "Vendredi", date: "24", sub: "Ouverture" },
  { id: "SAM", label: "Samedi", date: "25", sub: "Le grand froid" },
  { id: "DIM", label: "Dimanche", date: "26", sub: "Derniere lueur" },
];

const categoryLabels: Record<FestivalEvent["category"], string> = {
  concerts: "Concerts",
  conferences: "Conferences",
  activites: "Activites",
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
      <section className="border-b border-[#252525]">
        <div className="px-8 py-20 text-center md:px-12 md:py-24">
          <span className="font-condensed text-xs uppercase tracking-[0.4em] text-pink">
            24 - 26 Jan 2027
          </span>
          <h1 className="mt-3 font-display text-[clamp(56px,15vw,120px)] uppercase leading-none text-white">
            Programme
          </h1>
          <p className="mt-3 font-condensed text-sm uppercase tracking-[0.3em] text-cyan">
            Concerts, conferences, activites et stands
          </p>
        </div>
      </section>

      <ProgrammeUserBar />

      <section className="sticky top-14 z-40 border-b border-[#252525] bg-dark/95 backdrop-blur">
        <div className="grid grid-cols-3 divide-x divide-[#252525]">
          {days.map((day) => {
            const active = day.id === activeDay;
            return (
              <button
                key={day.id}
                type="button"
                onClick={() => setActiveDay(day.id)}
                className={`flex flex-col items-center gap-1 px-4 py-6 transition-colors ${
                  active ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                }`}
              >
                <span className={`font-display text-5xl ${active ? "text-lime" : "text-white/30"}`}>
                  {day.date}
                </span>
                <span className={`font-condensed text-xs uppercase tracking-[0.2em] ${active ? "text-white" : "text-white/45"}`}>
                  {day.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="border-b border-[#252525] bg-dark/95">
        <div className="flex items-center justify-between gap-4 px-8 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowFilters(true)}
              className={`border px-4 py-3 font-condensed text-xs font-bold uppercase tracking-[0.18em] transition-colors ${
                hasFilters
                  ? "border-lime text-lime"
                  : "border-white/20 text-white/70 hover:border-white/50 hover:text-white"
              }`}
            >
              Filtres
            </button>
            {hasFilters && (
              <button
                type="button"
                onClick={() => setFilters({ dates: [], categories: [], genres: [] })}
                className="font-condensed text-xs uppercase tracking-[0.15em] text-white/45 hover:text-white"
              >
                Effacer
              </button>
            )}
          </div>
          <div className="text-right font-condensed text-[10px] uppercase tracking-[0.16em] text-white/40">
            <span>{filteredEvents.length} resultat{filteredEvents.length > 1 ? "s" : ""}</span>
            <span className="ml-3 hidden border border-white/10 px-2 py-1 sm:inline">
              {source === "strapi" ? "Strapi" : "Demo"}
            </span>
          </div>
        </div>
      </section>

      <section className="border-b border-[#252525]">
        <div className="flex items-baseline justify-between px-8 py-7 md:px-10">
          <h2 className="font-display text-4xl uppercase text-white">
            {days.find((day) => day.id === activeDay)?.label}
          </h2>
          <span className="font-condensed text-xs uppercase tracking-[0.18em] text-white/40">
            {days.find((day) => day.id === activeDay)?.sub}
          </span>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 divide-y divide-[#252525] lg:grid-cols-2 lg:divide-x lg:divide-y-0 xl:grid-cols-3">
            {filteredEvents.map((event) => (
              <article key={event.id} className="group relative overflow-hidden">
                <Link href={`/programme/${event.id}`} className="block">
                  <div className="relative h-[360px] w-full lg:h-[430px]">
                    <Image
                      src={event.image}
                      alt={event.artist}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/45" />
                    <div className="absolute left-4 top-4 flex font-condensed text-[10px] font-bold uppercase tracking-[0.15em]">
                      <span className={`${event.dateBg} ${event.dateText} px-3 py-2`}>
                        {event.dateLabel}
                      </span>
                      <span className={`${event.dateBg} ${event.dateText} px-3 py-2 opacity-75`}>
                        {event.time}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 px-6 pb-7">
                      <p className={`font-condensed text-xs uppercase tracking-[0.22em] ${event.accent}`}>
                        {event.stage}
                      </p>
                      <h3 className="mt-2 font-display text-5xl uppercase leading-none text-white">
                        {event.artist}
                      </h3>
                      <p className="mt-2 font-condensed text-xs uppercase tracking-[0.14em] text-white/55">
                        {event.genre} / {event.origin}
                      </p>
                    </div>
                  </div>
                </Link>
                <FavoriteButton
                  eventId={event.id}
                  className="absolute right-4 top-4 z-10 h-10 w-10 px-0"
                />
              </article>
            ))}
          </div>
        ) : (
          <div className="px-8 py-20 text-center">
            <p className="font-condensed text-sm uppercase tracking-[0.2em] text-white/50">
              Aucun evenement pour ces filtres
            </p>
          </div>
        )}
      </section>

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
