import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { fetchStrapiEvents } from "@/lib/strapi";
import { ReminderDelay } from "@/app/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Décalage (en minutes) avant le début de l'événement pour chaque palier.
export const REMINDER_OFFSET_MINUTES: Record<ReminderDelay, number> = {
  [ReminderDelay.HOURS_24]: 24 * 60,
  [ReminderDelay.HOURS_2]: 2 * 60,
  [ReminderDelay.MINUTES_30]: 30,
};

const reminderSchema = z.object({
  eventId: z.number().int().positive(),
  delay: z.enum(["HOURS_24", "HOURS_2", "MINUTES_30"]),
  endpoint: z.string().url(),
});

export async function POST(req: NextRequest) {
  const parsed = reminderSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Donnees invalides" }, { status: 400 });
  }

  const { eventId, delay, endpoint } = parsed.data;

  const events = await fetchStrapiEvents();
  const event = events.find((item) => item.strapiId === eventId);
  if (!event) {
    return NextResponse.json({ error: "Evenement introuvable" }, { status: 404 });
  }

  const subscription = await prisma.pushSubscription.findUnique({
    where: { endpoint },
  });
  if (!subscription) {
    return NextResponse.json(
      { error: "Abonnez-vous aux notifications avant de programmer un rappel" },
      { status: 400 },
    );
  }

  const remindAt = new Date(
    new Date(event.startsAt).getTime() - REMINDER_OFFSET_MINUTES[delay] * 60_000,
  );

  const session = await auth();
  const sessionUserId = session?.user?.id ? Number(session.user.id) : null;
  const userId =
    sessionUserId && Number.isInteger(sessionUserId) ? sessionUserId : null;

  const existing = await prisma.eventReminder.findFirst({
    where: { eventId, delay, pushSubscriptionId: subscription.id },
  });

  const reminder = existing
    ? await prisma.eventReminder.update({
        where: { id: existing.id },
        data: { remindAt, sentAt: null, userId },
      })
    : await prisma.eventReminder.create({
        data: {
          eventId,
          delay,
          remindAt,
          userId,
          pushSubscriptionId: subscription.id,
        },
      });

  return NextResponse.json({ id: reminder.id, remindAt }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const parsed = reminderSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Donnees invalides" }, { status: 400 });
  }

  const { eventId, delay, endpoint } = parsed.data;

  const subscription = await prisma.pushSubscription.findUnique({
    where: { endpoint },
  });
  if (!subscription) {
    return NextResponse.json({ success: true });
  }

  await prisma.eventReminder.deleteMany({
    where: { eventId, delay, pushSubscriptionId: subscription.id },
  });

  return NextResponse.json({ success: true });
}
