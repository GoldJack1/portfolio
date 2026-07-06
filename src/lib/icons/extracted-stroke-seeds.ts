import fontMetrics from "@/config/font-metrics.json";
import { ICON_WEIGHTS, type IconFont, type IconWeight } from "@/config/icon-weights";

type FamilyMetrics = {
  strokeWidths: Record<string, number>;
};

function fullStrokes(family: FamilyMetrics): Record<IconWeight, number> {
  const strokes = family.strokeWidths;
  const result = {} as Record<IconWeight, number>;

  for (const weight of ICON_WEIGHTS) {
    result[weight] = strokes[String(weight)] ?? 2;
  }

  return result;
}

/** Auto-extracted stroke seeds from OTF stem metrics — reset baseline on calibration page. */
export const extractedStrokeWidths: Record<IconFont, Record<IconWeight, number>> = {
  sans: fullStrokes(fontMetrics.families.sans as FamilyMetrics),
  deco: fullStrokes(fontMetrics.families.deco as FamilyMetrics),
};

export const extractedAt = fontMetrics.generatedAt;

export function allExtractedStrokes(family: FamilyMetrics): Record<number, number> {
  return Object.fromEntries(
    Object.entries(family.strokeWidths).map(([w, s]) => [Number(w), s]),
  );
}
