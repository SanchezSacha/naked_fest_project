import { fallbackFestivalEvents } from "@/lib/festival-events";
import { fetchStrapiEvents } from "@/lib/strapi";
import ProgrammeClient from "./ProgrammeClient";

export default async function ProgrammePage() {
  let events = fallbackFestivalEvents;
  let source: "strapi" | "fallback" = "fallback";

  try {
    const strapiEvents = await fetchStrapiEvents();
    if (strapiEvents.length > 0) {
      events = strapiEvents;
      source = "strapi";
    }
  } catch {
    // Local fallback keeps the programme available without Strapi.
  }

  return <ProgrammeClient initialEvents={events} source={source} />;
}
