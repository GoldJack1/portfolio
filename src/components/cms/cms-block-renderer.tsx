import ReactMarkdown from "react-markdown";
import ProjectCard from "@/components/project-card";
import type { CmsBlock } from "@/lib/cms/types";
import { getAllProjects, getFeaturedProjects } from "@/lib/projects";
import {
  GALLERY_COLUMN_CLASSES,
  HERO_MIN_HEIGHT_CLASSES,
  PAGE_WIDTH_CLASSES,
  SPACER_CLASSES,
  TWO_COLUMN_RATIO_CLASSES,
  typographyClassName,
} from "@/lib/cms/typography";
import { blockSectionStyle, sectionClassName } from "@/lib/cms/section-styles";
import { sansBold, sansLight, sansMedium } from "@/lib/typography";
import CmsImage from "./cms-image";
import CmsBackLink from "./cms-back-link";
import CmsContactForm from "./cms-contact-form";
import CmsButton from "./cms-button";
import { CmsButtonRow, CmsMarkdown } from "./cms-primitives";

type BlockRendererProps = {
  blocks: CmsBlock[];
  pageWidth?: keyof typeof PAGE_WIDTH_CLASSES;
  pageTitle?: string;
};

function galleryImageSrc(image: string | { image?: string }): string | undefined {
  if (typeof image === "string") return image || undefined;
  return image.image || undefined;
}

function widthClass(pageWidth: BlockRendererProps["pageWidth"]) {
  return PAGE_WIDTH_CLASSES[pageWidth ?? "default"];
}

