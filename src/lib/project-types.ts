export type ProjectLink = { label: string; href: string };
export type ProjectEmbed = { title: string; src: string; hideOnMobile?: boolean };

export type Project = {
  slug: string;
  title: string;
  year: string;
  tag: string;
  desc: string;
  body?: string[];
  bodyMarkdown?: string;
  tech?: string[];
  featured?: boolean;
  sortOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  thumbnail: string;
  gallery: string[];
  links?: ProjectLink[];
  video?: string;
  pdf?: string;
  embeds?: ProjectEmbed[];
};
