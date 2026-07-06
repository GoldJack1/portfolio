export type ProjectLink = { label: string; href: string };
export type ProjectEmbed = { title: string; src: string; hideOnMobile?: boolean };

export type Project = {
  slug: string;
  title: string;
  year: string;
  tag: string;
  desc: string;
  body?: string[];
  tech?: string[];
  featured?: boolean;
  thumbnail: string;
  gallery: string[];
  links?: ProjectLink[];
  video?: string;
  pdf?: string;
  embeds?: ProjectEmbed[];
};
