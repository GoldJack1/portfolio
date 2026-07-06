import sitePagesData from "@/data/site-pages.json";
import type { CmsSitePage } from "./types";

type SitePageRoute = CmsSitePage["route"];

const SITE_PAGES = sitePagesData as Partial<Record<SitePageRoute, CmsSitePage>>;

export function getSitePage(route: SitePageRoute): CmsSitePage | null {
  return SITE_PAGES[route] ?? null;
}
