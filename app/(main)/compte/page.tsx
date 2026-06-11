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
    <div className="min-h-[calc(100vh-14rem)]">
      {/* Header de section */}
      <section className="border-b border-dark-border/60">
        <div className="px-6 py-16 md:px-12 md:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto">
            <span className="font-condensed text-xs uppercase tracking-[0.3em] text-pink">
              Espace personnel
            </span>
            <h1 className="mt-3 font-display text-[clamp(48px,10vw,80px)] uppercase leading-none text-white">
              Mon compte
            </h1>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="px-6 py-10 md:px-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {!loaded ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-lime/30 border-t-lime rounded-full animate-spin" />
            </div>
          ) : user ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Carte profil */}
              <div className="lg:col-span-2 glass border border-white/10 rounded-2xl p-6 md:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-lime/20 to-pink/20 flex items-center justify-center">
                    <span className="font-display text-2xl text-white">
                      {user.name?.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                  <div>
                    <p className="font-condensed text-xs uppercase tracking-[0.2em] text-white/50">Bienvenue</p>
                    <p className="text-2xl text-white font-light">{user.name || "Utilisateur"}</p>
                  </div>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <p className="font-condensed text-xs uppercase tracking-[0.2em] text-white/40">Email</p>
                    <p className="mt-1 text-white">{user.email}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <p className="font-condensed text-xs uppercase tracking-[0.2em] text-white/40">Statut</p>
                    <p className="mt-1 text-lime flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
                      Connecté
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <Link
                href="/favoris"
                className="group glass border border-white/10 rounded-2xl p-6 md:p-8 hover:border-lime/30 transition-all duration-300 hover-lift"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-condensed text-xs uppercase tracking-[0.2em] text-white/50">Mes favoris</span>
                  <svg className="w-5 h-5 text-white/30 group-hover:text-lime transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 1 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z" />
                  </svg>
                </div>
                <p className="font-display text-3xl text-white">Voir ma sélection</p>
              </Link>

              <button
                type="button"
                onClick={() => signOut({ redirectTo: "/login" })}
                className="group glass border border-white/10 rounded-2xl p-6 md:p-8 hover:border-pink/30 transition-all duration-300 hover-lift text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-condensed text-xs uppercase tracking-[0.2em] text-white/50">Session</span>
                  <svg className="w-5 h-5 text-white/30 group-hover:text-pink transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                </div>
                <p className="font-display text-3xl text-white group-hover:text-pink transition-colors">Déconnexion</p>
              </button>
            </div>
          ) : (
            <div className="glass border border-white/10 rounded-2xl p-8 md:p-12 text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </div>
              <p className="text-xl text-white mb-2">Connectez-vous</p>
              <p className="text-white/50 mb-8">Accédez à votre compte et gérez vos favoris</p>
              <Link
                href="/login"
                className="inline-flex border-2 border-lime bg-lime px-8 py-4 font-condensed text-xs font-bold uppercase tracking-[0.2em] text-dark hover:bg-transparent hover:text-lime transition-all"
              >
                Connexion
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
