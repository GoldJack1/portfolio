"use client";

import { useEffect, useState } from "react";
import CmsPageShell from "@/components/cms/cms-page-shell";
import type { CmsBlock, CmsPageSettings } from "@/lib/cms/types";

type PreviewPayload = CmsPageSettings & {
  blocks?: CmsBlock[];
};

export default function CmsPreviewPage() {
  const [page, setPage] = useState<PreviewPayload | null>(null);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.data?.type !== "cms-preview") return;
      setPage(event.data.payload as PreviewPayload);
    }

    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: "cms-preview-ready" }, "*");

    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!page?.blocks?.length) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-6 text-center text-muted">
        <p>Live preview will appear here as you edit.</p>
      </div>
    );
  }

  return <CmsPageShell {...page} blocks={page.blocks} />;
}
