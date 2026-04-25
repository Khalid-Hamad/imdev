import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { getPostBySlug } from "@/lib/queries/posts";
import { getLocalizedField, formatDate, readingTime } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { Reactions } from "@/components/reactions";
import { ViewTracker } from "@/components/view-tracker";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  let post;
  try { post = await getPostBySlug(slug); } catch { return {}; }
  if (!post) return {};
  return {
    title: getLocalizedField(post, "title", locale),
    description: getLocalizedField(post, "excerpt", locale),
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  let post;
  try { post = await getPostBySlug(slug); } catch { notFound(); }
  if (!post) notFound();

  return <BlogPostContent locale={locale} post={post} />;
}

function BlogPostContent({
  locale,
  post,
}: {
  locale: string;
  post: NonNullable<Awaited<ReturnType<typeof getPostBySlug>>>;
}) {
  const t = useTranslations("blog");
  const content = getLocalizedField(post, "content", locale);
  const title = getLocalizedField(post, "title", locale);

  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className="max-w-[720px] mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[15px] text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("backToBlog")}
          </Link>

          <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-tertiary)] mb-4">
            {post.publishedAt && (
              <time>{formatDate(post.publishedAt, locale)}</time>
            )}
            <span>&middot;</span>
            <span>{t("minRead", { count: readingTime(post.contentEn) })}</span>
          </div>

          <h1 className="text-[36px] md:text-[48px] font-bold tracking-[-0.015em] leading-[1.08] mb-6">
            {title}
          </h1>

          {post.tags && (post.tags as string[]).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {(post.tags as string[]).map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          )}

          <article className="prose prose-lg max-w-none">
            <MarkdownContent content={content} />
          </article>

          <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
            <p className="text-[13px] text-[var(--color-text-tertiary)] mb-3">
              {t("helpful")}
            </p>
            <Reactions targetType="post" targetId={post.id} />
          </div>

          <ViewTracker pagePath={`/blog/${post.slug}`} targetType="post" targetId={post.id} />
        </div>
      </Container>
    </section>
  );
}
