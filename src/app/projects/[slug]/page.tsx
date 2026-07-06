import Image from "next/image";
import { notFound } from "next/navigation";
import CmsBackLink from "@/components/cms/cms-back-link";
import TransitionLink from "@/components/transition-link";
import VideoThumbnail from "@/components/video-thumbnail";
import { getAllProjects, getProject, isVideoThumbnail } from "@/lib/projects";
import { createPageMetadata } from "@/lib/site-metadata";
import { decoMedium, sansBold, sansLight, sansMedium } from "@/lib/typography";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return createPageMetadata("Project");
  return createPageMetadata(project.title, project.desc);
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const isVideo = isVideoThumbnail(project.thumbnail);

  return (
    <article className="px-6 sm:px-12 pt-10 sm:pt-14 pb-16 w-full">
      <CmsBackLink label="Back to projects" href="/projects" />

      <header className="mb-10 max-w-3xl">
        <p className={`text-xs uppercase tracking-widest text-muted mb-3 ${sansLight}`}>
          {project.tag} · {project.year}
        </p>
        <h1 className={`text-5xl sm:text-7xl ${decoMedium} text-foreground mb-6`}>
          {project.title}
        </h1>
        <p className={`text-lg text-muted leading-relaxed ${sansLight}`}>
          {project.desc}
        </p>
      </header>

      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border mb-12 bg-background">
        {isVideo ? (
          <VideoThumbnail
            src={project.video ?? project.thumbnail}
            className="w-full h-full object-cover"
            ariaLabel={project.title}
          />
        ) : (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
      </div>

      {project.body && project.body.length > 0 && (
        <div className="max-w-3xl space-y-6 mb-12">
          {project.body.map((paragraph) => (
            <p key={paragraph} className="text-base sm:text-lg text-muted leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {project.links && project.links.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-12">
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-5 py-2.5 rounded-full bg-foreground text-background text-sm hover:opacity-80 transition-opacity ${sansBold}`}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      {project.pdf && (
        <div data-header-tone="light" className="mb-12 w-full">
          <p className={`text-sm text-muted mb-4 ${sansLight}`}>
            Full project outcome (PDF)
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <a
              href={project.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-5 py-2.5 rounded-full border border-border text-foreground text-sm hover:bg-surface transition-colors ${sansBold}`}
            >
              Open PDF
            </a>
            <a
              href={project.pdf}
              download
              className={`px-5 py-2.5 rounded-full border border-border text-foreground text-sm hover:bg-surface transition-colors ${sansBold}`}
            >
              Download PDF
            </a>
          </div>
          <iframe
            src={project.pdf}
            title={`${project.title} PDF`}
            className="hidden md:block w-full min-h-[600px] border border-border rounded-2xl bg-white"
          />
        </div>
      )}

      {project.embeds && project.embeds.length > 0 && (
        <div className="space-y-10 mb-12 max-w-4xl">
          {project.embeds.map((embed) => (
            <div key={embed.src} className={embed.hideOnMobile ? "hidden md:block" : undefined}>
              <p className={`text-sm text-muted mb-3 ${sansLight}`}>
                {embed.title}
              </p>
              <div
                data-header-tone="dark"
                className={`relative w-full rounded-2xl overflow-hidden border border-border bg-black ${
                  embed.src.includes("youtube") ? "aspect-video" : "min-h-[520px] sm:min-h-[600px]"
                }`}
              >
                <iframe
                  src={embed.src}
                  title={embed.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className={`absolute inset-0 w-full h-full border-0 ${
                    embed.src.includes("youtube") ? "" : "min-h-[520px]"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {project.gallery.length > 0 && (
        <section>
          <h2 className={`text-2xl ${decoMedium} text-foreground mb-6`}>
            Gallery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.gallery.map((src) => (
              <div
                key={src}
                className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border bg-background"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {project.tech && project.tech.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border">
          {project.tech.map((t) => (
            <span
              key={t}
              className={`px-3 py-1 text-xs rounded-full bg-surface border border-border text-muted ${sansMedium}`}
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
