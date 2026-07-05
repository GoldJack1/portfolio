import TransitionLink from "@/components/transition-link";
import ProjectCard from "@/components/project-card";
import { getFeaturedProjects } from "@/lib/projects";
import { ABOUT_HERO, ABOUT_TAGLINE, ABOUT_TEASER, ABOUT_WIP_NOTICE } from "@/lib/about-content";
import { decoMedium, sansBold, sansLight } from "@/lib/typography";

export default function Home() {
  const featured = getFeaturedProjects();

  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section className="flex-1 flex flex-col items-start justify-center px-6 sm:px-12 pt-10 sm:pt-14 pb-24 w-full min-h-[60vh]">
        <p className={`text-sm uppercase tracking-widest text-muted mb-6 ${sansLight}`}>
          {ABOUT_TAGLINE}
        </p>
        <h1 className={`text-7xl ${decoMedium} leading-none text-foreground mb-8 whitespace-nowrap`}>
          Jack Wingate
        </h1>
        <p className={`text-lg text-muted leading-relaxed max-w-2xl mb-4 ${decoMedium}`}>
          {ABOUT_HERO}
        </p>
        <p className={`text-sm text-muted leading-relaxed max-w-2xl mb-10 ${sansLight}`}>
          {ABOUT_WIP_NOTICE}
        </p>
        <div className="flex flex-wrap gap-4">
          <TransitionLink
            href="/projects"
            className={`px-6 py-3 rounded-full bg-foreground text-background text-[15px] hover:opacity-80 transition-opacity ${sansBold}`}
          >
            View work
          </TransitionLink>
          <TransitionLink
            href="/contact"
            className={`px-6 py-3 rounded-full border border-border text-foreground text-[15px] hover:bg-surface transition-colors ${sansBold}`}
          >
            Get in touch
          </TransitionLink>
        </div>
      </section>

      {/* ── Selected work ── */}
      <section className="px-6 sm:px-12 pb-24 w-full">
        <div className="flex items-end justify-between mb-8">
          <h2 className={`text-3xl sm:text-4xl ${decoMedium} text-foreground`}>
            Selected work
          </h2>
          <TransitionLink
            href="/projects"
            className={`text-sm text-muted hover:text-foreground transition-colors ${sansLight}`}
          >
            All projects →
          </TransitionLink>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      {/* ── About teaser ── */}
      <section className="px-6 sm:px-12 pb-24 w-full">
        <div className="rounded-2xl bg-surface border border-border p-8 sm:p-12 flex flex-col sm:flex-row sm:items-center gap-8">
          <div className="flex-1">
            <h2 className={`text-3xl ${decoMedium} text-foreground mb-4`}>
              About me
            </h2>
            <p className="text-lg text-muted leading-relaxed max-w-lg">
              {ABOUT_TEASER}
            </p>
          </div>
          <TransitionLink
            href="/about"
            className={`shrink-0 px-6 py-3 rounded-full border border-border text-foreground text-[15px] hover:bg-background transition-colors self-start sm:self-auto ${sansBold}`}
          >
            Learn more →
          </TransitionLink>
        </div>
      </section>

    </div>
  );
}
