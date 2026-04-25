import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPublishedPosts } from "@/lib/queries/posts";
import { getLocalizedField, formatDate, readingTime } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
};

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let posts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
  try {
    posts = await getPublishedPosts();
  } catch {
    // DB not available
  }

  return <BlogContent locale={locale} posts={posts} />;
}

function BlogContent({
  locale,
  posts,
}: {
  locale: string;
  posts: Array<{ id: string; slug: string; titleEn: string; titleAr: string | null; excerptEn: string | null; excerptAr: string | null; contentEn: string; publishedAt: Date | null; tags: string[] | null }>;
}) {
  const t = useTranslations("blog");

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

        {posts.length === 0 ? (
          <p className="text-[17px] text-[var(--color-text-secondary)] py-12">
            {t("noPosts")}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card interactive className="h-full">
                  <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-tertiary)] mb-3">
                    {post.publishedAt && (
                      <time>{formatDate(post.publishedAt, locale)}</time>
                    )}
                    <span>&middot;</span>
                    <span>{t("minRead", { count: readingTime(post.contentEn) })}</span>
                  </div>
                  <CardTitle>{getLocalizedField(post, "title", locale)}</CardTitle>
                  <CardDescription>
                    {getLocalizedField(post, "excerpt", locale)}
                  </CardDescription>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {(post.tags as string[]).map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
