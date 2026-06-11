import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";

/* ─── DATA ─────────────────────────────────────────────────────── */

const features = [
  { icon: "/Icon_song.svg",  iconAlt: "Musique", w: 32, h: 32,
    title: "Musique Extrême",
    description: "Techno industrielle, Metal expérimental, Noise radicale. Un mur de son contre le gel.",
    color: "lime" },
  { icon: "/Icon_human.svg", iconAlt: "Liberté", w: 32, h: 32,
    title: "Liberté Totale",
    description: "L'expérience nudiste ultime en environnement hostile. Brisez les chaînes du vêtement.",
    color: "pink" },
  { icon: "/Icon_cold.svg",  iconAlt: "Froid",   w: 32, h: 32,
    title: "Froid Radical",
    description: "-6°C en moyenne. Le choc thermique comme catalyseur d'adrénaline pure.",
    color: "cyan" },
];

const events = [
  { image: "/event_1.png",  artist: "Frontex",  genre: "Techno Industrielle", origin: "DE",
    date: "SAM 25", time: "23:00", day: "Samedi",
    color: "lime",
    href: "/programme/frontex" },
  { image: "/Event_2.png", artist: "King Vibe", genre: "Experimental Noise",  origin: "NO",
    date: "DIM 26", time: "02:00", day: "Dimanche",
    color: "pink",
    href: "/programme/king-vibe" },
  { image: "/event_3.png", artist: "2nd-Gen",   genre: "Glitch Ambient",      origin: "FR",
    date: "VEN 24", time: "22:00", day: "Vendredi",
    color: "cyan",
    href: "/programme/2nd-gen" },
];

const infos = [
  { num: "01", color: "lime",
    title: "Lieu & Accès",
    body: "Forêt des Ardennes, France. Navettes depuis Charleville-Mézières toutes les heures. Parkings sécurisés." },
  { num: "02", color: "pink",
    title: "Charte Nudiste",
    body: "Nudité obligatoire sur l'ensemble du site (exceptions météo extrêmes signalées). Respect absolu, zéro photo." },
  { num: "03", color: "cyan",
    title: "Équipement",
    body: "Prévoyez des peaux de bêtes synthétiques pour les déplacements. Zones chauffées à 25°C disponibles 24/7." },
  { num: "04", color: "violet",
    title: "Sécurité",
    body: "Équipe médicale spécialisée en hypothermie. Safe zones présentes sur chaque scène." },
];

