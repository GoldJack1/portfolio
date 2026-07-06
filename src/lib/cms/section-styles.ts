import type { CmsSectionStyle } from "./types";

export const SECTION_PADDING_TOP: Record<NonNullable<CmsSectionStyle["paddingTop"]>, string> = {
  none: "pt-0",
  sm: "pt-6",
  md: "pt-10 sm:pt-14",
  lg: "pt-16 sm:pt-20",
};

export const SECTION_PADDING_BOTTOM: Record<NonNullable<CmsSectionStyle["paddingBottom"]>, string> = {
  none: "pb-0",
  sm: "pb-8",
  md: "pb-12",
  lg: "pb-16",
};

export function sectionClassName(style?: CmsSectionStyle, defaults?: CmsSectionStyle): string {
  const merged = { paddingTop: "md", paddingBottom: "md", background: "none", ...defaults, ...style } as Required<
    Pick<CmsSectionStyle, "paddingTop" | "paddingBottom" | "background">
  > &
    CmsSectionStyle;
  const classes = [
    SECTION_PADDING_TOP[merged.paddingTop ?? "md"],
    SECTION_PADDING_BOTTOM[merged.paddingBottom ?? "md"],
  ];
  if (merged.background === "surface") {
    classes.push("rounded-surface bg-surface border border-border p-8 sm:p-12");
  }
  if (merged.textTone === "muted") {
    classes.push("text-muted");
  }
  return classes.join(" ");
}

/** Supports flat fields (legacy JSON) and nested sectionStyle from Decap CMS. */
export function blockSectionStyle(block: Record<string, unknown>): CmsSectionStyle {
  const nested = (block.sectionStyle ?? {}) as CmsSectionStyle;
  return {
    paddingTop: (block.paddingTop as CmsSectionStyle["paddingTop"]) ?? nested.paddingTop,
    paddingBottom: (block.paddingBottom as CmsSectionStyle["paddingBottom"]) ?? nested.paddingBottom,
    background: (block.background as CmsSectionStyle["background"]) ?? nested.background,
    textTone: (block.textTone as CmsSectionStyle["textTone"]) ?? nested.textTone,
  };
}
