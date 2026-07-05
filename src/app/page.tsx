import TransitionLink from "@/components/transition-link";
import ProjectCard from "@/components/project-card";
import { getFeaturedProjects } from "@/lib/projects";

export default function Home() {
  const featured = getFeaturedProjects();

  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section className="flex-1 flex flex-col items-start justify-center px-6 sm:px-12 pt-10 sm:pt-14 pb-24 w-full min-h-[60vh]">
        <p
          className="text-sm uppercase tracking-widest text-muted mb-6"
          style={{ fontFamily: "var(--font-strawford)" }}
        >
          Designer & Developer
        </p>
        <h1
          className="text-7xl sm:text-9xl font-normal leading-none text-foreground mb-8"
          style={{ fontFamily: "var(--font-knile)" }}
        >
          Jack<br />Wingate
        </h1>
        <p
          className="text-xl sm:text-2xl text-muted max-w-xl leading-relaxed mb-10"
          style={{ fontFamily: "var(--font-strawford)" }}
        >
          I craft thoughtful digital experiences — blending clean design with solid engineering to build things people actually enjoy using.
        </p>
        <div className="flex flex-wrap gap-4" style={{ fontFamily: "var(--font-strawford)" }}>
          <TransitionLink
            href="/projects"
            className="px-6 py-3 rounded-full bg-foreground text-background text-[15px] hover:opacity-80 transition-opacity"
          >
            View work
          </TransitionLink>
          <TransitionLink
            href="/contact"
            className="px-6 py-3 rounded-full border border-border text-foreground text-[15px] hover:bg-surface transition-colors"
          >
            Get in touch
          </TransitionLink>
        </div>
      </section>

      {/* ── Selected work ── */}
      <section className="px-6 sm:px-12 pb-24 w-full">
        <div className="flex items-end justify-between mb-8">
          <h2
            className="text-3xl sm:text-4xl font-normal text-foreground"
            style={{ fontFamily: "var(--font-knile)" }}
          >
            Selected work
          </h2>
          <TransitionLink
            href="/projects"
            className="text-sm text-muted hover:text-foreground transition-colors"
            style={{ fontFamily: "var(--font-strawford)" }}
          >
            All projects →
          </TransitionLink>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} variant="compact" />
          ))}
        </div>
      </section>

      {/* ── About teaser ── */}
      <section className="px-6 sm:px-12 pb-24 w-full">
        <div className="rounded-2xl bg-surface border border-border p-8 sm:p-12 flex flex-col sm:flex-row sm:items-center gap-8">
          <div className="flex-1">
            <h2
              className="text-3xl font-normal text-foreground mb-4"
              style={{ fontFamily: "var(--font-knile)" }}
            >
              About me
            </h2>
            <p
              className="text-lg text-muted leading-relaxed max-w-md"
              style={{ fontFamily: "var(--font-strawford)" }}
            >
              Based in London. I&apos;ve spent the last few years working across product design and frontend development, with a focus on interfaces that feel effortless.
            </p>
          </div>
          <TransitionLink
            href="/about"
            className="shrink-0 px-6 py-3 rounded-full border border-border text-foreground text-[15px] hover:bg-background transition-colors self-start sm:self-auto"
            style={{ fontFamily: "var(--font-strawford)" }}
          >
            Learn more →
          </TransitionLink>
        </div>
      </section>

    </div>
  );
}
