import type { IconFont } from "@/config/icon-weights";
import { getStaticIconBasePath } from "./static-icon-utils";

export function getStarIconAssetPath(
  font: IconFont,
  size: number,
  weight: number,
): string {
  return getStaticIconBasePath(font, "star", size, weight, "Star");
}

export { getClosestSize, getClosestWeight } from "./static-icon-utils";
