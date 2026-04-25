import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
