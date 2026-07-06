import ReactMarkdown from "react-markdown";
import type { CmsBlock } from "@/lib/cms/types";
import {
  GALLERY_COLUMN_CLASSES,
  PAGE_WIDTH_CLASSES,
  SPACER_CLASSES,
  TWO_COLUMN_RATIO_CLASSES,
  typographyClassName,
} from "@/lib/cms/typography";
import { sansLight } from "@/lib/typography";
import CmsImage from "./cms-image";
import { CmsButtonRow, CmsMarkdown } from "./cms-primitives";

function galleryImageSrc(image: string | { image?: string }): string | undefined {
  if (typeof image === "string") return image || undefined;
  return image.image || undefined;
}

type BlockRendererProps = {
  blocks: CmsBlock[];
  pageWidth?: keyof typeof PAGE_WIDTH_CLASSES;
};

function widthClass(pageWidth: BlockRendererProps["pageWidth"]) {
  return PAGE_WIDTH_CLASSES[pageWidth ?? "default"];
}

export default function CmsBlockRenderer({ blocks, pageWidth = "default" }: BlockRendererProps) {
  const container = widthClass(pageWidth);

  return (
    <div className={`mx-auto w-full px-6 sm:px-12 ${container}`}>
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        switch (block.type) {
          case "hero":
            return (
              <section key={key} className="pt-10 sm:pt-14 pb-16">
                {block.layout === "split-right" || block.layout === "split-left" ? (
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${
                      block.layout === "split-left" ? "lg:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <div>
                      {block.eyebrow ? (
                        <p
                          className={`text-sm uppercase tracking-widest text-muted mb-6 ${typographyClassName(
                            block.bodyTypography,
                            { size: "sm", weight: "light" },
                          )}`}
                        >
                          {block.eyebrow}
                        </p>
                      ) : null}
                      <h1
                        className={`${typographyClassName(block.headingTypography, {
                          font: "deco",
                          size: "6xl",
                          weight: "medium",
                        })} text-foreground leading-none mb-6`}
                      >
                        {block.heading}
                      </h1>
                      {block.body ? (
                        <p
                          className={`text-muted leading-relaxed max-w-2xl mb-8 ${typographyClassName(
                            block.bodyTypography,
                            { size: "lg" },
                          )}`}
                        >
                          {block.body}
                        </p>
                      ) : null}
                      <CmsButtonRow buttons={block.buttons} />
                    </div>
                    {block.image ? (
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-surface">
                        <CmsImage src={block.image} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" />
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className={block.layout === "centered" ? "text-center max-w-3xl mx-auto" : "max-w-3xl"}>
                    {block.eyebrow ? (
                      <p
                        className={`text-sm uppercase tracking-widest text-muted mb-6 ${typographyClassName(
                          block.bodyTypography,
                          { size: "sm", weight: "light" },
                        )}`}
                      >
                        {block.eyebrow}
                      </p>
                    ) : null}
                    <h1
                      className={`${typographyClassName(block.headingTypography, {
                        font: "deco",
                        size: "6xl",
                        weight: "medium",
                      })} text-foreground leading-none mb-6`}
                    >
                      {block.heading}
                    </h1>
                    {block.body ? (
                      <p
                        className={`text-muted leading-relaxed mb-8 ${typographyClassName(block.bodyTypography, {
                          size: "lg",
                        })} ${block.layout === "centered" ? "mx-auto max-w-2xl" : "max-w-2xl"}`}
                      >
                        {block.body}
                      </p>
                    ) : null}
                    <CmsButtonRow buttons={block.buttons} className={block.layout === "centered" ? "justify-center" : ""} />
                    {block.image ? (
                      <div className="relative mt-10 aspect-video rounded-2xl overflow-hidden border border-border bg-surface">
                        <CmsImage src={block.image} alt="" fill sizes="100vw" priority />
                      </div>
                    ) : null}
                  </div>
                )}
              </section>
            );

          case "heading":
            return (
              <section key={key} className="pb-8">
                <h2
                  className={`${typographyClassName(block.typography, {
                    font: "deco",
                    size: "3xl",
                    weight: "medium",
                  })} text-foreground ${block.align === "center" ? "text-center" : ""}`}
                >
                  {block.text}
                </h2>
              </section>
            );

          case "text":
            return (
              <section key={key} className={`pb-10 ${block.align === "center" ? "text-center" : ""}`}>
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
            const imageShell =
              layout === "small"
                ? "relative mx-auto max-w-xl aspect-[4/3]"
                : layout === "full"
                  ? "relative w-full aspect-video"
                  : "relative w-full aspect-video";

            return (
              <figure key={key} className="pb-10">
                <div
                  className={`${imageShell} overflow-hidden border border-border bg-surface ${
                    layout === "inset" || layout === "small" ? "rounded-2xl" : ""
                  }`}
                >
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

            return (
              <section key={key} className="pb-12">
                <div className={`grid gap-4 ${GALLERY_COLUMN_CLASSES[block.columns ?? "2"]}`}>
                  {images.map((src) => (
                    <div
                      key={src}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border bg-surface"
                    >
                      <CmsImage src={src} alt="" fill sizes="(max-width: 640px) 100vw, 50vw" />
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          case "twoColumn":
            return (
              <section key={key} className="pb-12">
                <div className={`grid gap-10 ${TWO_COLUMN_RATIO_CLASSES[block.ratio ?? "equal"]}`}>
                  <CmsMarkdown content={block.left} typography={block.leftTypography} />
                  <CmsMarkdown content={block.right} typography={block.rightTypography} />
                </div>
              </section>
            );

          case "cta":
            return (
              <section key={key} className="pb-12">
                <div
                  className={
                    block.style === "plain"
                      ? "flex flex-col gap-6"
                      : "rounded-2xl bg-surface border border-border p-8 sm:p-12 flex flex-col sm:flex-row sm:items-center gap-8"
                  }
                >
                  <div className="flex-1">
                    {block.heading ? (
                      <h2
                        className={`${typographyClassName(block.headingTypography, {
                          font: "deco",
                          size: "3xl",
                          weight: "medium",
                        })} text-foreground mb-4`}
                      >
                        {block.heading}
                      </h2>
                    ) : null}
                    {block.body ? <p className="text-lg text-muted leading-relaxed max-w-lg">{block.body}</p> : null}
                  </div>
                  <CmsButtonRow buttons={block.buttons} className="shrink-0" />
                </div>
              </section>
            );

          case "embed":
            if (!block.src) return null;
            return (
              <section key={key} className="pb-12 max-w-4xl">
                {block.title ? <p className={`text-sm text-muted mb-3 ${sansLight}`}>{block.title}</p> : null}
                <div
                  data-header-tone="dark"
                  className={`relative w-full rounded-2xl overflow-hidden border border-border bg-black ${
                    block.aspect === "tall" ? "min-h-[520px] sm:min-h-[600px]" : "aspect-video"
                  }`}
                >
                  <iframe
                    src={block.src}
                    title={block.title ?? "Embedded content"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>
              </section>
            );

          case "spacer":
            return <div key={key} className={SPACER_CLASSES[block.size ?? "md"]} aria-hidden />;

          default:
            return null;
        }
      })}
    </div>
  );
}
