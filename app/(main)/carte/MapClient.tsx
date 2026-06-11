"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { FestivalEvent } from "@/lib/festival-events";

type MapPoint = {
  id: string;
  name: string;
  kind: string;
  description: string;
  latitude: number;
  longitude: number;
  x: number;
  y: number;
  color: string;
  eventId?: string;
};

const staticPoints: MapPoint[] = [
  {
    id: "entrance",
    name: "Entree principale",
    kind: "Entree",
    description: "Controle des billets, accueil et informations.",
    latitude: 49.7598,
    longitude: 4.7154,
    x: 22,
    y: 78,
    color: "#ffffff",
  },
  {
    id: "thermal-bar",
    name: "Bar thermique",
    kind: "Stand",
    description: "Boissons chaudes et zone de recuperation.",
    latitude: 49.7617,
    longitude: 4.7193,
    x: 58,
    y: 66,
    color: "#c8ff00",
  },
  {
    id: "first-aid",
    name: "Poste de secours",
    kind: "Securite",
    description: "Equipe medicale et prise en charge hypothermie.",
    latitude: 49.7609,
    longitude: 4.7176,
    x: 38,
    y: 58,
    color: "#ff2d9b",
  },
  {
    id: "info",
    name: "Point info",
    kind: "Information",
    description: "Programme, objets trouves et orientation.",
    latitude: 49.7604,
    longitude: 4.7162,
    x: 29,
    y: 69,
    color: "#00f5ff",
  },
];

export default function MapClient({ events }: { events: FestivalEvent[] }) {
  const [zoom, setZoom] = useState(1);
  const points = useMemo(() => {
    const stagePoints = Array.from(
      new Map(events.map((event) => [event.stage, event])).values(),
    ).map((event, index): MapPoint => ({
      id: `stage-${event.id}`,
      name: event.stage,
      kind: "Scene",
      description: `${event.artist} - ${event.dateLabel} a ${event.time}`,
      latitude: event.latitude,
      longitude: event.longitude,
      x: [68, 46, 62][index % 3],
      y: [36, 44, 52][index % 3],
      color: ["#ff2d9b", "#00f5ff", "#bf5fff"][index % 3],
      eventId: event.id,
    }));

    return [...stagePoints, ...staticPoints];
  }, [events]);

  const [selectedId, setSelectedId] = useState(points[0]?.id ?? "");
  const selected = points.find((point) => point.id === selectedId) ?? points[0];

  useEffect(() => {
    const eventId = new URLSearchParams(window.location.search).get("event");
    if (!eventId) return;
    const point = points.find((item) => item.eventId === eventId);
    if (!point) return;
    const timer = window.setTimeout(() => setSelectedId(point.id), 0);
    return () => window.clearTimeout(timer);
  }, [points]);

  return (
    <section className="-mt-14 min-h-screen bg-dark pt-14">
      <div className="grid min-h-[calc(100vh-3.5rem)] lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="relative min-h-[58vh] overflow-hidden border-b border-[#252525] lg:min-h-full lg:border-b-0 lg:border-r">
          <div
            className="absolute inset-0 transition-transform duration-300"
            style={{ transform: `scale(${zoom})` }}
          >
            <Image
              src="/fatal_fields_winter_map.webp"
              alt="Carte interactive de Fatal Fields"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/20" />

          <div className="absolute left-6 top-6">
            <p className="font-condensed text-xs uppercase tracking-[0.25em] text-white/50">
              Fatal Fields
            </p>
            <h1 className="font-display text-6xl uppercase text-white">Carte</h1>
          </div>

          <div className="absolute right-5 top-6 flex flex-col gap-2">
            <MapControl label="Zoom avant" onClick={() => setZoom((value) => Math.min(1.8, value + 0.15))}>
              +
            </MapControl>
            <MapControl label="Zoom arriere" onClick={() => setZoom((value) => Math.max(1, value - 0.15))}>
              -
            </MapControl>
            <MapControl label="Reinitialiser" onClick={() => setZoom(1)}>
              ◎
            </MapControl>
          </div>

          {points.map((point) => {
            const active = point.id === selected?.id;
            return (
              <button
                key={point.id}
                type="button"
                aria-label={`${point.kind}: ${point.name}`}
                onClick={() => setSelectedId(point.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
              >
                <span
                  className={`block h-5 w-5 rotate-45 border-2 border-white shadow-[0_0_18px_currentColor] ${active ? "scale-125" : ""}`}
                  style={{ backgroundColor: point.color, color: point.color }}
                />
              </button>
            );
          })}
        </div>

        {selected && (
          <aside className="flex flex-col justify-center px-8 pb-36 pt-10 lg:px-10 lg:pb-28">
            <span
              className="self-start px-3 py-1 font-condensed text-xs font-bold uppercase tracking-[0.16em] text-dark"
              style={{ backgroundColor: selected.color }}
            >
              {selected.kind}
            </span>
            <h2 className="mt-4 font-display text-5xl uppercase leading-none text-white">
              {selected.name}
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/60">{selected.description}</p>

            <div className="mt-8 border-y border-white/10 py-5">
              <p className="font-condensed text-xs uppercase tracking-[0.2em] text-white/35">
                Position geographique
              </p>
              <p className="mt-2 font-condensed text-lg font-bold tracking-[0.08em] text-cyan">
                {selected.latitude.toFixed(4)}, {selected.longitude.toFixed(4)}
              </p>
            </div>

            {selected.eventId && (
              <Link
                href={`/programme/${selected.eventId}`}
                className="mt-8 inline-flex self-start border-2 border-lime bg-lime px-6 py-4 font-condensed text-xs font-bold uppercase tracking-[0.2em] text-dark transition-all hover:bg-[#111113] hover:[color:var(--neon-lime)]"
              >
                Voir l&apos;evenement
              </Link>
            )}

            <div className="mt-10">
              <p className="font-condensed text-xs uppercase tracking-[0.2em] text-white/35">
                Points d&apos;interet
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {points.map((point) => (
                  <button
                    key={point.id}
                    type="button"
                    onClick={() => setSelectedId(point.id)}
                    className={`border px-3 py-3 text-left font-condensed text-xs font-bold uppercase tracking-[0.1em] transition-colors ${
                      point.id === selected.id
                        ? "border-white text-white"
                        : "border-white/10 text-white/45 hover:border-white/35 hover:text-white"
                    }`}
                  >
                    {point.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}

function MapControl({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid h-10 w-10 place-items-center bg-black/80 text-xl text-white transition-colors hover:bg-white hover:text-dark"
    >
      {children}
    </button>
  );
}
