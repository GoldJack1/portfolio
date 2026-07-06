import type { IconFont } from "@/config/icon-weights";
import { getStaticIconBasePath } from "./static-icon-utils";

export function getControlsIconAssetPath(
  font: IconFont,
  size: number,
  weight: number,
): string {
  return getStaticIconBasePath(font, "controls", size, weight, "Controls");
}

export { getClosestSize, getClosestWeight } from "./static-icon-utils";
