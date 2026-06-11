import prisma from "@/lib/prisma";
import { isPushConfigured, sendPushToTargets } from "@/lib/push";
import { ReminderDelay } from "@/app/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

const DELAY_LABEL: Record<ReminderDelay, string> = {
  [ReminderDelay.HOURS_24]: "dans 24 heures",
  [ReminderDelay.HOURS_2]: "dans 2 heures",
  [ReminderDelay.MINUTES_30]: "dans 30 minutes",
};

function isAuthorized(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const header = req.headers.get("authorization");
  if (header === `Bearer ${secret}`) return true;

  return req.nextUrl.searchParams.get("secret") === secret;
}

async function processDueReminders() {
  const now = new Date();

  const due = await prisma.eventReminder.findMany({
    where: {
      sentAt: null,
      remindAt: { lte: now },
      pushSubscriptionId: { not: null },
    },
    include: { event: true, pushSubscription: true },
  });

  if (due.length === 0) {
    return { processed: 0, sent: 0, failed: 0, removed: 0 };
  }

  const expiredEndpoints = new Set<string>();
  const sentReminderIds: number[] = [];
  let sent = 0;
  let failed = 0;

  for (const reminder of due) {
    const sub = reminder.pushSubscription;
    if (!sub) continue;

    const result = await sendPushToTargets(
      [{ endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth }],
      {
        title: reminder.event.title,
        body: `Ca commence ${DELAY_LABEL[reminder.delay]} !`,
        url: "/programme",
        tag: `reminder-${reminder.id}`,
      },
    );

    sent += result.sent;
    failed += result.failed;
    result.expiredEndpoints.forEach((e) => expiredEndpoints.add(e));
    sentReminderIds.push(reminder.id);
  }

  if (sentReminderIds.length > 0) {
    await prisma.eventReminder.updateMany({
      where: { id: { in: sentReminderIds } },
      data: { sentAt: new Date() },
    });
  }

  if (expiredEndpoints.size > 0) {
    await prisma.pushSubscription.deleteMany({
      where: { endpoint: { in: Array.from(expiredEndpoints) } },
    });
  }

  return {
    processed: due.length,
    sent,
    failed,
    removed: expiredEndpoints.size,
  };
}

// Traitement des notifications programmées à heure fixe
async function processScheduledPushes() {
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000); // Tolérance de 5 min

  // Récupérer les notifications programmées qui doivent être envoyées
  const duePushes = await prisma.scheduledPush.findMany({
    where: {
      sentAt: null,
      cancelledAt: null,
      scheduledAt: {
        lte: now,
        gte: fiveMinutesAgo, // Ne pas envoyer les trop vieilles (cron manqué)
      },
    },
    include: {
      topic: true,
    },
  });

  if (duePushes.length === 0) {
    return { processed: 0, sent: 0, failed: 0, removed: 0 };
  }

  const expiredEndpoints = new Set<string>();
  const sentPushIds: number[] = [];
  let sent = 0;
  let failed = 0;

  for (const push of duePushes) {
    // Récupérer les abonnés (tous ou par topic)
    let subscriptions;
    if (push.topicId) {
      const subTopics = await prisma.pushSubscriptionTopic.findMany({
        where: { topicId: push.topicId },
        include: {
          pushSubscription: {
            select: { endpoint: true, p256dh: true, auth: true },
          },
        },
      });
      subscriptions = subTopics.map((st) => st.pushSubscription);
    } else {
      subscriptions = await prisma.pushSubscription.findMany({
        select: { endpoint: true, p256dh: true, auth: true },
      });
    }

    if (subscriptions.length === 0) {
      // Marquer comme envoyé même si 0 destinataire (pour ne pas réessayer)
      sentPushIds.push(push.id);
      continue;
    }

    const result = await sendPushToTargets(subscriptions, {
      title: push.title,
      body: push.body,
      url: push.url || "/",
      tag: `scheduled-${push.id}`,
    });

    sent += result.sent;
    failed += result.failed;
    result.expiredEndpoints.forEach((e) => expiredEndpoints.add(e));
    sentPushIds.push(push.id);
  }

  // Marquer comme envoyés
  if (sentPushIds.length > 0) {
    await prisma.scheduledPush.updateMany({
      where: { id: { in: sentPushIds } },
      data: { sentAt: new Date() },
    });
  }

  // Nettoyer les subscriptions expirées
  if (expiredEndpoints.size > 0) {
    await prisma.pushSubscription.deleteMany({
      where: { endpoint: { in: Array.from(expiredEndpoints) } },
    });
  }

  return {
    processed: duePushes.length,
    sent,
    failed,
    removed: expiredEndpoints.size,
  };
}

async function handle(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Acces refuse" }, { status: 401 });
  }

  if (!isPushConfigured()) {
    return NextResponse.json(
      { error: "Notifications push non configurees sur le serveur" },
      { status: 503 },
    );
  }

  // Traiter les rappels d'événements ET les notifications programmées
  const [remindersSummary, scheduledSummary] = await Promise.all([
    processDueReminders(),
    processScheduledPushes(),
  ]);

  return NextResponse.json({
    reminders: remindersSummary,
    scheduled: scheduledSummary,
    total: {
      processed: remindersSummary.processed + scheduledSummary.processed,
      sent: remindersSummary.sent + scheduledSummary.sent,
      failed: remindersSummary.failed + scheduledSummary.failed,
      removed: remindersSummary.removed + scheduledSummary.removed,
    },
  });
}

export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}
