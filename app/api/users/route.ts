import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createVerificationEmail, sendEmail } from "@/lib/email";
import prisma from "@/lib/prisma";
import { addMinutes, createToken, getBaseUrl } from "@/lib/tokens";

const registerSchema = z
  .object({
    email: z
      .email("L'adresse email n'est pas valide")
      .transform((email) => email.trim().toLowerCase()),
    name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caracteres").max(100),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caracteres")
      .max(100),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["passwordConfirmation"],
  });

function getValidationMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "Les donnees du formulaire sont invalides";
}

function getPrismaErrorCode(error: unknown) {
  if (error && typeof error === "object" && "code" in error) {
    return String(error.code);
  }

  return null;
}

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Le formulaire envoye est illisible" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: getValidationMessage(parsed.error),
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { email, name, password } = parsed.data;
  const hashed = await bcrypt.hash(password, 10);
  const token = createToken();
  const verificationUrl = `${getBaseUrl(req.url)}/verify-email?token=${token}`;

  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashed,
        emailVerificationTokens: {
          create: {
            token,
            expiresAt: addMinutes(new Date(), 60),
          },
        },
      },
    });

    const emailResult = await sendEmail({
      to: user.email,
      subject: "Verifiez votre email N'FEST",
      html: createVerificationEmail(user.name, verificationUrl),
    });

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        emailSent: emailResult.sent,
        verificationUrl: emailResult.sent ? undefined : verificationUrl,
        warning: emailResult.sent ? undefined : emailResult.error,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration failed:", error);
    const code = getPrismaErrorCode(error);

    if (code === "P2002") {
      return NextResponse.json({ error: "Cette adresse email est deja utilisee" }, { status: 409 });
    }

    if (code === "P2021" || code === "P2022") {
      return NextResponse.json(
        { error: "La base de donnees n'est pas a jour. Lance les migrations Prisma." },
        { status: 503 },
      );
    }

    if (code === "P1001" || code === "P1002") {
      return NextResponse.json(
        { error: "Impossible de joindre la base de donnees. Verifie DATABASE_URL." },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "L'inscription a echoue cote base de donnees. Consulte le terminal Next.js." },
      { status: 500 },
    );
  }
}
