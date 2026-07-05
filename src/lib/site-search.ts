import {
  ABOUT_HERO,
  ABOUT_INTRO,
  ABOUT_TAGLINE,
  ABOUT_TEASER,
  ABOUT_WIP_NOTICE,
  EDUCATION,
  HIGHLIGHTS,
  INTERESTS,
  SKILLS,
} from "@/lib/about-content";
import { PROJECTS, type Project } from "@/lib/projects";
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
  const entries: IndexEntry[] = [
    {
      id: "home",
      title: "Home",
      desc: ABOUT_HERO,
      href: "/",
      category: "Page",
      text: collectTexts(SITE_NAME, ABOUT_TAGLINE, ABOUT_HERO, ABOUT_TEASER, ABOUT_WIP_NOTICE),
    },
    {
      id: "projects",
      title: "Projects",
      desc: "A selection of work across brand design, UI/UX, motion, and product design.",
      href: "/projects",
      category: "Page",
      text: collectTexts(
        "projects",
        "brand design",
        "UI/UX",
        "motion",
        "product design",
        PROJECTS.map((p) => projectSearchText(p)),
      ),
    },
    {
      id: "about",
      title: "About",
      desc: ABOUT_TEASER,
      href: "/about",
      category: "Page",
      text: collectTexts(ABOUT_INTRO, ABOUT_TAGLINE, ABOUT_TEASER),
    },
    {
      id: "contact",
      title: "Contact",
      desc: "Available for freelance projects and full-time roles.",
      href: "/contact",
      category: "Page",
      text: collectTexts(
        "contact",
        "freelance",
        "full-time",
        CONTACT_EMAIL,
        SOCIAL_LINKS.map((social) => social.label),
      ),
    },
  ];

  for (const entry of EDUCATION) {
    entries.push({
      id: `education-${entry.institution}`,
      title: entry.institution,
      desc: entry.qualification,
      href: "/about",
      category: "Education",
      text: collectTexts(entry.institution, entry.qualification, entry.period),
    });
  }

  for (const highlight of HIGHLIGHTS) {
    entries.push({
      id: `highlight-${highlight.title}`,
      title: highlight.title,
      desc: highlight.desc,
      href: "/about",
      category: "Highlight",
      text: collectTexts(highlight.title, highlight.desc, highlight.period),
    });
  }

  for (const group of SKILLS) {
    entries.push({
      id: `skills-${group.category}`,
      title: group.category,
      desc: group.items.join(", "),
      href: "/about",
      category: "Skills",
      text: collectTexts(group.category, group.items),
    });
  }

  for (const interest of INTERESTS) {
    entries.push({
      id: `interest-${interest.slice(0, 24)}`,
      title: "Interests",
      desc: interest,
      href: "/about",
      category: "About",
      text: interest,
    });
  }

  for (const project of PROJECTS) {
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
  if (!trimmed) return PROJECTS;
  return PROJECTS.filter((project) => matchesQuery(projectSearchText(project), trimmed));
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
