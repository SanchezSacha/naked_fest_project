import { fetchStrapiEvents } from "@/lib/strapi";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const events = await fetchStrapiEvents();
    return NextResponse.json({ events, source: "strapi" });
  } catch {
    return NextResponse.json({ events: [], source: "fallback" });
  }
}
