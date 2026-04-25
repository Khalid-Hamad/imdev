import { getPostBySlug } from "@/lib/queries/posts";
import { PostForm } from "@/components/admin/post-form";
import { db } from "@/db";
import { posts } from "@/db/schema/posts";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let post;
  try {
    const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    post = result[0];
  } catch {
    notFound();
  }
  if (!post) notFound();

  return (
    <div>
      <h1 className="text-[28px] font-semibold tracking-[-0.01em] mb-8">
        Edit Post
      </h1>
      <PostForm post={post} />
    </div>
  );
}
