export const metadata = { title: "Projects | Portfolio" };

const PROJECTS = [
  {
    name: "Project Alpha",
    year: "2025",
    tag: "Web App",
    desc: "A full-stack dashboard for real-time analytics with custom data visualisation and role-based access control.",
    tech: ["Next.js", "TypeScript", "Postgres"],
    color: "from-violet-500/20 to-indigo-500/20",
  },
  {
    name: "Project Beta",
    year: "2025",
    tag: "Design System",
    desc: "Component library and design token system built to unify a product suite across web and mobile platforms.",
    tech: ["Figma", "React", "Storybook"],
    color: "from-emerald-500/20 to-teal-500/20",
  },
  {
    name: "Project Gamma",
    year: "2024",
    tag: "Mobile",
    desc: "Cross-platform fitness tracking app with personalised workout plans and progress visualisation.",
    tech: ["React Native", "Expo", "Supabase"],
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    name: "Project Delta",
    year: "2024",
    tag: "Branding",
    desc: "Brand identity and digital presence for a London-based creative studio — logo, type, and web.",
    tech: ["Figma", "Framer", "Motion"],
    color: "from-rose-500/20 to-pink-500/20",
  },
  {
    name: "Project Epsilon",
    year: "2023",
    tag: "E-commerce",
    desc: "High-performance storefront with headless CMS, edge caching, and a custom checkout flow.",
    tech: ["Next.js", "Shopify", "Tailwind"],
    color: "from-sky-500/20 to-cyan-500/20",
  },
  {
    name: "Project Zeta",
    year: "2023",
    tag: "Tool",
    desc: "CLI and web interface for automating repetitive design handoff tasks between Figma and code.",
    tech: ["Node.js", "Figma API", "React"],
    color: "from-fuchsia-500/20 to-purple-500/20",
  },
];

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
        {PROJECTS.map((p) => (
          <div
            key={p.name}
            className="group flex flex-col rounded-2xl bg-surface border border-border hover:border-muted transition-colors overflow-hidden cursor-pointer"
          >
            {/* Thumbnail */}
            <div className={`aspect-video bg-gradient-to-br ${p.color} flex items-end p-5`}>
              <span
                className="text-xs uppercase tracking-widest text-muted"
                style={{ fontFamily: "var(--font-strawford)" }}
              >
                {p.tag} · {p.year}
              </span>
            </div>
            {/* Body */}
            <div className="flex flex-col flex-1 p-5 gap-3">
              <h2
                className="text-2xl font-normal text-foreground"
                style={{ fontFamily: "var(--font-knile)" }}
              >
                {p.name}
              </h2>
              <p
                className="text-sm text-muted leading-relaxed flex-1"
                style={{ fontFamily: "var(--font-strawford)" }}
              >
                {p.desc}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 text-xs rounded-full bg-background border border-border text-muted"
                    style={{ fontFamily: "var(--font-strawford)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
