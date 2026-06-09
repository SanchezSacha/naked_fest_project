import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-black border-b border-[#252525]">
        <span className="font-display text-white text-2xl tracking-widest uppercase">
          N&apos;FEST
        </span>
        <div className="flex items-center gap-4">
          <Link
            href="/recherche"
            aria-label="Rechercher"
            className="opacity-50 hover:opacity-100 transition-opacity duration-200"
          >
            <Image src="/Icon_search.svg" alt="Rechercher" width={18} height={18} />
          </Link>
          <Link
            href="/billetterie"
            className="border border-lime bg-lime text-dark font-condensed font-bold text-[10px] px-6 py-3 tracking-[0.25em] uppercase transition-all duration-300 hover:bg-transparent hover:text-lime"
          >
            Billetterie
          </Link>
        </div>
      </header>
      
    </>
  );
}
