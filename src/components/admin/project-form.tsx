"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";
import type { Project } from "@/db/schema/projects";

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [titleEn, setTitleEn] = useState(project?.titleEn || "");
  const [titleAr, setTitleAr] = useState(project?.titleAr || "");
  const [slug, setSlug] = useState(project?.slug || "");
  const [descriptionEn, setDescriptionEn] = useState(project?.descriptionEn || "");
  const [descriptionAr, setDescriptionAr] = useState(project?.descriptionAr || "");
  const [contentEn, setContentEn] = useState(project?.contentEn || "");
  const [contentAr, setContentAr] = useState(project?.contentAr || "");
  const [techInput, setTechInput] = useState((project?.techStack as string[] || []).join(", "));
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl || "");
  const [huggingfaceUrl, setHuggingfaceUrl] = useState(project?.huggingfaceUrl || "");
  const [demoUrl, setDemoUrl] = useState(project?.demoUrl || "");
  const [featured, setFeatured] = useState(project?.featured || false);
  const [status, setStatus] = useState(project?.status || "draft");
  const [coverImage, setCoverImage] = useState(project?.coverImage || "");

  function handleTitleChange(value: string) {
    setTitleEn(value);
    if (!project) setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const body = {
      titleEn, titleAr, slug, descriptionEn, descriptionAr,
      contentEn, contentAr, coverImage, status, featured,
      githubUrl, huggingfaceUrl, demoUrl,
      techStack: techInput.split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      const url = project ? `/api/admin/projects/${project.id}` : "/api/admin/projects";
      const method = project ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      toast.success(project ? "Project updated" : "Project created");
      router.push("/admin/projects");
      router.refresh();
    } catch {
      toast.error("Failed to save project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Title (English)" value={titleEn} onChange={(e) => handleTitleChange(e.target.value)} required />
        <Input label="Title (Arabic)" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} dir="rtl" />
      </div>
      <Input label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Textarea label="Description (English)" value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} rows={3} />
        <Textarea label="Description (Arabic)" value={descriptionAr} onChange={(e) => setDescriptionAr(e.target.value)} dir="rtl" rows={3} />
      </div>
      <Textarea label="Content (English) — Markdown" value={contentEn} onChange={(e) => setContentEn(e.target.value)} className="min-h-[200px] font-mono text-[15px]" />
      <Textarea label="Content (Arabic) — Markdown" value={contentAr} onChange={(e) => setContentAr(e.target.value)} className="min-h-[200px] font-mono text-[15px]" dir="rtl" />
      <Input label="Cover Image URL" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} />
      <Input label="Tech Stack (comma separated)" value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="Next.js, Python, Docker" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input label="GitHub URL" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
        <Input label="HuggingFace URL" value={huggingfaceUrl} onChange={(e) => setHuggingfaceUrl(e.target.value)} />
        <Input label="Demo URL" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} />
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4 accent-[var(--color-accent)]" />
          <span className="text-[15px]">Featured on homepage</span>
        </label>
      </div>
      <div>
        <p className="text-[13px] font-semibold mb-2">Status</p>
        <div className="flex gap-3">
          <button type="button" onClick={() => setStatus("draft")} className={`px-4 py-2 rounded-[var(--radius-pill)] text-[15px] font-medium border transition-colors ${status === "draft" ? "border-[var(--color-warning)] bg-[var(--color-warning)]/10 text-[var(--color-warning)]" : "border-[var(--color-border)] text-[var(--color-text-secondary)]"}`}>Draft</button>
          <button type="button" onClick={() => setStatus("published")} className={`px-4 py-2 rounded-[var(--radius-pill)] text-[15px] font-medium border transition-colors ${status === "published" ? "border-[var(--color-success)] bg-[var(--color-success)]/10 text-[var(--color-success)]" : "border-[var(--color-border)] text-[var(--color-text-secondary)]"}`}>Published</button>
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : project ? "Update Project" : "Create Project"}</Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
