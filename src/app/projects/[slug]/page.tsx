import { notFound } from "next/navigation";
import ProjectDetailContent from "@/components/project-detail-content";
import { getAllProjects, getProject } from "@/lib/projects";
import { createCmsPageMetadata, createPageMetadata } from "@/lib/site-metadata";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return createPageMetadata("Project");
  return createCmsPageMetadata(
    project.title,
    project.seoTitle,
    project.seoDescription ?? project.desc,
    project.ogImage ?? project.thumbnail,
  );
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return <ProjectDetailContent project={project} />;
}
