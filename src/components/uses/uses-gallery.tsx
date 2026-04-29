"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { USES_TAGS, RATING_MAX } from "@/lib/uses-constants";

export type UsesItemView = {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  rating: number;
  iconUrl: string | null;
};

type Grouped = Record<string, UsesItemView[]>;

function StarsRow({ rating }: { rating: number }) {
  if (!rating || rating <= 0) return null;
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} of ${RATING_MAX}`}>
      {Array.from({ length: RATING_MAX }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "w-3.5 h-3.5",
            i < rating
              ? "fill-[var(--color-accent)] text-[var(--color-accent)]"
              : "text-[var(--color-border)]"
          )}
        />
      ))}
    </div>
  );
}

export function UsesGallery({
  grouped,
  emptyLabel,
  filterAllLabel,
  tagLabels,
}: {
  grouped: Grouped;
  emptyLabel: string;
  filterAllLabel: string;
  tagLabels: Record<string, string>;
}) {
  const [activeTag, setActiveTag] = useState<string | "ALL">("ALL");

  const filteredGrouped = useMemo<Grouped>(() => {
    if (activeTag === "ALL") return grouped;
    const out: Grouped = {};
    for (const [cat, items] of Object.entries(grouped)) {
      const matched = items.filter((it) => it.tags.includes(activeTag));
      if (matched.length > 0) out[cat] = matched;
    }
    return out;
  }, [grouped, activeTag]);

  const categories = Object.keys(filteredGrouped);

  const filterButtons: { id: string; label: string }[] = [
    { id: "ALL", label: filterAllLabel },
    ...USES_TAGS.map((t) => ({ id: t, label: tagLabels[t] ?? t })),
  ];

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-10">
        {filterButtons.map((b) => {
          const active = activeTag === b.id;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => setActiveTag(b.id as typeof activeTag)}
              className={cn(
                "px-4 py-1.5 rounded-[var(--radius-pill)] text-[14px] font-medium border transition-colors",
                active
                  ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                  : "bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)]"
              )}
            >
              {b.label}
            </button>
          );
        })}
      </div>

      {categories.length === 0 ? (
        <p className="text-[17px] text-[var(--color-text-secondary)] py-12">
          {emptyLabel}
        </p>
      ) : (
        <div className="space-y-16 md:space-y-20">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-[22px] md:text-[26px] font-semibold tracking-[-0.02em] text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-3 mb-8">
                {category}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredGrouped[category]!.map((item) => (
                  <UsesCard
                    key={item.id}
                    item={item}
                    tagLabels={tagLabels}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function UsesCard({
  item,
  tagLabels,
}: {
  item: UsesItemView;
  tagLabels: Record<string, string>;
}) {
  return (
    <div className="group flex flex-col rounded-[var(--radius-lg)] overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 hover:bg-[var(--color-bg-secondary)] hover:border-[var(--color-accent)]/40 transition-colors">
      <div className="relative aspect-square bg-[var(--color-bg-primary)] flex items-center justify-center p-6">
        {item.iconUrl ? (
          <Image
            src={item.iconUrl}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4"
            unoptimized={item.iconUrl.startsWith("/")}
          />
        ) : (
          <div
            className="w-full h-full rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg-tertiary)]/30"
            aria-hidden
          />
        )}
      </div>
      <div className="flex-1 p-4 md:p-5 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[16px] md:text-[17px] font-semibold text-[var(--color-text-primary)] leading-snug">
            {item.name}
          </h3>
          <StarsRow rating={item.rating} />
        </div>
        {item.description ? (
          <p className="text-[14px] md:text-[15px] text-[var(--color-text-secondary)] leading-relaxed line-clamp-3">
            {item.description}
          </p>
        ) : null}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {item.tags.map((t) => (
              <Badge key={t} className="px-2 py-0.5 text-[11px]">
                {tagLabels[t] ?? t}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
