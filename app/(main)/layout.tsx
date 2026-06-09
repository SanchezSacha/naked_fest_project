import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex-1 pt-14 pb-40">{children}</main>
      <BottomNav />
    </>
  );
}
