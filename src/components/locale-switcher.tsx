"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition } from "react";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchLocale() {
    const next = locale === "en" ? "ar" : "en";
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <button
      onClick={switchLocale}
      disabled={isPending}
      className="text-[13px] font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] px-2 py-1 rounded-md hover:bg-[var(--color-bg-tertiary)] transition-colors duration-200 disabled:opacity-50"
      aria-label="Switch language"
    >
      {locale === "en" ? "AR" : "EN"}
    </button>
  );
}
