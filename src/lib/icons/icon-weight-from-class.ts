import { nearestAnchorWeight } from "@/config/icon-weights";

const WEIGHT_BY_TAILWIND: Record<string, number> = {
  "font-thin": 100,
  "font-extralight": 200,
  "font-light": 300,
  "font-normal": 400,
  "font-medium": 500,
  "font-semibold": 600,
  "font-bold": 700,
  "font-extrabold": 800,
  "font-black": 800,
};

/**
 * Resolve an icon weight from Tailwind font-weight class names.
 * Defaults to 500 (medium) when no match is found.
 */
export function iconWeightFromClass(...classNames: Array<string | undefined>): number {
  for (const className of classNames) {
    if (!className) continue;
    for (const token of className.split(/\s+/)) {
      const weight = WEIGHT_BY_TAILWIND[token];
      if (weight) return weight;
    }
  }
  return 500;
}

/** Parse a numeric font-weight from an inline style or CSS variable context. */
export function iconWeightFromCSSValue(weight: string | number | undefined): number {
  if (weight === undefined) return 500;
  const n = typeof weight === "number" ? weight : parseInt(weight, 10);
  if (Number.isNaN(n)) return 500;
  return Math.max(100, Math.min(800, n));
}

/** Default icon weights aligned with typography tokens */
export const defaultSansIconWeight = 500;
export const defaultDecoIconWeight = 500;

export { nearestAnchorWeight };
