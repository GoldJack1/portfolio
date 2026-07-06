"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import type { Project } from "@/lib/project-types";
import { isVideoThumbnail } from "@/lib/projects";
import CmsBackLink from "@/components/cms/cms-back-link";
import CmsHeading from "@/components/cms/cms-heading";
import CmsImageFrame from "@/components/cms/cms-image-frame";
import VideoThumbnail from "@/components/video-thumbnail";
import { decoMedium, sansBold, sansLight, sansMedium } from "@/lib/typography";

export default function ProjectDetailContent({ project }: { project: Project }) {
  const isVideo = isVideoThumbnail(project.thumbnail);

  return (
    <article className="px-6 sm:px-12 pt-10 sm:pt-14 pb-16 w-full">
      <CmsBackLink label="Back to projects" href="/projects" />

      <header className="mb-10">
        <p className={`text-xs uppercase tracking-widest text-muted mb-3 ${sansLight}`}>
          {project.tag} · {project.year}
        </p>
        <CmsHeading as="h1" typography={{ font: "deco", weight: "medium", size: "7xl" }} className="mb-6">
          {project.title}
        </CmsHeading>
        <p className={`text-lg text-muted leading-relaxed max-w-3xl ${sansLight}`}>{project.desc}</p>
      </header>

      <div className="relative w-full aspect-video rounded-surface overflow-hidden border border-border mb-12 bg-background">
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

      {project.bodyMarkdown ? (
        <div className={`max-w-3xl mb-12 prose prose-neutral dark:prose-invert ${sansLight}`}>
          <ReactMarkdown>{project.bodyMarkdown}</ReactMarkdown>
        </div>
      ) : project.body && project.body.length > 0 ? (
        <div className="max-w-3xl space-y-6 mb-12">
          {project.body.map((paragraph) => (
            <p key={paragraph} className="text-base sm:text-lg text-muted leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}

      {project.links && project.links.length > 0 ? (
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
      ) : null}

      {project.gallery.length > 0 ? (
        <section>
          <h2 className={`text-2xl ${decoMedium} text-foreground mb-6`}>Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.gallery.map((src) => (
              <CmsImageFrame
                key={src}
                src={src}
                alt=""
                display={{ layout: "full", aspect: "standard", fit: "cover", radius: "lg" }}
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            ))}
          </div>
        </section>
      ) : null}

      {project.tech && project.tech.length > 0 ? (
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
      ) : null}
    </article>
  );
}
