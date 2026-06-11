// API pour s'abonner/desabonner a un topic specifique
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { endpoint, topicKey, subscribe } = await req.json();

  if (!endpoint || !topicKey) {
    return NextResponse.json(
      { error: "Endpoint and topicKey required" },
      { status: 400 }
    );
  }

  const pushSub = await prisma.pushSubscription.findUnique({
    where: { endpoint },
  });

  if (!pushSub) {
    return NextResponse.json(
      { error: "Subscription not found" },
      { status: 404 }
    );
  }

  const topic = await prisma.pushTopic.findUnique({
    where: { key: topicKey },
  });

  if (!topic) {
    return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  }

  if (subscribe) {
    // Abonnement
    await prisma.pushSubscriptionTopic.upsert({
      where: {
        pushSubscriptionId_topicId: {
          pushSubscriptionId: pushSub.id,
          topicId: topic.id,
        },
      },
      update: {},
      create: {
        pushSubscriptionId: pushSub.id,
        topicId: topic.id,
      },
    });
  } else {
    // Desabonnement
    await prisma.pushSubscriptionTopic.deleteMany({
      where: {
        pushSubscriptionId: pushSub.id,
        topicId: topic.id,
      },
    });
  }

  return NextResponse.json({ success: true, subscribed: subscribe });
}
