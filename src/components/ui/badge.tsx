import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-[var(--radius-pill)] text-[13px] font-medium",
        {
          "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]":
            variant === "default",
          "bg-[var(--color-success)]/15 text-[var(--color-success)]":
            variant === "success",
          "bg-[var(--color-warning)]/15 text-[var(--color-warning)]":
            variant === "warning",
          "bg-[var(--color-error)]/15 text-[var(--color-error)]":
            variant === "error",
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
