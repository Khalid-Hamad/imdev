import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProjectBySlug } from "@/lib/queries/projects";
import { getLocalizedField } from "@/lib/utils";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GithubIcon as Github } from "@/components/icons";
import { Link } from "@/i18n/navigation";
import { MarkdownContent } from "@/components/blog/markdown-content";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  let project;
  try { project = await getProjectBySlug(slug); } catch { return {}; }
  if (!project) return {};
  return {
    title: getLocalizedField(project, "title", locale),
    description: getLocalizedField(project, "description", locale),
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  let project;
  try { project = await getProjectBySlug(slug); } catch { notFound(); }
  if (!project) notFound();

  return <ProjectDetailContent locale={locale} project={project} />;
}

function ProjectDetailContent({
  locale,
  project,
}: {
  locale: string;
  project: NonNullable<Awaited<ReturnType<typeof getProjectBySlug>>>;
}) {
  const t = useTranslations("projects");
  const title = getLocalizedField(project, "title", locale);
  const description = getLocalizedField(project, "description", locale);
  const content = getLocalizedField(project, "content", locale);

  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className="max-w-[720px] mx-auto">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[15px] text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("backToProjects")}
          </Link>

          <h1 className="text-[36px] md:text-[48px] font-bold tracking-[-0.015em] leading-[1.08] mb-4">
            {title}
          </h1>

          {description && (
            <p className="text-[21px] text-[var(--color-text-secondary)] leading-[1.52] mb-6">
              {description}
            </p>
          )}

          {project.techStack && (project.techStack as string[]).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {(project.techStack as string[]).map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3 mb-10">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm">
                  <Github className="w-4 h-4 mr-2" /> {t("viewCode")}
                </Button>
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" /> {t("liveDemo")}
                </Button>
              </a>
            )}
          </div>

          {content && (
            <article className="prose prose-lg max-w-none">
              <MarkdownContent content={content} />
            </article>
          )}
        </div>
      </Container>
    </section>
  );
}
