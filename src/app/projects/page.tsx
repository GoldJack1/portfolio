import ProjectCard from "@/components/project-card";
import { PROJECTS } from "@/lib/projects";

export const metadata = { title: "Projects | Portfolio" };

export default function Projects() {
  return (
    <section className="px-6 sm:px-12 pt-10 sm:pt-14 pb-16 w-full">
      <h1
        className="text-5xl sm:text-7xl font-normal text-foreground mb-4"
        style={{ fontFamily: "var(--font-knile)" }}
      >
        Projects
      </h1>
      <p
        className="text-lg text-muted mb-16 max-w-xl"
        style={{ fontFamily: "var(--font-strawford)" }}
      >
        A selection of work across product design, frontend engineering, and creative direction.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
