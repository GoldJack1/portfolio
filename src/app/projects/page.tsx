import ProjectCard from "@/components/project-card";
import { PROJECTS } from "@/lib/projects";
import { decoMedium, sansLight } from "@/lib/typography";

export const metadata = { title: "Projects | Portfolio" };

export default function Projects() {
  return (
    <section className="px-6 sm:px-12 pt-10 sm:pt-14 pb-16 w-full">
      <h1 className={`text-5xl sm:text-7xl ${decoMedium} text-foreground mb-4`}>
        Projects
      </h1>
      <p className={`text-lg text-muted mb-16 max-w-xl ${sansLight}`}>
        A selection of work across brand design, UI/UX, motion, and product design.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
