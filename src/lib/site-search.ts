import { blocksSearchText } from "@/lib/cms/search-text";
import { getSitePage } from "@/lib/cms/site-pages";
import type { Project } from "@/lib/project-types";
import { getAllProjects } from "@/lib/projects";
import { CONTACT_EMAIL, SITE_NAME, SOCIAL_LINKS } from "@/lib/site-config";

export type SearchResult = {
  id: string;
  title: string;
  desc: string;
  href: string;
  category: string;
};

type IndexEntry = SearchResult & { text: string };

function collectTexts(...parts: (string | string[] | undefined)[]): string {
  return parts
    .flat()
    .filter((part): part is string => Boolean(part))
    .join(" ");
}

export function projectSearchText(project: Project): string {
  return collectTexts(
    project.title,
    project.desc,
    project.tag,
    project.year,
    project.tech,
    project.body,
    project.links?.map((link) => link.label),
    project.embeds?.map((embed) => embed.title),
  );
}

function buildIndex(): IndexEntry[] {
  const home = getSitePage("home");
  const about = getSitePage("about");
  const projectsPage = getSitePage("projects");
  const contact = getSitePage("contact");
  const projects = getAllProjects();

  const entries: IndexEntry[] = [
    {
      id: "home",
      title: home?.title ?? "Home",
      desc: home?.seoDescription ?? SITE_NAME,
      href: "/",
      category: "Page",
      text: collectTexts(home?.title, home?.seoDescription, home ? blocksSearchText(home.blocks) : ""),
    },
    {
      id: "projects",
      title: projectsPage?.title ?? "Projects",
      desc: projectsPage?.seoDescription ?? "Projects",
      href: "/projects",
      category: "Page",
      text: collectTexts(
        projectsPage?.title,
        projectsPage?.seoDescription,
        projectsPage ? blocksSearchText(projectsPage.blocks) : "",
        projects.map((p) => projectSearchText(p)),
      ),
    },
    {
      id: "about",
      title: about?.title ?? "About",
      desc: about?.seoDescription ?? "About",
      href: "/about",
      category: "Page",
      text: collectTexts(about?.title, about?.seoDescription, about ? blocksSearchText(about.blocks) : ""),
    },
    {
      id: "contact",
      title: contact?.title ?? "Contact",
      desc: contact?.seoDescription ?? "Contact",
      href: "/contact",
      category: "Page",
      text: collectTexts(
        contact?.title,
        contact?.seoDescription,
        contact ? blocksSearchText(contact.blocks) : "",
        CONTACT_EMAIL,
        SOCIAL_LINKS.map((social) => social.label),
      ),
    },
  ];

  for (const project of projects) {
    entries.push({
      id: `project-${project.slug}`,
      title: project.title,
      desc: project.desc,
      href: `/projects/${project.slug}`,
      category: project.tag,
      text: projectSearchText(project),
    });
  }

  return entries;
}

const SEARCH_INDEX = buildIndex();

export function queryTokens(query: string): string[] {
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

export function matchesQuery(text: string, query: string): boolean {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return true;
  const haystack = text.toLowerCase();
  return tokens.every((token) => haystack.includes(token));
}

function resultScore(entry: IndexEntry, tokens: string[]): number {
  const title = entry.title.toLowerCase();
  const desc = entry.desc.toLowerCase();
  let score = 0;

  for (const token of tokens) {
    if (title.includes(token)) score += 3;
    if (desc.includes(token)) score += 1;
    if (entry.text.toLowerCase().includes(token)) score += 0.5;
  }

  if (entry.category === "Page") score += 0.5;
  return score;
}

export function searchSite(query: string, limit?: number): SearchResult[] {
  const trimmed = query.trim();

  let results: IndexEntry[];

  if (!trimmed) {
    results = [
      ...SEARCH_INDEX.filter((entry) => entry.category === "Page"),
      ...SEARCH_INDEX.filter((entry) => entry.id.startsWith("project-")).slice(0, 4),
    ];
  } else {
    const tokens = queryTokens(trimmed);
    results = SEARCH_INDEX
      .filter((entry) => matchesQuery(`${entry.title} ${entry.desc} ${entry.text}`, trimmed))
      .sort((a, b) => resultScore(b, tokens) - resultScore(a, tokens));
  }

  const mapped = results.map(({ text: _text, ...result }) => result);
  return limit ? mapped.slice(0, limit) : mapped;
}

export function isProjectResult(result: SearchResult): boolean {
  return /^\/projects\/[^/]+$/.test(result.href);
}

export function searchProjects(query: string): Project[] {
  const trimmed = query.trim();
  const projects = getAllProjects();
  if (!trimmed) return projects;
  return projects.filter((project) => matchesQuery(projectSearchText(project), trimmed));
}

export function searchPages(query: string): SearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return SEARCH_INDEX.filter((entry) => entry.category === "Page").map(
      ({ text: _text, ...result }) => result,
    );
  }
  return searchSite(trimmed).filter((result) => !isProjectResult(result));
}

export const HEADER_RESULT_LIMIT = 3;

export function headerSearchResults(query: string): {
  results: SearchResult[];
  total: number;
} {
  const all = searchSite(query);
  return {
    results: all.slice(0, HEADER_RESULT_LIMIT),
    total: all.length,
  };
}
