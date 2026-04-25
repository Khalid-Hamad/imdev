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
    <section className="py-24 md:py-32">
      <Container>
        <div className="max-w-[720px] mb-12">
          <h1 className="text-[48px] font-bold tracking-[-0.015em] leading-[1.08]">
            {t("title")}
          </h1>
          <p className="text-[21px] text-[var(--color-text-secondary)] leading-[1.52] mt-4">
            {t("description")}
          </p>
        </div>

        {categories.length === 0 ? (
          <p className="text-[17px] text-[var(--color-text-secondary)] py-12">
            {t("noItems")}
          </p>
        ) : (
          <div className="space-y-12">
            {categories.map((category) => (
              <div key={category}>
                <h2 className="text-[22px] font-semibold tracking-[-0.005em] mb-6 text-[var(--color-accent)]">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {grouped[category].map((item) => (
                    <Card key={item.id} className="flex items-start gap-4">
                      {item.iconUrl && (
                        <div className="shrink-0 w-10 h-10 rounded-[var(--radius-sm)] overflow-hidden bg-[var(--color-bg-primary)] flex items-center justify-center border border-[var(--color-border)]">
                          <Image
                            src={item.iconUrl}
                            alt={item.name}
                            width={28}
                            height={28}
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-[17px] font-semibold text-[var(--color-text-primary)]">
                            {item.name}
                          </h3>
                          {item.rating && item.rating > 0 && (
                            <div className="flex items-center gap-0.5 ml-3 shrink-0">
                              {Array.from(
                                { length: Math.min(item.rating, 10) },
                                (_, i) => (
                                  <Star
                                    key={i}
                                    className="w-3.5 h-3.5 fill-[var(--color-accent)] text-[var(--color-accent)]"
                                  />
                                )
                              )}
                              <span className="text-[12px] text-[var(--color-text-tertiary)] ml-1">
                                {item.rating}/10
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-[15px] text-[var(--color-text-secondary)] mt-1">
                          {getLocalizedField(item, "description", locale)}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
