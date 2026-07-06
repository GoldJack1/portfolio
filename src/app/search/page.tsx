import { Suspense } from "react";
import SearchPageClient from "./SearchPageClient";

import { createPageMetadata } from "@/lib/site-metadata";
import { getSearchPageMeta } from "@/lib/site-settings";

const searchMeta = getSearchPageMeta();

export const metadata = createPageMetadata(searchMeta.title, {
  description: searchMeta.description,
});

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageClient />
    </Suspense>
  );
}
