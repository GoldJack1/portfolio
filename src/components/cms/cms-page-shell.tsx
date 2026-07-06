import type { CmsPageSettings } from "@/lib/cms/types";
import { PAGE_WIDTH_CLASSES } from "@/lib/cms/typography";
import CmsBackLink from "./cms-back-link";
import CmsBlockRenderer from "./cms-block-renderer";

type CmsPageShellProps = CmsPageSettings & {
  blocks: Parameters<typeof CmsBlockRenderer>[0]["blocks"];
};

export default function CmsPageShell({
  title,
  pageWidth = "default",
  showBackLink,
  backLabel,
  backHref,
  blocks,
}: CmsPageShellProps) {
  return (
    <article className="pb-16 w-full">
      <div className={`mx-auto w-full px-6 sm:px-12 ${PAGE_WIDTH_CLASSES[pageWidth]}`}>
        {showBackLink ? <CmsBackLink label={backLabel} href={backHref} /> : null}
      </div>
      <CmsBlockRenderer blocks={blocks} pageWidth={pageWidth} pageTitle={title} />
    </article>
  );
}
