import { notFound } from "next/navigation";
import CmsPageShell from "@/components/cms/cms-page-shell";
import { getSitePage } from "@/lib/cms/site-pages";
import { sitePageMetadata, createCmsPageMetadata } from "@/lib/site-metadata";

const page = getSitePage("home");

export const metadata = sitePageMetadata(page, "Home");

export default function Home() {
  if (!page) notFound();
  return <CmsPageShell {...page} />;
}
