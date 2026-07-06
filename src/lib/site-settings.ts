import siteSettingsData from "@/data/site-settings.json";
import type { CmsSiteSettings } from "@/lib/cms/types";

const SETTINGS = siteSettingsData as CmsSiteSettings;

export function getSiteSettingsData(): CmsSiteSettings {
  return SETTINGS;
}

export function getSiteName(): string {
  return SETTINGS.siteName?.trim() || "Jack Wingate";
}

export function getSiteDescription(): string {
  return (
    SETTINGS.siteDescription?.trim() ||
    "Graphic & UI/UX designer — brands, interfaces, and digital products."
  );
}

export function getContactEmail(): string {
  return SETTINGS.contactEmail?.trim() || "wingatejack2021@gmail.com";
}

export function getContactFormEmail(): string {
  return SETTINGS.contactFormEmail?.trim() || getContactEmail();
}

export function getContactPhone(): string {
  return SETTINGS.contactPhone?.trim() || "";
}

export function getContactPhoneHref(): string {
  const dialable = getContactPhone().replace(/[^\d+]/g, "");
  return dialable ? `tel:${dialable}` : "";
}

export function getSocialLinks() {
  return SETTINGS.socialLinks ?? [];
}

export type SocialLink = {
  id: string;
  label: string;
  href: string;
};

export function getFooterRightsText(): string {
  return SETTINGS.footerRightsText?.trim() || "All rights reserved.";
}

export function getDefaultOgImage(): string | undefined {
  return SETTINGS.defaultOgImage?.trim() || undefined;
}

export function getSearchPageMeta() {
  return {
    title: SETTINGS.searchPageTitle?.trim() || "Search",
    description:
      SETTINGS.searchPageDescription?.trim() ||
      "Search projects and pages on this portfolio.",
  };
}

export function getNotFoundContent() {
  return {
    title: SETTINGS.notFoundTitle?.trim() || "Page not found",
    body:
      SETTINGS.notFoundBody?.trim() ||
      "The page you're looking for doesn't exist or may have moved.",
    ctaLabel: SETTINGS.notFoundCtaLabel?.trim() || "Back home",
    ctaHref: SETTINGS.notFoundCtaHref?.trim() || "/",
  };
}
