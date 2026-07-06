import type { IconFont } from "@/config/icon-weights";
import { getStaticIconBasePath } from "./static-icon-utils";

export function getHelpCircleIconAssetPath(
  font: IconFont,
  size: number,
  weight: number,
): string {
  return getStaticIconBasePath(font, "help-circle", size, weight, "Help Circle");
}

export { getClosestSize, getClosestWeight } from "./static-icon-utils";
