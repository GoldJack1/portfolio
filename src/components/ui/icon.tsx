"use client";

import { useEffect, useState } from "react";
import {
  getBaseStrokeWidth,
  getStrokeWidth,
  type AnchorWeight,
  type IconFont,
} from "@/config/icon-weights";
import {
  getClosestSize as getControlsClosestSize,
  getClosestWeight as getControlsClosestWeight,
  getControlsIconAssetPath,
} from "@/lib/icons/static-controls";
import {
  getClosestSize as getHelpCircleClosestSize,
  getClosestWeight as getHelpCircleClosestWeight,
  getHelpCircleIconAssetPath,
} from "@/lib/icons/static-help-circle";
import {
  getClosestSize as getInfoCircleClosestSize,
  getClosestWeight as getInfoCircleClosestWeight,
  getInfoCircleIconAssetPath,
} from "@/lib/icons/static-info-circle";
import {
  getClosestSize,
  getClosestWeight,
  getStarIconAssetPath,
} from "@/lib/icons/static-star";
import {
  parseViewBoxSize,
  remapStaticIconContent,
} from "@/lib/icons/remap-static-icon";

const VIEWBOX_SIZE = 32;

type IconPathData = {
  paths: string[];
  strokeLinejoin?: "round";
  rotate?: number;
  compound?: {
    outer: string[];
    inner: string[];
    outerSize?: number;
  };
};

const STATIC_ICONS = ["star", "info-circle", "help-circle", "controls"] as const;
type StaticIconName = (typeof STATIC_ICONS)[number];

