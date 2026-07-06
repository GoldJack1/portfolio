"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import {
  ICON_ANCHOR_WEIGHTS,
  strokeWidths as extractedStrokeWidths,
  WEIGHT_NAMES,
  type AnchorWeight,
  type IconFont,
} from "@/config/icon-weights";

const WEIGHT_NAMES_ANCHOR: Record<AnchorWeight, string> = {
  300: WEIGHT_NAMES[300],
  500: WEIGHT_NAMES[500],
  700: WEIGHT_NAMES[700],
};

const FONT_TABS: { id: IconFont; label: string; className: string }[] = [
  { id: "sans", label: "Strawford", className: "font-sans" },
  { id: "deco", label: "Knile", className: "font-deco" },
];

const sampleText = "Hamburger";

const iconPaths = {
  cross: "M6,6 L26,26 M26,6 L6,26",
  plus: "M16,6 L16,26 M6,16 L26,16",
  minus: "M6,16 L26,16",
};

function IconPreview({
  path,
  strokeWidth,
  size,
}: {
  path: string;
  strokeWidth: number;
  size: number;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className="inline-block shrink-0 align-middle"
      style={{ verticalAlign: "middle", marginTop: "-0.1em" }}
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WeightRow({
  weight,
  strokeWidth,
  onStrokeChange,
  fontSize,
  fontClassName,
}: {
  weight: AnchorWeight;
  strokeWidth: number;
  onStrokeChange: (weight: AnchorWeight, value: number) => void;
  fontSize: number;
  fontClassName: string;
}) {
  const iconSize = fontSize;

  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-border py-4">
      <div className="w-28 shrink-0">
        <span className="text-sm text-muted">{weight}</span>
        <span className="ml-2 text-xs text-muted">{WEIGHT_NAMES_ANCHOR[weight]}</span>
      </div>
      <div
        className={`w-44 shrink-0 text-foreground ${fontClassName}`}
        style={{ fontWeight: weight, fontSize: `${fontSize}px`, lineHeight: 1 }}
      >
        {sampleText}
      </div>
      <div
        className="flex w-28 shrink-0 items-center justify-center gap-2 text-foreground"
        style={{ fontSize: `${fontSize}px`, lineHeight: 1 }}
      >
        <IconPreview path={iconPaths.plus} strokeWidth={strokeWidth} size={iconSize} />
        <IconPreview path={iconPaths.cross} strokeWidth={strokeWidth} size={iconSize} />
        <IconPreview path={iconPaths.minus} strokeWidth={strokeWidth} size={iconSize} />
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
      </div>
    </div>
  );
}

export default function IconCalibrationPage() {
  const [activeFont, setActiveFont] = useState<IconFont>("sans");
  const [strokeWidthValues, setStrokeWidthValues] = useState<
    Record<IconFont, Record<AnchorWeight, number>>
  >(() => ({
    sans: { ...extractedStrokeWidths.sans },
    deco: { ...extractedStrokeWidths.deco },
  }));
  const [fontSize, setFontSize] = useState(24);
  const [copied, setCopied] = useState(false);

  const activeTab = FONT_TABS.find((t) => t.id === activeFont)!;
  const currentValues = strokeWidthValues[activeFont];

  const handleStrokeChange = useCallback((font: IconFont, weight: AnchorWeight, value: number) => {
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

  const exportValues = useCallback(() => {
    const sans = strokeWidthValues.sans;
    const deco = strokeWidthValues.deco;
    const tsCode = `export const strokeWidths: Record<IconFont, Record<AnchorWeight, number>> = {
  sans: {
    300: ${sans[300].toFixed(2)},
    500: ${sans[500].toFixed(2)},
    700: ${sans[700].toFixed(2)},
  },
  deco: {
    300: ${deco[300].toFixed(2)},
    500: ${deco[500].toFixed(2)},
    700: ${deco[700].toFixed(2)},
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
              Adjust stroke width per font weight until icons visually match text thickness.
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
          <div className="flex flex-wrap items-center gap-6">
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
          {ICON_ANCHOR_WEIGHTS.map((weight) => (
            <WeightRow
              key={weight}
              weight={weight}
              strokeWidth={currentValues[weight]}
              onStrokeChange={(w, v) => handleStrokeChange(activeFont, w, v)}
              fontSize={fontSize}
              fontClassName={activeTab.className}
            />
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-deco text-xl font-semibold text-foreground">In-context preview</h2>
          <div className="mt-4 space-y-3">
            {ICON_ANCHOR_WEIGHTS.map((weight) => (
              <div
                key={weight}
                className={`flex items-center gap-2 text-foreground ${activeTab.className}`}
                style={{ fontWeight: weight, fontSize: `${fontSize}px`, lineHeight: 1.2 }}
              >
                <span className="inline-flex items-center gap-1.5">
                  <IconPreview
                    path={iconPaths.plus}
                    strokeWidth={currentValues[weight]}
                    size={fontSize}
                  />
                  <span>Add item</span>
                </span>
                <span className="mx-3 text-muted">|</span>
                <span className="inline-flex items-center gap-1.5">
                  <IconPreview
                    path={iconPaths.cross}
                    strokeWidth={currentValues[weight]}
                    size={fontSize}
                  />
                  <span>Close</span>
                </span>
                <span className="ml-auto text-xs text-muted">
                  {weight} ({WEIGHT_NAMES_ANCHOR[weight]})
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-sm text-muted">
          Paste exported values into{" "}
          <code className="rounded bg-surface px-1">src/config/icon-weights.ts</code>, then regenerate
          static SVGs via the Illustrator script with matching stroke tables.
        </p>
      </div>
    </div>
  );
}
