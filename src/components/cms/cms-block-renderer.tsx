import ReactMarkdown from "react-markdown";
import ProjectCard from "@/components/project-card";
import type { CmsBlock } from "@/lib/cms/types";
import { getAllProjects, getFeaturedProjects, resolveProjectSelection } from "@/lib/projects";
import {
  GALLERY_COLUMN_CLASSES,
  HERO_MIN_HEIGHT_CLASSES,
  PAGE_WIDTH_CLASSES,
  SPACER_CLASSES,
  TWO_COLUMN_RATIO_CLASSES,
  typographyClassName,
} from "@/lib/cms/typography";
import { galleryBleedClass, galleryGapClass, pickImageDisplay } from "@/lib/cms/image-display";
import { blockSectionStyle, sectionClassName } from "@/lib/cms/section-styles";
import { sansBold, sansLight, sansMedium } from "@/lib/typography";
import CmsHeading from "./cms-heading";
import CmsImageFrame from "./cms-image-frame";
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
  return PAGE_WIDTH_CLASSES[pageWidth ?? "full"];
}

export default function CmsBlockRenderer({
  blocks,
  pageWidth = "full",
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
                      <CmsHeading
                        as="h1"
                        typography={block.headingTypography}
                        defaults={{ font: "deco", size: "7xl", weight: "medium" }}
                        className="mb-6"
                      >
                        {block.heading}
                      </CmsHeading>
                      {block.body ? (
                        <p className={`text-muted leading-relaxed max-w-2xl mb-8 ${typographyClassName(block.bodyTypography, { size: "lg" })}`}>
                          {block.body}
                        </p>
                      ) : null}
                      <CmsButtonRow buttons={block.buttons} />
                    </div>
                    {block.image ? (
                      <CmsImageFrame
                        src={block.image}
                        alt=""
                        display={{ layout: "full", aspect: "standard", radius: "lg", ...block.imageDisplay }}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    ) : null}
                  </div>
                ) : (
                  <div className={`w-full ${block.layout === "centered" ? "text-center" : ""}`}>
                    {block.eyebrow ? (
                      <p className={`text-sm uppercase tracking-widest text-muted mb-6 ${typographyClassName(block.bodyTypography, { size: "sm", weight: "light" })} ${block.layout === "centered" ? "mx-auto max-w-3xl" : "max-w-3xl"}`}>
                        {block.eyebrow}
                      </p>
                    ) : null}
                    <CmsHeading
                      as="h1"
                      typography={block.headingTypography}
                      defaults={{ font: "deco", size: "7xl", weight: "medium" }}
                      className="mb-6"
                    >
                      {block.heading}
                    </CmsHeading>
                    {block.body ? (
                      <p className={`text-muted leading-relaxed mb-8 ${typographyClassName(block.bodyTypography, { size: "lg" })} ${block.layout === "centered" ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
                        {block.body}
                      </p>
                    ) : null}
                    <CmsButtonRow buttons={block.buttons} className={block.layout === "centered" ? "justify-center" : ""} />
                    {block.image ? (
                      <CmsImageFrame
                        src={block.image}
                        alt=""
                        display={{ layout: "full", aspect: "video", radius: "lg", ...block.imageDisplay }}
                        sizes="100vw"
                        priority
                        className="mt-10"
                      />
                    ) : null}
                  </div>
                )}
              </section>
            );

          case "heading":
            return (
              <section key={key} className={sectionClass}>
                <CmsHeading
                  typography={block.typography}
                  defaults={{ font: "deco", size: "3xl", weight: "medium" }}
                  className={block.align === "center" ? "text-center" : ""}
                >
                  {block.text}
                </CmsHeading>
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
            const captionAlign = block.captionAlign ?? "left";

            return (
              <figure key={key} className={sectionClass}>
                <CmsImageFrame src={block.src} alt={block.alt ?? ""} display={pickImageDisplay(block)} sizes="100vw" />
                {block.caption ? (
                  <figcaption
                    className={`mt-3 text-sm text-muted ${sansLight} ${captionAlign === "center" ? "text-center" : ""}`}
                  >
                    {block.caption}
                  </figcaption>
                ) : null}
              </figure>
            );
          }

          case "gallery": {
            const images = block.images.map(galleryImageSrc).filter((src): src is string => Boolean(src));
            if (!images.length) return null;

            const arrangement = block.arrangement ?? "grid";
            const gapClass = galleryGapClass(arrangement, block.gap);
            const bleedClass = galleryBleedClass(block.bleed);
            const seamless =
              arrangement === "vertical" || arrangement === "horizontal" || block.gap === "none";

            const imageDisplay = pickImageDisplay(block, {
              layout: block.bleed ? "bleed" : "full",
              aspect: block.aspect ?? "standard",
              fit: block.fit ?? "cover",
              radius: seamless || block.bleed ? "none" : block.radius,
              border: seamless || block.bleed ? false : block.border,
            });

            const gridClass =
              arrangement === "vertical"
                ? `flex flex-col ${gapClass}`
                : arrangement === "horizontal"
                  ? `grid ${gapClass}`
                  : `grid ${gapClass} ${GALLERY_COLUMN_CLASSES[block.columns ?? "2"]}`;

            const gridStyle =
              arrangement === "horizontal"
                ? { gridTemplateColumns: `repeat(${images.length}, minmax(0, 1fr))` }
                : undefined;

            return (
              <section key={key} className={`${sectionClass} ${bleedClass}`.trim()}>
                <div className={gridClass} style={gridStyle}>
                  {images.map((src, imageIndex) => (
                    <CmsImageFrame
                      key={`${src}-${imageIndex}`}
                      src={src}
                      alt=""
                      display={{ ...imageDisplay, layout: "full" }}
                      sizes={
                        arrangement === "horizontal"
                          ? `(max-width: 640px) 100vw, ${Math.round(100 / images.length)}vw`
                          : "(max-width: 640px) 100vw, 50vw"
                      }
                    />
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
                      : "rounded-surface bg-surface border border-border p-8 sm:p-12 flex flex-col sm:flex-row sm:items-center gap-8"
                  }
                >
                  <div className="flex-1">
                    {block.heading ? (
                      <CmsHeading
                        typography={block.headingTypography}
                        defaults={{ font: "deco", size: "3xl", weight: "medium" }}
                        className="mb-4"
                      >
                        {block.heading}
                      </CmsHeading>
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
                  className={`relative w-full rounded-surface overflow-hidden border border-border bg-black ${
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
            const featured = resolveProjectSelection(
              block.projectSlugs,
              getFeaturedProjects,
              block.limit,
            );
            const columns = block.columns ?? "2";
            return (
              <section key={key} className={sectionClass}>
                <div className="flex items-end justify-between mb-8">
                  {block.heading ? (
                    <CmsHeading
                      typography={block.headingTypography}
                      defaults={{ font: "deco", size: "3xl", weight: "medium" }}
                      containerClassName="flex-1"
                    >
                      {block.heading}
                    </CmsHeading>
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
            const projects = resolveProjectSelection(
              block.mode === "selected" ? block.projectSlugs : undefined,
              getAllProjects,
            );
            return (
              <section key={key} className={sectionClass}>
                {block.heading ? (
                  <CmsHeading
                    as="h1"
                    typography={block.headingTypography}
                    defaults={{ font: "deco", size: "7xl", weight: "medium" }}
                    className="mb-4"
                  >
                    {block.heading}
                  </CmsHeading>
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
                  <CmsHeading
                    typography={block.headingTypography}
                    defaults={{ font: "deco", size: "2xl", weight: "medium" }}
                    className="mb-8"
                  >
                    {block.heading}
                  </CmsHeading>
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
                  <CmsHeading
                    typography={block.headingTypography}
                    defaults={{ font: "deco", size: "2xl", weight: "medium" }}
                    className="mb-8"
                  >
                    {block.heading}
                  </CmsHeading>
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
                  <CmsHeading
                    typography={block.headingTypography}
                    defaults={{ font: "deco", size: "2xl", weight: "medium" }}
                    className="mb-6"
                  >
                    {block.heading}
                  </CmsHeading>
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
                  <CmsHeading
                    typography={block.headingTypography}
                    defaults={{ font: "deco", size: "xl", weight: "medium" }}
                    className="mb-6"
                  >
                    {block.heading}
                  </CmsHeading>
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

          case "video":
            if (!block.src) return null;
            return (
              <section key={key} className={sectionClass}>
                <div className="relative w-full aspect-video overflow-hidden rounded-surface border border-border bg-black">
                  <video
                    src={block.src}
                    poster={block.poster}
                    controls
                    playsInline
                    autoPlay={block.autoplay}
                    loop={block.loop}
                    muted={block.muted ?? block.autoplay}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                {block.caption ? (
                  <p className={`mt-3 text-sm text-muted ${sansLight}`}>{block.caption}</p>
                ) : null}
              </section>
            );

          case "quote":
            return (
              <section key={key} className={sectionClass}>
                <blockquote className="border-l-2 border-border pl-6">
                  <p className={`text-xl sm:text-2xl text-foreground leading-relaxed ${typographyClassName(block.typography, { size: "2xl", weight: "medium" })}`}>
                    {block.text}
                  </p>
                  {block.cite ? (
                    <footer className={`mt-4 text-sm text-muted ${sansLight}`}>— {block.cite}</footer>
                  ) : null}
                </blockquote>
              </section>
            );

          case "faq":
            return (
              <section key={key} className={sectionClass}>
                {block.heading ? (
                  <CmsHeading
                    typography={block.headingTypography}
                    defaults={{ font: "deco", size: "2xl", weight: "medium" }}
                    className="mb-8"
                  >
                    {block.heading}
                  </CmsHeading>
                ) : null}
                <div className="flex flex-col gap-4">
                  {block.items.map((item) => (
                    <details key={item.question} className="rounded-surface border border-border bg-surface p-5">
                      <summary className={`cursor-pointer text-foreground ${sansMedium}`}>{item.question}</summary>
                      <p className={`mt-3 text-muted leading-relaxed ${sansLight}`}>{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            );

          case "stats": {
            const columns = block.columns ?? "3";
            const colsClass =
              columns === "2" ? "grid-cols-2" : columns === "4" ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-1 sm:grid-cols-3";
            return (
              <section key={key} className={sectionClass}>
                {block.heading ? (
                  <CmsHeading
                    typography={block.headingTypography}
                    defaults={{ font: "deco", size: "2xl", weight: "medium" }}
                    className="mb-8"
                  >
                    {block.heading}
                  </CmsHeading>
                ) : null}
                <div className={`grid gap-6 ${colsClass}`}>
                  {block.items.map((item) => (
                    <div key={`${item.value}-${item.label}`} className="rounded-surface border border-border bg-surface p-6 text-center">
                      <p className={`text-3xl sm:text-4xl text-foreground mb-2 ${sansMedium}`}>{item.value}</p>
                      <p className={`text-sm text-muted ${sansLight}`}>{item.label}</p>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          case "divider":
            return block.style === "space" ? (
              <div key={key} className="h-8" aria-hidden />
            ) : (
              <hr key={key} className={`${sectionClass} border-border`} />
            );

          case "logos": {
            const columns = block.columns ?? "4";
            const colsClass =
              columns === "3"
                ? "grid-cols-2 sm:grid-cols-3"
                : columns === "5"
                  ? "grid-cols-2 sm:grid-cols-5"
                  : columns === "6"
                    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
                    : "grid-cols-2 sm:grid-cols-4";
            return (
              <section key={key} className={sectionClass}>
                {block.heading ? (
                  <CmsHeading
                    typography={block.headingTypography}
                    defaults={{ font: "deco", size: "2xl", weight: "medium" }}
                    className="mb-8"
                  >
                    {block.heading}
                  </CmsHeading>
                ) : null}
                <div className={`grid gap-6 items-center ${colsClass}`}>
                  {block.items.map((item) => {
                    const image = (
                      <CmsImageFrame
                        src={item.image}
                        alt={item.name}
                        display={{ layout: "full", aspect: "auto", fit: "contain", border: false, radius: "none" }}
                        sizes="200px"
                      />
                    );
                    return item.href ? (
                      <a key={item.name} href={item.href} className="block opacity-80 hover:opacity-100 transition-opacity">
                        {image}
                      </a>
                    ) : (
                      <div key={item.name}>{image}</div>
                    );
                  })}
                </div>
              </section>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
