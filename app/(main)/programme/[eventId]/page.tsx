import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { events } from "@/lib/events";
import BellButton from "@/components/BellButton";

/* ─── FEATURES (fixed icons for all events) ──────────────────────── */

const features = [
  { icon: "/Icon_cold.svg",    w: 30, h: 30, label: "Zone Extérieure",},
  { icon: "/Icon_storm.svg",   w: 16, h: 27, label: "Aiguilles Sonores",},
  { icon: "/Icon_drink.svg",   w: 24, h: 24, label: "Bar à Glace Froide",},
  { icon: "/Icon_warning.svg", w: 30, h: 26, label: "Show Pyrotechnique",},
];

/* ─── STAR RATING ─────────────────────────────────────────────────── */

function StarRating({ count, max = 5, size = 14 }: { count: number; max?: number; size?: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`${count} étoiles sur ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 14 14"
          fill={i < count ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <path d="M7 1L8.8 5.2L13.4 5.6L10.1 8.4L11.1 13L7 10.6L2.9 13L3.9 8.4L0.6 5.6L5.2 5.2L7 1Z" />
        </svg>
      ))}
    </div>
  );
}

/* ─── PAGE ──────────────────────────────────────────────────────── */

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = events[eventId];

  if (!event) notFound();

  return (
    <>
      {/* ── HERO HEADER ────────────────────────────────────────────── */}
      <section className="border-b border-[#252525]">
        <div className="px-8 pt-14 pb-10 md:px-12 md:pt-16">

          {/* Back link + Bell */}
          <div className="flex items-center justify-between mb-10">
            <Link
              href="/programme"
              className="inline-flex items-center gap-2 font-condensed text-[11px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors duration-200"
            >
              <svg width="20" height="20" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M12 7H2M2 7L6.5 2.5M2 7L6.5 11.5"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <BellButton eventId={event.id} accentClass={event.accentClass} />
          </div>

          {/* Category + date */}
          <div className="flex items-center gap-3 mb-6">
            <span className={`${event.accentBgClass} ${event.accentTextClass} font-condensed font-bold text-[10px] tracking-[0.3em] uppercase px-3 py-1.5`}>
              {event.category}
            </span>
            <span className="font-condensed text-[11px] tracking-[0.25em] text-white/40 uppercase">
              {event.date} · {event.time}
            </span>
          </div>

          {/* Artist name — triple neon layer (same effect as 404) */}
          <h1 className="relative font-display leading-none uppercase text-[clamp(64px,18vw,130px)] mb-8">
            {/* Layer A — top-left */}
            <span
              className={`absolute inset-0 ${event.layerA} select-none`}
              aria-hidden="true"
              style={{ transform: "translate(-5px, -5px)" }}
            >
              {event.artist}
            </span>
            {/* Layer B — bottom-right */}
            <span
              className={`absolute inset-0 ${event.layerB} select-none`}
              aria-hidden="true"
              style={{ transform: "translate(5px, 5px)" }}
            >
              {event.artist}
            </span>
            {/* White — centered */}
            <span className="relative text-white">{event.artist}</span>
          </h1>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-[#252525]">
            {/* Time + stage */}
            <div className="flex flex-col gap-0.5">
              <span className="font-condensed text-[10px] tracking-[0.3em] text-white/30 uppercase">Heure · Scène</span>
              <span className="font-condensed font-bold text-sm tracking-[0.15em] uppercase text-lime">
                {event.time} — {event.stage}
              </span>
            </div>

            <div className="w-px h-8 bg-[#252525]" />

            {/* Duration */}
            <div className="flex flex-col gap-0.5">
              <span className="font-condensed text-[10px] tracking-[0.3em] text-white/30 uppercase">Durée</span>
              <span className="font-condensed font-bold text-sm tracking-[0.15em] uppercase text-cyan">
                {event.duration}
              </span>
            </div>

            <div className="w-px h-8 bg-[#252525]" />

            {/* Genre */}
            <div className="flex flex-col gap-0.5">
              <span className="font-condensed text-[10px] tracking-[0.3em] text-white/30 uppercase">Genre</span>
              <span className="font-condensed font-bold text-sm tracking-[0.15em] uppercase text-white">
                {event.genre}
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ── FULL-WIDTH PHOTO ────────────────────────────────────────── */}
      <div className="relative w-full h-[55vw] min-h-[280px] max-h-[620px] overflow-hidden">
        <Image
          src={event.image}
          alt={event.artist}
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />
        {/* Origin watermark */}
        <div className="absolute bottom-6 right-6">
          <span className="font-display text-[clamp(48px,10vw,80px)] leading-none opacity-15 text-white">
            {event.origin}
          </span>
        </div>
        {/* Rating — bottom-left on photo */}
        <div className="absolute bottom-6 left-6 text-pink">
          <StarRating count={event.rating} size={22} />
        </div>
      </div>

      {/* ── DESCRIPTION ─────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#201F22" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

          {/* Left — section title */}
          <div className="px-8 py-5 md:px-12 md:py-16 flex flex-col justify-center ">
            <span className="font-condensed text-[10px] tracking-[0.4em] uppercase mb-4 text-pink">
              À Propos
            </span>
            <h2 className="font-display text-[clamp(36px,8vw,64px)] leading-none uppercase text-white">
              Performance<br />Extrême
            </h2>
          </div>

          {/* Right — body text + CTA */}
          <div className="px-8 py-5 md:px-12 md:py-16 flex flex-col justify-center gap-8">
            <p className="text-white/60 text-sm leading-relaxed">
              {event.description}
            </p>

            {/* Calendar CTA — always lime */}
            <button
              type="button"
              className="self-start bg-lime text-dark font-condensed font-bold text-xs px-10 py-4 tracking-[0.3em] uppercase flex items-center gap-3 transition-all duration-300 hover:opacity-80"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="1" y="2.5" width="14" height="13" rx="1" stroke="currentColor" strokeWidth="1.3" />
                <path d="M1 6.5H15" stroke="currentColor" strokeWidth="1.3" />
                <path d="M5 1V4M11 1V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <path d="M4.5 10H7.5M8.5 10H11.5M4.5 12.5H7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              Ajouter au Calendrier
            </button>
          </div>
        </div>
      </section>

      {/* ── TECHNICAL STATS ─────────────────────────────────────────── */}
      <section className=" my-10  border-2 border-[#3a3a3a]" style={{ backgroundColor: "#201F22" }}>
        <div className="grid grid-cols-2 ">
          <div className="flex flex-col items-center justify-center text-center px-6 py-8 md:py-10">
            <span className="font-display text-[clamp(44px,10vw,72px)] leading-none text-lime">
              {event.temperature}
            </span>
            <span className="font-condensed text-[10px] tracking-[0.35em] text-white/40 uppercase mt-2">
              Température Prévue
            </span>
          </div>
          <div className="flex flex-col items-center justify-center text-center px-6 py-8 md:py-10">
            <span className="font-display text-[clamp(44px,10vw,72px)] leading-none text-pink">
              {event.db}
            </span>
            <span className="font-condensed text-[10px] tracking-[0.35em] text-white/40 uppercase mt-2">
              Niveau Sonore
            </span>
          </div>
        </div>
      </section>

      {/* ── SEPARATOR ───────────────────────────────────────────────── */}
      <div className="flex justify-center py-6">
        <Image src="/separator.svg" alt="" width={350} height={17} aria-hidden="true" />
      </div>

      {/* ── FEATURES GRID ───────────────────────────────────────────── */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 ">
          {features.map((feat) => (
            <div
              key={feat.label}
              className="group flex flex-col items-center justify-center text-center px-8 py-12 gap-5 transition-colors duration-300 hover:bg-white/[0.02]"
            >
              <div className="transition-transform duration-300 group-hover:scale-110">
                <Image
                  src={feat.icon}
                  alt={feat.label}
                  width={feat.w}
                  height={feat.h}
                />
              </div>
              <span className={`font-condensed text-[10px] tracking-[0.3em] uppercase leading-relaxed text-white/40`}>
                {feat.label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
