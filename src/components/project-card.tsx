import Image from "next/image";
import TransitionLink from "@/components/transition-link";
import VideoThumbnail from "@/components/video-thumbnail";
import type { Project } from "@/lib/projects";
import { isVideoThumbnail } from "@/lib/projects";
import { decoMedium, sansLight, sansMedium } from "@/lib/typography";

type ProjectCardProps = {
  project: Project;
  variant?: "grid" | "compact";
};

export default function ProjectCard({ project, variant = "grid" }: ProjectCardProps) {
  const href = `/projects/${project.slug}`;
  const isVideo = isVideoThumbnail(project.thumbnail);

  if (variant === "compact") {
    return (
      <TransitionLink
        href={href}
        className="group flex flex-col cursor-pointer"
      >
        <div className="relative aspect-video rounded-2xl border border-border overflow-hidden bg-background hover:border-muted transition-colors">
          <ProjectThumbnail project={project} isVideo={isVideo} />
        </div>
        <div className="pt-4 flex flex-col gap-1">
          <h2 className={`text-lg sm:text-xl text-foreground leading-snug ${decoMedium}`}>
            {project.title}
          </h2>
          <p className={`text-xs uppercase tracking-widest text-muted ${sansLight}`}>
            {project.tag} · {project.year}
          </p>
        </div>
      </TransitionLink>
    );
  }

  return (
    <TransitionLink
      href={href}
      className="group flex flex-col rounded-2xl bg-surface border border-border hover:border-muted transition-colors overflow-hidden cursor-pointer"
    >
      <div className="relative aspect-video overflow-hidden bg-background">
        <ProjectThumbnail project={project} isVideo={isVideo} />
      </div>
      <div className="flex flex-col flex-1 p-5 gap-3">
        <p className={`text-xs uppercase tracking-widest text-muted mb-1 ${sansLight}`}>
          {project.tag} · {project.year}
        </p>
        <h2 className={`text-2xl ${decoMedium} text-foreground`}>
          {project.title}
        </h2>
        <p className={`text-sm text-muted leading-relaxed flex-1 ${sansLight}`}>
          {project.desc}
        </p>
        {project.tech && project.tech.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {project.tech.map((t) => (
              <span
                key={t}
                className={`px-3 py-1 text-xs rounded-full bg-background border border-border text-muted ${sansMedium}`}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </TransitionLink>
  );
}

function ProjectThumbnail({ project, isVideo }: { project: Project; isVideo: boolean }) {
  if (isVideo) {
    return (
      <VideoThumbnail
        src={project.thumbnail}
        className="absolute inset-0 w-full h-full object-cover"
      />
    );
  }

  return (
    <Image
      src={project.thumbnail}
      alt={project.title}
      fill
      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      sizes="(max-width: 640px) 100vw, 50vw"
    />
  );
}
