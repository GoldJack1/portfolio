import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata(
  "Contact",
  "Get in touch with Jack Wingate about design work, collaborations, and projects.",
);

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
