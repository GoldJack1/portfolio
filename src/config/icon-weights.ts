/**
 * Icon stroke widths calibrated to Strawford (sans) and Knile (deco).
 * Strawford + Knile visually calibrated 2026-07-06 at 48px.
 */

export type IconFont = "sans" | "deco";

/** Static SVG assets exist at these weights only */
export type AnchorWeight = 300 | 500 | 700;

export const ICON_ANCHOR_WEIGHTS: AnchorWeight[] = [300, 500, 700];

export const ICON_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800] as const;

export type IconWeight = (typeof ICON_WEIGHTS)[number];

export const strokeWidths: Record<IconFont, Record<IconWeight, number>> = {
  sans: {
    100: 0.4,
    200: 1.15,
    300: 1.85,
    400: 2.53,
    500: 3.2,
    600: 3.85,
    700: 4.5,
    800: 5.15,
  },
  deco: {
    100: 0.45,
    200: 0.9,
    300: 1.5,
    400: 2.05,
    500: 3.25,
    600: 4.5,
    700: 5.6,
    800: 6.75,
  },
};

/** Baseline stroke at weight 300 — anchors path inset math in Icon component */
export const baseStrokeWidths: Record<IconFont, number> = {
  sans: strokeWidths.sans[300],
  deco: strokeWidths.deco[300],
};

const MIN_WEIGHT = 100;
const MAX_WEIGHT = 800;
const MIN_STROKE = 0.1;

function clampWeight(weight: number): number {
  return Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, weight));
}

/** Piecewise-linear lookup across the full per-weight table. */
export function interpolateStrokeWidths(
  table: Record<IconWeight, number>,
  weight: number,
): number {
  weight = clampWeight(weight);
  const points = ICON_WEIGHTS;

  if (weight <= points[0]) return Math.max(MIN_STROKE, table[points[0]]);
  if (weight >= points[points.length - 1]) {
    return Math.max(MIN_STROKE, table[points[points.length - 1]]);
  }

  for (let i = 0; i < points.length - 1; i++) {
    const lower = points[i];
    const upper = points[i + 1];
    if (weight >= lower && weight <= upper) {
      if (weight === lower) return table[lower];
      if (weight === upper) return table[upper];
      const t = (weight - lower) / (upper - lower);
      return table[lower] + t * (table[upper] - table[lower]);
    }
  }

  return table[500];
}

/** @deprecated Use interpolateStrokeWidths */
export const interpolateAnchorStrokes = interpolateStrokeWidths;

/** Nearest anchor for static SVG file selection (only 300/500/700 assets exist). */
export function nearestAnchorWeight(weight: number): AnchorWeight {
  weight = clampWeight(weight);
  let closest: AnchorWeight = ICON_ANCHOR_WEIGHTS[0];
  let minDiff = Math.abs(weight - closest);
  for (const w of ICON_ANCHOR_WEIGHTS) {
    const diff = Math.abs(weight - w);
    if (diff < minDiff) {
      minDiff = diff;
      closest = w;
    }
  }
  return closest;
}

/** @deprecated Use nearestAnchorWeight */
export const normalizeIconWeight = nearestAnchorWeight;

export function getStrokeWidth(font: IconFont, weight: number): number {
  const table = strokeWidths[font];
  const rounded = Math.round(weight);
  if (ICON_WEIGHTS.includes(rounded as IconWeight)) {
    return table[rounded as IconWeight];
  }
  return interpolateStrokeWidths(table, weight);
}

export function getBaseStrokeWidth(font: IconFont): number {
  return baseStrokeWidths[font];
}

export function getStrokePercentage(font: IconFont, weight: number): number {
  return getStrokeWidth(font, weight) / 32;
}

export const WEIGHT_NAMES: Record<IconWeight, string> = {
  100: "Thin",
  200: "ExtraLight",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "SemiBold",
  700: "Bold",
  800: "Black",
};
