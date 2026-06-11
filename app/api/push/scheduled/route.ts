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
  console.log("[API scheduled] POST called");
  
  const session = await auth();
  console.log("[API scheduled] Session:", session?.user?.email, "role:", session?.user?.role);
  
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  console.log("[API scheduled] Body:", body);
  
  const parsed = scheduledSchema.safeParse(body);
  console.log("[API scheduled] Parsed:", parsed.success, parsed.error?.issues);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { title, body: pushBody, url, scheduledAt, topicKey } = parsed.data;
  console.log("[API scheduled] Data:", { title, pushBody, url, scheduledAt, topicKey });

  // Vérifier que la date est dans le futur (avec 1 min de tolérance)
  const scheduledDate = new Date(scheduledAt);
  const now = new Date();
  const nowWithTolerance = new Date(now.getTime() - 60 * 1000); // 1 min de tolérance
  console.log("[API scheduled] ScheduledDate:", scheduledDate, "Now:", now, "Tolerance:", nowWithTolerance);
  
  if (scheduledDate <= nowWithTolerance) {
    return NextResponse.json(
      { error: "La date doit être dans le futur (actuellement: " + now.toISOString() + ")" },
      { status: 400 }
    );
  }

  // Récupérer le topic si spécifié
  let topicId: number | null = null;
  if (topicKey) {
    console.log("[API scheduled] Looking for topic:", topicKey);
    const topic = await prisma.pushTopic.findUnique({
      where: { key: topicKey },
    });
    if (!topic) {
      return NextResponse.json({ error: "Topic inconnu" }, { status: 404 });
    }
    topicId = topic.id;
    console.log("[API scheduled] Found topic:", topic.id);
  }

  console.log("[API scheduled] Creating scheduled push...");
  
  // Test: verifier que la table existe
  try {
    const count = await prisma.scheduledPush.count();
    console.log("[API scheduled] Table exists, current count:", count);
  } catch (tableErr) {
    console.error("[API scheduled] Table access error:", tableErr);
    return NextResponse.json(
      { 
        error: "La table ScheduledPush n'existe pas en base", 
        details: "Executez: npx prisma db push --accept-data-loss",
        tableError: String(tableErr)
      },
      { status: 500 }
    );
  }
  
  try {
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
    console.log("[API scheduled] Created:", scheduled.id);
    return NextResponse.json(scheduled, { status: 201 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    const errorCode = (err as { code?: string }).code;
    console.error("[API scheduled] Error creating:", err);
    return NextResponse.json(
      { 
        error: "Erreur base de données", 
        details: errorMessage,
        code: errorCode
      }, 
      { status: 500 }
    );
  }
}
