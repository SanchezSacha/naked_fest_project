import prisma from "@/lib/prisma";
import { createPasswordResetEmail, sendEmail } from "@/lib/email";
import { addMinutes, createToken, getBaseUrl } from "@/lib/tokens";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.email(),
});

export async function POST(req: NextRequest) {
  const parsed = forgotPasswordSchema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (!user) {
    return NextResponse.json({ success: true });
  }

  const token = createToken();
  const resetUrl = `${getBaseUrl(req.url)}/reset-password?token=${token}`;

  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt: addMinutes(new Date(), 30),
    },
  });
  const emailResult = await sendEmail({
    to: user.email,
    subject: "Reinitialisez votre mot de passe N'FEST",
    html: createPasswordResetEmail(resetUrl),
  });

  return NextResponse.json({
    success: true,
    emailSent: emailResult.sent,
    resetUrl: emailResult.sent ? undefined : resetUrl,
    warning: emailResult.sent ? undefined : emailResult.error,
  });
}
