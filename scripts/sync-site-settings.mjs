import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const settingsFile = path.join(__dirname, "..", "content", "site", "settings.json");
const outFile = path.join(__dirname, "..", "src", "data", "site-settings.json");

const defaults = {
  siteName: "Jack Wingate",
  siteDescription:
    "Graphic & UI/UX designer — brands, interfaces, and digital products. Transport, wayfinding, and realism-led design from West Yorkshire.",
  contactEmail: "wingatejack2021@gmail.com",
  contactPhone: "(UK) +44 7943 002619",
  contactFormEmail: "wingatejack2021@gmail.com",
  footerRightsText: "All rights reserved.",
  socialLinks: [
    { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/jackwingate2023/" },
    { id: "x", label: "X", href: "https://x.com/jackrailsecrets" },
    { id: "instagram", label: "Instagram", href: "https://www.instagram.com/jackawingate/" },
    { id: "youtube", label: "YouTube", href: "https://www.youtube.com/@RailwaySecrets" },
    { id: "bluesky", label: "Bluesky", href: "https://bsky.app/profile/jackrailsecrets.bsky.social" },
    { id: "threads", label: "Threads", href: "https://www.threads.com/@jackawingate" },
  ],
  navItems: [
    { id: "home", label: "Home", href: "/", visible: true },
    { id: "projects", label: "Projects", href: "/projects", visible: true },
    { id: "about", label: "About", href: "/about", visible: true },
    { id: "contact", label: "Contact", href: "/contact", visible: true },
  ],
  searchPageTitle: "Search",
  searchPageDescription: "Search projects and pages on Jack Wingate's portfolio.",
  notFoundTitle: "Page not found",
  notFoundBody: "The page you're looking for doesn't exist or may have moved.",
  notFoundCtaLabel: "Back home",
  notFoundCtaHref: "/",
  extraNav: [],
};

function loadSettings() {
  if (!fs.existsSync(settingsFile)) return defaults;
  const file = JSON.parse(fs.readFileSync(settingsFile, "utf8"));
  return { ...defaults, ...file };
}

const settings = loadSettings();
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, `${JSON.stringify(settings, null, 2)}\n`);
console.log("Synced site settings → src/data/site-settings.json");