const iconPaths: Record<string, IconPathData> = {
  star: { paths: [] },
  "info-circle": { paths: [] },
  "help-circle": { paths: [] },
  controls: { paths: [] },
  cross: {
    paths: ["M30.89,1.11L1.11,30.89", "M1.11,1.11l29.78,29.78"],
  },
  plus: {
    paths: ["M16,1.11v29.78", "M30.89,16H1.11"],
  },
  minus: {
    paths: ["M30.89,16H1.11"],
  },
  "chevron-left": {
    paths: [
      "M22.872,1.11l-12.711,12.434c-1.378,1.348-1.378,3.565,0,4.913l12.711,12.434",
    ],
    strokeLinejoin: "round",
  },
  "chevron-right": {
    paths: [
      "M9.128,1.11l12.711,12.434c1.378,1.348,1.378,3.565,0,4.913l-12.711,12.434",
    ],
    strokeLinejoin: "round",
  },
  "chevron-down": {
    paths: ["M1.11,9.13l12.44,12.72c1.34,1.37,3.56,1.37,4.9,0l12.44-12.72"],
    strokeLinejoin: "round",
  },
  "chevron-up": {
    paths: ["M1.11,22.87l12.44-12.72c1.34-1.37,3.56-1.37,4.9,0l12.44,12.72"],
    strokeLinejoin: "round",
  },
  checkmark: {
    paths: ["M3.27,19.63l9.19,10.47c1.11,1.27,3.17.95,3.85-.6L28.73,1.11"],
    strokeLinejoin: "round",
  },
  hamburger: {
    paths: ["M30.89,16H1.11", "M30.89,5.052H1.11", "M30.89,26.948H1.11"],
  },
  "circled-checkmark": {
    paths: [],
    compound: {
      outer: ["M 16,1.11 A 14.89,14.89 0 1,1 16,30.89 A 14.89,14.89 0 1,1 16,1.11"],
      inner: ["M10.54,17.56l3.94,4.49c.47.54,1.35.41,1.64-.25l5.33-12.18"],
      outerSize: 29.78,
    },
    strokeLinejoin: "round",
  },
  "circled-cross": {
    paths: [],
    compound: {
      outer: ["M 16,1.11 A 14.89,14.89 0 1,1 16,30.89 A 14.89,14.89 0 1,1 16,1.11"],
      inner: ["M22.38,9.62l-12.76,12.76", "M9.62,9.62l12.76,12.76"],
      outerSize: 29.78,
    },
    strokeLinejoin: "round",
  },
  search: {
    paths: [
      "M 11.18,1.11 A 10.06,10.06 0 1,1 11.18,21.23 A 10.06,10.06 0 1,1 11.18,1.11",
      "M18.99,19l11.89,11.89",
    ],
    strokeLinejoin: "round",
  },
  "arrow-down": {
    paths: [
      "M16.01,1.11v28.78",
      "M6,22.37l8.35,7.88c.9.85,2.39.85,3.29,0l8.35-7.88",
    ],
    strokeLinejoin: "round",
  },
  "arrow-left": {
    paths: [
      "M30.89,16.01H2.11",
      "M9.63,6L1.75,14.36c-.85.9-.85,2.39,0,3.29l7.88,8.35",
    ],
    strokeLinejoin: "round",
  },
  "arrow-right": {
    paths: [
      "M1.11,16.01h28.78",
      "M22.37,6l7.88,8.35c.85.9.85,2.39,0,3.29l-7.88,8.35",
    ],
    strokeLinejoin: "round",
  },
  "arrow-up": {
    paths: [
      "M16.01,30.89V2.11",
      "M6,9.63L14.36,1.75c.9-.85,2.39-.85,3.29,0l8.35,7.88",
    ],
    strokeLinejoin: "round",
  },
  download: {
    paths: [
      "M16,1.11v20.53",
      "M8.87,16.01l5.96,5.89c.64.61,1.7.61,2.35,0l5.96-5.89",
      "M30.88,16.01v8.88c0,3.31-2.69,6-6,6H7.12c-3.31,0-6-2.69-6-6v-8.88",
    ],
    strokeLinejoin: "round",
  },
  upload: {
    paths: [
      "M16,22.35V1.82",
      "M8.87,7.45L14.83,1.57c.64-.61,1.7-.61,2.35,0l5.96,5.89",
      "M30.88,16.01v8.88c0,3.31-2.69,6-6,6H7.12c-3.31,0-6-2.69-6-6v-8.88",
    ],
    strokeLinejoin: "round",
  },
  filter: {
    paths: [
      "M4.32,1.11h23.37c.92,0,1.66.74,1.66,1.66h0c0,1.03-.35,2.03-.99,2.83l-6.61,9.68c-.5.47-.78,1.1-.78,1.76v8.01c-.2,3.97-5.87,5.84-9.08,5.84-.87,0-.82-.98-.82-2.46v-11.39c0-.66-.28-1.29-.78-1.76L3.65,5.6c-.64-.8-1-1.8-1-2.83h0c0-.92.74-1.66,1.66-1.66Z",
    ],
    strokeLinejoin: "round",
  },
  link: {
    paths: [
      "M13.11,11.21c-2.5-.17-5.14.63-7.05,2.53l-2.12,2.12c-3.51,3.51-3.59,9.11-.18,12.52,2.94,2.94,7.51,3.28,10.96,1.08",
      "M18.89,20.79c2.5.17,5.14-.63,7.05-2.53l2.12-2.12c3.51-3.51,3.59-9.11.18-12.52-2.94-2.94-7.51-3.28-10.96-1.08",
      "M21.68,10.32L10.32,21.68",
    ],
    strokeLinejoin: "round",
  },
  refresh: {
    paths: [
      "M26.83,26.1c-2.71,2.92-6.58,4.74-10.88,4.74-8.2,0-14.85-6.65-14.85-14.85S7.76,1.15,15.96,1.15c5.53,0,10.35,3.02,12.91,7.51",
      "M21.89,10.31l6.74-.25c1.2,0,2.17-.97,2.17-2.17l.09-6.73",
    ],
    strokeLinejoin: "round",
    rotate: -45,
  },
  location: {
    paths: [
      "M15.84,18.43v10.19c0,2.48,3.4,3.16,4.36.87L30.71,4.25c.78-1.87-1.09-3.74-2.96-2.96L2.51,11.81c-2.29.95-1.6,4.36.87,4.36h10.19c1.25,0,2.27,1.01,2.27,2.27Z",
    ],
    strokeLinejoin: "round",
  },
  "sort-horizontal": {
    paths: [
      "M30.83,23.42H1.9",
      "M7.52,30.89l-5.89-6.24c-.64-.67-.64-1.78,0-2.46l5.89-6.24",
      "M1.17,8.57h28.93",
      "M24.48,16.05l5.89-6.24c.64-.67.64-1.78,0-2.46l-5.89-6.24",
    ],
    strokeLinejoin: "round",
  },
  "sort-vertical": {
    paths: [
      "M8.58,30.83V1.9",
      "M1.11,7.52L7.35,1.63c.67-.64,1.78-.64,2.46,0l6.24,5.89",
      "M23.43,1.17v28.93",
      "M15.95,24.48l6.24,5.89c.67.64,1.78.64,2.46,0l6.24-5.89",
    ],
    strokeLinejoin: "round",
  },
  sun: {
    paths: [
      "M 16,10 A 6,6 0 1,1 16,22 A 6,6 0 1,1 16,10",
      "M16,3V6",
      "M16,26V29",
      "M3,16H6",
      "M26,16H29",
      "M6.8,6.8L8.9,8.9",
      "M23.1,23.1L25.2,25.2",
      "M25.2,6.8L23.1,8.9",
      "M8.9,23.1L6.8,25.2",
    ],
    strokeLinejoin: "round",
  },
  moon: {
    paths: [
      "M26,19A11,11 0 1 1 13,6c-1,4 1,10 6,13 3,1.6 6,1.6 7,0z",
    ],
    strokeLinejoin: "round",
  },
};

