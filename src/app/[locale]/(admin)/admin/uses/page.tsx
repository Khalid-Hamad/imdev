"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Save, Star, Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  USES_CATEGORIES,
  USES_TAGS,
  RATING_MAX,
  clampRating,
} from "@/lib/uses-constants";

interface UsesItem {
  id?: string;
  name: string;
  descriptionEn: string;
  descriptionAr: string;
  category: string;
  tags: string[];
  rating: number;
  iconUrl: string;
  sortOrder: number;
}

function RatingPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-[var(--color-text-primary)]">
        Rating (optional, 0–{RATING_MAX})
      </span>
      <div className="flex items-center gap-1">
        {Array.from({ length: RATING_MAX }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(value === n ? 0 : n)}
            className="p-0.5"
            aria-label={`Rate ${n} of ${RATING_MAX}`}
          >
            <Star
              className={cn(
                "w-5 h-5 transition-colors",
                n <= value
                  ? "fill-[var(--color-accent)] text-[var(--color-accent)]"
                  : "text-[var(--color-border)] hover:text-[var(--color-accent)]/50"
              )}
            />
          </button>
        ))}
        {value > 0 && (
          <span className="text-[13px] text-[var(--color-text-secondary)] ml-2">
            {value}/{RATING_MAX}
          </span>
        )}
      </div>
    </div>
  );
}

function TagsPicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  function toggle(tag: string) {
    if (value.includes(tag)) onChange(value.filter((t) => t !== tag));
    else onChange([...value, tag]);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-[var(--color-text-primary)]">
        Setup tags (optional)
      </span>
      <div className="flex flex-wrap gap-2">
        {USES_TAGS.map((tag) => {
          const active = value.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              className={cn(
                "px-3 py-1 rounded-[var(--radius-pill)] text-[13px] font-medium border transition-colors",
                active
                  ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                  : "bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-accent)]"
              )}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminUsesPage() {
  const [items, setItems] = useState<UsesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/uses")
      .then((r) => r.json())
      .then((data) => {
        setItems(
          data.map((d: Record<string, unknown>) => ({
            id: d.id as string,
            name: (d.name as string) || "",
            descriptionEn: (d.descriptionEn as string) || "",
            descriptionAr: (d.descriptionAr as string) || "",
            category: (d.category as string) || USES_CATEGORIES[0],
            tags: Array.isArray(d.tags) ? (d.tags as string[]) : [],
            rating: clampRating(d.rating as number | null | undefined),
            iconUrl: (d.iconUrl as string) || "",
            sortOrder: (d.sortOrder as number) || 0,
          }))
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function addItem() {
    setItems([
      ...items,
      {
        name: "",
        descriptionEn: "",
        descriptionAr: "",
        category: USES_CATEGORIES[0],
        tags: [],
        rating: 0,
        iconUrl: "",
        sortOrder: items.length,
      },
    ]);
  }

  function updateItem(index: number, updates: Partial<UsesItem>) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
    toast.success("Item removed — click Save All to confirm");
  }

  async function uploadIcon(index: number, file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
      credentials: "include",
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(err.error || "Upload failed");
    }
    const data = (await res.json()) as { url: string };
    updateItem(index, { iconUrl: data.url });
    toast.success("Image uploaded");
  }

  async function saveAll() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/uses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      setItems(
        saved.map((d: Record<string, unknown>) => ({
          id: d.id as string,
          name: (d.name as string) || "",
          descriptionEn: (d.descriptionEn as string) || "",
          descriptionAr: (d.descriptionAr as string) || "",
          category: (d.category as string) || USES_CATEGORIES[0],
          tags: Array.isArray(d.tags) ? (d.tags as string[]) : [],
          rating: clampRating(d.rating as number | null | undefined),
          iconUrl: (d.iconUrl as string) || "",
          sortOrder: (d.sortOrder as number) || 0,
        }))
      );
      toast.success("Uses saved successfully");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <p className="text-[var(--color-text-secondary)] py-12">Loading...</p>
    );

  return (
    <div>
      <datalist id="uses-category-suggestions">
        {USES_CATEGORIES.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.01em]">
            Uses / Tools
          </h1>
          <p className="text-[15px] text-[var(--color-text-secondary)] mt-1">
            Manage your tech stack and tools.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
          <Button size="sm" onClick={saveAll} disabled={saving}>
            <Save className="w-4 h-4 mr-1" /> {saving ? "Saving..." : "Save All"}
          </Button>
        </div>
      </div>

      {items.length === 0 && (
        <div className="text-center py-16 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
          <p className="text-[var(--color-text-secondary)]">No tools added yet.</p>
          <button
            onClick={addItem}
            className="text-[var(--color-accent)] hover:underline text-[15px] mt-2 inline-block"
          >
            Add your first tool
          </button>
        </div>
      )}

      <div className="space-y-4">
        {items.map((item, i) => (
          <div
            key={item.id || `new-${i}`}
            className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6"
          >
            <div className="flex items-start justify-between mb-4 gap-4">
              <div className="flex-1 min-w-0">
                <label className="block text-[13px] font-semibold text-[var(--color-text-primary)] mb-1.5">
                  Section (category)
                </label>
                <input
                  list="uses-category-suggestions"
                  value={item.category}
                  onChange={(e) => updateItem(i, { category: e.target.value })}
                  className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-[15px] text-[var(--color-text-primary)]"
                  placeholder="Pick or type a category"
                />
                <p className="text-[12px] text-[var(--color-text-tertiary)] mt-1">
                  Suggested: {USES_CATEGORIES.join(", ")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-[var(--color-error)] hover:bg-[var(--color-error)]/10 w-8 h-8 flex items-center justify-center rounded-lg transition-colors shrink-0 mt-6"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Name"
                value={item.name}
                onChange={(e) => updateItem(i, { name: e.target.value })}
              />
              <div>
                <span className="block text-[13px] font-semibold text-[var(--color-text-primary)] mb-1.5">
                  Image
                </span>
                <div className="flex items-start gap-3 flex-wrap">
                  {item.iconUrl ? (
                    <div className="relative w-16 h-16 rounded-[var(--radius-sm)] border border-[var(--color-border)] overflow-hidden bg-[var(--color-bg-primary)]">
                      <Image
                        src={item.iconUrl}
                        alt=""
                        width={64}
                        height={64}
                        className="object-contain w-full h-full p-1"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-[var(--radius-sm)] border border-dashed border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-tertiary)]">
                      <Upload className="w-5 h-5" />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
                        className="sr-only"
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          e.target.value = "";
                          if (!f) return;
                          try {
                            await uploadIcon(i, f);
                          } catch (err) {
                            toast.error(
                              err instanceof Error
                                ? err.message
                                : "Upload failed"
                            );
                          }
                        }}
                      />
                      <span className="inline-flex items-center text-[14px] font-medium text-[var(--color-accent)] hover:underline">
                        Upload image
                      </span>
                    </label>
                    {item.iconUrl && (
                      <button
                        type="button"
                        onClick={() => updateItem(i, { iconUrl: "" })}
                        className="text-[13px] text-[var(--color-text-tertiary)] flex items-center gap-1 hover:text-[var(--color-error)]"
                      >
                        <X className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                    <p className="text-[12px] text-[var(--color-text-tertiary)] max-w-[220px]">
                      PNG, JPG, WebP, SVG up to 3MB. Stored on S3 (R2) when
                      configured; otherwise written under /uploads.
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    type="text"
                    className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-1.5 text-[13px] text-[var(--color-text-secondary)]"
                    placeholder="Or paste an image URL (optional)"
                    value={item.iconUrl.startsWith("http") ? item.iconUrl : ""}
                    onChange={(e) => updateItem(i, { iconUrl: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input
                label="Description (EN)"
                value={item.descriptionEn}
                onChange={(e) =>
                  updateItem(i, { descriptionEn: e.target.value })
                }
              />
              <Input
                label="Description (AR)"
                value={item.descriptionAr}
                onChange={(e) =>
                  updateItem(i, { descriptionAr: e.target.value })
                }
                dir="rtl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <RatingPicker
                value={item.rating}
                onChange={(v) => updateItem(i, { rating: v })}
              />
              <TagsPicker
                value={item.tags}
                onChange={(v) => updateItem(i, { tags: v })}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
