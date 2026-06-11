import Link from "next/link";
import Image from "next/image";
import HeaderAuthActions from "@/components/HeaderAuthActions";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-[#252525]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Accueil"
            className="font-display text-white text-2xl tracking-widest uppercase transition-colors duration-200 hover:text-lime"
          >
            N&apos;FEST
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link 
              href="/programme" 
              className="font-condensed text-sm uppercase tracking-[0.15em] text-white/70 hover:text-lime transition-colors"
            >
              Programme
            </Link>
            <Link 
              href="/carte" 
              className="font-condensed text-sm uppercase tracking-[0.15em] text-white/70 hover:text-lime transition-colors"
            >
              Carte
            </Link>
            <Link 
              href="/favoris" 
              className="font-condensed text-sm uppercase tracking-[0.15em] text-white/70 hover:text-lime transition-colors"
            >
              Favoris
            </Link>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/recherche"
              aria-label="Rechercher"
              className="opacity-50 hover:opacity-100 transition-opacity duration-200 p-2"
            >
              <Image src="/Icon_search.svg" alt="Rechercher" width={20} height={20} />
            </Link>
            <HeaderAuthActions />
          </div>
        </div>
      </div>
    </header>
  );
}
