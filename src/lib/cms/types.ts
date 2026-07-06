import type { CmsIconName } from "./icon-names";
import type { CmsGalleryArrangement, CmsGalleryGap, CmsImageDisplay } from "./image-display";

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
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  pageWidth?: CmsPageWidth;
  showBackLink?: boolean;
  backLabel?: string;
  backHref?: string;
  showInNav?: boolean;
  navLabel?: string;
};

export type CmsHeroBlock = CmsSectionStyle & {
  type: "hero";
  eyebrow?: string;
  heading: string;
  body?: string;
  headingTypography?: CmsTypography;
  bodyTypography?: CmsTypography;
  image?: string;
  imageDisplay?: CmsImageDisplay;
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

export type CmsImageBlock = CmsSectionStyle &
  CmsImageDisplay & {
    type: "image";
    src: string;
    alt?: string;
    caption?: string;
    captionAlign?: "left" | "center";
  };

export type CmsGalleryBlock = CmsSectionStyle &
  CmsImageDisplay & {
    type: "gallery";
    images: Array<string | { image?: string }>;
    columns?: "1" | "2" | "3";
    arrangement?: CmsGalleryArrangement;
    gap?: CmsGalleryGap;
    bleed?: boolean;
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
  projectSlugs?: Array<string | { slug?: string }>;
  limit?: number;
};

export type CmsProjectGridBlock = CmsSectionStyle & {
  type: "projectGrid";
  heading?: string;
  intro?: string;
  headingTypography?: CmsTypography;
  introTypography?: CmsTypography;
  mode?: "all" | "selected";
  projectSlugs?: Array<string | { slug?: string }>;
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

export type CmsVideoBlock = CmsSectionStyle & {
  type: "video";
  src: string;
  poster?: string;
  caption?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
};

export type CmsQuoteBlock = CmsSectionStyle & {
  type: "quote";
  text: string;
  cite?: string;
  typography?: CmsTypography;
};

export type CmsFaqItem = {
  question: string;
  answer: string;
};

export type CmsFaqBlock = CmsSectionStyle & {
  type: "faq";
  heading?: string;
  headingTypography?: CmsTypography;
  items: CmsFaqItem[];
};

export type CmsStatItem = {
  value: string;
  label: string;
};

export type CmsStatsBlock = CmsSectionStyle & {
  type: "stats";
  heading?: string;
  headingTypography?: CmsTypography;
  items: CmsStatItem[];
  columns?: "2" | "3" | "4";
};

export type CmsDividerBlock = {
  type: "divider";
  style?: "line" | "space";
};

export type CmsLogoItem = {
  name: string;
  image: string;
  href?: string;
};

export type CmsLogosBlock = CmsSectionStyle & {
  type: "logos";
  heading?: string;
  headingTypography?: CmsTypography;
  items: CmsLogoItem[];
  columns?: "3" | "4" | "5" | "6";
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
  | CmsContactFormBlock
  | CmsVideoBlock
  | CmsQuoteBlock
  | CmsFaqBlock
  | CmsStatsBlock
  | CmsDividerBlock
  | CmsLogosBlock;

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
  id?: string;
};

export type CmsNavItem = {
  id: string;
  label: string;
  href: string;
  visible?: boolean;
};

export type CmsSocialLink = {
  id: string;
  label: string;
  href: string;
};

export type CmsSiteSettings = {
  siteName?: string;
  siteDescription?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactFormEmail?: string;
  footerRightsText?: string;
  defaultOgImage?: string;
  socialLinks?: CmsSocialLink[];
  navItems?: CmsNavItem[];
  searchPageTitle?: string;
  searchPageDescription?: string;
  notFoundTitle?: string;
  notFoundBody?: string;
  notFoundCtaLabel?: string;
  notFoundCtaHref?: string;
  extraNav?: CmsNavLink[];
};
