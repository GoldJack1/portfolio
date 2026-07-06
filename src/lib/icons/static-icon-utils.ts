import type { IconFont, AnchorWeight } from "@/config/icon-weights";
import { nearestAnchorWeight } from "@/config/icon-weights";

const MIN_SIZE = 8;
const MAX_SIZE = 128;

export function getClosestSize(requestedSize: number): number {
  return Math.max(MIN_SIZE, Math.min(MAX_SIZE, Math.round(requestedSize)));
}

/** Static SVG assets exist at anchor weights 300 / 500 / 700 only. */
export function getClosestWeight(requestedWeight: number): AnchorWeight {
  return nearestAnchorWeight(requestedWeight);
}

export function getStaticIconBasePath(
  font: IconFont,
  family: string,
  size: number,
  weight: number,
  fileName: string,
): string {
  const closestSize = getClosestSize(size);
  const closestWeight = getClosestWeight(weight);
  return `/icons/${font}/${family}/${closestSize}x${closestSize}/${fileName}_${closestWeight}_${closestSize}x${closestSize}.svg`;
}
