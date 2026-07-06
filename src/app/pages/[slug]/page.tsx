import { notFound } from "next/navigation";
import CmsBlockRenderer from "@/components/cms/cms-block-renderer";
import { getAllCmsPages, getCmsPage } from "@/lib/cms/pages";
import { createPageMetadata } from "@/lib/site-metadata";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllCmsPages().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = getCmsPage(slug);
  if (!page) return createPageMetadata("Page");
  return createPageMetadata(page.title, page.seoDescription);
}

export default async function CmsPageRoute({ params }: Props) {
  const { slug } = await params;
  const page = getCmsPage(slug);
  if (!page) notFound();

  return (
    <article className="pb-16 w-full">
      <CmsBlockRenderer blocks={page.blocks} pageWidth={page.pageWidth} />
    </article>
  );
}
