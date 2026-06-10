"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ProgrammeUserBar from "@/components/ProgrammeUserBar";

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
    },
    {
      image: "/event_1.png", artist: "Névé", genre: "Techno Hypnotique", origin: "BE",
      stage: "Scène Glacier", time: "23:30",
      dateBg: "bg-violet", dateText: "text-white", accent: "text-violet",
      hoverBorder: "group-hover:[border-top-color:#bf5fff]",
    },
    {
      image: "/Event_2.png", artist: "Whiteout", genre: "Drone / Noise", origin: "IS",
      stage: "Zone Cryo", time: "01:00",
      dateBg: "bg-pink", dateText: "text-white", accent: "text-pink",
      hoverBorder: "group-hover:[border-top-color:#ff2d9b]",
    },
  ],
  SAM: [
    {
      image: "/event_1.png", artist: "Frontex", genre: "Techno Industrielle", origin: "DE",
      stage: "Scène Glacier", time: "23:00",
      dateBg: "bg-lime", dateText: "text-dark", accent: "text-lime",
      hoverBorder: "group-hover:[border-top-color:#c8ff00]",
    },
    {
      image: "/event_3.png", artist: "Permafrost", genre: "EBM / Power", origin: "SE",
      stage: "Zone Cryo", time: "00:30",
      dateBg: "bg-cyan", dateText: "text-dark", accent: "text-cyan",
      hoverBorder: "group-hover:[border-top-color:#00f5ff]",
    },
    {
      image: "/Event_2.png", artist: "Blizzard", genre: "Metal Expérimental", origin: "FI",
      stage: "Scène Glacier", time: "02:00",
      dateBg: "bg-lime", dateText: "text-dark", accent: "text-lime",
      hoverBorder: "group-hover:[border-top-color:#c8ff00]",
    },
  ],
  DIM: [
    {
      image: "/Event_2.png", artist: "King Vibe", genre: "Experimental Noise", origin: "NO",
      stage: "Sanctuaire de Glace", time: "02:00",
      dateBg: "bg-pink", dateText: "text-white", accent: "text-pink",
      hoverBorder: "group-hover:[border-top-color:#ff2d9b]",
    },
    {
      image: "/event_1.png", artist: "Aurora", genre: "Ambient Cosmique", origin: "NO",
      stage: "Sanctuaire de Glace", time: "04:00",
      dateBg: "bg-violet", dateText: "text-white", accent: "text-violet",
      hoverBorder: "group-hover:[border-top-color:#bf5fff]",
    },
    {
      image: "/event_3.png", artist: "Dégel", genre: "Live Techno", origin: "FR",
      stage: "Scène Glacier", time: "06:00",
      dateBg: "bg-lime", dateText: "text-dark", accent: "text-lime",
      hoverBorder: "group-hover:[border-top-color:#c8ff00]",
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
  const slots = lineup[activeDay];

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

      {/* ── DAY INTRO ─────────────────────────────────────────────── */}
      <section className="border-b border-[#252525]">
        <div className="flex items-baseline justify-between px-8 py-7 md:px-10">
          <h2 className="font-display text-3xl md:text-4xl text-white uppercase tracking-wide">
            {days.find((d) => d.id === activeDay)?.label}
          </h2>
          <span className="font-condensed text-[11px] text-white/40 tracking-[0.2em] uppercase">
            {days.find((d) => d.id === activeDay)?.sub} · {slots.length} sets
          </span>
        </div>

        {/* ── CARDS ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#252525]">
          {slots.map((e) => (
            <div
              key={`${e.artist}-${e.time}`}
              className={`relative block overflow-hidden group border-t-2 border-transparent transition-all duration-300 ${e.hoverBorder}`}
            >
              <div className="relative aspect-[3/4] md:aspect-auto md:h-[460px] w-full">
                <Image
                  src={e.image}
                  alt={e.artist}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/90 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Time + stage badge */}
                <div className="absolute top-5 left-5 flex items-center gap-px font-condensed font-bold text-[10px] tracking-[0.15em] uppercase overflow-hidden">
                  <span className={`${e.dateBg} ${e.dateText} px-2.5 py-1.5`}>{e.time}</span>
                  <span className={`${e.dateBg} ${e.dateText} px-2.5 py-1.5 opacity-75`}>
                    {activeDay} {days.find((d) => d.id === activeDay)?.date}
                  </span>
                </div>

                {/* Artist info — bottom */}
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <p className={`font-condensed text-[10px] tracking-[0.25em] uppercase mb-2 ${e.accent}`}>
                    {e.stage}
                  </p>
                  <p className="font-display text-[clamp(30px,7vw,42px)] leading-none text-white uppercase">
                    {e.artist}
                  </p>
                  <p className="font-condensed text-[11px] tracking-[0.15em] text-white/50 uppercase mt-2">
                    {e.genre} / {e.origin}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
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
    </>
  );
}
