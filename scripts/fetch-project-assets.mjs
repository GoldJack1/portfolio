#!/usr/bin/env node
/**
 * One-off script: download project assets from jackwingate.co.uk and myportfolio.
 * Run: node scripts/fetch-project-assets.mjs
 */

import { mkdir, writeFile, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public", "projects");

const MYPORTFOLIO = [
  { slug: "receipty", path: "a-app-for-good-receipty" },
  { slug: "sheffield-tram-train", path: "reimagined-map-of-the-tram-train-network-in-sheffield" },
  { slug: "diabetes-support-advert", path: "social-media-advert-promoteing-a-diabetes-support-app" },
  { slug: "northern-rail", path: "northern-englands-rail-are-30-years-behind-the-south" },
  { slug: "leeds-corn-exchange", path: "idenity-advertisement-animation-on-leeds-corn-exchange" },
];

const COVER_UUIDS = {
  receipty: "c3f4b448-e4f6-4ea8-97f2-e55dd039d0b2",
  "sheffield-tram-train": "63e8a22e-5eaf-402c-a0df-5df3f1727d79",
  "diabetes-support-advert": "7e8fe304-6a10-47c5-8e5e-f879ec5a6a5b",
  "northern-rail": "d6c00cb8-494c-44d9-bf80-8246b8d82389",
  "leeds-corn-exchange": "390a0898-ee99-4481-806d-33cf9eeaab5f",
};

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, buf);
  console.log(`  saved ${path.relative(ROOT, dest)} (${(buf.length / 1024).toFixed(1)} KB)`);
}

function scoreUrl(url) {
  if (url.includes("_rw_3840")) return 5;
  if (url.includes("_rw_1920")) return 4;
  if (url.includes("_rw_1200")) return 3;
  if (url.includes("_carw_4x3x1920")) return 4;
  if (url.includes("_carw_4x3x1280")) return 3;
  if (url.includes("_rw_600")) return 2;
  if (!/_rw_|_carw_/.test(url)) return 3;
  return 1;
}

function extFromUrl(url) {
  const m = url.match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i);
  return m ? m[1].toLowerCase() === "jpeg" ? "jpg" : m[1].toLowerCase() : "jpg";
}

async function scrapeMyportfolio(slug, pagePath) {
  const html = await (await fetch(`https://jackawingate.myportfolio.com/${pagePath}`)).text();
  const urls = [...new Set(html.match(/https:\/\/cdn\.myportfolio\.com\/[^"'\s]+/g) ?? [])];
  const byUuid = new Map();

  for (const url of urls) {
    if (url.includes(".css")) continue;
    const m = url.match(/\/([0-9a-f-]{36})(?:_(?:rw_\d+|carw_[^/]+|rwc_[^/]+))?\.(jpg|jpeg|png|webp|gif)/i);
    if (!m) continue;
    const uuid = m[1];
    const score = scoreUrl(url);
    const prev = byUuid.get(uuid);
    if (!prev || score > prev.score) byUuid.set(uuid, { url, score, ext: extFromUrl(url) });
  }

  const coverUuid = COVER_UUIDS[slug];
  const entries = [...byUuid.entries()].sort((a, b) => {
    if (a[0] === coverUuid) return -1;
    if (b[0] === coverUuid) return 1;
    return 0;
  });

  const dir = path.join(PUBLIC, slug);
  const gallery = [];
  let i = 1;
  for (const [, { url, ext }] of entries) {
    const name = `gallery/${String(i).padStart(2, "0")}.${ext}`;
    await download(url, path.join(dir, name));
    gallery.push(`/projects/${slug}/${name}`);
    i++;
  }

  if (gallery.length > 0) {
    const thumbExt = gallery[0].split(".").pop();
    const thumbPath = path.join(dir, `thumbnail.${thumbExt}`);
    await copyFile(path.join(dir, gallery[0].replace(`/projects/${slug}/`, "")), thumbPath);
    return { thumbnail: `/projects/${slug}/thumbnail.${thumbExt}`, gallery };
  }
  return { thumbnail: "", gallery: [] };
}

async function fetchJackwingate() {
  console.log("\n=== jackwingate.co.uk ===");

  await download(
    "https://jackwingate.co.uk/assets/Project%201-BGMSB3te.jpg",
    path.join(PUBLIC, "great-british-railways", "thumbnail.jpg")
  );

  const pdfApi =
    "https://firebasestorage.googleapis.com/v0/b/portfoliojw26.firebasestorage.app/o/" +
    encodeURIComponent("Projects/GBR/Final Outcome PDF Compressed.pdf") +
    "?alt=media";
  try {
    await download(pdfApi, path.join(PUBLIC, "great-british-railways", "gbr-outcome.pdf"));
  } catch (e) {
    console.warn("  PDF download failed:", e.message);
  }

  await download(
    "https://jackwingate.co.uk/assets/Project%202-B9y_6kbg.jpg",
    path.join(PUBLIC, "rail-statistics", "thumbnail.jpg")
  );

  await download(
    "https://jackwingate.co.uk/assets/Project%203-G-IKE0gZ.mp4",
    path.join(PUBLIC, "webtext", "thumbnail.mp4")
  );
}

async function main() {
  await mkdir(PUBLIC, { recursive: true });
  await fetchJackwingate();

  console.log("\n=== myportfolio ===");
  const manifest = {};
  for (const { slug, path: pagePath } of MYPORTFOLIO) {
    console.log(`\n${slug}:`);
    manifest[slug] = await scrapeMyportfolio(slug, pagePath);
  }

  manifest["great-british-railways"] = {
    thumbnail: "/projects/great-british-railways/thumbnail.jpg",
    gallery: [],
    pdf: "/projects/great-british-railways/gbr-outcome.pdf",
  };
  manifest["rail-statistics"] = {
    thumbnail: "/projects/rail-statistics/thumbnail.jpg",
    gallery: [],
  };
  manifest.webtext = {
    thumbnail: "/projects/webtext/thumbnail.mp4",
    gallery: [],
    video: "/projects/webtext/thumbnail.mp4",
  };

  await writeFile(
    path.join(PUBLIC, "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
  console.log("\nDone. Wrote public/projects/manifest.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
