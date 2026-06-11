// API pour s'abonner/désabonner à un événement spécifique (avec slug Strapi)
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const subscribeSchema = z.object({
  endpoint: z.string(),
  eventSlug: z.string(),
  eventTitle: z.string().optional(),
  eventStartsAt: z.string().datetime().optional(),
  subscribe: z.boolean(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = subscribeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { endpoint, eventSlug, eventTitle, eventStartsAt, subscribe } = parsed.data;

  // Vérifier que la subscription existe
  const pushSub = await prisma.pushSubscription.findUnique({
    where: { endpoint },
  });

  if (!pushSub) {
    return NextResponse.json(
      { error: "Subscription non trouvée" },
      { status: 404 }
    );
  }

  if (subscribe) {
    // Créer l'abonnement (upsert si déjà existant)
    try {
      await prisma.pushEventSubscription.upsert({
        where: {
          pushSubscriptionId_eventSlug: {
            pushSubscriptionId: pushSub.id,
            eventSlug,
          },
        },
        update: {
          eventTitle,
          eventStartsAt: eventStartsAt ? new Date(eventStartsAt) : null,
        },
        create: {
          pushSubscriptionId: pushSub.id,
          eventSlug,
          eventTitle,
          eventStartsAt: eventStartsAt ? new Date(eventStartsAt) : null,
        },
      });
      return NextResponse.json({ subscribed: true });
    } catch (err) {
      console.error("[subscribe-event] Error:", err);
      return NextResponse.json({ error: "Erreur création" }, { status: 500 });
    }
  } else {
    // Supprimer l'abonnement
    await prisma.pushEventSubscription.deleteMany({
      where: {
        pushSubscriptionId: pushSub.id,
        eventSlug,
      },
    });
    return NextResponse.json({ subscribed: false });
  }
}
