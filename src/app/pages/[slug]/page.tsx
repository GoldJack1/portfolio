import { notFound } from "next/navigation";
import CmsPageShell from "@/components/cms/cms-page-shell";
import { getAllCmsPages, getCmsPage } from "@/lib/cms/pages";
import { createCmsPageMetadata, createPageMetadata } from "@/lib/site-metadata";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllCmsPages().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = getCmsPage(slug);
  if (!page) return createPageMetadata("Page");
  return createCmsPageMetadata(page.title, page.seoTitle, page.seoDescription, page.ogImage);
}

export default async function CmsPageRoute({ params }: Props) {
  const { slug } = await params;
  const page = getCmsPage(slug);
  if (!page) notFound();

  return (
    <CmsPageShell
      {...page}
      showBackLink={page.showBackLink ?? true}
      backLabel={page.backLabel ?? "Back"}
      backHref={page.backHref ?? "/"}
    />
  );
}
