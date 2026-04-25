"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Save, Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UsesItem {
  id?: string;
  name: string;
  descriptionEn: string;
  descriptionAr: string;
  category: string;
  rating: number;
  iconUrl: string;
  sortOrder: number;
}

const CATEGORIES = [
  "Languages",
  "Frameworks",
  "AI/ML",
  "Infrastructure",
  "Dev Tools",
  "Hardware",
];

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
        Rating (optional)
      </span>
      <div className="flex items-center gap-1">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(value === n ? 0 : n)}
            className="p-0.5"
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
            {value}/10
          </span>
        )}
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
            id: d.id,
            name: d.name || "",
            descriptionEn: d.descriptionEn || "",
            descriptionAr: d.descriptionAr || "",
            category: d.category || "Languages",
            rating: d.rating || 0,
            iconUrl: d.iconUrl || "",
            sortOrder: d.sortOrder || 0,
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
        category: "Languages",
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
          id: d.id,
          name: d.name || "",
          descriptionEn: d.descriptionEn || "",
          descriptionAr: d.descriptionAr || "",
          category: d.category || "Languages",
          rating: d.rating || 0,
          iconUrl: d.iconUrl || "",
          sortOrder: d.sortOrder || 0,
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
            <div className="flex items-start justify-between mb-4">
              <select
                value={item.category}
                onChange={(e) => updateItem(i, { category: e.target.value })}
                className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-[15px] text-[var(--color-text-primary)]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                onClick={() => removeItem(i)}
                className="text-[var(--color-error)] hover:bg-[var(--color-error)]/10 w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
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
              <Input
                label="Icon URL (optional)"
                value={item.iconUrl}
                onChange={(e) => updateItem(i, { iconUrl: e.target.value })}
                placeholder="https://cdn.simpleicons.org/python"
              />
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

            <div className="mt-4">
              <RatingPicker
                value={item.rating}
                onChange={(v) => updateItem(i, { rating: v })}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
