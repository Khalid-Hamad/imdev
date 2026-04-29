import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { getUsesItemsByCategory } from "@/lib/queries/uses";
import { getLocalizedField } from "@/lib/utils";
import { UsesGallery, type UsesItemView } from "@/components/uses/uses-gallery";
import { USES_TAGS } from "@/lib/uses-constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uses",
};

type DbItem = {
  id: string;
  name: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  category: string;
  tags: string[];
  rating: number;
  iconUrl: string | null;
};

export default async function UsesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let grouped: Record<string, DbItem[]> = {};
  try {
    grouped = (await getUsesItemsByCategory()) as unknown as Record<
      string,
      DbItem[]
    >;
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
  grouped: Record<string, DbItem[]>;
}) {
  const t = useTranslations("uses");

  const view: Record<string, UsesItemView[]> = {};
  for (const [cat, items] of Object.entries(grouped)) {
    view[cat] = items.map((item) => ({
      id: item.id,
      name: item.name,
      description: getLocalizedField(item, "description", locale) || "",
      category: item.category,
      tags: Array.isArray(item.tags) ? item.tags : [],
      rating: item.rating ?? 0,
      iconUrl: item.iconUrl,
    }));
  }

  const tagLabels: Record<string, string> = {};
  for (const tag of USES_TAGS) {
    const key = tag.toLowerCase() as "home" | "office" | "travel";
    tagLabels[tag] = t(`tags.${key}`);
  }

  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h1 className="text-[40px] md:text-[48px] font-bold tracking-[-0.02em] leading-[1.08] text-[var(--color-text-primary)]">
              {t("title")}
            </h1>
            <p className="text-[19px] md:text-[21px] text-[var(--color-text-secondary)] leading-[1.52] mt-4 max-w-2xl">
              {t("description")}
            </p>
          </div>

          <UsesGallery
            grouped={view}
            emptyLabel={t("noItems")}
            filterAllLabel={t("tags.all")}
            tagLabels={tagLabels}
          />
        </div>
      </Container>
    </section>
  );
}
