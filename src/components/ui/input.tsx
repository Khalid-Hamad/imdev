import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-[13px] font-semibold text-[var(--color-text-primary)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-[var(--radius-md)]",
            "px-4 py-3 text-[17px] text-[var(--color-text-primary)]",
            "placeholder:text-[var(--color-text-tertiary)]",
            "focus:outline-none focus:border-[var(--color-accent)] focus:ring-[3px] focus:ring-[var(--color-accent)]/15",
            "transition-all duration-200",
            error && "border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]/15",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-[13px] text-[var(--color-error)]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
