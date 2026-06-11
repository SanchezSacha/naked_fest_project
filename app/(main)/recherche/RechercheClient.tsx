"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useMemo } from "react";
import type { FestivalEvent } from "@/lib/festival-events";
import FavoriteButton from "@/components/FavoriteButton";

const categoryColors: Record<FestivalEvent["category"], string> = {
  concerts: "text-cyan",
  conferences: "text-lime",
  activites: "text-violet",
  stands: "text-pink",
};

const categoryLabels: Record<FestivalEvent["category"], string> = {
  concerts: "Concert",
  conferences: "Conf.",
  activites: "Activite",
  stands: "Stand",
};

function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function RechercheClient({
  initialEvents,
}: {
  initialEvents: FestivalEvent[];
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return [];

    return initialEvents.filter((event) => {
      return (
        normalize(event.title).includes(q) ||
        normalize(event.artist).includes(q) ||
        normalize(event.category).includes(q) ||
        normalize(event.genre).includes(q) ||
        normalize(event.dateLabel).includes(q) ||
        event.speakers.some((s) => normalize(s).includes(q))
      );
    });
  }, [query, initialEvents]);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="min-h-screen">
      {/* Zone de recherche */}
      <section className="border-b border-[#252525] px-8 pb-10 pt-14 md:px-12 md:pt-16">
        <span className="font-condensed text-xs uppercase tracking-[0.4em] text-pink">
          Festival N&apos;FEST — Jan 2027
        </span>
        <h1 className="mt-3 font-display text-[clamp(48px,12vw,100px)] uppercase leading-none text-white">
          Recherche
        </h1>

        <div className="relative mt-8">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
            <Image
              src="/Icon_search.svg"
              alt=""
              width={18}
              height={18}
              className="opacity-40"
            />
          </div>
          <input
            ref={inputRef}
            type="search"
            autoFocus
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Artiste, genre, categorie, date…"
            className="h-16 w-full border border-white/20 bg-[#111113] pl-14 pr-5 font-condensed text-lg uppercase tracking-[0.1em] text-white placeholder:text-white/30 outline-none focus:border-lime transition-colors duration-200"
          />
          {hasQuery && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="absolute inset-y-0 right-0 flex items-center px-5 font-condensed text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
            >
              Effacer
            </button>
          )}
        </div>

        {hasQuery && (
          <p className="mt-4 font-condensed text-xs uppercase tracking-[0.2em] text-white/40">
            {results.length} resultat{results.length > 1 ? "s" : ""} pour &laquo;&nbsp;{query}&nbsp;&raquo;
          </p>
        )}
      </section>

      {/* Resultats */}
      {hasQuery && results.length > 0 && (
        <section className="border-b border-[#252525]">
          <div className="grid grid-cols-1 divide-y divide-[#252525] lg:grid-cols-2 lg:divide-x lg:divide-y-0 xl:grid-cols-3">
            {results.map((event) => (
              <article key={event.id} className="group relative overflow-hidden">
                <Link href={`/programme/${event.id}?from=recherche`} className="block">
                  <div className="relative h-[320px] w-full lg:h-[380px]">
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
                    <div className="absolute left-4 top-4 right-4 flex justify-end">
                      <span className={`font-condensed text-[10px] font-bold uppercase tracking-[0.15em] ${categoryColors[event.category]}`}>
                        {categoryLabels[event.category]}
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
                  className="absolute right-4 bottom-4 z-10 h-10 w-10 px-0"
                />
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Etat vide — aucun resultat */}
      {hasQuery && results.length === 0 && (
        <section className="px-8 py-24 text-center">
          <p className="font-display text-4xl uppercase text-white/20">Aucun resultat</p>
          <p className="mt-3 font-condensed text-sm uppercase tracking-[0.2em] text-white/35">
            Essaie un autre mot-cle
          </p>
        </section>
      )}

      {/* Etat initial — invite */}
      {!hasQuery && (
        <section className="px-8 py-24 text-center">
          <p className="font-condensed text-sm uppercase tracking-[0.25em] text-white/30">
            Tape un artiste, un genre, une categorie ou une date
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {["Concerts", "Techno", "VEN 24", "SAM 25", "Ambient", "Conferences"].map((hint) => (
              <button
                key={hint}
                type="button"
                onClick={() => setQuery(hint)}
                className="border border-white/15 px-4 py-2 font-condensed text-xs uppercase tracking-[0.18em] text-white/50 transition-colors hover:border-white/40 hover:text-white"
              >
                {hint}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
