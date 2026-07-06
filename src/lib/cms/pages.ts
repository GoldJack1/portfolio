import fs from "fs";
import path from "path";
import type { CmsPage, CmsSiteSettings } from "./types";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const PAGES_DIR = path.join(CONTENT_ROOT, "pages");
const SITE_SETTINGS_PATH = path.join(CONTENT_ROOT, "site", "settings.json");

function readJsonFile<T>(filePath: string): T | null {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function getAllCmsPages(): CmsPage[] {
  if (!fs.existsSync(PAGES_DIR)) return [];

  return fs
    .readdirSync(PAGES_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => readJsonFile<CmsPage>(path.join(PAGES_DIR, file)))
    .filter((page): page is CmsPage => Boolean(page?.slug && page?.title))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getCmsPage(slug: string): CmsPage | undefined {
  const filePath = path.join(PAGES_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return undefined;
  return readJsonFile<CmsPage>(filePath) ?? undefined;
}

export function getCmsNavPages(): CmsPage[] {
  return getAllCmsPages().filter((page) => page.showInNav);
}

export function getSiteSettings(): CmsSiteSettings {
  return readJsonFile<CmsSiteSettings>(SITE_SETTINGS_PATH) ?? {};
}
