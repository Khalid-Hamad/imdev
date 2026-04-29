"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const heights = { sm: 36, md: 44, lg: 56 };
  const h = heights[size];
  const w = Math.round(h * 3.5);

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const src = mounted && resolvedTheme === "dark" ? "/logo-dark.png" : "/logo-light.png";

  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src={src}
        alt="im.dev"
        width={w}
        height={h}
        className="object-contain"
        priority
      />
    </span>
  );
}
