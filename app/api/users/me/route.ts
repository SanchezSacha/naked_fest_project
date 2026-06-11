import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// ── PATCH — mise à jour du profil ──────────────────────────────────────────

const updateSchema = z
  .object({
    name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caracteres").max(100).optional(),
    email: z
      .string()
      .email("L'adresse email n'est pas valide")
      .transform((e) => e.trim().toLowerCase())
      .optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8, "Le mot de passe doit contenir au moins 8 caracteres").max(100).optional(),
    newPasswordConfirmation: z.string().optional(),
  })
  .refine(
    (data) => !data.newPassword || data.newPassword === data.newPasswordConfirmation,
    { message: "Les mots de passe ne correspondent pas", path: ["newPasswordConfirmation"] },
  )
  .refine(
    (data) => !data.newPassword || !!data.currentPassword,
    { message: "Le mot de passe actuel est requis", path: ["currentPassword"] },
  );

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const userId = Number(session.user.id);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requete invalide" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Donnees invalides" },
      { status: 400 },
    );
  }

  const { name, email, currentPassword, newPassword } = parsed.data;

  if (newPassword) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !currentPassword || !(await bcrypt.compare(currentPassword, user.password))) {
      return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });
    }
  }

  if (email) {
    const existing = await prisma.user.findFirst({
      where: { email, NOT: { id: userId } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Cette adresse email est deja utilisee" },
        { status: 409 },
      );
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email }),
      ...(newPassword && { password: await bcrypt.hash(newPassword, 10) }),
    },
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json(updatedUser);
}

// ── DELETE — suppression du compte ────────────────────────────────────────

const deleteSchema = z.object({
  password: z.string().min(1, "Le mot de passe est requis"),
});

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const userId = Number(session.user.id);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requete invalide" }, { status: 400 });
  }

  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Donnees invalides" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !(await bcrypt.compare(parsed.data.password, user.password))) {
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id: userId } });

  return NextResponse.json({ success: true });
}
