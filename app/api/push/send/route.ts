import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isPushConfigured, sendPushToTargets } from "@/lib/push";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const sendSchema = z.object({
  title: z.string().min(1).max(120),
  body: z.string().min(1).max(500),
  url: z.string().min(1).max(500).optional(),
  topicKey: z.string().optional(), // null = tous les abonnes, sinon filtre par topic
});

// Envoi manuel par un administrateur : titre, contenu et lien au choix.
export async function POST(req: NextRequest) {
  if (!isPushConfigured()) {
    return NextResponse.json(
      { error: "Notifications push non configurees sur le serveur" },
      { status: 503 },
    );
  }

  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Acces refuse" }, { status: 403 });
  }

  const parsed = sendSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Donnees invalides" }, { status: 400 });
  }

  const { title, body, url, topicKey } = parsed.data;

  // Si un topic est specifie, on filtre les abonnements a ce topic
  // Sinon, on envoie a tous les abonnes (retrocompatibilite)
  let subscriptions;

  if (topicKey) {
    // Verifier que le topic existe
    const topic = await prisma.pushTopic.findUnique({
      where: { key: topicKey },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic inconnu" }, { status: 404 });
    }

    // Recuperer les abonnements associes a ce topic
    const subTopics = await prisma.pushSubscriptionTopic.findMany({
      where: { topicId: topic.id },
      include: {
        pushSubscription: {
          select: { endpoint: true, p256dh: true, auth: true },
        },
      },
    });

    subscriptions = subTopics.map((st) => st.pushSubscription);
  } else {
    // Sans topic : envoi a tous les abonnes
    subscriptions = await prisma.pushSubscription.findMany({
      select: { endpoint: true, p256dh: true, auth: true },
    });
  }

  if (subscriptions.length === 0) {
    return NextResponse.json({ sent: 0, failed: 0, recipients: 0 });
  }

  const result = await sendPushToTargets(subscriptions, {
    title,
    body,
    url: url ?? "/",
  });

  if (result.expiredEndpoints.length > 0) {
    await prisma.pushSubscription.deleteMany({
      where: { endpoint: { in: result.expiredEndpoints } },
    });
  }

  return NextResponse.json({
    recipients: subscriptions.length,
    sent: result.sent,
    failed: result.failed,
    removed: result.expiredEndpoints.length,
  });
}
