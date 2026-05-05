import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ViewTracker } from "@/components/view-tracker";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Globe,
  Mail,
} from "lucide-react";
import { getAboutSections } from "@/lib/queries/settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

type SectionData = Record<string, unknown>;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let sections: Array<{ type: string; data: SectionData }> = [];
  try {
    const raw = await getAboutSections();
    sections = raw.map((s) => ({
      type: s.type,
      data: s.data as SectionData,
    }));
  } catch {}

  return <AboutContent locale={locale} sections={sections} />;
}

function AboutContent({
  locale,
  sections,
}: {
  locale: string;
  sections: Array<{ type: string; data: SectionData }>;
}) {
  const t = useTranslations("about");
  const isAr = locale === "ar";

  const overviews = sections.filter((s) => s.type === "overview");
  const experiences = sections.filter((s) => s.type === "experience");
  const educations = sections.filter((s) => s.type === "education");
  const skillGroups = sections.filter((s) => s.type === "skills");
  const certifications = sections.filter((s) => s.type === "certification");
  const languages = sections.filter((s) => s.type === "language");
  const contacts = sections.filter((s) => s.type === "contact");

  const overview = overviews[0]?.data;

  if (sections.length === 0) {
    return (
      <section className="py-24 md:py-32">
        <Container>
          <div className="max-w-[720px]">
            <h1 className="text-[48px] font-bold tracking-[-0.015em] leading-[1.08]">
              {t("title")}
            </h1>
            <p className="text-[21px] text-[var(--color-text-secondary)] leading-[1.52] mt-6">
              {t("description")}
            </p>
          </div>
          <ViewTracker pagePath="/about" />
        </Container>
      </section>
    );
  }

  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className="max-w-[720px]">
          <h1 className="text-[48px] font-bold tracking-[-0.015em] leading-[1.08]">
            {t("title")}
          </h1>
          {overview && (
            <p className="text-[21px] text-[var(--color-text-secondary)] leading-[1.52] mt-6">
              {isAr
                ? (overview.bioAr as string) || (overview.bioEn as string)
                : (overview.bioEn as string)}
            </p>
          )}
        </div>

        <div className="max-w-[880px] mt-16 space-y-12">
          {/* Overview */}
          {overview && (
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[var(--color-accent)]" />
                </div>
                <div>
                  <p className="text-[17px] font-semibold">
                    {(overview.name as string) || ""}
                  </p>
                  <p className="text-[13px] text-[var(--color-text-tertiary)]">
                    {(overview.location as string) || ""}
                  </p>
                </div>
              </div>
              <p className="text-[17px] text-[var(--color-text-secondary)] leading-[1.65]">
                {isAr
                  ? (overview.summaryAr as string) ||
                    (overview.summaryEn as string)
                  : (overview.summaryEn as string)}
              </p>
            </Card>
          )}

          {/* Experience */}
          {experiences.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="w-5 h-5 text-[var(--color-accent)]" />
                <h2 className="text-[28px] font-semibold tracking-[-0.01em]">
                  {t("experience")}
                </h2>
              </div>
              <div className="space-y-6">
                {experiences.map((exp, i) => {
                  const d = exp.data;
                  const highlights = (d.highlights as string[]) || [];
                  return (
                    <Card key={i}>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
                        <div>
                          <h3 className="text-[17px] font-semibold text-[var(--color-text-primary)]">
                            {isAr
                              ? (d.roleAr as string) || (d.role as string)
                              : (d.role as string) || ""}
                          </h3>
                          <p className="text-[15px] font-medium text-[var(--color-accent)]">
                            {isAr
                              ? (d.companyAr as string) || (d.company as string)
                              : (d.company as string) || ""}
                          </p>
                        </div>
                        <div className="text-[13px] text-[var(--color-text-tertiary)] shrink-0">
                          <p>
                            {isAr
                              ? (d.periodAr as string) || (d.period as string)
                              : (d.period as string) || ""}
                          </p>
                          <p>
                            {isAr
                              ? (d.locationAr as string) || (d.location as string)
                              : (d.location as string) || ""}
                          </p>
                        </div>
                      </div>
                      {((isAr ? (d.highlightsAr as string[]) : null) ||
                        (d.highlights as string[]) ||
                        []) .length > 0 && (
                        <ul className="space-y-2 mt-3">
                          {((isAr ? (d.highlightsAr as string[]) : null) ||
                            (d.highlights as string[]) ||
                            [])
                            .filter((h) => h?.trim())
                            .map((h, j) => (
                              <li
                                key={j}
                                className="text-[15px] text-[var(--color-text-secondary)] leading-[1.6] flex gap-2"
                              >
                                <span className="text-[var(--color-accent)] mt-1.5 shrink-0">
                                  ·
                                </span>
                                <span>{h}</span>
                              </li>
                            ))}
                        </ul>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Education */}
          {educations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="w-5 h-5 text-[var(--color-accent)]" />
                <h2 className="text-[28px] font-semibold tracking-[-0.01em]">
                  {t("education")}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {educations.map((edu, i) => {
                  const d = edu.data;
                  return (
                    <Card key={i}>
                      <p className="text-[15px] font-semibold text-[var(--color-text-primary)]">
                        {(d.degree as string) || ""}
                      </p>
                      <p className="text-[13px] text-[var(--color-accent)] mt-1">
                        {(d.school as string) || ""}
                      </p>
                      <p className="text-[13px] text-[var(--color-text-tertiary)] mt-1">
                        {(d.year as string) || ""} — {(d.location as string) || ""}
                      </p>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Skills */}
          {skillGroups.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Code className="w-5 h-5 text-[var(--color-accent)]" />
                <h2 className="text-[28px] font-semibold tracking-[-0.01em]">
                  {t("skills")}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skillGroups.map((sg, i) => {
                  const d = sg.data;
                  const items = (d.items as string[]) || [];
                  return (
                    <Card key={i}>
                      <h3 className="text-[15px] font-semibold text-[var(--color-accent)] mb-3">
                        {(d.category as string) || ""}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {items.map((skill) => (
                          <Badge key={skill}>{skill}</Badge>
                        ))}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-5 h-5 text-[var(--color-accent)]" />
                <h2 className="text-[28px] font-semibold tracking-[-0.01em]">
                  {t("certifications")}
                </h2>
              </div>
              {certifications.map((cert, i) => {
                const d = cert.data;
                return (
                  <Card key={i}>
                    <h3 className="text-[17px] font-semibold mb-1">
                      {(d.title as string) || ""}
                    </h3>
                    <p className="text-[15px] text-[var(--color-text-secondary)]">
                      {(d.details as string) || ""}
                    </p>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Globe className="w-5 h-5 text-[var(--color-accent)]" />
                <h2 className="text-[28px] font-semibold tracking-[-0.01em]">
                  {t("languages")}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {languages.map((lang, i) => {
                  const d = lang.data;
                  return (
                    <Card key={i}>
                      <p className="text-[15px] font-semibold text-[var(--color-text-primary)]">
                        {(d.name as string) || ""}
                      </p>
                      <p className="text-[13px] text-[var(--color-accent)] mt-1">
                        {(d.level as string) || ""}
                      </p>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Contact / Links */}
          {contacts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Mail className="w-5 h-5 text-[var(--color-accent)]" />
                <h2 className="text-[28px] font-semibold tracking-[-0.01em]">
                  {t("contact")}
                </h2>
              </div>
              <Card>
                <ul className="space-y-2">
                  {contacts.map((c, i) => {
                    const d = c.data;
                    const label = (d.label as string) || "";
                    const value = (d.value as string) || "";
                    const href = (d.href as string) || "";
                    return (
                      <li
                        key={i}
                        className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px]"
                      >
                        <span className="font-semibold text-[var(--color-text-primary)] min-w-[110px]">
                          {label}
                        </span>
                        {href ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--color-accent)] hover:underline break-all"
                          >
                            {value || href}
                          </a>
                        ) : (
                          <span className="text-[var(--color-text-secondary)] break-all">
                            {value}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </Card>
            </div>
          )}
        </div>

        <ViewTracker pagePath="/about" />
      </Container>
    </section>
  );
}
