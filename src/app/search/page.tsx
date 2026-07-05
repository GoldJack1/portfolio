import { Suspense } from "react";
import SearchPageClient from "./SearchPageClient";

export const metadata = { title: "Search | Portfolio" };

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageClient />
    </Suspense>
  );
}
