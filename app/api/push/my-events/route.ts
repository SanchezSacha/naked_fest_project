// API pour récupérer les événements suivis par un utilisateur (slugs Strapi)
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const endpoint = searchParams.get("endpoint");

  if (!endpoint) {
    return NextResponse.json(
      { error: "Endpoint required" },
      { status: 400 }
    );
  }

  const pushSub = await prisma.pushSubscription.findUnique({
    where: { endpoint },
    include: {
      events: {
        orderBy: { eventStartsAt: "asc" },
      },
    },
  });

  if (!pushSub) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Retourne les slugs et infos stockées
  const events = pushSub.events.map((e) => ({
    subscriptionId: e.id,
    slug: e.eventSlug,
    title: e.eventTitle,
    startsAt: e.eventStartsAt,
  }));

  return NextResponse.json(events);
}
