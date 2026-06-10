import Link from "next/link";
import Image from "next/image";
import HeaderAuthActions from "@/components/HeaderAuthActions";

export default function Header() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-black border-b border-[#252525]">
        <Link
          href="/"
          aria-label="Accueil"
          className="font-display text-white text-2xl tracking-widest uppercase transition-colors duration-200 hover:text-lime"
        >
          N&apos;FEST
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/recherche"
            aria-label="Rechercher"
            className="opacity-50 hover:opacity-100 transition-opacity duration-200"
          >
            <Image src="/Icon_search.svg" alt="Rechercher" width={18} height={18} />
          </Link>
          <HeaderAuthActions />
        </div>
      </header>
      
    </>
  );
}
