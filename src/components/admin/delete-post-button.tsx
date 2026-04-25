"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DeletePostButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Post deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete post");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--color-error)]/10 text-[var(--color-text-tertiary)] hover:text-[var(--color-error)] transition-colors"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
