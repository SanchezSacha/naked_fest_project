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
    return NextResponse.json({ error: "Evenement introuvable" }, { status: 404 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Strapi indisponible" },
      { status: 503 },
    );
  }
}
