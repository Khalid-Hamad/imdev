import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getAllSettings } from "@/lib/queries/settings";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings: Record<string, unknown> = {};
  try {
    settings = await getAllSettings();
  } catch {
    // DB not available yet
  }

  const socialLinks = {
    github: (settings.githubUrl as string) || "",
    linkedin: (settings.linkedinUrl as string) || "",
  };

  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen">{children}</main>
      <Footer socialLinks={socialLinks} />
    </>
  );
}
