"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";
import type { Post } from "@/db/schema/posts";

interface PostFormProps {
  post?: Post;
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [titleEn, setTitleEn] = useState(post?.titleEn || "");
  const [titleAr, setTitleAr] = useState(post?.titleAr || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerptEn, setExcerptEn] = useState(post?.excerptEn || "");
  const [excerptAr, setExcerptAr] = useState(post?.excerptAr || "");
  const [contentEn, setContentEn] = useState(post?.contentEn || "");
  const [contentAr, setContentAr] = useState(post?.contentAr || "");
  const [tagsInput, setTagsInput] = useState((post?.tags as string[] || []).join(", "));
  const [status, setStatus] = useState(post?.status || "draft");
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");

  function handleTitleChange(value: string) {
    setTitleEn(value);
    if (!post) setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const body = {
      titleEn,
      titleAr,
      slug,
      excerptEn,
      excerptAr,
      contentEn,
      contentAr,
      coverImage,
      status,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      publishedAt: status === "published" ? new Date().toISOString() : null,
    };

    try {
      const url = post ? `/api/admin/posts/${post.id}` : "/api/admin/posts";
      const method = post ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      toast.success(post ? "Post updated" : "Post created");
      router.push("/admin/blog");
      router.refresh();
    } catch {
      toast.error("Failed to save post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Title (English)"
          value={titleEn}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
        />
        <Input
          label="Title (Arabic)"
          value={titleAr}
          onChange={(e) => setTitleAr(e.target.value)}
          dir="rtl"
        />
      </div>

      <Input
        label="Slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Textarea
          label="Excerpt (English)"
          value={excerptEn}
          onChange={(e) => setExcerptEn(e.target.value)}
          rows={3}
        />
        <Textarea
          label="Excerpt (Arabic)"
          value={excerptAr}
          onChange={(e) => setExcerptAr(e.target.value)}
          dir="rtl"
          rows={3}
        />
      </div>

      <Textarea
        label="Content (English) — Markdown"
        value={contentEn}
        onChange={(e) => setContentEn(e.target.value)}
        className="min-h-[300px] font-mono text-[15px]"
        required
      />

      <Textarea
        label="Content (Arabic) — Markdown"
        value={contentAr}
        onChange={(e) => setContentAr(e.target.value)}
        className="min-h-[300px] font-mono text-[15px]"
        dir="rtl"
      />

      <Input
        label="Cover Image URL"
        value={coverImage}
        onChange={(e) => setCoverImage(e.target.value)}
        placeholder="https://..."
      />

      <Input
        label="Tags (comma separated)"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
        placeholder="AI, Engineering, Python"
      />

      <div>
        <p className="text-[13px] font-semibold text-[var(--color-text-primary)] mb-2">Status</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setStatus("draft")}
            className={`px-4 py-2 rounded-[var(--radius-pill)] text-[15px] font-medium border transition-colors ${
              status === "draft"
                ? "border-[var(--color-warning)] bg-[var(--color-warning)]/10 text-[var(--color-warning)]"
                : "border-[var(--color-border)] text-[var(--color-text-secondary)]"
            }`}
          >
            Draft
          </button>
          <button
            type="button"
            onClick={() => setStatus("published")}
            className={`px-4 py-2 rounded-[var(--radius-pill)] text-[15px] font-medium border transition-colors ${
              status === "published"
                ? "border-[var(--color-success)] bg-[var(--color-success)]/10 text-[var(--color-success)]"
                : "border-[var(--color-border)] text-[var(--color-text-secondary)]"
            }`}
          >
            Published
          </button>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : post ? "Update Post" : "Create Post"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
