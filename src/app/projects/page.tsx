import { notFound } from "next/navigation";
import CmsPageShell from "@/components/cms/cms-page-shell";
import { getSitePage } from "@/lib/cms/site-pages";
import { sitePageMetadata } from "@/lib/site-metadata";

const page = getSitePage("projects");

export const metadata = sitePageMetadata(page, "Projects");

export default function Projects() {
  if (!page) notFound();
  return <CmsPageShell {...page} />;
}
