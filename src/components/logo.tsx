"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Source PNGs are 1024×409 → aspect ratio ~2.504. Keeping width/height
// in sync with that lets next/image generate a pixel-tight optimized
// bitmap for the rendered size; mismatched dimensions force scaling
// and read as soft/blurry on Retina.
const LOGO_ASPECT = 1024 / 409;

export function Logo({ size = "md", className = "" }: LogoProps) {
  const heights = { sm: 36, md: 44, lg: 56 };
  const h = heights[size];
  const w = Math.round(h * LOGO_ASPECT);

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const src = mounted && resolvedTheme === "dark" ? "/logo-dark.png" : "/logo-light.png";

  // The PNG source has a hard-coded blue accent. The design system flips
  // accent to orange in dark mode (see --color-accent in globals.css), so
  // we hue-rotate the dark-mode logo to match. White/grey portions of the
  // logo are unaffected by hue-rotate; only the chromatic blue shifts.
  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src={src}
        alt="im.dev"
        width={w}
        height={h}
        sizes={`${w}px`}
        quality={95}
        priority
        className="dark:[filter:hue-rotate(170deg)_saturate(1.1)]"
      />
    </span>
  );
}
