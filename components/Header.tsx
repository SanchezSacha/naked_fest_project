import Link from "next/link";
import Image from "next/image";
import HeaderAuthActions from "@/components/HeaderAuthActions";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-[#252525]/80">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Logo avec glow effect au hover */}
          <Link
            href="/"
            aria-label="Accueil"
            className="font-display text-white text-2xl lg:text-3xl tracking-widest uppercase transition-all duration-300 hover:text-lime relative group"
          >
            <span className="relative z-10">N&apos;FEST</span>
            <span className="absolute inset-0 blur-lg bg-lime/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0" />
          </Link>
          
          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link
              href="/"
              className="font-condensed text-xs font-bold uppercase tracking-[0.2em] text-white/70 hover:text-lime transition-colors"
            >
              Accueil
            </Link>
            <Link
              href="/programme"
              className="font-condensed text-xs font-bold uppercase tracking-[0.2em] text-white/70 hover:text-lime transition-colors"
            >
              Programme
            </Link>
            <Link
              href="/carte"
              className="font-condensed text-xs font-bold uppercase tracking-[0.2em] text-white/70 hover:text-lime transition-colors"
            >
              Carte
            </Link>
          </nav>

          {/* Actions avec meilleurs boutons */}
          <div className="flex items-center gap-2 lg:gap-3">
            <Link
              href="/recherche"
              aria-label="Rechercher"
              className="p-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <Image src="/Icon_search.svg" alt="Rechercher" width={20} height={20} className="opacity-70 hover:opacity-100 transition-opacity" />
            </Link>
            <div className="pl-2 border-l border-white/10">
              <HeaderAuthActions />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
