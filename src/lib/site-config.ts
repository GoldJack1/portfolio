import type { SocialLink } from "./site-settings";
import {
  getContactEmail,
  getContactFormEmail,
  getContactPhone,
  getContactPhoneHref,
  getSiteDescription,
  getSiteName,
  getSocialLinks,
} from "./site-settings";

export type { SocialLink };

export const SITE_NAME = getSiteName();
export const SITE_DESCRIPTION = getSiteDescription();
export const CONTACT_EMAIL = getContactEmail();
export const CONTACT_FORM_EMAIL = getContactFormEmail();
export const CONTACT_PHONE = getContactPhone();
export { getContactPhoneHref };

export const SOCIAL_LINKS: SocialLink[] = getSocialLinks();

/** Canonical site URL for Open Graph / metadata. Set NEXT_PUBLIC_SITE_URL in production. */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return url && url.length > 0 ? url.replace(/\/$/, "") : "https://jackwingate.netlify.app";
}

export function getCopyrightYear(): number {
  return new Date().getFullYear();
}
