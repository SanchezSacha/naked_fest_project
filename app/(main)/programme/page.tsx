import { fetchStrapiEvents } from "@/lib/strapi";
import ProgrammeClient from "./ProgrammeClient";

export default async function ProgrammePage() {
  const events = await fetchStrapiEvents();
  return <ProgrammeClient initialEvents={events} />;
}
