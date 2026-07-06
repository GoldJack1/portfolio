import type { CmsStyle, CmsTypography, CmsWeight } from "./types";

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

const WEIGHT_CLASSES: Record<CmsWeight, string> = {
  thin: "font-thin",
  extralight: "font-extralight",
  light: "font-light",
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  black: "font-black",
};

/** Map legacy CMS weight values saved before the full weight set was added. */
const LEGACY_WEIGHT_MAP: Record<string, CmsWeight> = {
  light: "light",
  medium: "medium",
  bold: "bold",
};

const STYLE_CLASSES: Record<CmsStyle, string> = {
  normal: "",
  italic: "italic",
};

const DEFAULT_TYPOGRAPHY: Required<CmsTypography> = {
  font: "sans",
  weight: "medium",
  style: "normal",
  size: "base",
};

function resolveWeight(weight?: string): CmsWeight {
  if (!weight) return DEFAULT_TYPOGRAPHY.weight;
  if (weight in WEIGHT_CLASSES) return weight as CmsWeight;
  return LEGACY_WEIGHT_MAP[weight] ?? DEFAULT_TYPOGRAPHY.weight;
}

export function typographyClassName(
  typography?: CmsTypography,
  defaults: Partial<CmsTypography> = {},
): string {
  const merged = { ...DEFAULT_TYPOGRAPHY, ...defaults, ...typography };
  const weight = resolveWeight(merged.weight);
  const style = merged.style ?? "normal";

  return [
    FONT_CLASSES[merged.font],
    WEIGHT_CLASSES[weight],
    STYLE_CLASSES[style],
    SIZE_CLASSES[merged.size],
  ]
    .filter(Boolean)
    .join(" ");
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

export const BUTTON_SIZE_CLASSES = {
  sm: "px-4 py-2 text-sm gap-1.5",
  md: "px-6 py-3 text-[15px] gap-2",
  lg: "px-8 py-3.5 text-base gap-2.5",
} as const;

export const TWO_COLUMN_RATIO_CLASSES = {
  equal: "sm:grid-cols-2",
  "narrow-wide": "sm:grid-cols-[2fr_3fr]",
  "wide-narrow": "sm:grid-cols-[3fr_2fr]",
} as const;

export const HERO_MIN_HEIGHT_CLASSES = {
  auto: "",
  medium: "min-h-[50vh]",
  tall: "min-h-[60vh]",
} as const;
