import projectsData from "@/data/projects.json";
import type { Project } from "./project-types";

const PROJECTS = projectsData as Project[];

export type { Project, ProjectEmbed, ProjectLink } from "./project-types";

export function getAllProjects(): Project[] {
  return PROJECTS;
}

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return PROJECTS.filter((p) => p.featured);
}

export function isVideoThumbnail(thumbnail: string): boolean {
  return /\.(mp4|webm|mov)$/i.test(thumbnail);
}
