export type CmsImageAspect =
  | "auto"
  | "square"
  | "standard"
  | "video"
  | "portrait"
  | "tall"
  | "cinematic";

export type CmsImageFit = "cover" | "contain";

export type CmsImageAlign = "left" | "center" | "right";

export type CmsImageRadius = "none" | "sm" | "lg" | "full";

export type CmsImageLayout = "full" | "inset" | "small" | "bleed";

export type CmsImageCrop = "center" | "top" | "bottom" | "left" | "right";

export type CmsImageDisplay = {
  layout?: CmsImageLayout;
  aspect?: CmsImageAspect;
  fit?: CmsImageFit;
  align?: CmsImageAlign;
  radius?: CmsImageRadius;
  border?: boolean;
  crop?: CmsImageCrop;
  /** Legacy boolean — maps to radius lg/none when radius is unset */
  rounded?: boolean;
};

export type CmsGalleryArrangement = "grid" | "vertical" | "horizontal";

export type CmsGalleryGap = "none" | "sm" | "md";

export const IMAGE_ASPECT_CLASSES: Record<Exclude<CmsImageAspect, "auto">, string> = {
  square: "aspect-square",
  standard: "aspect-[4/3]",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  tall: "aspect-[4/5]",
  cinematic: "aspect-[21/9]",
};

export const IMAGE_FIT_CLASSES: Record<CmsImageFit, string> = {
  cover: "object-cover",
  contain: "object-contain",
};

export const IMAGE_ALIGN_CLASSES: Record<CmsImageAlign, string> = {
  left: "mr-auto",
  center: "mx-auto",
  right: "ml-auto",
};

export const IMAGE_LAYOUT_WIDTH_CLASSES: Record<CmsImageLayout, string> = {
  full: "w-full",
  inset: "w-full max-w-4xl",
  small: "w-full max-w-xl",
  bleed: "w-screen max-w-[100vw] relative left-1/2 -translate-x-1/2",
};

export const IMAGE_CROP_CLASSES: Record<CmsImageCrop, string> = {
  center: "object-center",
  top: "object-top",
  bottom: "object-bottom",
  left: "object-left",
  right: "object-right",
};

export const GALLERY_GAP_CLASSES: Record<CmsGalleryGap, string> = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-4",
};

export const IMAGE_RADIUS_CLASSES: Record<CmsImageRadius, string> = {
  none: "",
  sm: "rounded-surface-sm",
  lg: "rounded-surface",
  full: "rounded-full",
};

export function resolveImageRadius(display: CmsImageDisplay = {}): CmsImageRadius {
  if (display.radius) return display.radius;
  if (display.rounded === true) return "lg";
  return "none";
}

export function imageFrameShellClasses(display: CmsImageDisplay = {}): string {
  const layout = display.layout ?? "inset";
  const align = display.align ?? "center";
  const aspect = display.aspect ?? "video";
  const border = display.border ?? true;
  const radius = resolveImageRadius(display);

  return [
    "overflow-hidden bg-surface",
    IMAGE_LAYOUT_WIDTH_CLASSES[layout],
    IMAGE_ALIGN_CLASSES[align],
    aspect !== "auto" ? "relative" : "",
    aspect !== "auto" ? IMAGE_ASPECT_CLASSES[aspect] : "",
    border ? "border border-border" : "",
    IMAGE_RADIUS_CLASSES[radius],
  ]
    .filter(Boolean)
    .join(" ");
}

export function imageFitClass(display: CmsImageDisplay = {}): string {
  const fit = IMAGE_FIT_CLASSES[display.fit ?? "cover"];
  const crop = IMAGE_CROP_CLASSES[display.crop ?? "center"];
  return `${fit} ${crop}`;
}

export function imageBleedWrapperClass(display: CmsImageDisplay = {}): string {
  return display.layout === "bleed" ? "w-full overflow-x-clip" : "";
}

export function galleryGapClass(
  arrangement: CmsGalleryArrangement = "grid",
  gap?: CmsGalleryGap,
): string {
  const resolved = gap ?? (arrangement === "grid" ? "md" : "none");
  return GALLERY_GAP_CLASSES[resolved];
}

export function galleryBleedClass(bleed?: boolean): string {
  return bleed ? "w-screen max-w-[100vw] relative left-1/2 -translate-x-1/2 overflow-x-clip" : "";
}

export function pickImageDisplay(
  source: CmsImageDisplay = {},
  overrides: CmsImageDisplay = {},
): CmsImageDisplay {
  return {
    layout: overrides.layout ?? source.layout,
    aspect: overrides.aspect ?? source.aspect,
    fit: overrides.fit ?? source.fit,
    align: overrides.align ?? source.align,
    radius: overrides.radius ?? source.radius,
    border: overrides.border ?? source.border,
    crop: overrides.crop ?? source.crop,
    rounded: overrides.rounded ?? source.rounded,
  };
}
