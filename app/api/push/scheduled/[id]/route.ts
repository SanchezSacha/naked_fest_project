// API pour modifier/supprimer une notification programmée spécifique
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  body: z.string().min(1).max(500).optional(),
  url: z.string().min(1).max(500).optional().nullable(),
  scheduledAt: z.string().datetime().optional(),
  topicKey: z.string().optional().nullable(),
  cancelled: z.boolean().optional(),
});

async function checkAuth() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return false;
  }
  return true;
}

// PATCH - Modifier une notification programmée
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const scheduledId = parseInt(id, 10);
  if (isNaN(scheduledId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides" },
      { status: 400 }
    );
  }

  const { title, body: pushBody, url, scheduledAt, topicKey, cancelled } =
    parsed.data;

  // Récupérer la notif existante
  const existing = await prisma.scheduledPush.findUnique({
    where: { id: scheduledId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Ne pas modifier si déjà envoyée
  if (existing.sentAt) {
    return NextResponse.json(
      { error: "Impossible de modifier une notification déjà envoyée" },
      { status: 409 }
    );
  }

  // Préparer les données de mise à jour
  const updateData: Record<string, unknown> = {};
  if (title !== undefined) updateData.title = title;
  if (pushBody !== undefined) updateData.body = pushBody;
  if (url !== undefined) updateData.url = url;
  if (scheduledAt !== undefined) {
    const scheduledDate = new Date(scheduledAt);
    if (scheduledDate <= new Date()) {
      return NextResponse.json(
        { error: "La date doit être dans le futur" },
        { status: 400 }
      );
    }
    updateData.scheduledAt = scheduledDate;
  }
  if (cancelled === true) {
    updateData.cancelledAt = new Date();
  } else if (cancelled === false) {
    updateData.cancelledAt = null;
  }

  // Gérer le changement de topic
  if (topicKey !== undefined) {
    if (topicKey === null) {
      updateData.topicId = null;
    } else {
      const topic = await prisma.pushTopic.findUnique({
        where: { key: topicKey },
      });
      if (!topic) {
        return NextResponse.json({ error: "Topic inconnu" }, { status: 404 });
      }
      updateData.topicId = topic.id;
    }
  }

  const updated = await prisma.scheduledPush.update({
    where: { id: scheduledId },
    data: updateData,
    include: {
      topic: { select: { key: true, label: true, color: true } },
    },
  });

  return NextResponse.json(updated);
}

// DELETE - Supprimer une notification programmée
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const scheduledId = parseInt(id, 10);
  if (isNaN(scheduledId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  try {
    await prisma.scheduledPush.delete({
      where: { id: scheduledId },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
