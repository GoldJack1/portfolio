import { Suspense } from "react";
import SearchPageClient from "./SearchPageClient";

import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata("Search", "Search projects and pages on Jack Wingate's portfolio.");

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageClient />
    </Suspense>
  );
}
