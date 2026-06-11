"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Button from "@/components/Button";
import FavoriteButton from "@/components/FavoriteButton";
import type { FestivalEvent } from "@/lib/festival-events";
import { FAVORITES_CHANGED_EVENT, getFavoriteIds } from "@/lib/favorites";

export default function FavoritesClient({ events }: { events: FestivalEvent[] }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [category, setCategory] = useState("all");
  const [day, setDay] = useState("all");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const sync = () => setFavoriteIds(getFavoriteIds());
    sync();
    window.addEventListener(FAVORITES_CHANGED_EVENT, sync);

    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((session: { user?: unknown }) => setAuthenticated(Boolean(session.user)))
      .catch(() => setAuthenticated(false));

    return () => window.removeEventListener(FAVORITES_CHANGED_EVENT, sync);
  }, []);

  const favorites = useMemo(
    () =>
      events
        .filter((event) => favoriteIds.includes(event.id))
        .filter((event) => category === "all" || event.category === category)
        .filter((event) => day === "all" || event.day === day)
        .sort((a, b) =>
          sort === "asc"
            ? a.startsAt.localeCompare(b.startsAt)
            : b.startsAt.localeCompare(a.startsAt),
        ),
    [category, day, events, favoriteIds, sort],
  );

  if (authenticated === false) {
    return (
      <section className="px-8 py-24 text-center">
        <h1 className="font-display text-6xl uppercase text-white">Connexion requise</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/50">
          Connectez-vous ou creez un compte pour enregistrer des favoris sur cet appareil.
        </p>
        <Button as="link" href="/login" color="lime" variant="filled" size="md" className="mt-8">
          Se connecter
        </Button>
      </section>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="border-b border-dark-border/60">
        <div className="px-6 py-16 md:px-12 md:py-20 lg:py-24 text-center">
          <span className="font-condensed text-xs uppercase tracking-[0.35em] text-pink">
            Votre selection
          </span>
          <h1 className="mt-3 font-display text-[clamp(48px,10vw,100px)] uppercase leading-none text-white">
            Mes favoris
          </h1>
        </div>
      </section>

      {/* Filtres */}
      <section className="border-b border-dark-border/60 px-6 py-5 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
            <Select value={day} onChange={setDay} label="Date">
              <option value="all">Toutes les dates</option>
              <option value="VEN">Vendredi 24</option>
              <option value="SAM">Samedi 25</option>
              <option value="DIM">Dimanche 26</option>
            </Select>
            <Select value={category} onChange={setCategory} label="Categorie">
              <option value="all">Toutes les categories</option>
              <option value="concerts">Concerts</option>
              <option value="conferences">Conferences</option>
              <option value="activites">Activites</option>
              <option value="stands">Stands</option>
            </Select>
            <Select value={sort} onChange={(value) => setSort(value as "asc" | "desc")} label="Tri">
              <option value="asc">Plus proche en premier</option>
              <option value="desc">Plus tard en premier</option>
            </Select>
            <div className="hidden lg:flex items-end">
              <p className="font-condensed text-xs uppercase tracking-[0.15em] text-white/40 pb-3">
                {favorites.length} favori{favorites.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu */}
      {favorites.length > 0 ? (
        <section className="grid grid-cols-1 divide-y divide-dark-border md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-3 xl:grid-cols-4">
          {favorites.map((event) => (
            <article key={event.id} className="group relative overflow-hidden">
              <Link href={`/programme/${event.id}`} className="block">
                <div className="relative h-[340px] md:h-[400px] lg:h-[380px]">
                  <Image
                    src={event.image}
                    alt={event.artist}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-black/40" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                    <span className={`font-condensed text-xs uppercase tracking-[0.2em] ${event.accent}`}>
                      {event.dateLabel} / {event.time}
                    </span>
                    <h2 className="mt-2 font-display text-4xl md:text-5xl uppercase text-white">{event.artist}</h2>
                    <p className="mt-1 text-sm text-white/50">{event.stage}</p>
                  </div>
                </div>
              </Link>
              <FavoriteButton eventId={event.id} className="absolute right-4 top-4 h-10 w-10 px-0" />
            </article>
          ))}
        </section>
      ) : (
        <section className="px-6 py-24 md:py-32 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 1 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z" />
              </svg>
            </div>
            <h2 className="font-display text-4xl md:text-5xl uppercase text-white">Aucun favori</h2>
            <p className="mt-4 text-sm leading-6 text-white/50">
              Ajoutez des evenements depuis le programme ou leur fiche. Vos choix resteront
              enregistres sur cet appareil.
            </p>
            <Link
              href="/programme"
              className="mt-8 inline-flex border-2 border-lime bg-lime px-8 py-4 font-condensed text-xs font-bold uppercase tracking-[0.2em] text-dark transition-all hover:bg-transparent hover:text-lime"
            >
              Voir le programme
            </Link>
          </div>
        </section>
      )}
    </>
  );
}

function Select({
  value,
  onChange,
  label,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="font-condensed text-xs uppercase tracking-[0.16em] text-white/45">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full border border-white/20 bg-[#111113] px-3 text-sm text-white outline-none focus:border-lime"
      >
        {children}
      </select>
    </label>
  );
}
