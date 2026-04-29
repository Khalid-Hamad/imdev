import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const remoteHosts: { protocol: "https" | "http"; hostname: string }[] = [
  { protocol: "https", hostname: "**.githubusercontent.com" },
  { protocol: "https", hostname: "cdn.simpleicons.org" },
  { protocol: "https", hostname: "cdn.jsdelivr.net" },
];

const s3PublicUrl = process.env.S3_PUBLIC_URL;
if (s3PublicUrl) {
  try {
    const u = new URL(s3PublicUrl);
    remoteHosts.push({
      protocol: u.protocol === "http:" ? "http" : "https",
      hostname: u.hostname,
    });
  } catch {
    // ignore malformed URL
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    localPatterns: [{ pathname: "/uploads/**", search: "" }],
    remotePatterns: remoteHosts,
  },
};

export default withNextIntl(nextConfig);
