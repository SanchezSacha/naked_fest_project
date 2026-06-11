import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SideNav from "@/components/SideNav";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {/* Mobile: bottom nav / Desktop: side nav */}
      <BottomNav />
      <SideNav />
      
      <main className="flex-1 pt-14 pb-32 lg:pb-8 lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12">
          {children}
        </div>
      </main>
    </>
  );
}
