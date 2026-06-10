import Image from "next/image";
import Link from "next/link";

/* ─── DATA ─────────────────────────────────────────────────────── */

const features = [
  { icon: "/Icon_song.svg",  iconAlt: "Musique", w: 27, h: 30,
    title: "Musique Extrême",
    description: "Techno industrielle, Metal expérimental, Noise radicale. Un mur de son contre le gel." },
  { icon: "/Icon_human.svg", iconAlt: "Liberté", w: 27, h: 30,
    title: "Liberté Totale",
    description: "L'expérience nudiste ultime en environnement hostile. Brisez les chaînes du vêtement." },
  { icon: "/Icon_cold.svg",  iconAlt: "Froid",   w: 30, h: 30,
    title: "Froid Radical",
    description: "-6°C en moyenne. Le choc thermique comme catalyseur d'adrénaline pure." },
];

const events = [
  { image: "/event_1.png",  artist: "Frontex",  genre: "Techno Industrielle", origin: "DE",
    date: "SAM 25", time: "23:00",
    dateBg: "bg-lime",  dateText: "text-dark",
    hoverBorder: "group-hover:[border-top-color:#c8ff00]",
    href: "/programme/frontex" },
  { image: "/Event_2.png", artist: "King Vibe", genre: "Experimental Noise",  origin: "NO",
    date: "DIM 26", time: "02:00",
    dateBg: "bg-pink",  dateText: "text-white",
    hoverBorder: "group-hover:[border-top-color:#ff2d9b]",
    href: "/programme/king-vibe" },
  { image: "/event_3.png", artist: "2nd-Gen",   genre: "Glitch Ambient",      origin: "FR",
    date: "VEN 24", time: "22:00",
    dateBg: "bg-cyan",  dateText: "text-dark",
    hoverBorder: "group-hover:[border-top-color:#00f5ff]",
    href: "/programme/2nd-gen" },
];

const infos = [
  { num: "01", numColor: "text-lime",
    title: "Lieu & Accès",
    body: "Forêt des Ardennes, France. Navettes depuis Charleville-Mézières toutes les heures. Parkings sécurisés." },
  { num: "02", numColor: "text-pink",
    title: "Charte Nudiste",
    body: "Nudité obligatoire sur l'ensemble du site (exceptions météo extrêmes signalées). Respect absolu, zéro photo." },
  { num: "03", numColor: "text-cyan",
    title: "Équipement",
    body: "Prévoyez des peaux de bêtes synthétiques pour les déplacements. Zones chauffées à 25°C disponibles 24/7." },
  { num: "04", numColor: "text-violet",
    title: "Sécurité",
    body: "Équipe médicale spécialisée en hypothermie. Safe zones présentes sur chaque scène." },
];

