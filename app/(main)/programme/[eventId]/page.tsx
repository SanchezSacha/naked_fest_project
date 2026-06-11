import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FavoriteButton from "@/components/FavoriteButton";
import { getFallbackEvent } from "@/lib/festival-events";
import { fetchStrapiEvents } from "@/lib/strapi";

const backRoutes: Record<string, { href: string; label: string }> = {
  recherche: { href: "/recherche", label: "Retour a la recherche" },
  favoris: { href: "/favoris", label: "Retour aux favoris" },
};

export default async function EventDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { eventId } = await params;
  const { from } = await searchParams;
  const back = backRoutes[from ?? ""] ?? { href: "/programme", label: "Retour au programme" };

  let event = getFallbackEvent(eventId);

  try {
    const strapiEvents = await fetchStrapiEvents();
    event = strapiEvents.find((item) => item.id === eventId) ?? event;
  } catch {
    // The detail page remains available with local fallback data.
  }

  if (!event) notFound();

  const startsAt = new Date(event.startsAt);
  const endsAt = new Date(event.endsAt);
  const date = `${event.dateLabel} JANVIER 2027`;

  return (
    <>
      <section className="border-b border-[#252525] px-8 pb-12 pt-14 md:px-12">
        <Link
          href={back.href}
          className="inline-flex items-center gap-2 font-condensed text-xs uppercase tracking-[0.18em] text-white/45 transition-colors hover:text-white"
        >
          <span aria-hidden="true">←</span> {back.label}
        </Link>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className={`${event.dateBg} ${event.dateText} px-3 py-2 font-condensed text-xs font-bold uppercase tracking-[0.2em]`}>
            {event.category}
          </span>
          <span className="font-condensed text-xs uppercase tracking-[0.2em] text-white/45">
            {event.dateLabel} / {event.time}
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-[clamp(64px,16vw,126px)] uppercase leading-none text-white">
              {event.artist}
            </h1>
            <p className={`mt-3 font-condensed text-sm uppercase tracking-[0.25em] ${event.accent}`}>
              {event.genre} / {event.origin}
            </p>
          </div>
          <FavoriteButton eventId={event.id} showLabel className="shrink-0 px-5 py-3" />
        </div>
      </section>

      <div className="relative h-[48vw] min-h-[300px] max-h-[620px] overflow-hidden">
        <Image
          src={event.image}
          alt={event.artist}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
      </div>

      <section className="grid border-b border-[#252525] md:grid-cols-[1.15fr_0.85fr]">
        <div className="px-8 py-14 md:border-r md:border-[#252525] md:px-12 md:py-20">
          <span className="font-condensed text-xs uppercase tracking-[0.3em] text-pink">
            A propos
          </span>
          <h2 className="mt-3 font-display text-5xl uppercase text-white md:text-7xl">
            {event.title}
          </h2>
          <p className="mt-7 max-w-2xl text-base leading-8 text-white/65">
            {event.description}
          </p>

          <div className="mt-10">
            <p className="font-condensed text-xs uppercase tracking-[0.25em] text-white/35">
              Artistes / intervenants
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {event.speakers.map((speaker) => (
                <span
                  key={speaker}
                  className="border border-white/20 px-3 py-2 font-condensed text-xs font-bold uppercase tracking-[0.14em] text-white"
                >
                  {speaker}
                </span>
              ))}
            </div>
          </div>
        </div>

        <aside className="px-8 py-14 md:px-10 md:py-20">
          <dl className="space-y-8">
            <Detail label="Date" value={date} />
            <Detail
              label="Horaires"
              value={`${startsAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} - ${endsAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`}
            />
            <Detail label="Duree" value={event.duration} />
            <Detail label="Lieu" value={event.stage} />
            <Detail label="Adresse" value={event.address} />
            <Detail
              label="Coordonnees"
              value={`${event.latitude.toFixed(4)}, ${event.longitude.toFixed(4)}`}
            />
          </dl>

          <Link
            href={`/carte?event=${event.id}`}
            className="mt-10 inline-flex border-2 border-lime bg-lime px-7 py-4 font-condensed text-xs font-bold uppercase tracking-[0.22em] text-dark transition-all hover:bg-[#111113] hover:[color:var(--neon-lime)]"
          >
            Voir sur la carte
          </Link>
        </aside>
      </section>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-condensed text-xs uppercase tracking-[0.25em] text-white/35">{label}</dt>
      <dd className="mt-1 font-condensed text-lg font-bold uppercase tracking-[0.08em] text-white">
        {value}
      </dd>
    </div>
  );
}
