"use client";

import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import PushSubscriptionToggle from "@/components/PushSubscriptionToggle";

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
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <PushSubscriptionToggle />
          <Button
            onClick={() => signOut({ redirectTo: "/login" })}
            color="pink"
            variant="filled"
            size="sm"
            className="self-start md:self-auto"
          >
            Deconnexion
          </Button>
        </div>
      </div>
    </section>
  );
}
