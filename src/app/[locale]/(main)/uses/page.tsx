import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { getUsesItemsByCategory } from "@/lib/queries/uses";
import { getLocalizedField } from "@/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uses",
};

export default async function UsesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let grouped: Record<
    string,
    Array<{
      id: string;
      name: string;
      descriptionEn: string | null;
      descriptionAr: string | null;
      rating: number | null;
      iconUrl: string | null;
    }>
  > = {};
  try {
    grouped = await getUsesItemsByCategory();
  } catch {
    // DB not available
  }

  return <UsesContent locale={locale} grouped={grouped} />;
}

function UsesContent({
  locale,
  grouped,
}: {
  locale: string;
  grouped: Record<
    string,
    Array<{
      id: string;
      name: string;
      descriptionEn: string | null;
      descriptionAr: string | null;
      rating: number | null;
      iconUrl: string | null;
    }>
  >;
}) {
  const t = useTranslations("uses");
  const categories = Object.keys(grouped);

  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <h1 className="text-[40px] md:text-[48px] font-bold tracking-[-0.02em] leading-[1.08] text-[var(--color-text-primary)]">
              {t("title")}
            </h1>
            <p className="text-[19px] md:text-[21px] text-[var(--color-text-secondary)] leading-[1.52] mt-4 max-w-2xl">
              {t("description")}
            </p>
          </div>

          {categories.length === 0 ? (
            <p className="text-[17px] text-[var(--color-text-secondary)] py-12">
              {t("noItems")}
            </p>
          ) : (
            <div className="space-y-16 md:space-y-20">
              {categories.map((category) => (
                <div key={category}>
                  <h2 className="text-[22px] md:text-[26px] font-semibold tracking-[-0.02em] text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-3 mb-8">
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    {grouped[category]!.map((item) => {
                      const desc = getLocalizedField(item, "description", locale);
                      return (
                        <Card
                          key={item.id}
                          className="h-full p-0 overflow-hidden border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 hover:bg-[var(--color-bg-secondary)] transition-colors"
                        >
                          <div className="flex items-start gap-4 p-5">
                            {item.iconUrl ? (
                              <div className="shrink-0 w-14 h-14 rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-center">
                                <Image
                                  src={item.iconUrl}
                                  alt={item.name}
                                  width={48}
                                  height={48}
                                  className="object-contain p-1"
                                  unoptimized={!item.iconUrl.startsWith("/")}
                                />
                              </div>
                            ) : (
                              <div
                                className="shrink-0 w-14 h-14 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg-tertiary)]/30"
                                aria-hidden
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="text-[16px] font-semibold text-[var(--color-text-primary)] leading-snug">
                                  {item.name}
                                </h3>
                                {item.rating && item.rating > 0 && (
                                  <div className="flex items-center gap-0.5 shrink-0">
                                    {Array.from(
                                      {
                                        length: Math.min(
                                          item.rating,
                                          10
                                        ),
                                      },
                                      (_, i) => (
                                        <Star
                                          key={i}
                                          className="w-3 h-3 fill-[var(--color-accent)] text-[var(--color-accent)]"
                                        />
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                              {desc ? (
                                <p className="text-[14px] md:text-[15px] text-[var(--color-text-secondary)] leading-relaxed mt-1.5">
                                  {desc}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
