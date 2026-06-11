// API pour gerer les notifications push programmées (CRUD admin)
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const scheduledSchema = z.object({
  title: z.string().min(1).max(120),
  body: z.string().min(1).max(500),
  url: z.string().min(1).max(500).optional(),
  scheduledAt: z.string().datetime(), // ISO 8601
  topicKey: z.string().optional(),
});

// GET - Liste toutes les notifications programmées (admin)
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const scheduled = await prisma.scheduledPush.findMany({
    orderBy: { scheduledAt: "asc" },
    include: {
      topic: { select: { key: true, label: true, color: true } },
    },
  });

  return NextResponse.json(scheduled);
}

// POST - Créer une notification programmée (admin)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = scheduledSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { title, body: pushBody, url, scheduledAt, topicKey } = parsed.data;

  // Vérifier que la date est dans le futur
  const scheduledDate = new Date(scheduledAt);
  if (scheduledDate <= new Date()) {
    return NextResponse.json(
      { error: "La date doit être dans le futur" },
      { status: 400 }
    );
  }

  // Récupérer le topic si spécifié
  let topicId: number | null = null;
  if (topicKey) {
    const topic = await prisma.pushTopic.findUnique({
      where: { key: topicKey },
    });
    if (!topic) {
      return NextResponse.json({ error: "Topic inconnu" }, { status: 404 });
    }
    topicId = topic.id;
  }

  const scheduled = await prisma.scheduledPush.create({
    data: {
      title,
      body: pushBody,
      url: url || null,
      scheduledAt: scheduledDate,
      topicId,
    },
    include: {
      topic: { select: { key: true, label: true, color: true } },
    },
  });

  return NextResponse.json(scheduled, { status: 201 });
}
