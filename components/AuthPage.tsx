import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

type AuthPageProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function AuthPage({ title, subtitle, children }: AuthPageProps) {
  return (
    <>
      <Header />
      <main className="min-h-screen px-6 pb-40 pt-28 md:px-10 md:pt-36">
        <section className="mx-auto max-w-4xl">
          <div className="text-center">
            <h1 className="font-display text-[clamp(56px,12vw,92px)] uppercase leading-none text-white">
              {title}
            </h1>
            <p className="mt-5 font-condensed text-2xl font-bold uppercase tracking-[0.22em] text-lime md:text-3xl">
              {subtitle}
            </p>
          </div>

          <div className="relative mt-14 border border-lime/35 bg-[#141416] px-7 py-12 md:px-16 md:py-16">
            <span className="absolute -left-1.5 -top-1.5 h-8 w-8 border-l-4 border-t-4 border-lime" />
            <span className="absolute -bottom-1.5 -right-1.5 h-8 w-8 border-b-4 border-r-4 border-lime" />
            {children}
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
