// API pour gerer les topics/sources de notification
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// GET - Liste tous les topics (public)
export async function GET() {
  const topics = await prisma.pushTopic.findMany({
    orderBy: { label: "asc" },
  });
  return NextResponse.json(topics);
}

// POST - Cree un nouveau topic (admin only)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { key, label, description, color, isDefault } = body;

  if (!key || !label) {
    return NextResponse.json(
      { error: "Key and label are required" },
      { status: 400 }
    );
  }

  try {
    const topic = await prisma.pushTopic.create({
      data: {
        key: key.toLowerCase().replace(/\s+/g, "-"),
        label,
        description,
        color,
        isDefault: isDefault ?? false,
      },
    });
    return NextResponse.json(topic, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Topic key already exists" },
      { status: 409 }
    );
  }
}
