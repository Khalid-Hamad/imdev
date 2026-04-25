"use server";

import { db } from "@/db";
import { projects, type NewProject } from "@/db/schema/projects";
import { eq, desc, and } from "drizzle-orm";

export async function getAllProjects(status?: string) {
  const conditions = status ? and(eq(projects.status, status)) : undefined;
  return db
    .select()
    .from(projects)
    .where(conditions)
    .orderBy(projects.sortOrder, desc(projects.createdAt));
}

export async function getPublishedProjects() {
  return getAllProjects("published");
}

export async function getFeaturedProjects() {
  return db
    .select()
    .from(projects)
    .where(and(eq(projects.status, "published"), eq(projects.featured, true)))
    .orderBy(projects.sortOrder)
    .limit(3);
}

export async function getProjectBySlug(slug: string) {
  const result = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1);
  return result[0] || null;
}

export async function createProject(data: NewProject) {
  const result = await db.insert(projects).values(data).returning();
  return result[0];
}

export async function updateProject(id: string, data: Partial<NewProject>) {
  const result = await db
    .update(projects)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning();
  return result[0];
}

export async function deleteProject(id: string) {
  return db.delete(projects).where(eq(projects.id, id));
}
