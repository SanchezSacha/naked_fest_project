import { fetchStrapiEvents } from "@/lib/strapi";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const events = await fetchStrapiEvents();
    return NextResponse.json({ data: events, source: "strapi" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Strapi indisponible" },
      { status: 503 },
    );
  }
}
