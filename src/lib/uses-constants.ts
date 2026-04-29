export const USES_CATEGORIES = [
  "PC & Laptop",
  "Accessories",
  "Hardware",
  "Coding",
  "Software",
] as const;

export type UsesCategory = (typeof USES_CATEGORIES)[number];

export const USES_TAGS = ["Home", "Office", "Travel"] as const;

export type UsesTag = (typeof USES_TAGS)[number];

export const RATING_MAX = 5;

export function clampRating(value: number | null | undefined): number {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n) || n < 0) return 0;
  if (n > RATING_MAX) return RATING_MAX;
  return Math.round(n);
}
