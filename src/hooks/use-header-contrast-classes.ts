"use client";

import { useMemo } from "react";
import type { CSSProperties } from "react";
import { useHeaderContrast } from "@/components/header-contrast-provider";
import { useTheme } from "@/components/theme-provider";

const GLASS_BLUR: CSSProperties = {
  backdropFilter: "blur(var(--header-glass-blur, 25px)) saturate(160%)",
  WebkitBackdropFilter: "blur(var(--header-glass-blur, 25px)) saturate(160%)",
};

export function useHeaderContrastClasses() {
  const { tone, isMixed } = useHeaderContrast();
  const { resolvedTheme } = useTheme();
  const onDark = tone === "on-dark";
  const searchTextDark = resolvedTheme === "dark" || !onDark || isMixed;

  return useMemo(() => {
    const hoverBg = onDark
      ? "bg-white/10 shadow-[0_0_0_1px_hsla(0,0%,100%,0.12)_inset]"
      : "bg-black/8 shadow-[0_0_0_1px_rgba(0,0,0,0.08)_inset]";

    const hoverBgStrong = onDark ? "bg-white/15" : "bg-black/15";
    const hoverBgRest = onDark ? "bg-white/10" : "bg-black/8";

    const glassStyle: CSSProperties = {
      ...GLASS_BLUR,
      background: "var(--header-glass-bg)",
      boxShadow: "var(--header-glass-ring)",
    };

    const searchPanelStyle: CSSProperties = {
      ...GLASS_BLUR,
      background: "var(--header-glass-bg)",
      boxShadow: "var(--header-glass-ring)",
    };

    return {
      onDark,
      glassStyle,
      mobileGlassStyle: glassStyle,
      glass: "transition-[background,box-shadow,backdrop-filter] duration-200 ease-out",
      mobileGlass: "transition-[background,box-shadow,backdrop-filter] duration-200 ease-out",
      navText: (underPill: boolean) => (underPill ? "text-black" : onDark ? "text-white" : "text-black"),
      icon: onDark ? "text-white" : "text-black",
      muted: onDark ? "text-white/40" : "text-black/40",
      mutedMid: onDark ? "text-white/50" : "text-black/50",
      input: searchTextDark
        ? "text-black placeholder:text-black/40"
        : "text-white placeholder:text-white/40",
      searchIcon: searchTextDark ? "text-black/50" : "text-white/50",
      searchPanelStyle,
      searchMuted: searchTextDark ? "text-black/45" : "text-white/45",
      searchMutedMid: searchTextDark ? "text-black/50" : "text-white/50",
      searchResultTitle: searchTextDark ? "text-black" : "text-white",
      searchResultDesc: searchTextDark ? "text-black/55" : "text-white/55",
      searchHoverRow: searchTextDark
        ? "hover:bg-black/6 active:bg-black/10"
        : "hover:bg-white/10 active:bg-white/15",
      hoverBg,
      hoverBgStrong,
      hoverBgRest,
      hoverRow: onDark
        ? "hover:bg-white/10 hover:shadow-[0_0_0_1px_hsla(0,0%,100%,0.12)_inset] active:bg-white/20"
        : "hover:bg-black/8 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.08)_inset] active:bg-white/60",
      resultTitle: onDark ? "text-white" : "text-black",
      resultDesc: onDark ? "text-white/50" : "text-black/50",
      ring: onDark
        ? "shadow-[0_0_0_1px_hsla(0,0%,100%,0.12)_inset]"
        : "shadow-[0_0_0_1px_rgba(0,0,0,0.08)_inset]",
      searchBtnRest: onDark
        ? "hover:bg-white/10 hover:shadow-[0_0_0_1px_hsla(0,0%,100%,0.12)_inset]"
        : "hover:bg-black/8 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.08)_inset]",
      searchBtnOpen: onDark
        ? "bg-white/10 hover:bg-white/15"
        : "bg-black/8 hover:bg-black/15",
      searchCloseIcon: "text-black",
      searchCloseRing: "shadow-[0_0_0_1px_rgba(0,0,0,0.08)_inset]",
      searchCloseRest: "bg-black/8",
      searchCloseHover: "bg-black/15",
    };
  }, [onDark, searchTextDark, isMixed]);
}
