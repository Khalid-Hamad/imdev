import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { getPublishedProjects } from "@/lib/queries/projects";
import { getLocalizedField } from "@/lib/utils";
import { ProjectsGallery, type ProjectView } from "@/components/projects/projects-gallery";
import { PROJECT_KINDS, normalizeKind, type ProjectKind } from "@/lib/projects-constants";
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
  projects: Array<{
    id: string;
    slug: string;
    titleEn: string;
    titleAr: string | null;
    descriptionEn: string | null;
    descriptionAr: string | null;
    kind: string | null;
    techStack: string[] | null;
    githubUrl: string | null;
    huggingfaceUrl: string | null;
    demoUrl: string | null;
  }>;
}) {
  const t = useTranslations("projects");

  const view: ProjectView[] = projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: getLocalizedField(p, "title", locale) || "",
    description: getLocalizedField(p, "description", locale) || "",
    kind: normalizeKind(p.kind ?? "personal"),
    techStack: (p.techStack as string[] | null) ?? [],
    githubUrl: p.githubUrl,
    huggingfaceUrl: p.huggingfaceUrl,
    demoUrl: p.demoUrl,
  }));

  const kindLabels = PROJECT_KINDS.reduce<Record<ProjectKind, string>>(
    (acc, k) => {
      acc[k] = t(`kinds.${k}`);
      return acc;
    },
    { professional: "", personal: "", educational: "" }
  );

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

        <ProjectsGallery
          projects={view}
          emptyLabel={t("noProjects")}
          filterAllLabel={t("kinds.all")}
          kindLabels={kindLabels}
        />
      </Container>
    </section>
  );
}
