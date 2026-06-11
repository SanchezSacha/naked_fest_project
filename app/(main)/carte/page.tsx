import { fetchStrapiEvents } from "@/lib/strapi";
import MapClient from "./MapClient";

export default async function CartePage() {
  const events = await fetchStrapiEvents();
  return <MapClient events={events} />;
}
