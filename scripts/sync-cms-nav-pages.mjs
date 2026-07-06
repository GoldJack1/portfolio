import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(__dirname, "..", "content", "pages");
const outFile = path.join(__dirname, "..", "src", "data", "cms-nav-pages.json");

function loadNavPages() {
  if (!fs.existsSync(pagesDir)) return [];

  return fs
    .readdirSync(pagesDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(fs.readFileSync(path.join(pagesDir, file), "utf8")))
    .filter((page) => page?.slug && page?.title)
    .map((page) => ({
      slug: page.slug,
      title: page.title,
      navLabel: page.navLabel,
      showInNav: page.showInNav,
    }));
}

const pages = loadNavPages();
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, `${JSON.stringify(pages, null, 2)}\n`);
console.log(`Synced ${pages.length} CMS nav pages → src/data/cms-nav-pages.json`);
