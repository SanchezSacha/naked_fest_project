import { fallbackFestivalEvents } from "@/lib/festival-events";
import { fetchStrapiEvents } from "@/lib/strapi";
import RechercheClient from "./RechercheClient";

export default async function RecherchePage() {
  let events = fallbackFestivalEvents;

  try {
    const strapiEvents = await fetchStrapiEvents();
    if (strapiEvents.length > 0) {
      events = strapiEvents;
    }
  } catch {
    // Fallback local si Strapi indisponible.
  }

  return <RechercheClient initialEvents={events} />;
}
