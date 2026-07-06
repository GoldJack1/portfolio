#!/usr/bin/env node

/**
 * Copy static icon SVGs from Refractored Site into portfolio public/icons/{sans,deco}/.
 * Filters to weights 300, 500, 700 only.
 *
 * Interim: copies Geologica-calibrated assets. Re-run Illustrator export with
 * Strawford/Knile stroke tables for production-quality assets.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_ROOT = path.join(
  __dirname,
  "..",
  "..",
  "cursor",
  "Refractored Site",
  "public",
  "icons",
);
const DEST_ROOT = path.join(__dirname, "..", "public", "icons");
const FAMILIES = ["star", "info-circle", "help-circle", "controls"];
const WEIGHTS = new Set([300, 500, 700]);
const FONT_KEYS = ["sans", "deco"];

function copyFamily(family, fontKey) {
  const sourceFamily = path.join(SOURCE_ROOT, family);
  const destFamily = path.join(DEST_ROOT, fontKey, family);
  if (!fs.existsSync(sourceFamily)) {
    console.warn(`  ⚠ Source missing: ${sourceFamily}`);
    return 0;
  }

  let copied = 0;
  for (const sizeDir of fs.readdirSync(sourceFamily)) {
    const sizePath = path.join(sourceFamily, sizeDir);
    if (!fs.statSync(sizePath).isDirectory()) continue;

    const destSizePath = path.join(destFamily, sizeDir);
    fs.mkdirSync(destSizePath, { recursive: true });

    for (const file of fs.readdirSync(sizePath)) {
      if (!file.endsWith(".svg")) continue;
      const weightMatch = file.match(/_(\d{3})_/);
      if (!weightMatch || !WEIGHTS.has(Number(weightMatch[1]))) continue;
      fs.copyFileSync(path.join(sizePath, file), path.join(destSizePath, file));
      copied++;
    }
  }
  return copied;
}

function main() {
  console.log("📦 Copying static icon assets...\n");
  if (!fs.existsSync(SOURCE_ROOT)) {
    console.error(`❌ Source not found: ${SOURCE_ROOT}`);
    process.exit(1);
  }

  let total = 0;
  for (const fontKey of FONT_KEYS) {
    console.log(`Font: ${fontKey}`);
    for (const family of FAMILIES) {
      const n = copyFamily(family, fontKey);
      console.log(`  ${family}: ${n} files`);
      total += n;
    }
  }
  console.log(`\n✅ Copied ${total} SVG files to public/icons/`);
  console.log("   Note: deco/ is a copy of sans/ until Knile-calibrated assets are generated.");
}

main();
