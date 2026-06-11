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
      
      <main className="flex-1 pt-14 lg:pt-16 pb-32 lg:pb-8 lg:pl-60 xl:pl-64">
        {children}
      </main>
    </>
  );
}
