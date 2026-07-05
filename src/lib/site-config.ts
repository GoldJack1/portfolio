export interface SocialLink {
  id: string;
  label: string;
  href: string;
}

export const SITE_NAME = "Jack Wingate";

/** Your contact email — used in the Elsewhere section and as the form recipient. */
export const CONTACT_EMAIL = "wingatejack2021@gmail.com";

/** Your phone number — shown in the Elsewhere section (include country code, e.g. +44…). */
export const CONTACT_PHONE = "(UK) +44 7943 002619";

/** Dialable tel: URI — strips labels like "(UK)", spaces, and other non-digit characters. */
export function getContactPhoneHref(): string {
  const dialable = CONTACT_PHONE.replace(/[^\d+]/g, "");
  return `tel:${dialable}`;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { id: "linkedin",  label: "LinkedIn",  href: "https://www.linkedin.com/in/jackwingate2023/" },
  { id: "x",         label: "X",         href: "https://x.com/jackrailsecrets" },
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/jackawingate/" },
  { id: "youtube",   label: "YouTube",   href: "https://www.youtube.com/@RailwaySecrets" },
  { id: "bluesky",   label: "Bluesky",   href: "https://bsky.app/profile/jackrailsecrets.bsky.social" },
  { id: "threads",   label: "Threads",   href: "https://www.threads.com/@jackawingate" },
];

export function getCopyrightYear(): number {
  return new Date().getFullYear();
}
