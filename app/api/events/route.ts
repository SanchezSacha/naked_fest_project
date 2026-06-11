import { fallbackFestivalEvents } from "@/lib/festival-events";
import { fetchStrapiEvents } from "@/lib/strapi";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const events = await fetchStrapiEvents();
    if (events.length > 0) {
      return NextResponse.json({ data: events, source: "strapi" });
    }
  } catch {
    // Fallback data keeps the API usable during local development.
  }

  return NextResponse.json({ data: fallbackFestivalEvents, source: "fallback" });
}
