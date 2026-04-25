import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 ease-out disabled:opacity-50 disabled:pointer-events-none",
          "active:scale-[0.98]",
          {
            "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] hover:scale-[1.02]":
              variant === "primary",
            "bg-transparent text-[var(--color-accent)] border-[1.5px] border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10":
              variant === "secondary",
            "bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]":
              variant === "ghost",
            "bg-[var(--color-error)] text-white hover:opacity-90":
              variant === "destructive",
          },
          {
            "text-[15px] px-4 py-2 rounded-[var(--radius-pill)]": size === "sm",
            "text-[17px] px-6 py-3 rounded-[var(--radius-pill)]": size === "md",
            "text-[17px] px-8 py-4 rounded-[var(--radius-pill)]": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button, type ButtonProps };
