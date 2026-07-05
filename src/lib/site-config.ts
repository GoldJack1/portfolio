export interface SocialLink {
  id: string;
  label: string;
  href: string;
}

export const SITE_NAME = "Jack Wingate";

export const SOCIAL_LINKS: SocialLink[] = [
  { id: "linkedin", label: "LinkedIn", href: "https://linkedin.com/in/yourprofile" },
  { id: "x",        label: "X",        href: "https://x.com/yourhandle" },
  { id: "instagram", label: "Instagram", href: "https://instagram.com/yourhandle" },
  { id: "youtube",  label: "YouTube",  href: "https://youtube.com/@yourhandle" },
  { id: "bluesky",  label: "Bluesky",  href: "https://bsky.app/profile/yourhandle.bsky.social" },
  { id: "threads",  label: "Threads",  href: "https://threads.net/@yourhandle" },
];

export function getCopyrightYear(): number {
  return new Date().getFullYear();
}
