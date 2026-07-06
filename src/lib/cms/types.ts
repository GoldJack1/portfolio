import type { CmsIconName } from "./icon-names";

export type CmsFont = "sans" | "deco";
export type CmsWeight =
  | "thin"
  | "extralight"
  | "light"
  | "regular"
  | "medium"
  | "semibold"
  | "bold"
  | "black";
export type CmsStyle = "normal" | "italic";
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
  style?: CmsStyle;
  size?: CmsSize;
};

export type CmsButtonVariant = "primary" | "secondary" | "ghost";
export type CmsButtonSize = "sm" | "md" | "lg";
export type CmsIconPosition = "left" | "right";

export type CmsButton = {
  label: string;
  href?: string;
  variant?: CmsButtonVariant;
  size?: CmsButtonSize;
  icon?: CmsIconName;
  iconPosition?: CmsIconPosition;
};

export type CmsSectionStyle = {
  paddingTop?: "none" | "sm" | "md" | "lg";
  paddingBottom?: "none" | "sm" | "md" | "lg";
  background?: "none" | "surface";
  textTone?: "default" | "muted";
};

export type CmsPageWidth = "narrow" | "default" | "wide" | "full";

export type CmsPageSettings = {
  title: string;
  seoDescription?: string;
  pageWidth?: CmsPageWidth;
  showBackLink?: boolean;
  backLabel?: string;
  backHref?: string;
};

export type CmsHeroBlock = CmsSectionStyle & {
  type: "hero";
  eyebrow?: string;
  heading: string;
  body?: string;
  headingTypography?: CmsTypography;
  bodyTypography?: CmsTypography;
  image?: string;
  layout?: "centered" | "left" | "split-right" | "split-left";
  minHeight?: "auto" | "medium" | "tall";
  buttons?: CmsButton[];
};

export type CmsHeadingBlock = CmsSectionStyle & {
  type: "heading";
  text: string;
  typography?: CmsTypography;
  align?: "left" | "center";
};

export type CmsTextBlock = CmsSectionStyle & {
  type: "text";
  body: string;
  typography?: CmsTypography;
  align?: "left" | "center";
};

export type CmsImageBlock = CmsSectionStyle & {
  type: "image";
  src: string;
  alt?: string;
  caption?: string;
  layout?: "full" | "inset" | "small";
  rounded?: boolean;
};

export type CmsGalleryBlock = CmsSectionStyle & {
  type: "gallery";
  images: Array<string | { image?: string }>;
  columns?: "1" | "2" | "3";
  rounded?: boolean;
};

export type CmsTwoColumnBlock = CmsSectionStyle & {
  type: "twoColumn";
  left: string;
  leftTypography?: CmsTypography;
  right: string;
  rightTypography?: CmsTypography;
  ratio?: "equal" | "narrow-wide" | "wide-narrow";
};

export type CmsCtaBlock = CmsSectionStyle & {
  type: "cta";
  heading?: string;
  body?: string;
  headingTypography?: CmsTypography;
  bodyTypography?: CmsTypography;
  buttons?: CmsButton[];
  style?: "card" | "plain";
};

export type CmsEmbedBlock = CmsSectionStyle & {
  type: "embed";
  title?: string;
  src: string;
  aspect?: "video" | "tall";
};

export type CmsSpacerBlock = {
  type: "spacer";
  size?: "sm" | "md" | "lg" | "xl";
};

export type CmsBackLinkBlock = {
  type: "backLink";
  label?: string;
  href?: string;
};

export type CmsFeaturedProjectsBlock = CmsSectionStyle & {
  type: "featuredProjects";
  heading?: string;
  headingTypography?: CmsTypography;
  linkLabel?: string;
  linkHref?: string;
  columns?: "1" | "2";
};

export type CmsProjectGridBlock = CmsSectionStyle & {
  type: "projectGrid";
  heading?: string;
  intro?: string;
  headingTypography?: CmsTypography;
  introTypography?: CmsTypography;
};

export type CmsTimelineItem = {
  period?: string;
  title: string;
  subtitle?: string;
  description?: string;
};

export type CmsTimelineBlock = CmsSectionStyle & {
  type: "timeline";
  heading?: string;
  headingTypography?: CmsTypography;
  items: CmsTimelineItem[];
};

export type CmsTagGroup = {
  category: string;
  items: string[];
};

export type CmsTagGroupsBlock = CmsSectionStyle & {
  type: "tagGroups";
  heading?: string;
  headingTypography?: CmsTypography;
  groups: CmsTagGroup[];
};

export type CmsBulletListBlock = CmsSectionStyle & {
  type: "bulletList";
  heading?: string;
  headingTypography?: CmsTypography;
  items: string[];
  typography?: CmsTypography;
};

export type CmsLinkListItem = {
  label: string;
  href: string;
  display?: string;
  external?: boolean;
};

export type CmsLinkListBlock = CmsSectionStyle & {
  type: "linkList";
  heading?: string;
  headingTypography?: CmsTypography;
  links: CmsLinkListItem[];
};

export type CmsContactFormBlock = CmsSectionStyle & {
  type: "contactForm";
  submitLabel?: string;
  successMessage?: string;
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
  | CmsSpacerBlock
  | CmsBackLinkBlock
  | CmsFeaturedProjectsBlock
  | CmsProjectGridBlock
  | CmsTimelineBlock
  | CmsTagGroupsBlock
  | CmsBulletListBlock
  | CmsLinkListBlock
  | CmsContactFormBlock;

/** Custom pages at /pages/[slug] */
export type CmsPage = CmsPageSettings & {
  slug: string;
  showInNav?: boolean;
  navLabel?: string;
  blocks: CmsBlock[];
};

/** Core site routes (/, /about, etc.) */
export type CmsSitePage = CmsPageSettings & {
  route: "home" | "about" | "projects" | "contact";
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
