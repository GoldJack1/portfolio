import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sitePagesDir = path.join(__dirname, "..", "content", "site-pages");
const outFile = path.join(__dirname, "..", "src", "data", "site-pages.json");

const ROUTE_FILES = {
  home: "home.json",
  about: "about.json",
  projects: "projects.json",
  contact: "contact.json",
};

function loadSitePages() {
  const pages = {};

  for (const [route, file] of Object.entries(ROUTE_FILES)) {
    const filePath = path.join(sitePagesDir, file);
    if (fs.existsSync(filePath)) {
      pages[route] = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
  }

  return pages;
}

const pages = loadSitePages();
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, `${JSON.stringify(pages, null, 2)}\n`);
console.log(`Synced ${Object.keys(pages).length} site pages → src/data/site-pages.json`);
