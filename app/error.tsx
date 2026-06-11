"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Button from "@/components/Button";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="flex-1 pt-14 pb-40">
        <section className="relative min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center overflow-hidden px-8 text-center">
          {/* Glow */}
          <div
            className="absolute inset-0 opacity-40"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, rgba(255,45,155,0.10), transparent 60%)",
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-4">
            {/* Badge */}
            <span className="font-condensed text-cyan text-xs tracking-[0.4em] uppercase">
              Erreur · 500
            </span>

            {/* GLITCH title — triple neon layer */}
            <h1 className="relative font-display leading-none uppercase mt-2 text-[clamp(64px,16vw,140px)]">
              <span
                className="absolute inset-0 text-cyan select-none"
                aria-hidden="true"
                style={{ transform: "translate(-6px, -6px)" }}
              >
                Glitch
              </span>
              <span
                className="absolute inset-0 text-pink select-none"
                aria-hidden="true"
                style={{ transform: "translate(6px, 6px)" }}
              >
                Glitch
              </span>
              <span className="relative text-white">Glitch</span>
            </h1>

            <p className="font-condensed text-lime text-sm tracking-[0.3em] uppercase mt-3">
              Une faille s&apos;est ouverte
            </p>

            <p className="text-white/45 text-sm leading-relaxed max-w-sm mt-2">
              Quelque chose a gelé en coulisses. Le système tente de se réchauffer —
              réessayez ou revenez au camp de base.
            </p>

            {error?.digest && (
              <p className="font-condensed text-white/25 text-[10px] tracking-[0.25em] uppercase mt-2">
                Réf : {error.digest}
              </p>
            )}

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <Button onClick={() => unstable_retry()} color="lime" variant="solid-dark" size="lg">
                Réessayer
              </Button>
              <Button as="link" href="/" color="cyan" variant="outline" size="md">
                Retour à l&apos;accueil
              </Button>
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
