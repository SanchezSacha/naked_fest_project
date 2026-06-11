import { fetchStrapiEvents } from "@/lib/strapi";
import RechercheClient from "./RechercheClient";

export default async function RecherchePage() {
  const events = await fetchStrapiEvents();
  return <RechercheClient initialEvents={events} />;
}
