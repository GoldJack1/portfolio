import type { CmsTypography } from "./types";

const SIZE_CLASSES: Record<NonNullable<CmsTypography["size"]>, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
  "7xl": "text-7xl",
};

const FONT_CLASSES: Record<NonNullable<CmsTypography["font"]>, string> = {
  sans: "font-sans",
  deco: "font-deco",
};

const WEIGHT_CLASSES: Record<NonNullable<CmsTypography["weight"]>, string> = {
  light: "font-light",
  medium: "font-medium",
  bold: "font-bold",
};

const DEFAULT_TYPOGRAPHY: Required<CmsTypography> = {
  font: "sans",
  weight: "medium",
  size: "base",
};

export function typographyClassName(
  typography?: CmsTypography,
  defaults: Partial<CmsTypography> = {},
): string {
  const merged = { ...DEFAULT_TYPOGRAPHY, ...defaults, ...typography };
  return [
    FONT_CLASSES[merged.font],
    WEIGHT_CLASSES[merged.weight],
    SIZE_CLASSES[merged.size],
  ].join(" ");
}

export const PAGE_WIDTH_CLASSES = {
  narrow: "max-w-3xl",
  default: "max-w-5xl",
  wide: "max-w-6xl",
  full: "max-w-none",
} as const;

export const SPACER_CLASSES = {
  sm: "h-8",
  md: "h-16",
  lg: "h-24",
  xl: "h-32",
} as const;

export const GALLERY_COLUMN_CLASSES = {
  "1": "grid-cols-1",
  "2": "grid-cols-1 sm:grid-cols-2",
  "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
} as const;

export const TWO_COLUMN_RATIO_CLASSES = {
  equal: "sm:grid-cols-2",
  "narrow-wide": "sm:grid-cols-[2fr_3fr]",
  "wide-narrow": "sm:grid-cols-[3fr_2fr]",
} as const;
