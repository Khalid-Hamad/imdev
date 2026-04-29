export const PROJECT_KINDS = ["professional", "personal", "educational"] as const;

export type ProjectKind = (typeof PROJECT_KINDS)[number];

export function normalizeKind(value: unknown): ProjectKind {
  if (typeof value === "string") {
    const lower = value.toLowerCase().trim();
    if ((PROJECT_KINDS as readonly string[]).includes(lower)) {
      return lower as ProjectKind;
    }
  }
  return "personal";
}
