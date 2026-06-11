// API pour initialiser les topics par defaut (a appeler une fois par l'admin)
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const DEFAULT_TOPICS = [
  {
    key: "general",
    label: "General",
    description: "Annonces importantes du festival",
    color: "#ff2d9b", // pink
    isDefault: true,
  },
  {
    key: "programme",
    label: "Programme",
    description: "Changements de scene et horaires",
    color: "#00d4ff", // cyan
    isDefault: true,
  },
  {
    key: "urgent",
    label: "Urgent",
    description: "Alertes et informations critiques",
    color: "#ff3333", // red
    isDefault: false,
  },
  {
    key: "benevoles",
    label: "Benevoles",
    description: "Appels a l'aide et informations benevoles",
    color: "#c8ff00", // lime
    isDefault: false,
  },
];

export async function POST() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const created = [];
  const skipped = [];

  for (const topic of DEFAULT_TOPICS) {
    try {
      const existing = await prisma.pushTopic.findUnique({
        where: { key: topic.key },
      });

      if (existing) {
        skipped.push(topic.key);
      } else {
        const newTopic = await prisma.pushTopic.create({ data: topic });
        created.push(newTopic);
      }
    } catch {
      skipped.push(topic.key);
    }
  }

  return NextResponse.json({
    created: created.length,
    skipped: skipped.length,
    topics: created,
  });
}
