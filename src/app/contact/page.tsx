import { notFound } from "next/navigation";
import CmsPageShell from "@/components/cms/cms-page-shell";
import { getSitePage } from "@/lib/cms/site-pages";
import { sitePageMetadata } from "@/lib/site-metadata";

const page = getSitePage("contact");

export const metadata = sitePageMetadata(page, "Contact");

export default function Contact() {
  if (!page) notFound();
  return <CmsPageShell {...page} />;
}
