"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { GithubIcon as Github } from "@/components/icons";
import { cn } from "@/lib/utils";
import { PROJECT_KINDS, type ProjectKind } from "@/lib/projects-constants";

export type ProjectView = {
  id: string;
  slug: string;
  title: string;
  description: string;
  kind: ProjectKind;
  techStack: string[];
  githubUrl: string | null;
  huggingfaceUrl: string | null;
  demoUrl: string | null;
};

export function ProjectsGallery({
  projects,
  emptyLabel,
  filterAllLabel,
  kindLabels,
}: {
  projects: ProjectView[];
  emptyLabel: string;
  filterAllLabel: string;
  kindLabels: Record<ProjectKind, string>;
}) {
  const [activeKind, setActiveKind] = useState<ProjectKind | "ALL">("ALL");

  const filtered = useMemo(() => {
    if (activeKind === "ALL") return projects;
    return projects.filter((p) => p.kind === activeKind);
  }, [projects, activeKind]);

  const filterButtons: { id: ProjectKind | "ALL"; label: string }[] = [
    { id: "ALL", label: filterAllLabel },
    ...PROJECT_KINDS.map((k) => ({ id: k, label: kindLabels[k] })),
  ];

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-10">
        {filterButtons.map((b) => {
          const active = activeKind === b.id;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => setActiveKind(b.id)}
              className={cn(
                "px-4 py-1.5 rounded-[var(--radius-pill)] text-[14px] font-medium border transition-colors",
                active
                  ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                  : "bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)]"
              )}
            >
              {b.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-[17px] text-[var(--color-text-secondary)] py-12">
          {emptyLabel}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <Card
              key={project.id}
              interactive
              className="h-full flex flex-col"
            >
              <Link href={`/projects/${project.slug}`} className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge className="px-2 py-0.5 text-[11px] uppercase tracking-wide">
                    {kindLabels[project.kind]}
                  </Badge>
                </div>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </Link>
              {project.techStack.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.techStack.slice(0, 5).map((tech) => (
                    <Badge key={tech}>{tech}</Badge>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[var(--color-border-light)]">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
