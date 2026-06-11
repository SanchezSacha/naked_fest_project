import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Button from "@/components/Button";

export default function NotFound() {
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
                "radial-gradient(circle at 50% 40%, rgba(200,255,0,0.08), transparent 60%)",
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-4">
            {/* Badge */}
            <span className="font-condensed text-pink text-xs tracking-[0.4em] uppercase">
              Erreur · 404
            </span>

            {/* 404 — triple neon layer */}
            <h1 className="relative font-display leading-none uppercase mt-2 text-[clamp(120px,38vw,260px)]">
              <span
                className="absolute inset-0 text-pink select-none"
                aria-hidden="true"
                style={{ transform: "translate(-7px, -7px)" }}
              >
                404
              </span>
              <span
                className="absolute inset-0 text-lime select-none"
                aria-hidden="true"
                style={{ transform: "translate(7px, 7px)" }}
              >
                404
              </span>
              <span className="relative text-white">404</span>
            </h1>

            <p className="font-condensed text-cyan text-sm tracking-[0.3em] uppercase mt-3">
              Zone introuvable
            </p>

            <p className="text-white/45 text-sm leading-relaxed max-w-sm mt-2">
              Cette page s&apos;est perdue dans le froid des Ardennes. Le sentier
              que vous cherchez n&apos;existe pas ou a été enseveli sous la glace.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <Button as="link" href="/" color="lime" variant="solid-dark" size="lg">
                Retour à l&apos;accueil
              </Button>
              <Button as="link" href="/programme" color="cyan" variant="outline" size="md">
                Voir le programme
              </Button>
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
