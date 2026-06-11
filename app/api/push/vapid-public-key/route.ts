import { NextResponse } from "next/server";

export async function GET() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? null;

  if (!publicKey) {
    return NextResponse.json(
      { error: "Cle publique VAPID non configuree" },
      { status: 503 },
    );
  }

  return NextResponse.json({ publicKey });
}
