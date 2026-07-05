import Image from "next/image";
import TransitionLink from "@/components/transition-link";
import VideoThumbnail from "@/components/video-thumbnail";
import type { Project } from "@/lib/projects";
import { isVideoThumbnail } from "@/lib/projects";

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
        className="group relative aspect-video rounded-2xl border border-border overflow-hidden cursor-pointer hover:border-muted transition-colors"
      >
        <ProjectThumbnail project={project} isVideo={isVideo} />
        <div className="absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
          <span
            className="text-xs uppercase tracking-widest text-white/80"
            style={{ fontFamily: "var(--font-strawford)" }}
          >
            {project.tag} · {project.year}
          </span>
          <span
            className="text-lg sm:text-xl text-white leading-snug"
            style={{ fontFamily: "var(--font-knile)" }}
          >
            {project.title}
          </span>
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
        <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/50 to-transparent">
          <span
            className="text-xs uppercase tracking-widest text-white/80"
            style={{ fontFamily: "var(--font-strawford)" }}
          >
            {project.tag} · {project.year}
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h2
          className="text-2xl font-normal text-foreground"
          style={{ fontFamily: "var(--font-knile)" }}
        >
          {project.title}
        </h2>
        <p
          className="text-sm text-muted leading-relaxed flex-1"
          style={{ fontFamily: "var(--font-strawford)" }}
        >
          {project.desc}
        </p>
        {project.tech && project.tech.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-3 py-1 text-xs rounded-full bg-background border border-border text-muted"
                style={{ fontFamily: "var(--font-strawford)" }}
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
