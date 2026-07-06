"use client";

import { useLayoutEffect, useRef, type ElementType, type ReactNode } from "react";
import type { CmsTypography } from "@/lib/cms/types";
import {
  getHeadingSizeBounds,
  HEADING_FILL_MAX_SCALE,
  HEADING_FILL_WIDTH_RATIO,
  headingTypographyClassName,
  resolveHeadingSize,
} from "@/lib/cms/typography";

type CmsHeadingProps = {
  as?: "h1" | "h2" | "h3";
  typography?: CmsTypography;
  defaults?: Partial<CmsTypography>;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
};

function remToPx(rem: number) {
  const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return rem * (Number.isFinite(rootSize) ? rootSize : 16);
}

function fitHeadingText(
  container: HTMLElement,
  el: HTMLElement,
  minPx: number,
  maxPx: number,
  fillWidth: boolean,
) {
  const width = container.clientWidth;
  if (width <= 0) return;

  // Block headings report scrollWidth as the container width, not the text width.
  el.style.display = "inline-block";
  el.style.maxWidth = "100%";
  el.style.verticalAlign = "top";
  el.style.whiteSpace = "nowrap";
  el.style.wordBreak = "normal";

  const targetWidth = width * 0.98;
  const fillMaxPx = fillWidth
    ? Math.min(
        Math.max(maxPx, targetWidth * HEADING_FILL_WIDTH_RATIO),
        maxPx * HEADING_FILL_MAX_SCALE,
      )
    : maxPx;

  let lo = minPx;
  let hi = fillMaxPx;
  let best = minPx;

  while (hi - lo > 0.5) {
    const mid = (lo + hi) / 2;
    el.style.fontSize = `${mid}px`;
    if (el.scrollWidth <= targetWidth) {
      best = mid;
      lo = mid;
    } else {
      hi = mid;
    }
  }

  el.style.fontSize = `${best}px`;

  // If it still won't fit on one line, wrap at the design size — not the minimum.
  if (el.scrollWidth > targetWidth) {
    el.style.whiteSpace = "normal";
    el.style.fontSize = `${maxPx}px`;
  }
}

function shouldFillHeadingWidth(
  as: CmsHeadingProps["as"],
  size: NonNullable<CmsTypography["size"]>,
) {
  if (as === "h1") return true;
  return size === "5xl" || size === "6xl" || size === "7xl";
}

export default function CmsHeading({
  as: Tag = "h2",
  typography,
  defaults,
  className = "",
  containerClassName = "",
  children,
}: CmsHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLElement>(null);
  const size = resolveHeadingSize(typography, defaults);
  const { minSizeRem, maxSizeRem } = getHeadingSizeBounds(size);
  const typographyClass = headingTypographyClassName(typography, defaults);
  const fillWidth = shouldFillHeadingWidth(Tag, size);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const el = textRef.current;
    if (!container || !el) return;

    const fit = () => {
      fitHeadingText(
        container,
        el,
        remToPx(minSizeRem),
        remToPx(maxSizeRem),
        fillWidth,
      );
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(container);
    document.fonts?.ready.then(fit).catch(() => undefined);

    return () => observer.disconnect();
  }, [children, minSizeRem, maxSizeRem, fillWidth]);

  const HeadingTag = Tag as ElementType;

  return (
    <div ref={containerRef} className={`w-full min-w-0 ${containerClassName}`.trim()}>
      <HeadingTag
        ref={textRef}
        className={`leading-none text-foreground ${typographyClass} ${className}`.trim()}
        style={{ fontSize: `${maxSizeRem}rem` }}
      >
        {children}
      </HeadingTag>
    </div>
  );
}
