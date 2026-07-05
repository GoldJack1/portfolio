export const metadata = { title: "About | Portfolio" };

const EXPERIENCE = [
  {
    role: "Senior Product Designer",
    company: "Studio Name",
    period: "2023 – Present",
    desc: "Leading design across a suite of B2B SaaS products. Responsible for the design system, user research, and end-to-end feature design.",
  },
  {
    role: "Frontend Developer",
    company: "Agency Name",
    period: "2021 – 2023",
    desc: "Built marketing sites and web apps for clients across fintech, media, and e-commerce. Focus on performance and accessibility.",
  },
  {
    role: "UI/UX Designer",
    company: "Freelance",
    period: "2019 – 2021",
    desc: "Worked with early-stage startups on branding, product design, and Webflow development.",
  },
];

const SKILLS: { category: string; items: string[] }[] = [
  { category: "Design",      items: ["Figma", "Framer", "Motion design", "Design systems", "Prototyping"] },
  { category: "Frontend",    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"] },
  { category: "Backend",     items: ["Node.js", "PostgreSQL", "Supabase", "REST APIs", "GraphQL"] },
  { category: "Workflow",    items: ["Git", "Vercel", "Linear", "Notion", "Figma Dev Mode"] },
];

export default function About() {
  return (
    <section className="px-6 sm:px-12 pt-10 sm:pt-14 pb-16 w-full max-w-3xl">

      {/* Heading */}
      <h1
        className="text-5xl sm:text-7xl font-normal text-foreground mb-12"
        style={{ fontFamily: "var(--font-knile)" }}
      >
        About
      </h1>

      {/* Bio */}
      <div
        className="space-y-5 text-lg text-muted leading-relaxed mb-16"
        style={{ fontFamily: "var(--font-strawford)" }}
      >
        <p>
          I&apos;m a designer and developer based in London with a background spanning product design, frontend engineering, and creative direction. I care deeply about the details — the micro-interactions, the typographic rhythm, the moments where good craft becomes invisible.
        </p>
        <p>
          Over the past five years I&apos;ve worked with startups, agencies, and independent clients to ship products that are both beautiful and reliable. My process is collaborative and iterative — I&apos;m equally comfortable in Figma and a code editor, and I believe the best work happens at the intersection of both.
        </p>
        <p>
          Outside of work I photograph cities, read about systems thinking, and occasionally compete in amateur half-marathons.
        </p>
      </div>

      {/* Experience */}
      <div className="mb-16">
        <h2
          className="text-2xl font-normal text-foreground mb-8"
          style={{ fontFamily: "var(--font-knile)" }}
        >
          Experience
        </h2>
        <div className="flex flex-col gap-8">
          {EXPERIENCE.map((e, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-2 sm:gap-6 pb-8 border-b border-border last:border-0 last:pb-0">
              <div>
                <p className="text-sm text-muted" style={{ fontFamily: "var(--font-strawford)" }}>{e.period}</p>
                <p className="text-sm text-muted" style={{ fontFamily: "var(--font-strawford)" }}>{e.company}</p>
              </div>
              <div>
                <p className="text-base font-normal text-foreground mb-1" style={{ fontFamily: "var(--font-strawford)" }}>{e.role}</p>
                <p className="text-sm text-muted leading-relaxed" style={{ fontFamily: "var(--font-strawford)" }}>{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <h2
          className="text-2xl font-normal text-foreground mb-8"
          style={{ fontFamily: "var(--font-knile)" }}
        >
          Skills
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {SKILLS.map((group) => (
            <div key={group.category}>
              <p
                className="text-xs uppercase tracking-widest text-muted mb-3"
                style={{ fontFamily: "var(--font-strawford)" }}
              >
                {group.category}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.items.map((s) => (
                  <span
                    key={s}
                    className="px-4 py-1.5 rounded-full bg-surface border border-border text-sm text-muted"
                    style={{ fontFamily: "var(--font-strawford)" }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