function calculateScaleFactor(
  strokeWidth: number,
  baseStrokeWidth: number,
  inset = 0,
): number {
  const originalContentSize = VIEWBOX_SIZE - baseStrokeWidth;
  const availableSize = VIEWBOX_SIZE - strokeWidth - inset * 2;
  return availableSize / originalContentSize;
}

function calculateCompoundScaleFactor(
  strokeWidth: number,
  baseStrokeWidth: number,
  outerSize: number,
): number {
  const strokeIncrease = strokeWidth - baseStrokeWidth;
  if (strokeIncrease <= 0.001) return 1;
  const strokeIncreasePerSide = strokeIncrease / 2;
  const shrinkMultiplier = 5.6;
  const reductionRatio = (strokeIncreasePerSide / outerSize) * shrinkMultiplier;
  return Math.max(0.5, 1 - reductionRatio);
}

export type StrokeIconName = keyof typeof iconPaths | StaticIconName;

export interface IconProps {
  name: StrokeIconName;
  font?: IconFont;
  weight?: number;
  className?: string;
  size?: number | string;
  strokeWidth?: number;
  color?: string;
  inset?: number;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
}

type StaticIconProps = Omit<IconProps, "name" | "inset"> & {
  getAssetPath: (font: IconFont, size: number, weight: number) => string;
  getSize: (size: number) => number;
  getWeight: (weight: number) => AnchorWeight;
  label: string;
  preserveFillNone?: boolean;
};

