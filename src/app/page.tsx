import { notFound } from "next/navigation";
import CmsPageShell from "@/components/cms/cms-page-shell";
import { getSitePage } from "@/lib/cms/site-pages";
import { createPageMetadata } from "@/lib/site-metadata";

const page = getSitePage("home");

export const metadata = page
  ? createPageMetadata(page.title, page.seoDescription)
  : createPageMetadata("Home");

export default function Home() {
  if (!page) notFound();
  return <CmsPageShell {...page} />;
}
