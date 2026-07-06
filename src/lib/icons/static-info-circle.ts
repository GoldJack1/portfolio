import type { IconFont } from "@/config/icon-weights";
import { getStaticIconBasePath } from "./static-icon-utils";

export function getInfoCircleIconAssetPath(
  font: IconFont,
  size: number,
  weight: number,
): string {
  return getStaticIconBasePath(font, "info-circle", size, weight, "Info Circle");
}

export { getClosestSize, getClosestWeight } from "./static-icon-utils";
