#!/usr/bin/env node

/**
 * Extract stem-width metrics from Strawford and Knile OTF files.
 * Outputs src/config/font-metrics.json and updates src/config/icon-weights.ts.
 */

import * as fontkit from "fontkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800];
const WEIGHT_NAMES = {
  100: "Thin",
  200: "ExtraLight",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "SemiBold",
  700: "Bold",
  800: "Black",
};

const FONT_FAMILIES = {
  sans: {
    label: "Strawford",
    files: {
      100: path.join(__dirname, "..", "src", "fonts", "Strawford-Thin.otf"),
      200: path.join(__dirname, "..", "src", "fonts", "Strawford-ExtraLight.otf"),
      300: path.join(__dirname, "..", "src", "fonts", "Strawford-Light.otf"),
      400: path.join(__dirname, "..", "src", "fonts", "Strawford-Regular.otf"),
      500: path.join(__dirname, "..", "src", "fonts", "Strawford-Medium.otf"),
      700: path.join(__dirname, "..", "src", "fonts", "Strawford-Bold.otf"),
      800: path.join(__dirname, "..", "src", "fonts", "Strawford-Black.otf"),
    },
  },
  deco: {
    label: "Knile",
    files: {
      100: path.join(__dirname, "..", "src", "fonts", "Knile-Thin.otf"),
      200: path.join(__dirname, "..", "src", "fonts", "Knile-ExtraLight.otf"),
      300: path.join(__dirname, "..", "src", "fonts", "Knile-Light.otf"),
      400: path.join(__dirname, "..", "src", "fonts", "Knile-Regular.otf"),
      500: path.join(__dirname, "..", "src", "fonts", "Knile-Medium.otf"),
      600: path.join(__dirname, "..", "src", "fonts", "Knile-SemiBold.otf"),
      700: path.join(__dirname, "..", "src", "fonts", "Knile-Bold.otf"),
      800: path.join(__dirname, "..", "src", "fonts", "Knile-Black.otf"),
    },
  },
};

function estimateFromMetrics(glyph) {
  if (!glyph?.bbox) return null;
  return glyph.bbox.maxX - glyph.bbox.minX;
}

function measureFromSVGPath(glyph) {
  if (!glyph?.path) return null;
  try {
    const svgPath = glyph.path.toSVG();
    const allCoords = [];
    const regex = /([MLHVCSQTA])([^MLHVCSQTAZ]*)/gi;
    let match;
    while ((match = regex.exec(svgPath)) !== null) {
      const cmd = match[1].toUpperCase();
      const args = match[2].trim().split(/[\s,]+/).filter(Boolean).map(Number);
      switch (cmd) {
        case "M":
        case "L":
          for (let i = 0; i < args.length; i += 2) allCoords.push(args[i]);
          break;
        case "H":
          allCoords.push(args[0]);
          break;
        case "C":
          for (let i = 0; i < args.length; i += 6) allCoords.push(args[i], args[i + 2], args[i + 4]);
          break;
        case "Q":
          for (let i = 0; i < args.length; i += 4) allCoords.push(args[i], args[i + 2]);
          break;
      }
    }
    if (allCoords.length < 4) return null;
    const sorted = [...new Set(allCoords.map((x) => Math.round(x)))].sort((a, b) => a - b);
    const gaps = [];
    for (let i = 1; i < sorted.length; i++) {
      const gap = sorted[i] - sorted[i - 1];
      if (gap > 2) gaps.push(gap);
    }
    if (!gaps.length) return null;
    gaps.sort((a, b) => a - b);
    return gaps[0];
  } catch {
    return null;
  }
}

