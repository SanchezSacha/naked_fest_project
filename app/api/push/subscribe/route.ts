import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isPushConfigured } from "@/lib/push";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const subscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

export async function POST(req: NextRequest) {
  if (!isPushConfigured()) {
    return NextResponse.json(
      { error: "Notifications push non configurees sur le serveur" },
      { status: 503 },
    );
  }

  const parsed = subscriptionSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Abonnement invalide" }, { status: 400 });
  }

  const { endpoint, keys } = parsed.data;

  const session = await auth();
  const sessionUserId = session?.user?.id ? Number(session.user.id) : null;
  const userId = sessionUserId && Number.isInteger(sessionUserId) ? sessionUserId : null;

  const userAgent = req.headers.get("user-agent") ?? undefined;

  const subscription = await prisma.pushSubscription.upsert({
    where: { endpoint },
    create: {
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      userAgent,
      userId,
    },
    update: {
      p256dh: keys.p256dh,
      auth: keys.auth,
      userAgent,
      userId,
    },
  });

  return NextResponse.json({ id: subscription.id }, { status: 201 });
}
