import {
  getStrokeWidth,
  nearestAnchorWeight,
  type IconFont,
  type AnchorWeight,
} from "@/config/icon-weights";

/** Geologica stroke table used when interim static SVGs were generated. */
const GEOLOGICA_SOURCE_AT_32: Record<AnchorWeight, number> = {
  300: 3.35,
  500: 4.48,
  700: 5.61,
};

/** Full Geologica table for interpolating source stroke at any weight. */
const GEOLOGICA_FULL_AT_32: Record<number, number> = {
  100: 2.22,
  200: 2.78,
  300: 3.35,
  400: 3.91,
  500: 4.48,
  600: 5.05,
  700: 5.61,
  800: 6.18,
  900: 6.74,
};

function interpolateTable(table: Record<number, number>, weight: number): number {
  weight = Math.max(100, Math.min(800, weight));
  const points = Object.keys(table)
    .map(Number)
    .sort((a, b) => a - b);

  if (weight <= points[0]) return table[points[0]];
  if (weight >= points[points.length - 1]) return table[points[points.length - 1]];

  for (let i = 0; i < points.length - 1; i++) {
    const lower = points[i];
    const upper = points[i + 1];
    if (weight >= lower && weight <= upper) {
      const t = (weight - lower) / (upper - lower);
      return table[lower] + t * (table[upper] - table[lower]);
    }
  }

  return table[500];
}

export function getSourceStrokeAt32(fileAnchorWeight: AnchorWeight): number {
  return GEOLOGICA_SOURCE_AT_32[fileAnchorWeight];
}

export function getInterpolatedSourceStrokeAt32(weight: number): number {
  return interpolateTable(GEOLOGICA_FULL_AT_32, weight);
}

export function getTargetStrokeAt32(
  font: IconFont,
  weight: number,
  strokeOverride?: number,
): number {
  if (strokeOverride !== undefined) return strokeOverride;
  return getStrokeWidth(font, weight);
}

export function getStaticIconScaleRatio(
  font: IconFont,
  weight: number,
  fileAnchorWeight: AnchorWeight,
  strokeOverride?: number,
): number {
  const source = getSourceStrokeAt32(fileAnchorWeight);
  const target = getTargetStrokeAt32(font, weight, strokeOverride);
  return target / source;
}

/**
 * Scale baked static SVG content so stroke/fill weight matches calibrated font strokes.
 * Interim assets were exported with Geologica stroke tables at 300/500/700.
 */
export function remapStaticIconContent(
  innerContent: string,
  viewBoxSize: number,
  font: IconFont,
  weight: number,
  fileAnchorWeight: AnchorWeight,
  strokeOverride?: number,
): string {
  const ratio = getStaticIconScaleRatio(font, weight, fileAnchorWeight, strokeOverride);
  if (Math.abs(ratio - 1) < 0.001) return innerContent;

  const center = viewBoxSize / 2;
  return `<g transform="translate(${center},${center}) scale(${ratio}) translate(${-center},${-center})">${innerContent}</g>`;
}

export function parseViewBoxSize(viewBox: string, fallback: number): number {
  const parts = viewBox.trim().split(/\s+/).map(Number);
  if (parts.length === 4 && parts[2] > 0) return parts[2];
  return fallback;
}

export { nearestAnchorWeight };