export default function CmsBlockRenderer({
  blocks,
  pageWidth = "default",
  pageTitle,
}: BlockRendererProps) {
  const container = widthClass(pageWidth);

  return (
    <div className={`mx-auto w-full px-6 sm:px-12 ${container}`}>
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        const sectionClass = sectionClassName(blockSectionStyle(block as Record<string, unknown>));

        switch (block.type) {
          case "hero":
            return (
              <section
                key={key}
                className={`flex flex-col items-start justify-center w-full ${sectionClass} ${HERO_MIN_HEIGHT_CLASSES[block.minHeight ?? "tall"]}`}
              >
                {block.layout === "split-right" || block.layout === "split-left" ? (
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center w-full ${
                      block.layout === "split-left" ? "lg:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <div>
                      {block.eyebrow ? (
                        <p className={`text-sm uppercase tracking-widest text-muted mb-6 ${typographyClassName(block.bodyTypography, { size: "sm", weight: "light" })}`}>
                          {block.eyebrow}
                        </p>
                      ) : null}
                      <h1 className={`${typographyClassName(block.headingTypography, { font: "deco", size: "6xl", weight: "medium" })} text-foreground leading-none mb-6`}>
                        {block.heading}
                      </h1>
                      {block.body ? (
                        <p className={`text-muted leading-relaxed max-w-2xl mb-8 ${typographyClassName(block.bodyTypography, { size: "lg" })}`}>
                          {block.body}
                        </p>
                      ) : null}
                      <CmsButtonRow buttons={block.buttons} />
                    </div>
                    {block.image ? (
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-surface w-full">
                        <CmsImage src={block.image} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" />
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className={`w-full ${block.layout === "centered" ? "text-center max-w-3xl mx-auto" : "max-w-3xl"}`}>
                    {block.eyebrow ? (
                      <p className={`text-sm uppercase tracking-widest text-muted mb-6 ${typographyClassName(block.bodyTypography, { size: "sm", weight: "light" })}`}>
                        {block.eyebrow}
                      </p>
                    ) : null}
                    <h1 className={`${typographyClassName(block.headingTypography, { font: "deco", size: "6xl", weight: "medium" })} text-foreground leading-none mb-6 ${block.heading.length < 20 ? "whitespace-nowrap" : ""}`}>
                      {block.heading}
                    </h1>
                    {block.body ? (
                      <p className={`text-muted leading-relaxed mb-8 ${typographyClassName(block.bodyTypography, { size: "lg" })} ${block.layout === "centered" ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
                        {block.body}
                      </p>
                    ) : null}
                    <CmsButtonRow buttons={block.buttons} className={block.layout === "centered" ? "justify-center" : ""} />
                    {block.image ? (
                      <div className="relative mt-10 aspect-video rounded-2xl overflow-hidden border border-border bg-surface w-full">
                        <CmsImage src={block.image} alt="" fill sizes="100vw" priority />
                      </div>
                    ) : null}
                  </div>
                )}
              </section>
            );

          case "heading":
            return (
              <section key={key} className={sectionClass}>
                <h2 className={`${typographyClassName(block.typography, { font: "deco", size: "3xl", weight: "medium" })} text-foreground ${block.align === "center" ? "text-center" : ""}`}>
                  {block.text}
                </h2>
              </section>
            );

          case "text":
            return (
              <section key={key} className={`${sectionClass} ${block.align === "center" ? "text-center" : ""}`}>
                <div className={block.align === "center" ? "mx-auto max-w-2xl" : ""}>
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p className={`mb-4 last:mb-0 text-muted leading-relaxed ${typographyClassName(block.typography)}`}>
                          {children}
                        </p>
                      ),
                      a: ({ href, children }) => (
                        <a href={href} className="text-foreground underline underline-offset-4 hover:opacity-80">
                          {children}
                        </a>
                      ),
                      strong: ({ children }) => <strong className="text-foreground font-bold">{children}</strong>,
                    }}
                  >
                    {block.body}
                  </ReactMarkdown>
                </div>
              </section>
            );

          case "image": {
            if (!block.src) return null;
            const layout = block.layout ?? "inset";
            const rounded = block.rounded !== false;
            const imageShell =
              layout === "small"
                ? "relative mx-auto max-w-xl aspect-[4/3]"
                : "relative w-full aspect-video";

            return (
              <figure key={key} className={sectionClass}>
                <div className={`${imageShell} overflow-hidden border border-border bg-surface ${rounded ? "rounded-2xl" : ""}`}>
                  <CmsImage src={block.src} alt={block.alt ?? ""} fill sizes="100vw" />
                </div>
                {block.caption ? (
                  <figcaption className={`mt-3 text-sm text-muted ${sansLight}`}>{block.caption}</figcaption>
                ) : null}
              </figure>
            );
          }

          case "gallery": {
            const images = block.images.map(galleryImageSrc).filter((src): src is string => Boolean(src));
            if (!images.length) return null;
            const rounded = block.rounded !== false;

            return (
              <section key={key} className={sectionClass}>
                <div className={`grid gap-4 ${GALLERY_COLUMN_CLASSES[block.columns ?? "2"]}`}>
                  {images.map((src) => (
                    <div key={src} className={`relative aspect-[4/3] overflow-hidden border border-border bg-surface ${rounded ? "rounded-xl" : ""}`}>
                      <CmsImage src={src} alt="" fill sizes="(max-width: 640px) 100vw, 50vw" />
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          case "twoColumn":
            return (
              <section key={key} className={sectionClass}>
                <div className={`grid gap-10 ${TWO_COLUMN_RATIO_CLASSES[block.ratio ?? "equal"]}`}>
                  <CmsMarkdown content={block.left} typography={block.leftTypography} />
                  <CmsMarkdown content={block.right} typography={block.rightTypography} />
                </div>
              </section>
            );

          case "cta":
            return (
              <section key={key} className={sectionClass}>
                <div
                  className={
                    block.style === "plain"
                      ? "flex flex-col gap-6"
                      : "rounded-2xl bg-surface border border-border p-8 sm:p-12 flex flex-col sm:flex-row sm:items-center gap-8"
                  }
                >
                  <div className="flex-1">
                    {block.heading ? (
                      <h2 className={`${typographyClassName(block.headingTypography, { font: "deco", size: "3xl", weight: "medium" })} text-foreground mb-4`}>
                        {block.heading}
                      </h2>
                    ) : null}
                    {block.body ? (
                      <p className={`text-lg text-muted leading-relaxed max-w-lg ${typographyClassName(block.bodyTypography)}`}>
                        {block.body}
                      </p>
                    ) : null}
                  </div>
                  <CmsButtonRow buttons={block.buttons} className="shrink-0" />
                </div>
              </section>
            );

          case "embed":
            if (!block.src) return null;
            return (
              <section key={key} className={`${sectionClass} max-w-4xl`}>
                {block.title ? <p className={`text-sm text-muted mb-3 ${sansLight}`}>{block.title}</p> : null}
                <div
                  data-header-tone="dark"
                  className={`relative w-full rounded-2xl overflow-hidden border border-border bg-black ${
                    block.aspect === "tall" ? "min-h-[520px] sm:min-h-[600px]" : "aspect-video"
                  }`}
                >
                  <iframe
                    src={block.src}
                    title={block.title ?? pageTitle ?? "Embedded content"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>
              </section>
            );

          case "spacer":
            return <div key={key} className={SPACER_CLASSES[block.size ?? "md"]} aria-hidden />;

          case "backLink":
            return (
              <div key={key} className={sectionClass}>
                <CmsBackLink label={block.label} href={block.href} />
              </div>
            );

          case "featuredProjects": {
            const featured = getFeaturedProjects();
            const columns = block.columns ?? "2";
            return (
              <section key={key} className={sectionClass}>
                <div className="flex items-end justify-between mb-8">
                  {block.heading ? (
                    <h2 className={`${typographyClassName(block.headingTypography, { font: "deco", size: "3xl", weight: "medium" })} text-foreground`}>
                      {block.heading}
                    </h2>
                  ) : (
                    <span />
                  )}
                  {block.linkHref && block.linkLabel ? (
                    <CmsButton
                      button={{
                        label: block.linkLabel,
                        href: block.linkHref,
                        variant: "ghost",
                        size: "sm",
                        icon: "chevron-right",
                        iconPosition: "right",
                      }}
                    />
                  ) : null}
                </div>
                <div className={`grid gap-6 ${columns === "1" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
                  {featured.map((project) => (
                    <ProjectCard key={project.slug} project={project} />
                  ))}
                </div>
              </section>
            );
          }

          case "projectGrid": {
            const projects = getAllProjects();
            return (
              <section key={key} className={sectionClass}>
                {block.heading ? (
                  <h1 className={`${typographyClassName(block.headingTypography, { font: "deco", size: "6xl", weight: "medium" })} text-foreground mb-4`}>
                    {block.heading}
                  </h1>
                ) : null}
                {block.intro ? (
                  <p className={`text-muted mb-16 max-w-xl ${typographyClassName(block.introTypography, { size: "lg", weight: "light" })}`}>
                    {block.intro}
                  </p>
                ) : null}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <ProjectCard key={project.slug} project={project} />
                  ))}
                </div>
              </section>
            );
          }

          case "timeline":
            return (
              <section key={key} className={sectionClass}>
                {block.heading ? (
                  <h2 className={`${typographyClassName(block.headingTypography, { font: "deco", size: "2xl", weight: "medium" })} text-foreground mb-8`}>
                    {block.heading}
                  </h2>
                ) : null}
                <div className="flex flex-col gap-8">
                  {block.items.map((item) => (
                    <div
                      key={`${item.title}-${item.period}`}
                      className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-2 sm:gap-6 pb-8 border-b border-border last:border-0 last:pb-0"
                    >
                      <div>
                        {item.period ? <p className={`text-sm text-muted ${sansLight}`}>{item.period}</p> : null}
                        {item.subtitle ? <p className={`text-sm text-muted ${sansLight}`}>{item.subtitle}</p> : null}
                      </div>
                      <div>
                        <p className={`text-base ${sansBold} text-foreground leading-relaxed mb-1`}>{item.title}</p>
                        {item.description ? (
                          <p className={`text-sm text-muted leading-relaxed ${sansLight}`}>{item.description}</p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );

          case "tagGroups":
            return (
              <section key={key} className={sectionClass}>
                {block.heading ? (
                  <h2 className={`${typographyClassName(block.headingTypography, { font: "deco", size: "2xl", weight: "medium" })} text-foreground mb-8`}>
                    {block.heading}
                  </h2>
                ) : null}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {block.groups.map((group) => (
                    <div key={group.category}>
                      <p className={`text-xs uppercase tracking-widest text-muted mb-3 ${sansLight}`}>{group.category}</p>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((item) => (
                          <span key={item} className={`px-4 py-1.5 rounded-full bg-surface border border-border text-sm text-muted ${sansMedium}`}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );

          case "bulletList":
            return (
              <section key={key} className={sectionClass}>
                {block.heading ? (
                  <h2 className={`${typographyClassName(block.headingTypography, { font: "deco", size: "2xl", weight: "medium" })} text-foreground mb-6`}>
                    {block.heading}
                  </h2>
                ) : null}
                <ul className={`space-y-3 leading-relaxed list-disc pl-5 ${typographyClassName(block.typography, { weight: "light" })} text-muted`}>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            );

          case "linkList":
            return (
              <section key={key} className={`${sectionClass} pt-12 border-t border-border`}>
                {block.heading ? (
                  <h2 className={`${typographyClassName(block.headingTypography, { font: "deco", size: "xl", weight: "medium" })} text-foreground mb-6`}>
                    {block.heading}
                  </h2>
                ) : null}
                <div className="flex flex-col gap-4">
                  {block.links.map((link) => (
                    <div key={link.label} className="flex items-center justify-between gap-8">
                      <span className={`text-sm text-muted uppercase tracking-widest shrink-0 ${sansLight}`}>{link.label}</span>
                      <a
                        href={link.href}
                        target={link.external || link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.external || link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className={`text-sm text-foreground hover:text-muted transition-colors text-right ${sansMedium}`}
                      >
                        {link.display ?? link.href}
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            );

          case "contactForm":
            return (
              <section key={key} className={sectionClass}>
                <CmsContactForm submitLabel={block.submitLabel} successMessage={block.successMessage} />
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
