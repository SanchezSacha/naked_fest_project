import { fallbackFestivalEvents } from "@/lib/festival-events";
import { fetchStrapiEvents } from "@/lib/strapi";
import FavoritesClient from "./FavoritesClient";

export default async function FavoritesPage() {
  let events = fallbackFestivalEvents;

  try {
    const strapiEvents = await fetchStrapiEvents();
    if (strapiEvents.length > 0) events = strapiEvents;
  } catch {
    // Favorites remain available offline with local event data.
  }

  return <FavoritesClient events={events} />;
}
