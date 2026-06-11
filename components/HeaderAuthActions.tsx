"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Button from "@/components/Button";

export default function HeaderAuthActions() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <span className="border border-lime/40 px-6 py-3 font-condensed text-[10px] font-bold uppercase tracking-[0.25em] text-lime/60">
        ...
      </span>
    );
  }

  if (session?.user) {
    const userName = session.user.name || session.user.email;
    return (
      <div className="flex items-center gap-3">
        <span className="hidden max-w-36 truncate font-condensed text-[11px] font-bold uppercase tracking-[0.16em] text-white/70 sm:inline">
          {userName}
        </span>
        <Button onClick={() => signOut({ redirectTo: "/login" })} color="pink" variant="filled" size="sm">
          Deconnexion
        </Button>
      </div>
    );
  }

  return (
    <Button as="link" href="/login" color="lime" variant="filled" size="sm">
      Connexion
    </Button>
  );
}
