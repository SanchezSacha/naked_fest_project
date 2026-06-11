"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

type SessionUser = {
  name?: string | null;
  email?: string | null;
};

export default function AccountPage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((session: { user?: SessionUser }) => {
        setUser(session.user ?? null);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <section className="mx-auto max-w-3xl px-6 py-20 md:px-10">
      <span className="font-condensed text-xs uppercase tracking-[0.3em] text-pink">
        Espace personnel
      </span>
      <h1 className="mt-3 font-display text-7xl uppercase text-white">Mon compte</h1>

      {!loaded ? (
        <p className="mt-10 text-white/45">Chargement...</p>
      ) : user ? (
        <div className="mt-10 border border-[#343438] bg-[#141416] p-7 md:p-10">
          <p className="font-condensed text-xs uppercase tracking-[0.2em] text-white/35">Nom</p>
          <p className="mt-1 text-xl text-white">{user.name || "Non renseigne"}</p>
          <p className="mt-7 font-condensed text-xs uppercase tracking-[0.2em] text-white/35">
            Email
          </p>
          <p className="mt-1 text-xl text-white">{user.email}</p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <Link
              href="/favoris"
              className="border-2 border-lime bg-lime px-6 py-4 text-center font-condensed text-xs font-bold uppercase tracking-[0.2em] text-dark transition-all hover:bg-[#111113] hover:[color:var(--neon-lime)]"
            >
              Mes favoris
            </Link>
            <button
              type="button"
              onClick={() => signOut({ redirectTo: "/login" })}
              className="border border-pink px-6 py-4 font-condensed text-xs font-bold uppercase tracking-[0.2em] text-pink transition-colors hover:bg-pink hover:text-white"
            >
              Deconnexion
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-10 border border-[#343438] bg-[#141416] p-8">
          <p className="text-white/60">Connectez-vous pour acceder a votre compte et vos favoris.</p>
          <Link
            href="/login"
            className="mt-6 inline-flex border-2 border-lime bg-lime px-7 py-4 font-condensed text-xs font-bold uppercase tracking-[0.2em] text-dark"
          >
            Connexion
          </Link>
        </div>
      )}
    </section>
  );
}
