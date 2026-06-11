import { fetchStrapiEvents } from "@/lib/strapi";
import FavoritesClient from "./FavoritesClient";

export default async function FavoritesPage() {
  const events = await fetchStrapiEvents();
  return <FavoritesClient events={events} />;
}
