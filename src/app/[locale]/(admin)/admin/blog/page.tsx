import { getAllPosts } from "@/lib/queries/posts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PenLine, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { DeletePostButton } from "@/components/admin/delete-post-button";

export default async function AdminBlogPage() {
  let posts: Awaited<ReturnType<typeof getAllPosts>> = [];
  try {
    posts = await getAllPosts();
  } catch {
    // DB not available
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.01em]">Blog Posts</h1>
          <p className="text-[15px] text-[var(--color-text-secondary)] mt-1">
            Manage your blog content.
          </p>
        </div>
        <Link href="/admin/blog/new">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" /> New Post
          </Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
          <p className="text-[var(--color-text-secondary)]">No posts yet.</p>
          <Link href="/admin/blog/new" className="text-[var(--color-accent)] hover:underline text-[15px] mt-2 inline-block">
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left px-6 py-3 text-[13px] font-semibold text-[var(--color-text-secondary)]">Title</th>
                <th className="text-left px-6 py-3 text-[13px] font-semibold text-[var(--color-text-secondary)] hidden md:table-cell">Status</th>
                <th className="text-left px-6 py-3 text-[13px] font-semibold text-[var(--color-text-secondary)] hidden md:table-cell">Date</th>
                <th className="text-right px-6 py-3 text-[13px] font-semibold text-[var(--color-text-secondary)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-[var(--color-border-light)] last:border-0 hover:bg-[var(--color-bg-tertiary)]/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-[15px] font-medium text-[var(--color-text-primary)]">{post.titleEn}</p>
                    {post.titleAr && (
                      <p className="text-[13px] text-[var(--color-text-tertiary)] mt-0.5" dir="rtl">{post.titleAr}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <Badge variant={post.status === "published" ? "success" : "warning"}>
                      {post.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[var(--color-text-secondary)] hidden md:table-cell">
                    {post.createdAt ? formatDate(post.createdAt) : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/blog/edit/${post.id}`}>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                          <PenLine className="w-4 h-4" />
                        </button>
                      </Link>
                      <DeletePostButton id={post.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
