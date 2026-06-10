"use client";

import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

type SessionResponse = {
  user?: {
    name?: string | null;
    email?: string | null;
  };
};

export default function ProgrammeUserBar() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" })
      .then((res) => res.json())
      .then((session: SessionResponse) => {
        const name = session.user?.name || session.user?.email || null;
        setUserName(name);
      })
      .catch(() => setUserName(null));
  }, []);

  if (!userName) {
    return null;
  }

  return (
    <section className="border-b border-[#252525] bg-white/[0.02]">
      <div className="flex flex-col gap-4 px-8 py-5 md:flex-row md:items-center md:justify-between md:px-10">
        <p className="font-condensed text-2xl font-bold uppercase tracking-[0.12em] text-white">
          Bonjour <span className="text-lime">{userName}</span>
        </p>
        <button
          type="button"
          onClick={() => signOut({ redirectTo: "/login" })}
          className="self-start border border-pink px-6 py-3 font-condensed text-xs font-bold uppercase tracking-[0.25em] text-pink transition-all duration-300 hover:bg-pink hover:text-white hover:shadow-[0_0_18px_rgba(255,45,155,0.24)] md:self-auto"
        >
          Deconnexion
        </button>
      </div>
    </section>
  );
}
