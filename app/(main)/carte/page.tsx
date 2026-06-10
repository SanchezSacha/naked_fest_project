import Image from "next/image";
import Link from "next/link";

const mapControls = [
  {
    label: "Zoom avant",
    icon: (
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    ),
  },
  {
    label: "Zoom arrière",
    icon: (
      <path
        d="M5 12h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    ),
  },
  {
    label: "Me localiser",
    icon: (
      <>
        <circle
          cx="12"
          cy="12"
          r="5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="12" r="1.8" fill="currentColor" />
        <path
          d="M12 3v3M12 18v3M3 12h3M18 12h3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </>
    ),
  },
];

const nearbyPlaces = [
  { name: "Zone Cryo", kind: "Ambient / Noise", color: "bg-cyan" },
  { name: "Bar Thermique", kind: "Ravitaillement", color: "bg-lime" },
  { name: "Sanctuaire", kind: "Repos chauffé", color: "bg-violet" },
];

export default function CartePage() {
  return (
    <section className="-mt-14 min-h-screen bg-dark">
      <div className="mx-auto min-h-screen w-full max-w-[430px] bg-[#171719] pt-14 md:border-x md:border-dark-border lg:grid lg:max-w-none lg:grid-cols-[minmax(0,1fr)_430px] lg:border-x-0">
        <div className="relative h-[45vh] min-h-[326px] overflow-hidden border-b border-dark-border lg:h-[calc(100vh-3.5rem)] lg:min-h-[650px] lg:border-b-0 lg:border-r">
          <Image
            src="/map_homepage.png"
            alt="Carte de Fatal Fields"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, calc(100vw - 430px)"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/5 lg:bg-black/10" />

          <div className="absolute left-8 top-8 hidden lg:block">
            <p className="font-condensed text-[11px] font-semibold uppercase tracking-[0.3em] text-white/55">
              Fatal Fields
            </p>
            <h1 className="mt-2 font-display text-7xl uppercase leading-none text-white">
              Carte
            </h1>
          </div>

          <div className="absolute right-5 top-8 flex flex-col gap-2 lg:right-8">
            {mapControls.map((control) => (
              <button
                key={control.label}
                type="button"
                aria-label={control.label}
                title={control.label}
                className="grid size-10 place-items-center bg-[#222225]/95 text-white shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-colors hover:bg-[#303034] focus:outline-none focus:ring-2 focus:ring-lime"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  {control.icon}
                </svg>
              </button>
            ))}
          </div>

          <div className="absolute left-1/2 top-[63%] -translate-x-1/2 -translate-y-1/2 lg:left-[54%] lg:top-[58%]">
            <div className="relative flex flex-col items-center">
              <span className="relative grid size-6 rotate-45 place-items-center bg-pink shadow-[0_0_22px_rgba(255,45,155,0.75)] lg:size-8">
                <span className="size-2 bg-white/90" />
              </span>
              <span className="mt-6 bg-pink px-2.5 py-1 font-condensed text-[10px] font-bold uppercase leading-none tracking-[0.06em] text-white shadow-[0_6px_16px_rgba(0,0,0,0.45)] lg:text-xs">
                Scène principale
              </span>
            </div>
          </div>

          <div className="absolute bottom-8 left-8 hidden w-[320px] border border-white/15 bg-black/55 p-5 backdrop-blur lg:block">
            <p className="font-condensed text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
              À proximité
            </p>
            <div className="mt-4 space-y-3">
              {nearbyPlaces.map((place) => (
                <div key={place.name} className="flex items-center gap-3">
                  <span className={`size-2.5 ${place.color}`} />
                  <div className="min-w-0">
                    <p className="font-condensed text-sm font-bold uppercase tracking-[0.12em] text-white">
                      {place.name}
                    </p>
                    <p className="text-xs text-white/45">{place.kind}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative px-11 pb-32 pt-8 lg:flex lg:min-h-[calc(100vh-3.5rem)] lg:flex-col lg:justify-center lg:px-10 lg:pb-40 lg:pt-20">
          <span className="mx-auto mb-12 block h-1 w-12 rounded-full bg-white/10 lg:hidden" />
          <div className="mb-6 h-20 w-1.5 bg-pink lg:h-28" />

          <div className="flex items-center gap-3">
            <span className="bg-pink px-2.5 py-1 font-condensed text-[10px] font-bold uppercase leading-none tracking-[0.1em] text-white">
              Concert
            </span>
            <span className="font-condensed text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
              En direct
            </span>
          </div>

          <h1 className="mt-2 font-display text-[42px] uppercase leading-[0.95] text-white lg:text-[64px]">
            Scène principale
          </h1>

          <p className="mt-4 max-w-[330px] text-[15px] leading-relaxed text-white/70 lg:max-w-none">
            Le cœur battant de N&apos;FEST. Performance immersive de Black Metal
            sous le dôme géodésique. Une expérience sensorielle extrême à la
            limite de la résistance thermique.
          </p>

          <div className="mt-8 hidden grid-cols-2 border-y border-white/10 lg:grid">
            <div className="border-r border-white/10 py-5">
              <p className="font-display text-4xl leading-none text-lime">23:00</p>
              <p className="mt-1 font-condensed text-[10px] uppercase tracking-[0.25em] text-white/45">
                Prochain set
              </p>
            </div>
            <div className="py-5 pl-6">
              <p className="font-display text-4xl leading-none text-cyan">420M</p>
              <p className="mt-1 font-condensed text-[10px] uppercase tracking-[0.25em] text-white/45">
                Depuis entrée
              </p>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-4 lg:mt-9">
            <Link
              href="/infos"
              className="flex min-h-14 items-center justify-center border-2 border-white px-4 font-condensed text-xs font-bold uppercase tracking-[0.08em] text-white transition-colors hover:border-lime hover:text-lime"
            >
              Y aller
            </Link>
            <Link
              href="/billetterie"
              className="flex min-h-14 items-center justify-center border-2 border-white bg-white px-4 font-condensed text-xs font-bold uppercase tracking-[0.08em] text-dark transition-colors hover:border-lime hover:bg-lime"
            >
              Réserver
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
