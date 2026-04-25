import { ProjectForm } from "@/components/admin/project-form";
import { db } from "@/db";
import { projects } from "@/db/schema/projects";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let project;
  try {
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    project = result[0];
  } catch { notFound(); }
  if (!project) notFound();

  return (
    <div>
      <h1 className="text-[28px] font-semibold tracking-[-0.01em] mb-8">Edit Project</h1>
      <ProjectForm project={project} />
    </div>
  );
}
