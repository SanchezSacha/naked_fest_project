import prisma from "@/lib/prisma";
import { createVerificationEmail, sendEmail } from "@/lib/email";
import { addMinutes, createToken, getBaseUrl } from "@/lib/tokens";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z
  .object({
    email: z.email(),
    name: z.string().min(2).max(100).optional().or(z.literal("")),
    password: z.string().min(12).max(100),
    passwordConfirmation: z.string().min(12).max(100),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["passwordConfirmation"],
  });

export async function POST(req: NextRequest) {
  const parsed = registerSchema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Donnees invalides" }, { status: 400 });
  }

  const { email, name, password } = parsed.data;
  const hashed = await bcrypt.hash(password, 10);
  const token = createToken();
  const verificationUrl = `${getBaseUrl(req.url)}/verify-email?token=${token}`;

  try {
    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
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
  } catch {
    return NextResponse.json({ error: "Email deja utilise" }, { status: 409 });
  }
}
