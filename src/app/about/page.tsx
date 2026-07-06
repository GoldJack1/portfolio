import { notFound } from "next/navigation";
import CmsPageShell from "@/components/cms/cms-page-shell";
import { getSitePage } from "@/lib/cms/site-pages";
import { createPageMetadata } from "@/lib/site-metadata";

const page = getSitePage("about");

export const metadata = page
  ? createPageMetadata(page.title, page.seoDescription)
  : createPageMetadata("About");

export default function About() {
  if (!page) notFound();
  return <CmsPageShell {...page} />;
}
