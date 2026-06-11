import Link from "next/link";
import Image from "next/image";
import HeaderAuthActions from "@/components/HeaderAuthActions";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-[#252525]/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12">
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
          
          {/* Desktop Navigation avec indicateurs actifs */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { href: "/programme", label: "Programme" },
              { href: "/carte", label: "Carte" },
              { href: "/favoris", label: "Favoris" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 font-condensed text-sm uppercase tracking-[0.12em] text-white/70 hover:text-white transition-all duration-200 rounded-lg hover:bg-white/5 group"
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute bottom-1 left-4 right-4 h-px bg-lime scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
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
