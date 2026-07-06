import type { Model } from "@stackbit/types";

const pageWidthOptions = ["narrow", "default", "wide", "full"] as const;

const pageSettingsFields: Model["fields"] = [
  { type: "string", name: "title", label: "Title", required: true },
  { type: "string", name: "seoTitle", label: "SEO title", required: false },
  { type: "text", name: "seoDescription", label: "SEO description", required: false },
  { type: "image", name: "ogImage", label: "Social preview image", required: false },
  {
    type: "enum",
    name: "pageWidth",
    label: "Page width",
    options: pageWidthOptions.map((value) => ({ value, label: value })),
    default: "full",
    required: false,
  },
  { type: "boolean", name: "showBackLink", label: "Show back link", required: false },
  { type: "string", name: "backLabel", label: "Back link label", required: false },
  { type: "string", name: "backHref", label: "Back link URL", required: false },
  {
    type: "json",
    name: "blocks",
    label: "Sections",
    required: false,
    description: "Page sections (hero, text, gallery, etc.)",
  },
];

export const SitePage: Model = {
  type: "page",
  name: "SitePage",
  label: "Site page",
  filePath: "content/site-pages/{route}.json",
  fields: [
    { type: "string", name: "route", label: "Route", required: true },
    ...pageSettingsFields,
  ],
};

export const CustomPage: Model = {
  type: "page",
  name: "CustomPage",
  label: "Custom page",
  filePath: "content/pages/{slug}.json",
  fields: [
    { type: "string", name: "slug", label: "URL slug", required: true },
    { type: "string", name: "title", label: "Title", required: true },
    { type: "string", name: "seoTitle", label: "SEO title", required: false },
    { type: "text", name: "seoDescription", label: "SEO description", required: false },
    { type: "image", name: "ogImage", label: "Social preview image", required: false },
    { type: "boolean", name: "showInNav", label: "Show in navigation", default: false, required: false },
    { type: "string", name: "navLabel", label: "Navigation label", required: false },
    {
      type: "enum",
      name: "pageWidth",
      label: "Page width",
      options: pageWidthOptions.map((value) => ({ value, label: value })),
      default: "full",
      required: false,
    },
    { type: "boolean", name: "showBackLink", label: "Show back link", default: true, required: false },
    { type: "string", name: "backLabel", label: "Back link label", required: false },
    { type: "string", name: "backHref", label: "Back link URL", required: false },
    {
      type: "json",
      name: "blocks",
      label: "Sections",
      required: false,
      description: "Page sections (hero, text, gallery, etc.)",
    },
  ],
};

export const Project: Model = {
  type: "page",
  name: "Project",
  label: "Project",
  filePath: "content/projects/{slug}.json",
  fields: [
    { type: "string", name: "slug", label: "URL slug", required: true },
    { type: "string", name: "title", label: "Title", required: true },
    { type: "number", name: "sortOrder", label: "Sort order", required: false },
    { type: "string", name: "year", label: "Year", required: true },
    { type: "string", name: "tag", label: "Tag", required: true },
    { type: "text", name: "desc", label: "Description", required: true },
    { type: "markdown", name: "bodyMarkdown", label: "Body (markdown)", required: false },
    { type: "json", name: "body", label: "Body paragraphs", required: false },
    { type: "string", name: "seoTitle", label: "SEO title", required: false },
    { type: "text", name: "seoDescription", label: "SEO description", required: false },
    { type: "image", name: "ogImage", label: "Social preview image", required: false },
    { type: "json", name: "tech", label: "Tech stack", required: false },
    { type: "boolean", name: "featured", label: "Featured", default: false, required: false },
    { type: "image", name: "thumbnail", label: "Thumbnail", required: true },
    { type: "json", name: "gallery", label: "Gallery", required: false },
    { type: "json", name: "links", label: "Links", required: false },
    { type: "string", name: "video", label: "Video URL", required: false },
    { type: "file", name: "pdf", label: "PDF", required: false },
    { type: "json", name: "embeds", label: "Embeds", required: false },
  ],
};

export const SiteSettings: Model = {
  type: "data",
  name: "SiteSettings",
  label: "Site settings",
  filePath: "content/site/settings.json",
  fields: [
    { type: "string", name: "siteName", label: "Site name", required: true },
    { type: "text", name: "siteDescription", label: "Site description", required: true },
    { type: "image", name: "defaultOgImage", label: "Default social preview image", required: false },
    { type: "string", name: "contactEmail", label: "Contact email", required: true },
    { type: "string", name: "contactPhone", label: "Contact phone", required: false },
    { type: "string", name: "contactFormEmail", label: "Contact form recipient", required: false },
    { type: "string", name: "footerRightsText", label: "Footer rights text", required: false },
    { type: "json", name: "socialLinks", label: "Social links", required: false },
    { type: "json", name: "navItems", label: "Main navigation", required: false },
    { type: "json", name: "extraNav", label: "Extra navigation links", required: false },
    { type: "string", name: "searchPageTitle", label: "Search page title", required: false },
    { type: "text", name: "searchPageDescription", label: "Search page description", required: false },
    { type: "string", name: "notFoundTitle", label: "404 title", required: false },
    { type: "text", name: "notFoundBody", label: "404 body", required: false },
    { type: "string", name: "notFoundCtaLabel", label: "404 button label", required: false },
    { type: "string", name: "notFoundCtaHref", label: "404 button URL", required: false },
  ],
};

export const allModels = [SitePage, CustomPage, Project, SiteSettings];