/* ─── PAGE ──────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen -mt-14 flex flex-col items-center justify-center overflow-hidden">
        <Image
          src="/necked_fest_homepage_1.jpg"
          alt="Naked Fest Winter 27 — Fatal Fields, Ardennes"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/90" />

        <div className="relative z-10 flex flex-col items-center text-center px-8 gap-3">
          {/* Date badge */}
          <span className="font-condensed text-pink text-xs tracking-[0.4em] uppercase">
            24 — 26 Jan · 2027
          </span>

          <h1 className="font-display leading-none uppercase mt-2">
            {/* NAKED FEST */}
            <span className="block text-[clamp(68px,20vw,120px)] text-white">
              Naked Fest
            </span>

            {/* WINTER 27 — triple neon layer symétrique */}
            <span className="relative block text-[clamp(42px,13vw,78px)]">
              {/* Rose — haut-gauche */}
              <span
                className="absolute inset-0 text-pink select-none"
                aria-hidden="true"
                style={{ transform: "translate(-5px, -5px)" }}
              >
                Winter 27
              </span>
              {/* Lime — bas-droite */}
              <span
                className="absolute inset-0 text-lime select-none"
                aria-hidden="true"
                style={{ transform: "translate(5px, 5px)" }}
              >
                Winter 27
              </span>
              {/* Blanc — centré entre les deux couches */}
              <span className="relative text-white">Winter 27</span>
            </span>
          </h1>

          {/* Tagline — neon cyan */}
          <p className="font-condensed text-cyan text-sm tracking-[0.3em] uppercase mt-3">
            La libération par le froid &amp; le son
          </p>

          {/* Location */}
          <span className="font-condensed text-white/40 text-[11px] tracking-[0.2em] uppercase">
            Fatal Fields · Ardennes, France
          </span>

          {/* CTA — lime solid → transparent outline on hover */}
          <Link
            href="/billetterie"
            className="mt-10 border-2 border-lime bg-lime text-dark font-condensed font-bold text-sm px-14 py-5 tracking-[0.35em] uppercase transition-all duration-300 hover:bg-[#111113] hover:[color:var(--neon-lime)]"
          >
            Billetterie
          </Link>
        </div>

        {/* Scroll arrow */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/25 animate-bounce">
          <svg width="18" height="28" viewBox="0 0 18 28" fill="none" aria-hidden="true">
            <path d="M9 2V24M9 24L2 17M9 24L16 17"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────── */}
      <section className="border-b border-[#252525] mt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#252525]">
          {features.map((f) => (
            <div
              key={f.title}
              className="group flex flex-col items-center text-center px-12 py-24 transition-colors duration-300 hover:bg-white/[0.02]"
            >
              <div className="mb-10 transition-transform duration-300 group-hover:scale-110">
                <Image src={f.icon} alt={f.iconAlt} width={f.w} height={f.h} />
              </div>
              <h2 className="font-display text-[clamp(28px,6vw,40px)] leading-none uppercase text-white">
                {f.title}
              </h2>
              <p className="mt-6 text-white/45 text-sm leading-relaxed max-w-[260px]">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────── */}
      <section className="border-b border-[#252525] mt-2">
        <div className="grid grid-cols-2 divide-x divide-y divide-[#252525]">
          <div className="flex flex-col items-center justify-center text-center px-10 py-24 md:py-28">
            <span className="font-display text-[clamp(64px,16vw,96px)] leading-none text-lime">03</span>
            <span className="font-condensed text-[10px] tracking-[0.35em] text-white/40 uppercase mt-4">Nuits Blanches</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center px-10 py-24 md:py-28">
            <span className="font-display text-[clamp(48px,13vw,80px)] leading-none text-pink">-06°C</span>
            <span className="font-condensed text-[10px] tracking-[0.35em] text-white/40 uppercase mt-4">Température Min</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center px-10 py-24 md:py-28">
            <span className="font-display text-[clamp(64px,16vw,96px)] leading-none text-cyan">48H</span>
            <span className="font-condensed text-[10px] tracking-[0.35em] text-white/40 uppercase mt-4">Set Non-Stop</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center px-10 py-24 md:py-28">
            <span className="font-display text-[clamp(64px,16vw,96px)] leading-none text-lime">∞</span>
            <span className="font-condensed text-[10px] tracking-[0.35em] text-white/40 uppercase mt-4">Chaleur Humaine</span>
          </div>
        </div>
      </section>

      {/* ── PROGRAMME / EVENTS ────────────────────────────────────── */}
      <section className="border-b border-[#252525] mt-2">
        {/* Section header */}
        <div className="flex items-center justify-between px-8 py-7 border-b border-[#252525] md:px-10">
          <h2 className="font-display text-3xl md:text-4xl text-white uppercase tracking-wide">Programme</h2>
          <Link
            href="/programme"
            className="group font-condensed text-[11px] text-lime tracking-[0.2em] uppercase flex items-center gap-2 transition-colors duration-200 hover:text-white"
          >
            Voir tout
            <svg
              width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              <path d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#252525]">
          {events.map((e) => (
            <Link
              key={e.artist}
              href={e.href}
              className={`relative block overflow-hidden group border-t-2 border-transparent transition-all duration-300 ${e.hoverBorder}`}
            >
              <div className="relative aspect-[3/4] md:aspect-auto md:h-[460px] w-full">
                <Image
                  src={e.image}
                  alt={e.artist}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay — darker on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/90 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Date + time badge */}
                <div className="absolute top-5 left-5 flex items-center gap-px font-condensed font-bold text-[10px] tracking-[0.15em] uppercase overflow-hidden">
                  <span className={`${e.dateBg} ${e.dateText} px-2.5 py-1.5`}>{e.date}</span>
                  <span className={`${e.dateBg} ${e.dateText} px-2.5 py-1.5 opacity-75`}>{e.time}</span>
                </div>

                {/* Artist info — bottom */}
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="font-display text-[clamp(30px,7vw,42px)] leading-none text-white uppercase">
                    {e.artist}
                  </p>
                  <p className="font-condensed text-[11px] tracking-[0.15em] text-white/50 uppercase mt-2">
                    {e.genre} / {e.origin}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── MAP — FATAL FIELDS ────────────────────────────────────── */}
      <section className="border-b border-[#252525] mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Text block */}
          <div className="flex flex-col justify-center px-8 py-20 md:px-12 md:py-24 border-b md:border-b-0 md:border-r border-[#252525]">
            <h2 className="font-display text-[clamp(52px,13vw,88px)] leading-none text-lime uppercase">
              Fatal Fields
            </h2>
            <p className="font-condensed text-white/45 text-xs tracking-[0.3em] uppercase mt-3 mb-6">
              Explorez le territoire du vide
            </p>
            <p className="text-white/55 text-sm leading-relaxed max-w-sm">
              Un domaine de 50 hectares dans les Ardennes transformé en zone de
              liberté radicale. 5 scènes, 3 zones thermiques, 1 sanctuaire de glace.
            </p>

            {/* CTA — outline → solid on hover */}
            <Link
              href="/carte"
              className="mt-10 self-start border border-lime text-lime font-condensed font-bold text-xs px-8 py-3.5 tracking-[0.3em] uppercase flex items-center gap-3 transition-all duration-300 hover:bg-lime hover:text-dark group"
            >
              <svg
                width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
                className="transition-colors duration-300"
              >
                <path d="M5.5 2L1 4V14L5.5 12M5.5 2L10.5 4M5.5 2V12M10.5 4L15 2V12L10.5 14M10.5 4V14M5.5 12L10.5 14"
                  stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Ouvrir la carte interactive
            </Link>
          </div>

          {/* Map image */}
          <div className="relative h-80 md:h-auto min-h-[380px] overflow-hidden">
            <Image
              src="/map_homepage.png"
              alt="Carte Fatal Fields"
              fill
              className="object-cover object-center transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-l md:from-black/30 md:to-transparent" />
          </div>
        </div>
      </section>

      {/* ── INFOS PRATIQUES ───────────────────────────────────────── */}
      <section className="border-t-2 border-pink mt-2">
        <div className="px-8 py-20 pb-28 md:px-12 md:py-24 md:pb-32">
          <h2 className="font-display text-[clamp(40px,10vw,68px)] leading-none text-white uppercase mb-12">
            Infos Pratiques
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
            {infos.map((info) => (
              <div key={info.num} className="flex gap-6">
                {/* Number */}
                <span className={`font-display text-3xl leading-none pt-0.5 min-w-[2.5rem] ${info.numColor}`}>
                  {info.num}
                </span>
                {/* Content */}
                <div>
                  <h3 className="font-condensed font-bold text-sm tracking-[0.2em] text-white uppercase mb-3">
                    {info.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {info.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
