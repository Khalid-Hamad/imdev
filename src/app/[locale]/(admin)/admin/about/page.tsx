"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  Save,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AboutSection {
  id?: string;
  type: string;
  data: Record<string, unknown>;
  sortOrder: number;
}

const SECTION_TYPES = [
  { value: "overview", label: "Overview", icon: User },
  { value: "experience", label: "Experience", icon: Briefcase },
  { value: "education", label: "Education", icon: GraduationCap },
  { value: "skills", label: "Skills", icon: Code },
  { value: "certification", label: "Certification", icon: Award },
] as const;

function OverviewEditor({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={(data.name as string) || ""}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
        />
        <Input
          label="Location"
          value={(data.location as string) || ""}
          onChange={(e) => onChange({ ...data, location: e.target.value })}
        />
      </div>
      <Textarea
        label="Bio (English)"
        value={(data.bioEn as string) || ""}
        onChange={(e) => onChange({ ...data, bioEn: e.target.value })}
        rows={3}
      />
      <Textarea
        label="Bio (Arabic)"
        value={(data.bioAr as string) || ""}
        onChange={(e) => onChange({ ...data, bioAr: e.target.value })}
        dir="rtl"
        rows={3}
      />
      <Textarea
        label="Summary (English)"
        value={(data.summaryEn as string) || ""}
        onChange={(e) => onChange({ ...data, summaryEn: e.target.value })}
        rows={4}
      />
      <Textarea
        label="Summary (Arabic)"
        value={(data.summaryAr as string) || ""}
        onChange={(e) => onChange({ ...data, summaryAr: e.target.value })}
        dir="rtl"
        rows={4}
      />
    </div>
  );
}

