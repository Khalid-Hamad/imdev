"use server";

import { db } from "@/db";
import { posts, type NewPost } from "@/db/schema/posts";
import { eq, desc, and } from "drizzle-orm";

export async function getAllPosts(status?: string) {
  const conditions = status ? and(eq(posts.status, status)) : undefined;
  return db
    .select()
    .from(posts)
    .where(conditions)
    .orderBy(desc(posts.publishedAt), desc(posts.createdAt));
}

export async function getPublishedPosts() {
  return getAllPosts("published");
}

export async function getPostBySlug(slug: string) {
  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);
  return result[0] || null;
}

export async function createPost(data: NewPost) {
  const result = await db.insert(posts).values(data).returning();
  return result[0];
}

export async function updatePost(id: string, data: Partial<NewPost>) {
  const result = await db
    .update(posts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(posts.id, id))
    .returning();
  return result[0];
}

export async function deletePost(id: string) {
  return db.delete(posts).where(eq(posts.id, id));
}
