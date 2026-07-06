/** Icons available for CMS buttons (matches stroke icons in Icon component). */
export const CMS_ICON_NAMES = [
  "arrow-left",
  "arrow-right",
  "arrow-up",
  "arrow-down",
  "chevron-left",
  "chevron-right",
  "chevron-up",
  "chevron-down",
  "checkmark",
  "circled-checkmark",
  "cross",
  "circled-cross",
  "plus",
  "minus",
  "search",
  "download",
  "upload",
  "link",
  "location",
  "filter",
  "refresh",
  "hamburger",
  "sun",
  "moon",
  "star",
  "info-circle",
  "help-circle",
  "controls",
  "sort-horizontal",
  "sort-vertical",
] as const;

export type CmsIconName = (typeof CMS_ICON_NAMES)[number];

export function isCmsIconName(value?: string): value is CmsIconName {
  return Boolean(value && (CMS_ICON_NAMES as readonly string[]).includes(value));
}
