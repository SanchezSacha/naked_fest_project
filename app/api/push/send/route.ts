import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isPushConfigured, sendPushToTargets } from "@/lib/push";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const sendSchema = z.object({
  title: z.string().min(1).max(120),
  body: z.string().min(1).max(500),
  url: z.string().min(1).max(500).optional(),
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

  const { title, body, url } = parsed.data;

  const subscriptions = await prisma.pushSubscription.findMany({
    select: { endpoint: true, p256dh: true, auth: true },
  });

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
