import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/icons";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <Container>
        <div className="py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <p className="text-[15px] text-[var(--color-text-secondary)]">
              {t("footer.description")}
            </p>

            <nav className="flex flex-wrap gap-6">
              <Link href="/about" className="text-[15px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                {t("nav.about")}
              </Link>
              <Link href="/blog" className="text-[15px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                {t("nav.blog")}
              </Link>
              <Link href="/projects" className="text-[15px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                {t("nav.projects")}
              </Link>
              <Link href="/uses" className="text-[15px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                {t("nav.uses")}
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
            <p className="text-[13px] text-[var(--color-text-tertiary)]">
              &copy; {new Date().getFullYear()} im.dev. {t("footer.copyright")}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
