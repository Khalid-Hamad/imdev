import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ExternalLink } from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/icons";
import { getPublishedPosts } from "@/lib/queries/posts";
import { getFeaturedProjects } from "@/lib/queries/projects";
import { getAllSettings } from "@/lib/queries/settings";
import { getLocalizedField, formatDate, readingTime } from "@/lib/utils";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let posts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
  let projects: Awaited<ReturnType<typeof getFeaturedProjects>> = [];
  let settings: Record<string, unknown> = {};

  try {
    [posts, projects, settings] = await Promise.all([
      getPublishedPosts(),
      getFeaturedProjects(),
      getAllSettings(),
    ]);
  } catch {
    // DB not available yet — render with empty data
  }

  const socialLinks = {
    github: (settings.githubUrl as string) || "https://github.com/Khalid-Hamad",
    linkedin: (settings.linkedinUrl as string) || "https://linkedin.com/in/khalid-alsubaie",
  };

  return <HomeContent locale={locale} posts={posts.slice(0, 3)} projects={projects} socialLinks={socialLinks} />;
}

function HomeContent({
  locale,
  posts,
  projects,
  socialLinks,
}: {
  locale: string;
  posts: Array<{ id: string; slug: string; titleEn: string; titleAr: string | null; excerptEn: string | null; excerptAr: string | null; contentEn: string; publishedAt: Date | null; tags: string[] | null }>;
  projects: Array<{ id: string; slug: string; titleEn: string; titleAr: string | null; descriptionEn: string | null; descriptionAr: string | null; techStack: string[] | null; githubUrl: string | null; demoUrl: string | null }>;
  socialLinks: { github: string; linkedin: string };
}) {
  const t = useTranslations();

  return (
    <>
      {/* Hero */}
      <section className="py-24 md:py-32 lg:py-40">
        <Container>
          <div className="max-w-[720px]">
            <p className="text-[21px] text-[var(--color-text-secondary)] leading-[1.52] mb-4">
              {t("home.greeting")}
            </p>
            <h1 className="text-[48px] md:text-[56px] font-bold tracking-[-0.015em] leading-[1.07] text-[var(--color-text-primary)]">
              {t("home.name")}
            </h1>

            <p className="text-[28px] md:text-[36px] font-semibold tracking-[-0.01em] leading-[1.11] mt-2">
              <span className="text-[var(--color-accent)]">{t("home.titleAccent")}</span>
            </p>

            <p className="text-[18px] md:text-[22px] font-medium leading-[1.4] mt-3 text-[var(--color-text-secondary)]">
              {t("home.heroLine1")}
              <span className="text-[var(--color-accent)] font-semibold">{t("home.heroAccent1")}</span>
              {t("home.heroLine1End")}
            </p>

            <p className="text-[16px] md:text-[18px] text-[var(--color-text-secondary)] leading-[1.6] mt-6 max-w-[640px]">
              {t("home.heroBody")}
            </p>

            <p className="text-[16px] md:text-[18px] text-[var(--color-text-secondary)] leading-[1.6] mt-4 max-w-[640px]">
              {t("home.heroClosingPre")}
              <span className="text-[var(--color-accent)] font-semibold">{t("home.heroClosingAccent")}</span>
              {t("home.heroClosingPost")}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-10">
              <Link href="/about">
                <Button>{t("home.learnMore")}</Button>
              </Link>
              <div className="flex items-center gap-3">
                {socialLinks.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-primary)] transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-primary)] transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Projects */}
      {projects.length > 0 && (
        <section className="py-16 md:py-20 bg-[var(--color-bg-secondary)]">
          <Container>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-[28px] md:text-[36px] font-semibold tracking-[-0.01em]">
                {t("home.featuredProjects")}
              </h2>
              <Link
                href="/projects"
                className="text-[15px] font-medium text-[var(--color-accent)] hover:underline flex items-center gap-1"
              >
                {t("home.viewAll")} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Link key={project.id} href={`/projects/${project.slug}`}>
                  <Card interactive className="h-full">
                    <CardTitle className="text-[22px] font-semibold tracking-[-0.005em] mb-2">
                      {getLocalizedField(project, "title", locale)}
                    </CardTitle>
                    <CardDescription>
                      {getLocalizedField(project, "description", locale)}
                    </CardDescription>
                    {project.techStack && project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {(project.techStack as string[]).slice(0, 4).map((tech) => (
                          <Badge key={tech}>{tech}</Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-4">
                      {project.githubUrl && (
                        <Github className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                      )}
                      {project.demoUrl && (
                        <ExternalLink className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Latest Posts */}
      {posts.length > 0 && (
        <section className="py-16 md:py-20">
          <Container>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-[28px] md:text-[36px] font-semibold tracking-[-0.01em]">
                {t("home.latestPosts")}
              </h2>
              <Link
                href="/blog"
                className="text-[15px] font-medium text-[var(--color-accent)] hover:underline flex items-center gap-1"
              >
                {t("home.viewAll")} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card interactive className="h-full">
                    <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-tertiary)] mb-3">
                      {post.publishedAt && (
                        <time>{formatDate(post.publishedAt, locale)}</time>
                      )}
                      <span>&middot;</span>
                      <span>{t("blog.minRead", { count: readingTime(post.contentEn) })}</span>
                    </div>
                    <CardTitle>{getLocalizedField(post, "title", locale)}</CardTitle>
                    <CardDescription>
                      {getLocalizedField(post, "excerpt", locale)}
                    </CardDescription>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {(post.tags as string[]).slice(0, 3).map((tag) => (
                          <Badge key={tag}>{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Empty state when no content */}
      {posts.length === 0 && projects.length === 0 && (
        <section className="py-16 md:py-20">
          <Container>
            <div className="text-center py-20">
              <p className="text-[21px] text-[var(--color-text-secondary)]">
                {t("common.comingSoon")}
              </p>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