function StaticFetchedIcon({
  font = "sans",
  weight = 500,
  className = "",
  size,
  color,
  strokeWidth: strokeOverride,
  getAssetPath,
  getSize,
  getWeight,
  label,
  preserveFillNone = false,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
}: StaticIconProps) {
  const sizeValue = size ?? 20;
  const sizeNum = typeof sizeValue === "number" ? sizeValue : 20;
  const closestSize = getSize(sizeNum);
  const closestWeight = getWeight(weight);
  const assetPath = getAssetPath(font, closestSize, closestWeight);

  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(assetPath)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
        return res.text();
      })
      .then((text) => {
        if (cancelled) return;
        let styledSvg = preserveFillNone
          ? text
              .replace(/fill="(?!none)[^"]*"/g, 'fill="currentColor"')
              .replace(/stroke="[^"]*"/g, 'stroke="currentColor"')
          : text
              .replace(/fill="[^"]*"/g, 'fill="currentColor"')
              .replace(/stroke="[^"]*"/g, 'stroke="currentColor"');
        styledSvg = styledSvg.replace(/<\?xml[^>]*\?>/g, "").replace(/<!--[\s\S]*?-->/g, "");
        setSvgContent(styledSvg);
      })
      .catch((err) => {
        if (!cancelled) console.error(`Failed to load ${label} icon: ${assetPath}`, err);
      });
    return () => {
      cancelled = true;
    };
  }, [assetPath, label, preserveFillNone]);

  const sizeStyle =
    typeof sizeValue === "number"
      ? { width: `${sizeValue}px`, height: `${sizeValue}px` }
      : { width: sizeValue, height: sizeValue };

  if (!svgContent) {
    return (
      <span
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          ...sizeStyle,
        }}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden ?? !ariaLabel}
        role={ariaLabel ? "img" : undefined}
      />
    );
  }

  const viewBoxMatch = svgContent.match(/viewBox=["']([^"']*)["']/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : `0 0 ${closestSize} ${closestSize}`;
  const innerContentMatch = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
  const rawInnerContent = innerContentMatch ? innerContentMatch[1] : "";
  if (!rawInnerContent) return null;

  const viewBoxSize = parseViewBoxSize(viewBox, closestSize);
  const innerContent = remapStaticIconContent(
    rawInnerContent,
    viewBoxSize,
    font,
    weight,
    closestWeight,
    strokeOverride,
  );

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: color || undefined,
        ...sizeStyle,
      }}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden ?? !ariaLabel}
      role={ariaLabel ? "img" : undefined}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        fill="currentColor"
        style={{ width: "100%", height: "100%" }}
        dangerouslySetInnerHTML={{ __html: innerContent }}
      />
    </span>
  );
}

