import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({ className, interactive, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6",
        "transition-all duration-300 ease-out",
        interactive && "cursor-pointer hover:-translate-y-0.5 hover:border-[var(--color-accent)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-[22px] font-semibold tracking-[-0.005em] text-[var(--color-text-primary)]",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-[15px] text-[var(--color-text-secondary)] leading-[1.47] mt-2",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
