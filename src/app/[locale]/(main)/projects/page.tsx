import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPublishedProjects } from "@/lib/queries/projects";
import { getLocalizedField } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { GithubIcon as Github } from "@/components/icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let projects: Awaited<ReturnType<typeof getPublishedProjects>> = [];
  try {
    projects = await getPublishedProjects();
  } catch {
    // DB not available
  }

  return <ProjectsContent locale={locale} projects={projects} />;
}

function ProjectsContent({
  locale,
  projects,
}: {
  locale: string;
  projects: Array<{ id: string; slug: string; titleEn: string; titleAr: string | null; descriptionEn: string | null; descriptionAr: string | null; techStack: string[] | null; githubUrl: string | null; huggingfaceUrl: string | null; demoUrl: string | null }>;
}) {
  const t = useTranslations("projects");

  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className="max-w-[720px] mb-12">
          <h1 className="text-[48px] font-bold tracking-[-0.015em] leading-[1.08]">
            {t("title")}
          </h1>
          <p className="text-[21px] text-[var(--color-text-secondary)] leading-[1.52] mt-4">
            {t("description")}
          </p>
        </div>

        {projects.length === 0 ? (
          <p className="text-[17px] text-[var(--color-text-secondary)] py-12">
            {t("noProjects")}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} interactive className="h-full flex flex-col">
                <Link href={`/projects/${project.slug}`} className="flex-1">
                  <CardTitle>{getLocalizedField(project, "title", locale)}</CardTitle>
                  <CardDescription>
                    {getLocalizedField(project, "description", locale)}
                  </CardDescription>
                </Link>
                {project.techStack && (project.techStack as string[]).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {(project.techStack as string[]).slice(0, 5).map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[var(--color-border-light)]">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors" onClick={(e) => e.stopPropagation()}>
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors" onClick={(e) => e.stopPropagation()}>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
