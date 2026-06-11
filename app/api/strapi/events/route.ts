import { fetchStrapiEvents } from "@/lib/strapi";
import { fallbackFestivalEvents } from "@/lib/festival-events";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const events = await fetchStrapiEvents();
    if (events.length > 0) {
      return NextResponse.json({ events, source: "strapi" });
    }
  } catch {
    // The public site keeps working while the local Strapi server is offline.
  }

  return NextResponse.json({ events: fallbackFestivalEvents, source: "fallback" });
}
