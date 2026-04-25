import { createHighlighter, type Highlighter } from "shiki";

let highlighter: Highlighter | null = null;

export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: [
        "typescript",
        "javascript",
        "python",
        "bash",
        "json",
        "yaml",
        "sql",
        "html",
        "css",
        "tsx",
        "jsx",
        "markdown",
        "dockerfile",
      ],
    });
  }
  return highlighter;
}

export async function highlightCode(
  code: string,
  lang: string = "typescript"
): Promise<string> {
  const hl = await getHighlighter();
  return hl.codeToHtml(code, {
    lang,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
  });
}
