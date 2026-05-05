import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "im.dev — Software · Applied AI · ML",
    template: "%s | im.dev",
  },
  description:
    "Personal website of Khalid AlSubaie. End-to-End Engineer — Software, Applied AI, ML.",
  openGraph: {
    images: [{ url: "/og-image.png", width: 700, height: 300 }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
