import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const heights = {
    sm: 36,
    md: 44,
    lg: 56,
  };

  const h = heights[size];
  const w = Math.round(h * 3.5);

  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src="/logo-light.png"
        alt="im.dev"
        width={w}
        height={h}
        className="object-contain dark:invert"
        priority
      />
    </span>
  );
}