function ExperienceEditor({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  const highlights = (data.highlights as string[]) || [];

  function updateHighlight(idx: number, val: string) {
    const updated = [...highlights];
    updated[idx] = val;
    onChange({ ...data, highlights: updated });
  }
  function addHighlight() {
    onChange({ ...data, highlights: [...highlights, ""] });
  }
  function removeHighlight(idx: number) {
    onChange({ ...data, highlights: highlights.filter((_, i) => i !== idx) });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Company"
          value={(data.company as string) || ""}
          onChange={(e) => onChange({ ...data, company: e.target.value })}
        />
        <Input
          label="Role"
          value={(data.role as string) || ""}
          onChange={(e) => onChange({ ...data, role: e.target.value })}
        />
        <Input
          label="Period"
          value={(data.period as string) || ""}
          onChange={(e) => onChange({ ...data, period: e.target.value })}
          placeholder="Sep 2025 – Present"
        />
        <Input
          label="Location"
          value={(data.location as string) || ""}
          onChange={(e) => onChange({ ...data, location: e.target.value })}
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-semibold text-[var(--color-text-primary)]">
            Key Highlights
          </span>
          <button
            type="button"
            onClick={addHighlight}
            className="text-[13px] text-[var(--color-accent)] hover:underline"
          >
            + Add
          </button>
        </div>
        <div className="space-y-2">
          {highlights.map((h, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={h}
                onChange={(e) => updateHighlight(i, e.target.value)}
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => removeHighlight(i)}
                className="text-[var(--color-error)] hover:bg-[var(--color-error)]/10 w-8 h-8 flex items-center justify-center rounded-lg shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EducationEditor({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label="Degree"
        value={(data.degree as string) || ""}
        onChange={(e) => onChange({ ...data, degree: e.target.value })}
      />
      <Input
        label="School"
        value={(data.school as string) || ""}
        onChange={(e) => onChange({ ...data, school: e.target.value })}
      />
      <Input
        label="Year"
        value={(data.year as string) || ""}
        onChange={(e) => onChange({ ...data, year: e.target.value })}
      />
      <Input
        label="Location"
        value={(data.location as string) || ""}
        onChange={(e) => onChange({ ...data, location: e.target.value })}
      />
    </div>
  );
}

function SkillsEditor({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  const items = (data.items as string[]) || [];

  return (
    <div className="space-y-4">
      <Input
        label="Category Name"
        value={(data.category as string) || ""}
        onChange={(e) => onChange({ ...data, category: e.target.value })}
        placeholder="AI & ML"
      />
      <div>
        <span className="text-[13px] font-semibold text-[var(--color-text-primary)] block mb-2">
          Skills (comma-separated)
        </span>
        <Textarea
          value={items.join(", ")}
          onChange={(e) =>
            onChange({
              ...data,
              items: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          rows={2}
          placeholder="Python, TypeScript, Docker"
        />
      </div>
    </div>
  );
}

function CertificationEditor({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-4">
      <Input
        label="Title"
        value={(data.title as string) || ""}
        onChange={(e) => onChange({ ...data, title: e.target.value })}
      />
      <Input
        label="Details"
        value={(data.details as string) || ""}
        onChange={(e) => onChange({ ...data, details: e.target.value })}
      />
    </div>
  );
}

export default function AdminAboutPage() {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch("/api/admin/about")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setSections(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function addSection(type: string) {
    const defaults: Record<string, Record<string, unknown>> = {
      overview: { name: "", location: "", bioEn: "", bioAr: "", summaryEn: "", summaryAr: "" },
      experience: { company: "", role: "", period: "", location: "", highlights: [""] },
      education: { degree: "", school: "", year: "", location: "" },
      skills: { category: "", items: [] },
      certification: { title: "", details: "" },
    };
    setSections([
      ...sections,
      { type, data: defaults[type] || {}, sortOrder: sections.length },
    ]);
  }

  function updateSection(index: number, data: Record<string, unknown>) {
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, data } : s))
    );
  }

  function removeSection(index: number) {
    setSections((prev) => prev.filter((_, i) => i !== index));
  }

  function moveSection(index: number, direction: "up" | "down") {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= sections.length) return;
    const updated = [...sections];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    setSections(updated);
  }

  function toggleCollapse(index: number) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  async function saveAll() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sections),
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      if (Array.isArray(saved)) setSections(saved);
      toast.success("About page saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function getSectionLabel(section: AboutSection) {
    const d = section.data;
    switch (section.type) {
      case "overview":
        return (d.name as string) || "Overview";
      case "experience":
        return `${(d.role as string) || "Role"} — ${(d.company as string) || "Company"}`;
      case "education":
        return (d.degree as string) || "Education";
      case "skills":
        return (d.category as string) || "Skills";
      case "certification":
        return (d.title as string) || "Certification";
      default:
        return section.type;
    }
  }

  const typeInfo = (type: string) =>
    SECTION_TYPES.find((t) => t.value === type);

  if (loading)
    return (
      <p className="text-[var(--color-text-secondary)] py-12">Loading...</p>
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.01em]">
            About Page
          </h1>
          <p className="text-[15px] text-[var(--color-text-secondary)] mt-1">
            Manage your CV / About content sections.
          </p>
        </div>
        <Button size="sm" onClick={saveAll} disabled={saving}>
          <Save className="w-4 h-4 mr-1" />{" "}
          {saving ? "Saving..." : "Save All"}
        </Button>
      </div>

      {/* Add Section Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {SECTION_TYPES.map((st) => (
          <button
            key={st.value}
            onClick={() => addSection(st.value)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-pill)] text-[13px] font-medium border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {st.label}
          </button>
        ))}
      </div>

      {sections.length === 0 && (
        <div className="text-center py-16 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
          <p className="text-[var(--color-text-secondary)]">
            No sections yet. Add sections above to build your About page.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {sections.map((section, i) => {
          const info = typeInfo(section.type);
          const Icon = info?.icon || User;
          const isCollapsed = collapsed.has(i);

          return (
            <div
              key={section.id || `new-${i}`}
              className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden"
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-6 py-4 cursor-pointer select-none"
                onClick={() => toggleCollapse(i)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-[var(--color-accent)]/10 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[var(--color-accent)]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] uppercase tracking-wider text-[var(--color-text-tertiary)] font-medium">
                      {info?.label || section.type}
                    </span>
                    <p className="text-[15px] font-medium text-[var(--color-text-primary)] truncate">
                      {getSectionLabel(section)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSection(i, "up");
                    }}
                    disabled={i === 0}
                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)] disabled:opacity-30 transition-colors"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSection(i, "down");
                    }}
                    disabled={i === sections.length - 1}
                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)] disabled:opacity-30 transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSection(i);
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[var(--color-error)]/10 text-[var(--color-error)] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {isCollapsed ? (
                    <ChevronDown className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                  )}
                </div>
              </div>

              {/* Body */}
              {!isCollapsed && (
                <div className="px-6 pb-6 pt-2 border-t border-[var(--color-border)]">
                  {section.type === "overview" && (
                    <OverviewEditor
                      data={section.data}
                      onChange={(d) => updateSection(i, d)}
                    />
                  )}
                  {section.type === "experience" && (
                    <ExperienceEditor
                      data={section.data}
                      onChange={(d) => updateSection(i, d)}
                    />
                  )}
                  {section.type === "education" && (
                    <EducationEditor
                      data={section.data}
                      onChange={(d) => updateSection(i, d)}
                    />
                  )}
                  {section.type === "skills" && (
                    <SkillsEditor
                      data={section.data}
                      onChange={(d) => updateSection(i, d)}
                    />
                  )}
                  {section.type === "certification" && (
                    <CertificationEditor
                      data={section.data}
                      onChange={(d) => updateSection(i, d)}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
