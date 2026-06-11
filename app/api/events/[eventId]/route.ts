import { fallbackFestivalEvents } from "@/lib/festival-events";
import { fetchStrapiEvents } from "@/lib/strapi";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await params;

  try {
    const events = await fetchStrapiEvents();
    const event = events.find((item) => item.id === eventId);
    if (event) {
      return NextResponse.json({ data: event, source: "strapi" });
    }
  } catch {
    // Continue with fallback data.
  }

  const event = fallbackFestivalEvents.find((item) => item.id === eventId);
  if (!event) {
    return NextResponse.json({ error: "Evenement introuvable" }, { status: 404 });
  }

  return NextResponse.json({ data: event, source: "fallback" });
}