/* ─── PAGE ──────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen -mt-14 lg:-mt-16 flex flex-col items-center justify-center overflow-hidden">
        <Image
          src="/necked_fest_homepage_1.jpg"
          alt="Naked Fest Winter 27 — Fatal Fields, Ardennes"
          fill
          className="object-cover object-center scale-105 animate-hero-zoom"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/95" />

        <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-8 gap-4">
          {/* Date badge glass */}
          <div className="glass px-5 py-2 rounded-full">
            <span className="font-condensed text-pink text-xs tracking-[0.4em] uppercase">
              24 — 26 Jan · 2027
            </span>
          </div>

          {/* Main title avec glow */}
          <h1 className="font-display leading-none uppercase mt-4">
            <span className="block text-[clamp(60px,18vw,140px)] text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              Naked Fest
            </span>
            <span className="relative block text-[clamp(36px,11vw,80px)] mt-2 font-display uppercase leading-none">
              <span
                className="absolute inset-0 text-pink select-none"
                aria-hidden="true"
                style={{ transform: "translate(-4px, -4px)" }}
              >
                Winter 27
              </span>
              <span
                className="absolute inset-0 text-lime select-none"
                aria-hidden="true"
                style={{ transform: "translate(4px, 4px)" }}
              >
                Winter 27
              </span>
              <span className="relative text-white">Winter 27</span>
            </span>
          </h1>

          {/* Tagline */}
          <p className="font-condensed text-cyan text-sm md:text-base tracking-[0.3em] uppercase mt-2">
            La libération par le froid &amp; le son
          </p>

          {/* Location */}
          <span className="font-condensed text-white/50 text-xs tracking-[0.2em] uppercase">
            Fatal Fields · Ardennes, France
          </span>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button as="link" href="/programme" color="lime" variant="solid-dark" size="lg" className="gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Programme
            </Button>
            <Button as="link" href="/carte" color="white" variant="outline" size="lg" className="gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                <line x1="9" y1="3" x2="9" y2="18" />
                <line x1="15" y1="6" x2="15" y2="21" />
              </svg>
              Carte
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <span className="font-condensed text-[10px] tracking-[0.2em] uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────── */}
      <section className="px-6 py-20 md:px-12 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="group glass border border-white/5 rounded-2xl p-8 hover:border-lime/20 transition-all duration-300 hover-lift"
              >
                <div className={`w-14 h-14 rounded-xl bg-${f.color}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Image src={f.icon} alt={f.iconAlt} width={f.w} height={f.h} className={`text-${f.color}`} />
                </div>
                <h2 className="font-display text-3xl lg:text-4xl leading-none uppercase text-white mb-4">
                  {f.title}
                </h2>
                <p className="text-white/50 text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────── */}
      <section className="border-y border-dark-border/60">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-dark-border/60">
          {[
            { value: "03", label: "Nuits Blanches", color: "lime" },
            { value: "-06°C", label: "Température Min", color: "pink" },
            { value: "48H", label: "Set Non-Stop", color: "cyan" },
            { value: "∞", label: "Chaleur Humaine", color: "violet" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center justify-center text-center px-6 py-16 md:py-20 hover:bg-white/[0.02] transition-colors">
              <span className={`font-display text-[clamp(48px,10vw,72px)] leading-none text-${stat.color}`}>
                {stat.value}
              </span>
              <span className="font-condensed text-xs tracking-[0.3em] text-white/40 uppercase mt-3">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROGRAMME PREVIEW ────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        {/* Header */}
        <div className="px-6 md:px-12 mb-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-condensed text-xs tracking-[0.3em] text-pink uppercase">À ne pas manquer</span>
              <h2 className="font-display text-5xl md:text-6xl lg:text-7xl uppercase text-white mt-2">Programme</h2>
            </div>
            <Link
              href="/programme"
              className="group font-condensed text-xs tracking-[0.2em] text-lime uppercase flex items-center gap-2 hover:text-white transition-colors"
            >
              Voir tout le programme
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform group-hover:translate-x-1">
                <path d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Event cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-dark-border/60">
          {events.map((e) => (
            <Link
              key={e.artist}
              href={e.href}
              className="group relative block overflow-hidden"
            >
              <div className="relative aspect-[4/5] md:aspect-[3/4] w-full">
                <Image
                  src={e.image}
                  alt={e.artist}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                {/* Color accent line top */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-${e.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />

                {/* Day badge */}
                <div className="absolute top-4 left-4">
                  <span className={`inline-block px-3 py-1.5 bg-${e.color} text-dark font-condensed text-[10px] font-bold tracking-[0.15em] uppercase`}>
                    {e.date}
                  </span>
                </div>

                {/* Time badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1.5 glass font-condensed text-[10px] tracking-[0.15em] uppercase text-white">
                    {e.time}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <p className="font-condensed text-xs tracking-[0.2em] text-white/50 uppercase mb-2">
                    {e.genre} · {e.origin}
                  </p>
                  <h3 className="font-display text-4xl md:text-5xl lg:text-6xl uppercase leading-none text-white group-hover:text-lime transition-colors">
                    {e.artist}
                  </h3>
                  <p className="font-condensed text-xs tracking-[0.15em] text-white/40 uppercase mt-3">
                    {e.day} {e.time}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── MAP SECTION ─────────────────────────────────────────────── */}
      <section className="border-y border-dark-border/60">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Content */}
          <div className="flex flex-col justify-center px-6 py-16 md:px-12 md:py-24 lg:py-32 order-2 lg:order-1">
            <div className="max-w-lg">
              <span className="font-condensed text-xs tracking-[0.3em] text-lime uppercase">Localisation</span>
              <h2 className="font-display text-6xl md:text-7xl lg:text-8xl uppercase text-white mt-3 mb-4">
                Fatal Fields
              </h2>
              <p className="font-condensed text-sm tracking-[0.2em] text-white/40 uppercase mb-6">
                Explorez le territoire du vide
              </p>
              <p className="text-white/50 text-base leading-relaxed mb-8">
                Un domaine de 50 hectares dans les Ardennes transformé en zone de
                liberté radicale. 5 scènes, 2 bars thermiques, 1 sanctuaire de glace, 1 station ski, 1 igloo VIP.
              </p>
              <Button as="link" href="/carte" color="lime" variant="outline-inverse" size="md" className="gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                  <line x1="9" y1="3" x2="9" y2="18" />
                  <line x1="15" y1="6" x2="15" y2="21" />
                </svg>
                Ouvrir la carte
              </Button>
            </div>
          </div>

          {/* Map image */}
          <div className="relative h-80 lg:h-auto min-h-[400px] order-1 lg:order-2 overflow-hidden">
            <Image
              src="/map_homepage.png"
              alt="Carte Fatal Fields"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent lg:bg-gradient-to-r lg:from-black/50 lg:to-transparent" />
          </div>
        </div>
      </section>

      {/* ── INFOS PRATIQUES ───────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 md:mb-16">
            <span className="font-condensed text-xs tracking-[0.3em] text-pink uppercase">Guide</span>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl uppercase text-white mt-2">
              Infos Pratiques
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {infos.map((info) => (
              <div 
                key={info.num} 
                className="group glass border border-white/5 rounded-xl p-6 md:p-8 hover:border-lime/10 transition-all duration-300"
              >
                <div className="flex gap-5">
                  <span className={`font-display text-4xl leading-none text-${info.color} opacity-80`}>
                    {info.num}
                  </span>
                  <div>
                    <h3 className="font-condensed font-bold text-sm tracking-[0.15em] text-white uppercase mb-3">
                      {info.title}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed">
                      {info.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
