"use client";

import { useEffect } from "react";
import { Bebas_Neue, Barlow_Condensed, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Button from "@/components/Button";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export default function GlobalError({
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
    <html
      lang="fr"
      className={`${bebasNeue.variable} ${barlowCondensed.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-dark text-white">
        <title>Erreur critique — Naked Fest Winter&apos;27</title>
        <main className="flex-1 flex items-center justify-center">
          <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-8 text-center">
            {/* Glow */}
            <div
              className="absolute inset-0 opacity-40"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(circle at 50% 40%, rgba(255,45,155,0.12), transparent 60%)",
              }}
            />

            <div className="relative z-10 flex flex-col items-center gap-4">
              <span className="font-condensed text-pink text-xs tracking-[0.4em] uppercase">
                Erreur critique
              </span>

              {/* BLACKOUT — triple neon layer */}
              <h1 className="relative font-display leading-none uppercase mt-2 text-[clamp(60px,15vw,140px)]">
                <span
                  className="absolute inset-0 text-pink select-none"
                  aria-hidden="true"
                  style={{ transform: "translate(-6px, -6px)" }}
                >
                  Blackout
                </span>
                <span
                  className="absolute inset-0 text-lime select-none"
                  aria-hidden="true"
                  style={{ transform: "translate(6px, 6px)" }}
                >
                  Blackout
                </span>
                <span className="relative text-white">Blackout</span>
              </h1>

              <p className="font-condensed text-cyan text-sm tracking-[0.3em] uppercase mt-3">
                Coupure générale du site
              </p>

              <p className="text-white/45 text-sm leading-relaxed max-w-sm mt-2">
                Le festival a perdu le courant. Nos équipes rétablissent la
                connexion — relancez le générateur ou rechargez la page.
              </p>

              {error?.digest && (
                <p className="font-condensed text-white/25 text-[10px] tracking-[0.25em] uppercase mt-2">
                  Réf : {error.digest}
                </p>
              )}

              <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                <Button onClick={() => unstable_retry()} color="lime" variant="solid-dark" size="lg">
                  Relancer
                </Button>
                <Button as="link" href="/" color="cyan" variant="outline" size="md">
                  Retour à l&apos;accueil
                </Button>
              </div>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
