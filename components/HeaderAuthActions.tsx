"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

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
        <button
          type="button"
          onClick={() => signOut({ redirectTo: "/login" })}
          className="border border-pink bg-pink px-4 py-3 font-condensed text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-transparent hover:[color:var(--neon-pink)] hover:shadow-[0_0_18px_rgba(255,45,155,0.24)]"
        >
          Deconnexion
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="border border-lime bg-lime px-6 py-3 font-condensed text-[10px] font-bold uppercase tracking-[0.25em] text-dark transition-all duration-300 hover:bg-[#111113] hover:[color:var(--neon-lime)] hover:shadow-[0_0_18px_rgba(200,255,0,0.25)]"
    >
      Connexion
    </Link>
  );
}
