import type { Project } from "./project-types";

export type { Project, ProjectEmbed, ProjectLink } from "./project-types";

import projectsData from "@/data/projects.json";

const PROJECTS = (projectsData as Project[]).slice().sort((a, b) => {
  const orderA = a.sortOrder ?? 0;
  const orderB = b.sortOrder ?? 0;
  if (orderA !== orderB) return orderA - orderB;
  return a.title.localeCompare(b.title);
});

export function getAllProjects(): Project[] {
  return PROJECTS;
}

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return PROJECTS.filter((p) => p.featured);
}

export function normalizeProjectSlugs(slugs?: Array<string | { slug?: string }>): string[] {
  return (slugs ?? [])
    .map((entry) => (typeof entry === "string" ? entry : entry.slug))
    .filter((slug): slug is string => Boolean(slug));
}

export function getProjectsBySlugs(slugs: string[]): Project[] {
  return slugs.map((slug) => getProject(slug)).filter((project): project is Project => Boolean(project));
}

export function resolveProjectSelection(
  slugs: Array<string | { slug?: string }> | undefined,
  fallback: () => Project[],
  limit?: number,
): Project[] {
  const normalized = normalizeProjectSlugs(slugs);
  const list = normalized.length ? getProjectsBySlugs(normalized) : fallback();
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

export function isVideoThumbnail(thumbnail: string): boolean {
  return /\.(mp4|webm|mov)$/i.test(thumbnail);
}

export function isVideoSource(src: string): boolean {
  return /\.(mp4|webm|mov)$/i.test(src) || src.includes("youtube.com") || src.includes("youtu.be") || src.includes("vimeo.com");
}
