"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Logo } from "@/components/logo";
import { Container } from "@/components/ui/container";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/blog", key: "blog" },
  { href: "/projects", key: "projects" },
  { href: "/uses", key: "uses" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[var(--color-nav-bg)] backdrop-blur-[20px] backdrop-saturate-[180%] border-b border-[var(--color-border)]">
      <Container>
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="shrink-0">
            <Logo size="sm" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="px-3 py-2 text-[15px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-bg-tertiary)]/50 transition-colors duration-200"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--color-bg-tertiary)] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-[var(--color-text-primary)]" />
              ) : (
                <Menu className="w-5 h-5 text-[var(--color-text-primary)]" />
              )}
            </button>
          </div>
        </div>
      </Container>

      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-out border-b border-[var(--color-border)]",
          mobileOpen ? "max-h-80" : "max-h-0 border-b-0"
        )}
      >
        <Container>
          <nav className="flex flex-col py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-3 text-[17px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-bg-tertiary)]/50 transition-colors"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>
        </Container>
      </div>
    </header>
  );
}