export function Icon({
  name,
  font = "sans",
  weight = 500,
  className = "",
  size,
  strokeWidth: customStrokeWidth,
  color,
  inset = 0,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
}: IconProps) {
  if (name === "star") {
    return (
      <StaticFetchedIcon
        font={font}
        weight={weight}
        className={className}
        size={size}
        color={color}
        strokeWidth={customStrokeWidth}
        getAssetPath={getStarIconAssetPath}
        getSize={getClosestSize}
        getWeight={getClosestWeight}
        label="Star"
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
      />
    );
  }
  if (name === "info-circle") {
    return (
      <StaticFetchedIcon
        font={font}
        weight={weight}
        className={className}
        size={size}
        color={color}
        strokeWidth={customStrokeWidth}
        getAssetPath={getInfoCircleIconAssetPath}
        getSize={getInfoCircleClosestSize}
        getWeight={getInfoCircleClosestWeight}
        label="Info Circle"
        preserveFillNone
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
      />
    );
  }
  if (name === "help-circle") {
    return (
      <StaticFetchedIcon
        font={font}
        weight={weight}
        className={className}
        size={size}
        color={color}
        strokeWidth={customStrokeWidth}
        getAssetPath={getHelpCircleIconAssetPath}
        getSize={getHelpCircleClosestSize}
        getWeight={getHelpCircleClosestWeight}
        label="Help Circle"
        preserveFillNone
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
      />
    );
  }
  if (name === "controls") {
    return (
      <StaticFetchedIcon
        font={font}
        weight={weight}
        className={className}
        size={size}
        color={color}
        strokeWidth={customStrokeWidth}
        getAssetPath={getControlsIconAssetPath}
        getSize={getControlsClosestSize}
        getWeight={getControlsClosestWeight}
        label="Controls"
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
      />
    );
  }

  const iconData = iconPaths[name];
  if (!iconData) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  const baseStrokeWidth = getBaseStrokeWidth(font);
  const calculatedStrokeWidth = customStrokeWidth ?? getStrokeWidth(font, weight);
  const scaleFactor = calculateScaleFactor(calculatedStrokeWidth, baseStrokeWidth, inset);
  const center = VIEWBOX_SIZE / 2;
  const translateOffset = center * (1 - scaleFactor);
  const compound = iconData.compound;
  const isCompound = !!compound;
  const scaledOuterSize =
    compound?.outerSize ? compound.outerSize * scaleFactor : 0;
  const innerScaleFactor =
    compound && scaledOuterSize > 0
      ? calculateCompoundScaleFactor(calculatedStrokeWidth, baseStrokeWidth, scaledOuterSize)
      : 1;

  const sizeValue = size ?? "1em";
  const sizeStyle =
    typeof sizeValue === "number"
      ? { width: `${sizeValue}px`, height: `${sizeValue}px` }
      : { width: sizeValue, height: sizeValue };

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...sizeStyle,
        ...(name === "refresh" ? { overflow: "visible" as const } : {}),
      }}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden ?? !ariaLabel}
      role={ariaLabel ? "img" : undefined}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="none"
        stroke={color || "currentColor"}
        strokeLinecap="round"
        strokeLinejoin={iconData.strokeLinejoin}
        overflow={name === "refresh" ? "visible" : undefined}
        style={{ width: "100%", height: "100%" }}
      >
        {isCompound && compound ? (
          <>
            <g transform={`translate(${translateOffset}, ${translateOffset}) scale(${scaleFactor})`}>
              {compound.outer.map((d, i) => (
                <path
                  key={`outer-${i}`}
                  d={d}
                  strokeWidth={calculatedStrokeWidth / scaleFactor}
                  style={{ transition: "stroke-width 200ms ease-out" }}
                />
              ))}
            </g>
            <g
              transform={`translate(${center}, ${center}) scale(${scaleFactor * innerScaleFactor}) translate(${-center}, ${-center})`}
            >
              {compound.inner.map((d, i) => (
                <path
                  key={`inner-${i}`}
                  d={d}
                  strokeWidth={calculatedStrokeWidth / (scaleFactor * innerScaleFactor)}
                  style={{ transition: "stroke-width 200ms ease-out, transform 200ms ease-out" }}
                />
              ))}
            </g>
          </>
        ) : (
          <g
            transform={`translate(${translateOffset}, ${translateOffset}) scale(${scaleFactor})${iconData.rotate != null ? ` rotate(${iconData.rotate} 16 16)` : ""}`}
          >
            {iconData.paths.map((d, i) => (
              <path
                key={i}
                d={d}
                strokeWidth={calculatedStrokeWidth / scaleFactor}
                style={{ transition: "stroke-width 200ms ease-out" }}
              />
            ))}
          </g>
        )}
      </svg>
    </span>
  );
}

export function getStrokeIconNames(): StrokeIconName[] {
  return Object.keys(iconPaths) as StrokeIconName[];
}

export function hasIcon(name: string): name is StrokeIconName {
  return name in iconPaths;
}

export interface AnimatedMenuIconProps {
  isOpen: boolean;
  font?: IconFont;
  size?: number;
  weight?: number;
  className?: string;
}

/** Animated hamburger/cross for mobile navigation */
export function AnimatedMenuIcon({
  isOpen,
  font = "sans",
  size = 16,
  weight = 500,
  className,
}: AnimatedMenuIconProps) {
  const strokeWidth = getStrokeWidth(font, weight);

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      style={{ overflow: "visible" }}
      aria-hidden
    >
      <line
        x1="1.11"
        y1={isOpen ? "1.11" : "5.052"}
        x2="30.89"
        y2={isOpen ? "30.89" : "5.052"}
        strokeWidth={strokeWidth}
        style={{ transition: "all 300ms ease-in-out", transformOrigin: "center" }}
      />
      <line
        x1="1.11"
        y1="16"
        x2="30.89"
        y2="16"
        strokeWidth={strokeWidth}
        style={{
          transition: "all 300ms ease-in-out",
          opacity: isOpen ? 0 : 1,
        }}
      />
      <line
        x1="1.11"
        y1={isOpen ? "30.89" : "26.948"}
        x2="30.89"
        y2={isOpen ? "1.11" : "26.948"}
        strokeWidth={strokeWidth}
        style={{ transition: "all 300ms ease-in-out", transformOrigin: "center" }}
      />
    </svg>
  );
}

export default Icon;
