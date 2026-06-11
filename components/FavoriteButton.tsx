"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FAVORITES_CHANGED_EVENT, isFavorite, toggleFavorite } from "@/lib/favorites";

type FavoriteButtonProps = {
  eventId: string;
  showLabel?: boolean;
  className?: string;
};

export default function FavoriteButton({
  eventId,
  showLabel = false,
  className = "",
}: FavoriteButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [favorite, setFavorite] = useState(false);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const initialSync = window.setTimeout(() => setFavorite(isFavorite(eventId)), 0);

    const syncFavorite = () => setFavorite(isFavorite(eventId));
    window.addEventListener(FAVORITES_CHANGED_EVENT, syncFavorite);

    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((session: { user?: unknown }) => setAuthenticated(Boolean(session.user)))
      .catch(() => setAuthenticated(false));

    return () => {
      window.clearTimeout(initialSync);
      window.removeEventListener(FAVORITES_CHANGED_EVENT, syncFavorite);
    };
  }, [eventId]);

  function handleClick() {
    if (!authenticated) {
      sessionStorage.setItem("nfest-post-login-redirect", pathname);
      router.push("/login");
      return;
    }

    setFavorite(toggleFavorite(eventId));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      aria-pressed={favorite}
      className={`inline-flex items-center justify-center gap-2 border px-3 py-2 font-condensed text-xs font-bold uppercase tracking-[0.15em] transition-all duration-200 ${
        favorite
          ? "border-pink bg-pink text-white"
          : "border-white/30 bg-black/55 text-white hover:border-pink hover:text-pink"
      } ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5"
        fill={favorite ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 1 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z" />
      </svg>
      {showLabel && (favorite ? "Favori" : "Ajouter")}
    </button>
  );
}
