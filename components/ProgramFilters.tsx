"use client";

import { useState } from "react";

type FilterState = {
  dates: string[];
  categories: string[];
  genres: string[];
};

type ProgramFiltersProps = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  onReset: () => void;
  initialFilters: FilterState;
  resultCount: number;
};

const categories = [
  { id: "concerts", label: "Concerts" },
  { id: "conferences", label: "Conférences" },
  { id: "activites", label: "Activités" },
  { id: "tout", label: "Tout Voir" },
];

const genres = [
  { id: "metal", label: "Metal" },
  { id: "electro", label: "Electro" },
  { id: "folk", label: "Folk" },
  { id: "techno", label: "Techno" },
  { id: "industrial", label: "Industrial" },
  { id: "dark-ambient", label: "Dark Ambient" },
];

export default function ProgramFilters({
  isOpen,
  onClose,
  onApply,
  onReset,
  initialFilters,
  resultCount,
}: ProgramFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const handleCategoryToggle = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(c => c !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleGenreToggle = (genreId: string) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genreId)
        ? prev.genres.filter(g => g !== genreId)
        : [...prev.genres, genreId]
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const emptyFilters = { dates: [], categories: [], genres: [] };
    setFilters(emptyFilters);
    onReset();
  };

  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-4xl bg-dark border border-[#252525] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#252525]">
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Fermer les filtres"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <h2 className="font-display text-2xl text-white uppercase">Filtres</h2>
          <button
            onClick={handleReset}
            className="font-condensed text-[10px] tracking-[0.2em] text-white/60 hover:text-white uppercase transition-colors"
          >
            RÉINITIALISER
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Catégories */}
            <div className="lg:col-span-1">
              <h3 className="font-condensed text-sm tracking-[0.3em] text-white uppercase mb-6">
                CATÉGORIES
              </h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryToggle(category.id)}
                    className={`w-full px-4 py-4 border font-condensed text-[11px] tracking-[0.15em] uppercase transition-all text-left ${
                      filters.categories.includes(category.id)
                        ? "border-lime bg-lime text-dark"
                        : "border-[#252525] text-white/70 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Genres musicaux */}
            <div className="lg:col-span-1">
              <h3 className="font-condensed text-sm tracking-[0.3em] text-white uppercase mb-6">
                GENRES MUSICAUX
              </h3>
              <div className="space-y-3">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => handleGenreToggle(genre.id)}
                    className={`w-full px-4 py-4 border font-condensed text-[11px] tracking-[0.15em] uppercase transition-all text-left ${
                      filters.genres.includes(genre.id)
                        ? "border-lime bg-lime text-dark"
                        : "border-[#252525] text-white/70 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {genre.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Résumé des filtres actifs */}
          {(filters.categories.length > 0 || filters.genres.length > 0) && (
            <div className="mt-8 p-4 bg-white/[0.02] border border-[#252525] rounded">
              <h4 className="font-condensed text-[10px] tracking-[0.2em] text-white/60 uppercase mb-3">
                FILTRES ACTIFS
              </h4>
              <div className="flex flex-wrap gap-2">
                {filters.categories.map(catId => (
                  <span key={catId} className="px-3 py-1 bg-cyan/20 text-cyan font-condensed text-[10px] uppercase tracking-[0.15em] rounded">
                    {categories.find(c => c.id === catId)?.label}
                  </span>
                ))}
                {filters.genres.map(genreId => (
                  <span key={genreId} className="px-3 py-1 bg-pink/20 text-pink font-condensed text-[10px] uppercase tracking-[0.15em] rounded">
                    {genres.find(g => g.id === genreId)?.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer avec résultats */}
        <div className="border-t border-[#252525] px-8 py-6 bg-dark/50">
          <div className="flex items-center justify-between mb-4">
            <span className="font-condensed text-[11px] text-white/60 uppercase tracking-[0.2em]">
              {resultCount} {resultCount === 1 ? "résultat" : "résultats"} trouvés
            </span>
            <button
              onClick={onClose}
              className="font-condensed text-[10px] text-white/40 hover:text-white uppercase tracking-[0.15em] transition-colors"
            >
              Annuler
            </button>
          </div>
          <button
            onClick={handleApply}
            className="w-full border-2 border-lime bg-lime text-dark font-condensed font-bold text-sm px-6 py-4 tracking-[0.3em] uppercase transition-all hover:bg-transparent hover:text-lime"
          >
            VOIR LES RÉSULTATS
          </button>
        </div>
      </div>
    </div>
  );
}
