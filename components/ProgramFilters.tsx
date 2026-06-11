"use client";

import { useState } from "react";

export type FilterState = {
  dates: string[];
  categories: string[];
  genres: string[];
};

type FilterOption = {
  id: string;
  label: string;
};

type ProgramFiltersProps = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  onReset: () => void;
  initialFilters: FilterState;
  resultCount: number;
  dateOptions: FilterOption[];
  categoryOptions: FilterOption[];
  genreOptions: FilterOption[];
};

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export default function ProgramFilters({
  isOpen,
  onClose,
  onApply,
  onReset,
  initialFilters,
  resultCount,
  dateOptions,
  categoryOptions,
  genreOptions,
}: ProgramFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  if (!isOpen) return null;

  const groups = [
    { key: "dates" as const, title: "Dates", options: dateOptions },
    { key: "categories" as const, title: "Categories", options: categoryOptions },
    { key: "genres" as const, title: "Genres musicaux", options: genreOptions },
  ];

  function reset() {
    const emptyFilters = { dates: [], categories: [], genres: [] };
    setFilters(emptyFilters);
    onReset();
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col border border-[#252525] bg-dark">
        <div className="flex items-center justify-between border-b border-[#252525] px-6 py-5">
          <h2 className="font-display text-3xl uppercase text-white">Filtrer le programme</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer les filtres"
            className="grid h-10 w-10 place-items-center text-white/60 transition-colors hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="grid flex-1 gap-8 overflow-y-auto px-6 py-8 md:grid-cols-3">
          {groups.map((group) => (
            <section key={group.key}>
              <h3 className="mb-5 font-condensed text-sm font-bold uppercase tracking-[0.25em] text-white">
                {group.title}
              </h3>
              <div className="space-y-3">
                {group.options.map((option) => {
                  const active = filters[group.key].includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        setFilters((current) => ({
                          ...current,
                          [group.key]: toggleValue(current[group.key], option.id),
                        }))
                      }
                      className={`w-full border px-4 py-4 text-left font-condensed text-xs font-bold uppercase tracking-[0.14em] transition-all ${
                        active
                          ? "border-lime bg-lime text-dark"
                          : "border-[#343438] text-white/65 hover:border-lime/70 hover:text-white"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="border-t border-[#252525] px-6 py-5">
          <p className="mb-4 font-condensed text-xs uppercase tracking-[0.18em] text-white/45">
            {resultCount} resultat{resultCount > 1 ? "s" : ""}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={reset}
              className="border border-white/25 px-6 py-4 font-condensed text-xs font-bold uppercase tracking-[0.22em] text-white transition-colors hover:border-white"
            >
              Reinitialiser
            </button>
            <button
              type="button"
              onClick={() => {
                onApply(filters);
                onClose();
              }}
              className="border-2 border-lime bg-lime px-6 py-4 font-condensed text-xs font-bold uppercase tracking-[0.22em] text-dark transition-all hover:bg-[#111113] hover:[color:var(--neon-lime)]"
            >
              Voir les resultats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
