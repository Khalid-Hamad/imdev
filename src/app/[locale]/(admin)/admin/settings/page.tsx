"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface SiteSettings {
  heroNameEn: string;
  heroNameAr: string;
  heroTitleEn: string;
  heroTitleAr: string;
  heroSubtitleEn: string;
  heroSubtitleAr: string;
  aboutContentEn: string;
  aboutContentAr: string;
  githubUrl: string;
  linkedinUrl: string;
  huggingfaceUrl: string;
  twitterUrl: string;
  siteTitle: string;
  siteDescription: string;
}

const defaults: SiteSettings = {
  heroNameEn: "", heroNameAr: "", heroTitleEn: "", heroTitleAr: "",
  heroSubtitleEn: "", heroSubtitleAr: "", aboutContentEn: "", aboutContentAr: "",
  githubUrl: "", linkedinUrl: "", huggingfaceUrl: "", twitterUrl: "",
  siteTitle: "", siteDescription: "",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaults);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => setSettings({ ...defaults, ...data }))
      .catch(() => {});
  }, []);

  function update(field: keyof SiteSettings, value: string) {
    setSettings((s) => ({ ...s, [field]: value }));
  }

  async function save() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error();
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.01em]">Settings</h1>
          <p className="text-[15px] text-[var(--color-text-secondary)] mt-1">Site metadata, hero content, and social links.</p>
        </div>
        <Button size="sm" onClick={save} disabled={loading}>
          <Save className="w-4 h-4 mr-1" /> {loading ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="space-y-8">
        <section className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 space-y-4">
          <h2 className="text-[17px] font-semibold">Hero Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Name (EN)" value={settings.heroNameEn} onChange={(e) => update("heroNameEn", e.target.value)} />
            <Input label="Name (AR)" value={settings.heroNameAr} onChange={(e) => update("heroNameAr", e.target.value)} dir="rtl" />
            <Input label="Title (EN)" value={settings.heroTitleEn} onChange={(e) => update("heroTitleEn", e.target.value)} />
            <Input label="Title (AR)" value={settings.heroTitleAr} onChange={(e) => update("heroTitleAr", e.target.value)} dir="rtl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea label="Subtitle (EN)" value={settings.heroSubtitleEn} onChange={(e) => update("heroSubtitleEn", e.target.value)} rows={3} />
            <Textarea label="Subtitle (AR)" value={settings.heroSubtitleAr} onChange={(e) => update("heroSubtitleAr", e.target.value)} dir="rtl" rows={3} />
          </div>
        </section>

        <section className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 space-y-4">
          <h2 className="text-[17px] font-semibold">Social Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="GitHub URL" value={settings.githubUrl} onChange={(e) => update("githubUrl", e.target.value)} />
            <Input label="LinkedIn URL" value={settings.linkedinUrl} onChange={(e) => update("linkedinUrl", e.target.value)} />
            <Input label="HuggingFace URL" value={settings.huggingfaceUrl} onChange={(e) => update("huggingfaceUrl", e.target.value)} />
            <Input label="Twitter/X URL" value={settings.twitterUrl} onChange={(e) => update("twitterUrl", e.target.value)} />
          </div>
        </section>

        <section className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 space-y-4">
          <h2 className="text-[17px] font-semibold">Site Metadata</h2>
          <Input label="Site Title" value={settings.siteTitle} onChange={(e) => update("siteTitle", e.target.value)} />
          <Textarea label="Site Description" value={settings.siteDescription} onChange={(e) => update("siteDescription", e.target.value)} rows={2} />
        </section>

        <section className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 space-y-4">
          <h2 className="text-[17px] font-semibold">About Page Content</h2>
          <Textarea label="About Content (EN) — Markdown" value={settings.aboutContentEn} onChange={(e) => update("aboutContentEn", e.target.value)} className="min-h-[200px] font-mono text-[15px]" />
          <Textarea label="About Content (AR) — Markdown" value={settings.aboutContentAr} onChange={(e) => update("aboutContentAr", e.target.value)} className="min-h-[200px] font-mono text-[15px]" dir="rtl" />
        </section>
      </div>
    </div>
  );
}