function measureWeight(fontPath, weight) {
  if (!fs.existsSync(fontPath)) {
    throw new Error(`Font file not found: ${fontPath}`);
  }
  const font = fontkit.openSync(fontPath);
  const unitsPerEm = font.unitsPerEm;
  const testChars = ["l", "I", "i", "H", "n"];
  const measurements = [];

  for (const char of testChars) {
    try {
      const glyph = font.glyphForCodePoint(char.charCodeAt(0));
      const pathWidth = measureFromSVGPath(glyph);
      const metricsWidth = estimateFromMetrics(glyph);
      const isSimpleStem = ["l", "I", "i"].includes(char);
      const finalWidth = isSimpleStem ? metricsWidth : pathWidth;
      if (finalWidth && finalWidth > 0) {
        measurements.push({ char, width: finalWidth, isSimpleStem });
      }
    } catch {
      // skip glyph
    }
  }

  const simple = measurements.filter((m) => m.isSimpleStem);
  const stemWidth =
    simple.length > 0 ? simple.reduce((sum, m) => sum + m.width, 0) / simple.length : null;
  const percentage = stemWidth ? (stemWidth / unitsPerEm) * 100 : null;
  const strokeFor32px = stemWidth ? (stemWidth / unitsPerEm) * 32 : null;

  return {
    weight,
    weightName: WEIGHT_NAMES[weight],
    fontFamily: font.familyName,
    unitsPerEm,
    stemWidth: stemWidth ? Math.round(stemWidth * 10) / 10 : null,
    percentage: percentage ? Math.round(percentage * 100) / 100 : null,
    strokeFor32pxViewBox: strokeFor32px ? Math.round(strokeFor32px * 100) / 100 : null,
    rawMeasurements: measurements.map((m) => ({
      char: m.char,
      width: Math.round(m.width),
      isSimpleStem: m.isSimpleStem,
    })),
  };
}

function measureFamily(familyKey, familyConfig) {
  console.log(`\n${"=".repeat(70)}\n${familyConfig.label} (${familyKey})\n`);
  const weights = {};
  const strokeWidths = {};

  for (const weight of WEIGHTS) {
    const filePath = familyConfig.files[weight];
    if (!filePath || !fs.existsSync(filePath)) {
      console.log(`  ${weight} (${WEIGHT_NAMES[weight]}): skipped — no font file`);
      continue;
    }
    const result = measureWeight(filePath, weight);
    weights[weight] = result;
    strokeWidths[weight] = result.strokeFor32pxViewBox ?? 2;
    console.log(
      `  ${weight} (${result.weightName}): stem=${result.stemWidth ?? "N/A"} → stroke@32=${result.strokeFor32pxViewBox ?? "N/A"}px`,
    );
  }

  return { label: familyConfig.label, weights, strokeWidths };
}

function writeOutputs(results) {
  const outputDir = path.join(__dirname, "..", "src", "config");
  const generatedAt = new Date().toISOString();

  const fontMetrics = {
    generatedAt,
    note: "Visible width approximations from l/I/i stems. Fine-tune at /design-system/icon-calibration.",
    families: results,
  };
  fs.writeFileSync(path.join(outputDir, "font-metrics.json"), JSON.stringify(fontMetrics, null, 2));

  const sansAnchors = [300, 500, 700].map((w) => `    ${w}: ${results.sans.strokeWidths[w]?.toFixed(2) ?? "N/A"}`).join("\n");
  const decoAnchors = [300, 500, 700].map((w) => `    ${w}: ${results.deco.strokeWidths[w]?.toFixed(2) ?? "N/A"}`).join("\n");

  console.log(`\n✅ Wrote src/config/font-metrics.json`);
  console.log(`\nPer-weight stroke seeds (32×32 viewBox) — fine-tune at /design-system/icon-calibration:\n`);
  for (const key of ["sans", "deco"]) {
    const lines = WEIGHTS.map((w) => `    ${w}: ${results[key].strokeWidths[w]?.toFixed(2) ?? "N/A"}`).join("\n");
    console.log(`  ${key}:\n${lines}\n`);
  }
  console.log(`  Does NOT overwrite src/config/icon-weights.ts — paste exported values after visual calibration.`);
}

function main() {
  console.log("📊 Portfolio icon metrics extraction\n");
  const results = {};
  for (const [key, config] of Object.entries(FONT_FAMILIES)) {
    results[key] = measureFamily(key, config);
  }
  writeOutputs(results);
}

main();
