"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import Icon from "@/components/ui/icon";
import {
  ICON_ANCHOR_WEIGHTS,
  ICON_WEIGHTS,
  strokeWidths as calibratedStrokeWidths,
  WEIGHT_NAMES,
  type IconFont,
  type IconWeight,
} from "@/config/icon-weights";
import { extractedAt, extractedStrokeWidths } from "@/lib/icons/extracted-stroke-seeds";

const FONT_TABS: { id: IconFont; label: string; className: string }[] = [
  { id: "sans", label: "Strawford", className: "font-sans" },
  { id: "deco", label: "Knile", className: "font-deco" },
];

const sampleText = "Hamburger";

function WeightRow({
  weight,
  strokeWidth,
  extractedStroke,
  onStrokeChange,
  fontSize,
  fontClassName,
  font,
  hasStaticAsset,
}: {
  weight: IconWeight;
  strokeWidth: number;
  extractedStroke: number;
  onStrokeChange: (weight: IconWeight, value: number) => void;
  fontSize: number;
  fontClassName: string;
  font: IconFont;
  hasStaticAsset: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-border py-4">
      <div className="w-28 shrink-0">
        <span className="text-sm text-foreground">{weight}</span>
        <span className="ml-2 text-xs text-muted">{WEIGHT_NAMES[weight]}</span>
        {hasStaticAsset ? (
          <span className="mt-0.5 block text-[10px] uppercase tracking-wide text-muted">Static SVG</span>
        ) : null}
      </div>
      <div
        className={`w-44 shrink-0 text-foreground ${fontClassName}`}
        style={{ fontWeight: weight, fontSize: `${fontSize}px`, lineHeight: 1 }}
      >
        {sampleText}
      </div>
      <div
        className={`flex w-28 shrink-0 items-center justify-center gap-2 text-foreground ${fontClassName}`}
        style={{ fontSize: `${fontSize}px`, lineHeight: 1, fontWeight: weight }}
      >
        <Icon name="plus" font={font} weight={weight} strokeWidth={strokeWidth} size={fontSize} />
        <Icon name="cross" font={font} weight={weight} strokeWidth={strokeWidth} size={fontSize} />
        <Icon name="minus" font={font} weight={weight} strokeWidth={strokeWidth} size={fontSize} />
      </div>
      <div className="flex min-w-[200px] flex-1 items-center gap-3">
        <input
          type="range"
          min="0.1"
          max="12"
          step="0.05"
          value={strokeWidth}
          onChange={(e) => onStrokeChange(weight, parseFloat(e.target.value))}
          className="h-2 flex-1 cursor-pointer accent-foreground"
        />
        <input
          type="number"
          min="0.1"
          max="12"
          step="0.05"
          value={strokeWidth.toFixed(2)}
          onChange={(e) => onStrokeChange(weight, parseFloat(e.target.value) || 0.1)}
          className="w-20 rounded border border-border bg-surface px-2 py-1 text-center text-sm text-foreground"
        />
        <button
          type="button"
          title="Apply extracted seed for this weight"
          onClick={() => onStrokeChange(weight, extractedStroke)}
          className="shrink-0 rounded border border-border px-2 py-1 text-xs text-muted hover:bg-background hover:text-foreground"
        >
          Seed {extractedStroke.toFixed(2)}
        </button>
      </div>
    </div>
  );
}

function formatStrokeBlock(font: IconFont, values: Record<IconWeight, number>): string {
  return ICON_WEIGHTS.map((w) => `    ${w}: ${values[w].toFixed(2)},`).join("\n");
}

