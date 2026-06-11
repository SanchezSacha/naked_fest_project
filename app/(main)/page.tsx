import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import { fetchStrapiHomePage } from "@/lib/strapi";

const textColors = {
  lime: "text-lime",
  pink: "text-pink",
  cyan: "text-cyan",
  violet: "text-violet",
};

export default async function HomePage() {
  const home = await fetchStrapiHomePage();

  return (
    <>
      <section className="relative -mt-14 flex min-h-screen flex-col items-center justify-center overflow-hidden lg:-mt-16">
        <Image
          src={home.heroImage}
          alt={`${home.title} ${home.edition}`}
          fill
          className="animate-hero-zoom scale-105 object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/95" />

        <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center md:px-8">
          <div className="glass rounded-full px-5 py-2">
            <span className="font-condensed text-xs uppercase tracking-[0.4em] text-pink">
              {home.heroEyebrow}
            </span>
          </div>
          <h1 className="mt-4 font-display uppercase leading-none">
            <span className="block text-[clamp(60px,18vw,140px)] text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              {home.title}
            </span>
            <span className="relative mt-2 block text-[clamp(36px,11vw,80px)] font-display uppercase leading-none">
              <span
                className="absolute inset-0 select-none text-pink"
                aria-hidden="true"
                style={{ transform: "translate(-4px, -4px)" }}
              >
                {home.edition}
              </span>
              <span
                className="absolute inset-0 select-none text-lime"
                aria-hidden="true"
                style={{ transform: "translate(4px, 4px)" }}
              >
                {home.edition}
              </span>
              <span className="relative text-white">{home.edition}</span>
            </span>
          </h1>
          <p className="mt-2 font-condensed text-sm uppercase tracking-[0.3em] text-cyan md:text-base">
            {home.tagline}
          </p>
          <span className="font-condensed text-xs uppercase tracking-[0.2em] text-white/50">
            {home.locationLabel}
          </span>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button as="link" href="/programme" color="lime" variant="solid-dark" size="lg">
              Programme
            </Button>
            <Button as="link" href="/carte" color="white" variant="outline" size="lg">
              Carte
            </Button>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {home.features.map((feature) => (
              <div
                key={feature.title}
                className="glass hover-lift group rounded-2xl border border-white/5 p-8 transition-all duration-300 hover:border-lime/20"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-lime/10 transition-transform group-hover:scale-110">
                  <Image src={feature.icon} alt={feature.iconAlt} width={32} height={32} />
                </div>
                <h2 className="mb-4 font-display text-3xl uppercase leading-none text-white lg:text-4xl">
                  {feature.title}
                </h2>
                <p className="text-sm leading-relaxed text-white/50">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-dark-border/60">
        <div className="grid grid-cols-2 divide-x divide-dark-border/60 lg:grid-cols-4">
          {home.stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center px-6 py-16 text-center transition-colors hover:bg-white/[0.02] md:py-20"
            >
              <span className={`font-display text-[clamp(48px,10vw,72px)] leading-none ${textColors[stat.color]}`}>
                {stat.value}
              </span>
              <span className="mt-3 font-condensed text-xs uppercase tracking-[0.3em] text-white/40">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mb-12 px-6 md:px-12">
          <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="font-condensed text-xs uppercase tracking-[0.3em] text-pink">
                A ne pas manquer
              </span>
              <h2 className="mt-2 font-display text-5xl uppercase text-white md:text-6xl lg:text-7xl">
                Programme
              </h2>
            </div>
            <Link
              href="/programme"
              className="font-condensed text-xs uppercase tracking-[0.2em] text-lime transition-colors hover:text-white"
            >
              Voir tout le programme
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 divide-y divide-dark-border/60 md:grid-cols-3 md:divide-x md:divide-y-0">
          {home.featuredEvents.map((event) => (
            <Link
              key={event.id}
              href={`/programme/${event.id}`}
              className="group relative block overflow-hidden"
            >
              <div className="relative aspect-[4/5] w-full md:aspect-[3/4]">
                <Image
                  src={event.image}
                  alt={event.artist}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
                <div className="absolute left-4 top-4">
                  <span className={`${event.dateBg} ${event.dateText} inline-block px-3 py-1.5 font-condensed text-[10px] font-bold uppercase tracking-[0.15em]`}>
                    {event.dateLabel}
                  </span>
                </div>
                <div className="absolute right-4 top-4">
                  <span className="glass px-3 py-1.5 font-condensed text-[10px] uppercase tracking-[0.15em] text-white">
                    {event.time}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <p className="mb-2 font-condensed text-xs uppercase tracking-[0.2em] text-white/50">
                    {event.genre} / {event.origin}
                  </p>
                  <h3 className="font-display text-4xl uppercase leading-none text-white transition-colors group-hover:text-lime md:text-5xl lg:text-6xl">
                    {event.artist}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-dark-border/60">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="order-2 flex flex-col justify-center px-6 py-16 md:px-12 md:py-24 lg:order-1 lg:py-32">
            <div className="max-w-lg">
              <span className="font-condensed text-xs uppercase tracking-[0.3em] text-lime">
                Localisation
              </span>
              <h2 className="mb-4 mt-3 font-display text-6xl uppercase text-white md:text-7xl lg:text-8xl">
                {home.mapTitle}
              </h2>
              <p className="mb-6 font-condensed text-sm uppercase tracking-[0.2em] text-white/40">
                {home.mapSubtitle}
              </p>
              <p className="mb-8 text-base leading-relaxed text-white/50">{home.mapDescription}</p>
              <Button as="link" href="/carte" color="lime" variant="outline-inverse" size="md">
                Ouvrir la carte
              </Button>
            </div>
          </div>
          <div className="relative order-1 h-80 min-h-[400px] overflow-hidden lg:order-2 lg:h-auto">
            <Image
              src={home.mapImage}
              alt={`Carte ${home.mapTitle}`}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent lg:bg-gradient-to-r lg:from-black/50 lg:to-transparent" />
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 md:mb-16">
            <span className="font-condensed text-xs uppercase tracking-[0.3em] text-pink">Guide</span>
            <h2 className="mt-2 font-display text-5xl uppercase text-white md:text-6xl lg:text-7xl">
              Infos Pratiques
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {home.practicalInfos.map((info) => (
              <div
                key={info.number}
                className="glass group rounded-xl border border-white/5 p-6 transition-all duration-300 hover:border-lime/10 md:p-8"
              >
                <div className="flex gap-5">
                  <span className={`font-display text-4xl leading-none opacity-80 ${textColors[info.color]}`}>
                    {info.number}
                  </span>
                  <div>
                    <h3 className="mb-3 font-condensed text-sm font-bold uppercase tracking-[0.15em] text-white">
                      {info.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/50">{info.body}</p>
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
