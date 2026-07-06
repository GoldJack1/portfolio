export type CmsFont = "sans" | "deco";
export type CmsWeight = "light" | "medium" | "bold";
export type CmsSize =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl";

export type CmsTypography = {
  font?: CmsFont;
  weight?: CmsWeight;
  size?: CmsSize;
};

export type CmsButton = {
  label: string;
  href?: string;
  variant?: "primary" | "secondary";
};

export type CmsHeroBlock = {
  type: "hero";
  eyebrow?: string;
  heading: string;
  body?: string;
  headingTypography?: CmsTypography;
  bodyTypography?: CmsTypography;
  image?: string;
  layout?: "centered" | "left" | "split-right" | "split-left";
  buttons?: CmsButton[];
};

export type CmsHeadingBlock = {
  type: "heading";
  text: string;
  typography?: CmsTypography;
  align?: "left" | "center";
};

export type CmsTextBlock = {
  type: "text";
  body: string;
  typography?: CmsTypography;
  align?: "left" | "center";
};

export type CmsImageBlock = {
  type: "image";
  src: string;
  alt?: string;
  caption?: string;
  layout?: "full" | "inset" | "small";
};

export type CmsGalleryBlock = {
  type: "gallery";
  images: Array<string | { image?: string }>;
  columns?: "1" | "2" | "3";
};

export type CmsTwoColumnBlock = {
  type: "twoColumn";
  left: string;
  leftTypography?: CmsTypography;
  right: string;
  rightTypography?: CmsTypography;
  ratio?: "equal" | "narrow-wide" | "wide-narrow";
};

export type CmsCtaBlock = {
  type: "cta";
  heading?: string;
  body?: string;
  headingTypography?: CmsTypography;
  buttons?: CmsButton[];
  style?: "card" | "plain";
};

export type CmsEmbedBlock = {
  type: "embed";
  title?: string;
  src: string;
  aspect?: "video" | "tall";
};

export type CmsSpacerBlock = {
  type: "spacer";
  size?: "sm" | "md" | "lg" | "xl";
};

export type CmsBlock =
  | CmsHeroBlock
  | CmsHeadingBlock
  | CmsTextBlock
  | CmsImageBlock
  | CmsGalleryBlock
  | CmsTwoColumnBlock
  | CmsCtaBlock
  | CmsEmbedBlock
  | CmsSpacerBlock;

export type CmsPageWidth = "narrow" | "default" | "wide" | "full";

export type CmsPage = {
  title: string;
  slug: string;
  seoDescription?: string;
  showInNav?: boolean;
  navLabel?: string;
  pageWidth?: CmsPageWidth;
  blocks: CmsBlock[];
};

export type CmsNavLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type CmsSiteSettings = {
  extraNav?: CmsNavLink[];
};
