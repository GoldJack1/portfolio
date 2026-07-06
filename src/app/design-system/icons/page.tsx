"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Icon, { getStrokeIconNames, type StrokeIconName } from "@/components/ui/icon";
import {
  getStrokeWidth,
  ICON_WEIGHTS,
  WEIGHT_NAMES,
  type IconFont,
} from "@/config/icon-weights";

const STATIC_ICON_NAMES = new Set<StrokeIconName>([
  "star",
  "info-circle",
  "help-circle",
  "controls",
]);

const FONT_TABS: { id: IconFont; label: string; className: string }[] = [
  { id: "sans", label: "Strawford", className: "font-sans" },
  { id: "deco", label: "Knile", className: "font-deco" },
];

function formatIconName(key: string): string {
  return key
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function ControlSlider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  display,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  display: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm text-muted">{label}</label>
        <span className="text-sm text-foreground tabular-nums">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-2 w-full cursor-pointer accent-foreground"
      />
    </div>
  );
}

function IconGrid({
  title,
  description,
  iconNames,
  font,
  weight,
  size,
  strokeWidth,
  fontClassName,
}: {
  title: string;
  description: string;
  iconNames: StrokeIconName[];
  font: IconFont;
  weight: number;
  size: number;
  strokeWidth?: number;
  fontClassName: string;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-deco text-xl font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {iconNames.map((iconName) => (
          <div
            key={`${iconName}-${font}-${weight}-${size}-${strokeWidth ?? "auto"}`}
            className="flex flex-col items-center justify-center rounded-xl border border-border bg-background p-4 transition-colors hover:bg-surface"
          >
            <div
              className={`mb-2 flex items-center justify-center text-foreground ${fontClassName}`}
              style={{ width: size, height: size }}
            >
              <Icon
                name={iconName}
                font={font}
                weight={weight}
                size={size}
                strokeWidth={strokeWidth}
              />
            </div>
            <span className="text-center text-xs text-muted">{formatIconName(iconName)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function IconsPage() {
  const [font, setFont] = useState<IconFont>("sans");
  const [weight, setWeight] = useState(500);
  const [size, setSize] = useState(24);
  const [useCustomStroke, setUseCustomStroke] = useState(false);
  const [customStroke, setCustomStroke] = useState(() => getStrokeWidth("sans", 500));

  const activeTab = FONT_TABS.find((tab) => tab.id === font)!;
  const computedStroke = getStrokeWidth(font, weight);
  const effectiveStroke = useCustomStroke ? customStroke : undefined;

  const { staticIcons, dynamicIcons } = useMemo(() => {
    const all = getStrokeIconNames();
    const staticIcons = all.filter((name) => STATIC_ICON_NAMES.has(name));
    const dynamicIcons = all.filter((name) => !STATIC_ICON_NAMES.has(name));
    return { staticIcons, dynamicIcons };
  }, []);

  return (
    <div className="min-h-screen bg-background px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-deco text-3xl font-bold text-foreground">Icons</h1>
            <p className="mt-2 text-muted">
              Browse all stroke-based icons and preview size, weight, and stroke settings.
            </p>
          </div>
          <Link
            href="/design-system/icon-calibration"
            className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-surface"
          >
            Stroke calibration →
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="mb-6 flex flex-wrap gap-2">
            {FONT_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setFont(tab.id);
                  if (!useCustomStroke) {
                    setCustomStroke(getStrokeWidth(tab.id, weight));
                  }
                }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  font === tab.id
                    ? "bg-foreground text-background"
                    : "border border-border text-foreground hover:bg-background"
                } ${tab.className}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mb-6 space-y-4">
            <ControlSlider
              label="Font weight"
              min={100}
              max={800}
              step={1}
              value={weight}
              onChange={(w) => {
                setWeight(w);
                if (!useCustomStroke) setCustomStroke(getStrokeWidth(font, w));
              }}
              display={`${weight} (${WEIGHT_NAMES[weight as keyof typeof WEIGHT_NAMES] ?? "Custom"})`}
            />
            <div className="flex flex-wrap gap-2">
              {ICON_WEIGHTS.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => {
                    setWeight(w);
                    if (!useCustomStroke) setCustomStroke(getStrokeWidth(font, w));
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                    weight === w
                      ? "bg-foreground text-background"
                      : "border border-border text-foreground hover:bg-background"
                  } ${activeTab.className}`}
                  style={{ fontWeight: w }}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ControlSlider
              label="Icon size"
              min={8}
              max={64}
              step={1}
              value={size}
              onChange={setSize}
              display={`${size}px`}
            />
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={useCustomStroke}
                  onChange={(e) => {
                    setUseCustomStroke(e.target.checked);
                    if (e.target.checked) {
                      setCustomStroke(computedStroke);
                    }
                  }}
                  className="accent-foreground"
                />
                Custom stroke override
              </label>
              {useCustomStroke ? (
                <ControlSlider
                  label="Stroke width (32×32 viewBox)"
                  min={0.1}
                  max={12}
                  step={0.05}
                  value={customStroke}
                  onChange={setCustomStroke}
                  display={customStroke.toFixed(2)}
                />
              ) : (
                <p className="text-sm text-muted">
                  Using interpolated stroke:{" "}
                  <span className="tabular-nums text-foreground">{computedStroke.toFixed(2)}</span>
                </p>
              )}
            </div>
          </div>

          <div
            className={`mt-6 flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-foreground ${activeTab.className}`}
            style={{ fontWeight: weight, fontSize: `${size}px`, lineHeight: 1 }}
          >
            <Icon
              name="plus"
              font={font}
              weight={weight}
              size={size}
              strokeWidth={effectiveStroke}
            />
            <span>Preview with adjacent text</span>
            <Icon
              name="star"
              font={font}
              weight={weight}
              size={size}
              strokeWidth={effectiveStroke}
            />
          </div>
        </div>

        <div className="mt-8 space-y-10 rounded-2xl border border-border bg-surface p-6">
          <IconGrid
            title="Dynamic stroke icons"
            description="Rendered from SVG path data with weight-based stroke scaling."
            iconNames={dynamicIcons}
            font={font}
            weight={weight}
            size={size}
            strokeWidth={effectiveStroke}
            fontClassName={activeTab.className}
          />
          <IconGrid
            title="Static icons"
            description="Pre-generated SVG assets remapped to match calibrated Strawford/Knile stroke weights."
            iconNames={staticIcons}
            font={font}
            weight={weight}
            size={size}
            strokeWidth={effectiveStroke}
            fontClassName={activeTab.className}
          />
        </div>
      </div>
    </div>
  );
}
