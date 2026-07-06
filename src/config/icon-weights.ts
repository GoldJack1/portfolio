/**
 * Icon stroke widths calibrated to Strawford (sans) and Knile (deco).
 * Sans + deco values visually calibrated 2026-07-06 at weights 300 / 500 / 700.
 * All weights 100–900 are linearly interpolated (extrapolated at the ends).
 */

export type IconFont = "sans" | "deco";

/** Calibrated anchor weights — values tuned on /design-system/icon-calibration */
export type AnchorWeight = 300 | 500 | 700;

export const ICON_ANCHOR_WEIGHTS: AnchorWeight[] = [300, 500, 700];

/** Standard CSS font weights supported for icon stroke lookup */
export const ICON_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

export type IconWeight = (typeof ICON_WEIGHTS)[number];

export const strokeWidths: Record<IconFont, Record<AnchorWeight, number>> = {
  sans: {
    300: 1.5,
    500: 3.35,
    700: 4.7,
  },
  deco: {
    300: 1.5,
    500: 3.05,
    700: 4.55,
  },
};

/** Baseline stroke at weight 300 — anchors path inset math in Icon component */
export const baseStrokeWidths: Record<IconFont, number> = {
  sans: strokeWidths.sans[300],
  deco: strokeWidths.deco[300],
};

const MIN_WEIGHT = 100;
const MAX_WEIGHT = 900;
const MIN_STROKE = 0.1;

function clampWeight(weight: number): number {
  return Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, weight));
}

/**
 * Piecewise-linear interpolation across anchor weights.
 * Extrapolates below 300 and above 700 using the nearest segment.
 */
export function interpolateAnchorStrokes(
  anchors: Record<AnchorWeight, number>,
  weight: number,
): number {
  weight = clampWeight(weight);
  const points = ICON_ANCHOR_WEIGHTS;

  if (weight <= points[0]) {
    const t = (weight - points[0]) / (points[1] - points[0]);
    return Math.max(MIN_STROKE, anchors[points[0]] + t * (anchors[points[1]] - anchors[points[0]]));
  }

  const last = points[points.length - 1];
  if (weight >= last) {
    const prev = points[points.length - 2];
    const t = (weight - prev) / (last - prev);
    return Math.max(MIN_STROKE, anchors[prev] + t * (anchors[last] - anchors[prev]));
  }

  for (let i = 0; i < points.length - 1; i++) {
    const lower = points[i];
    const upper = points[i + 1];
    if (weight >= lower && weight <= upper) {
      const t = (weight - lower) / (upper - lower);
      return anchors[lower] + t * (anchors[upper] - anchors[lower]);
    }
  }

  return anchors[500];
}

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
  return interpolateAnchorStrokes(strokeWidths[font], weight);
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
  800: "ExtraBold",
  900: "Black",
};
