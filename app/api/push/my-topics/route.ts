// API pour recuperer les topics auxquels un utilisateur est abonne
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
      topics: {
        include: {
          topic: {
            select: {
              id: true,
              key: true,
              label: true,
              color: true,
            },
          },
        },
      },
    },
  });

  if (!pushSub) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const topics = pushSub.topics.map((t) => t.topic);
  return NextResponse.json(topics);
}
