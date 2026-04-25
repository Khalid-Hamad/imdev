import { db } from "@/db";
import { posts } from "@/db/schema/posts";
import { projects } from "@/db/schema/projects";
import { usesItems } from "@/db/schema/uses";
import { reactions, pageViews } from "@/db/schema/reactions";
import { count, eq, and, desc, sql } from "drizzle-orm";
import {
  FileText,
  FolderOpen,
  Wrench,
  PenLine,
  Eye,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

async function getStats() {
  try {
    const [postCount] = await db.select({ count: count() }).from(posts);
    const [publishedPostCount] = await db
      .select({ count: count() })
      .from(posts)
      .where(eq(posts.status, "published"));
    const [draftPostCount] = await db
      .select({ count: count() })
      .from(posts)
      .where(eq(posts.status, "draft"));
    const [projectCount] = await db.select({ count: count() }).from(projects);
    const [usesCount] = await db.select({ count: count() }).from(usesItems);

    let totalViews = 0;
    let totalLikes = 0;
    let totalDislikes = 0;

    try {
      const [viewResult] = await db
        .select({ count: count() })
        .from(pageViews);
      totalViews = viewResult?.count || 0;
    } catch {}

    try {
      const [likeResult] = await db
        .select({ count: count() })
        .from(reactions)
        .where(eq(reactions.type, "like"));
      totalLikes = likeResult?.count || 0;

      const [dislikeResult] = await db
        .select({ count: count() })
        .from(reactions)
        .where(eq(reactions.type, "dislike"));
      totalDislikes = dislikeResult?.count || 0;
    } catch {}

    return {
      totalPosts: postCount.count,
      publishedPosts: publishedPostCount.count,
      draftPosts: draftPostCount.count,
      totalProjects: projectCount.count,
      totalUses: usesCount.count,
      totalViews,
      totalLikes,
      totalDislikes,
    };
  } catch {
    return {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      totalProjects: 0,
      totalUses: 0,
      totalViews: 0,
      totalLikes: 0,
      totalDislikes: 0,
    };
  }
}

async function getRecentPosts() {
  try {
    return await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(5);
  } catch {
    return [];
  }
}

async function getTopReactedContent() {
  try {
    const results = await db
      .select({
        targetId: reactions.targetId,
        targetType: reactions.targetType,
        likes: sql<number>`count(*) filter (where ${reactions.type} = 'like')`,
        dislikes: sql<number>`count(*) filter (where ${reactions.type} = 'dislike')`,
      })
      .from(reactions)
      .groupBy(reactions.targetId, reactions.targetType)
      .orderBy(sql`count(*) filter (where ${reactions.type} = 'like') desc`)
      .limit(5);
    return results;
  } catch {
    return [];
  }
}

async function getTopViewedPages() {
  try {
    const results = await db
      .select({
        pagePath: pageViews.pagePath,
        views: sql<number>`count(*)::int`,
      })
      .from(pageViews)
      .groupBy(pageViews.pagePath)
      .orderBy(sql`count(*) desc`)
      .limit(5);
    return results;
  } catch {
    return [];
  }
}

export default async function AdminDashboard() {
  const [stats, recentPosts, topViewed] = await Promise.all([
    getStats(),
    getRecentPosts(),
    getTopViewedPages(),
  ]);

  const statCards = [
    {
      label: "Total Posts",
      value: stats.totalPosts,
      sub: `${stats.publishedPosts} published · ${stats.draftPosts} drafts`,
      icon: FileText,
      href: "/admin/blog",
    },
    {
      label: "Projects",
      value: stats.totalProjects,
      icon: FolderOpen,
      href: "/admin/projects",
    },
    {
      label: "Tools / Uses",
      value: stats.totalUses,
      icon: Wrench,
      href: "/admin/uses",
    },
    {
      label: "Page Views",
      value: stats.totalViews,
      icon: Eye,
      href: "#",
    },
    {
      label: "Likes",
      value: stats.totalLikes,
      icon: ThumbsUp,
      href: "#",
    },
    {
      label: "Dislikes",
      value: stats.totalDislikes,
      icon: ThumbsDown,
      href: "#",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.01em]">
            Dashboard
          </h1>
          <p className="text-[15px] text-[var(--color-text-secondary)] mt-1">
            Overview of your site content and engagement.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 hover:border-[var(--color-accent)] transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <card.icon className="w-5 h-5 text-[var(--color-text-tertiary)]" />
            </div>
            <p className="text-[36px] font-bold tracking-[-0.01em]">
              {card.value}
            </p>
            <p className="text-[15px] text-[var(--color-text-secondary)] mt-1">
              {card.label}
            </p>
            {card.sub && (
              <p className="text-[13px] text-[var(--color-text-tertiary)] mt-0.5">
                {card.sub}
              </p>
            )}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Recent Posts */}
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
          <h2 className="text-[17px] font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--color-text-tertiary)]" />
            Recent Posts
          </h2>
          {recentPosts.length === 0 ? (
            <p className="text-[13px] text-[var(--color-text-tertiary)]">
              No posts yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/admin/blog/edit/${post.id}`}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[var(--color-bg-tertiary)]/50 transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-accent)] transition-colors">
                      {post.titleEn}
                    </p>
                    <p className="text-[12px] text-[var(--color-text-tertiary)]">
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ml-3 ${
                      post.status === "published"
                        ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                        : "bg-[var(--color-warning)]/10 text-[var(--color-warning)]"
                    }`}
                  >
                    {post.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Top Viewed Pages */}
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
          <h2 className="text-[17px] font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--color-text-tertiary)]" />
            Top Viewed Pages
          </h2>
          {topViewed.length === 0 ? (
            <p className="text-[13px] text-[var(--color-text-tertiary)]">
              No page views recorded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {topViewed.map((page) => (
                <div
                  key={page.pagePath}
                  className="flex items-center justify-between py-2 px-3"
                >
                  <p className="text-[15px] text-[var(--color-text-primary)] truncate flex-1 min-w-0">
                    {page.pagePath}
                  </p>
                  <span className="text-[13px] font-medium text-[var(--color-text-secondary)] shrink-0 ml-3">
                    {page.views} views
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-white px-5 py-2.5 rounded-[var(--radius-pill)] text-[15px] font-medium hover:opacity-90 transition-opacity"
        >
          <PenLine className="w-4 h-4" /> New Post
        </Link>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 border border-[var(--color-accent)] text-[var(--color-accent)] px-5 py-2.5 rounded-[var(--radius-pill)] text-[15px] font-medium hover:bg-[var(--color-accent)]/10 transition-colors"
        >
          <FolderOpen className="w-4 h-4" /> New Project
        </Link>
      </div>
    </div>
  );
}
