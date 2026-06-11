export const FAVORITES_STORAGE_KEY = "nfest-favorite-events";
export const FAVORITES_CHANGED_EVENT = "nfest:favorites-changed";

export function getFavoriteIds() {
  if (typeof window === "undefined") return [];

  try {
    const value = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function isFavorite(eventId: string) {
  return getFavoriteIds().includes(eventId);
}

export function toggleFavorite(eventId: string) {
  const favorites = getFavoriteIds();
  const nextFavorites = favorites.includes(eventId)
    ? favorites.filter((id) => id !== eventId)
    : [...favorites, eventId];

  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(nextFavorites));
  window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT));

  return nextFavorites.includes(eventId);
}