export default function IconCalibrationPage() {
  const [activeFont, setActiveFont] = useState<IconFont>("sans");
  const [strokeWidthValues, setStrokeWidthValues] = useState<
    Record<IconFont, Record<IconWeight, number>>
  >(() => ({
    sans: { ...calibratedStrokeWidths.sans },
    deco: { ...calibratedStrokeWidths.deco },
  }));
  const [fontSize, setFontSize] = useState(24);
  const [copied, setCopied] = useState(false);

  const activeTab = FONT_TABS.find((t) => t.id === activeFont)!;
  const currentValues = strokeWidthValues[activeFont];
  const extractedValues = extractedStrokeWidths[activeFont];

  const handleStrokeChange = useCallback((font: IconFont, weight: IconWeight, value: number) => {
    setStrokeWidthValues((prev) => ({
      ...prev,
      [font]: {
        ...prev[font],
        [weight]: Math.max(0.1, Math.min(12, value)),
      },
    }));
  }, []);

  const resetToExtracted = useCallback((font: IconFont) => {
    setStrokeWidthValues((prev) => ({
      ...prev,
      [font]: { ...extractedStrokeWidths[font] },
    }));
  }, []);

  const resetToCalibrated = useCallback((font: IconFont) => {
    setStrokeWidthValues((prev) => ({
      ...prev,
      [font]: { ...calibratedStrokeWidths[font] },
    }));
  }, []);

  const applyAllExtracted = useCallback(() => {
    setStrokeWidthValues({
      sans: { ...extractedStrokeWidths.sans },
      deco: { ...extractedStrokeWidths.deco },
    });
  }, []);

  const exportValues = useCallback(() => {
    const sans = strokeWidthValues.sans;
    const deco = strokeWidthValues.deco;
    const tsCode = `export const strokeWidths: Record<IconFont, Record<IconWeight, number>> = {
  sans: {
${formatStrokeBlock("sans", sans)}
  },
  deco: {
${formatStrokeBlock("deco", deco)}
  },
};

export const baseStrokeWidths: Record<IconFont, number> = {
  sans: strokeWidths.sans[300],
  deco: strokeWidths.deco[300],
};`;

    navigator.clipboard.writeText(tsCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [strokeWidthValues]);

  return (
    <div className="min-h-screen bg-background px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-deco text-3xl font-bold text-foreground">Icon Stroke Calibration</h1>
            <p className="mt-2 text-muted">
              Set stroke width for each font weight (100–800) until icons match text thickness.
            </p>
            <p className="mt-1 text-xs text-muted">
              Extracted seeds from OTF metrics: {new Date(extractedAt).toLocaleString()} — run{" "}
              <code className="rounded bg-surface px-1">npm run extract-icon-metrics</code> to refresh.
            </p>
          </div>
          <Link
            href="/design-system/icons"
            className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-surface"
          >
            Icon browser →
          </Link>
        </div>

        <div className="mt-6 flex gap-2">
          {FONT_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFont(tab.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeFont === tab.id
                  ? "bg-foreground text-background"
                  : "border border-border text-foreground hover:bg-surface"
              } ${tab.className}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm text-muted">Font size</label>
              <input
                type="range"
                min="12"
                max="48"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                className="h-2 w-32 cursor-pointer accent-foreground"
              />
              <span className="w-12 text-foreground">{fontSize}px</span>
            </div>
            <button
              type="button"
              onClick={() => resetToExtracted(activeFont)}
              className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-background"
            >
              Reset {activeTab.label} to extracted
            </button>
            <button
              type="button"
              onClick={() => resetToCalibrated(activeFont)}
              className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-background"
            >
              Reset {activeTab.label} to saved
            </button>
            <button
              type="button"
              onClick={applyAllExtracted}
              className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-background"
            >
              Apply all extracted seeds
            </button>
            <button
              type="button"
              onClick={exportValues}
              className="ml-auto rounded-lg bg-foreground px-4 py-2 text-sm text-background"
            >
              {copied ? "Copied!" : "Export TypeScript"}
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center gap-4 border-b border-border pb-4 text-xs uppercase tracking-wider text-muted">
            <div className="w-28 shrink-0">Weight</div>
            <div className="w-44 shrink-0">Sample text</div>
            <div className="w-28 shrink-0">Icons</div>
            <div className="flex-1">Stroke (32×32 viewBox)</div>
          </div>
          {ICON_WEIGHTS.map((weight) => (
            <WeightRow
              key={weight}
              weight={weight}
              strokeWidth={currentValues[weight]}
              extractedStroke={extractedValues[weight]}
              onStrokeChange={(w, v) => handleStrokeChange(activeFont, w, v)}
              fontSize={fontSize}
              fontClassName={activeTab.className}
              font={activeFont}
              hasStaticAsset={ICON_ANCHOR_WEIGHTS.includes(weight as (typeof ICON_ANCHOR_WEIGHTS)[number])}
            />
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-deco text-xl font-semibold text-foreground">In-context preview</h2>
          <div className="mt-4 space-y-3">
            {ICON_WEIGHTS.map((weight) => (
              <div
                key={weight}
                className={`flex items-center gap-2 text-foreground ${activeTab.className}`}
                style={{ fontWeight: weight, fontSize: `${fontSize}px`, lineHeight: 1.2 }}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Icon
                    name="plus"
                    font={activeFont}
                    weight={weight}
                    strokeWidth={currentValues[weight]}
                    size={fontSize}
                  />
                  <span>Add item</span>
                </span>
                <span className="mx-3 text-muted">|</span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon
                    name="cross"
                    font={activeFont}
                    weight={weight}
                    strokeWidth={currentValues[weight]}
                    size={fontSize}
                  />
                  <span>Close</span>
                </span>
                <span className="ml-auto text-xs text-muted">
                  {weight} ({WEIGHT_NAMES[weight]})
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-sm text-muted">
          Paste exported values into{" "}
          <code className="rounded bg-surface px-1">src/config/icon-weights.ts</code>. Weights marked
          &quot;Static SVG&quot; have pre-baked assets at 300 / 500 / 700 — other weights use dynamic
          paths or runtime remapping.
        </p>
      </div>
    </div>
  );
}
