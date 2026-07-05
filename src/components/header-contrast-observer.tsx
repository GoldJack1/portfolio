"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { resolveHeaderContrast, type HeaderTone } from "@/lib/header-contrast";
import { useHeaderContrast } from "@/components/header-contrast-provider";
import { useTheme } from "@/components/theme-provider";

function themeDefaultTone(resolvedTheme: "light" | "dark" | undefined): HeaderTone {
  return resolvedTheme === "dark" ? "on-dark" : "on-light";
}

export default function HeaderContrastObserver() {
  const { setContrast } = useHeaderContrast();
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const toneRef = useRef<HeaderTone>("on-light");
  const mixedRef = useRef(false);

  useEffect(() => {
    if (!resolvedTheme) return;

    const fallback = themeDefaultTone(resolvedTheme);
    toneRef.current = fallback;
    mixedRef.current = false;
    setContrast(fallback, false);

    let raf = 0;

    const update = () => {
      const backdrop = resolvedTheme === "dark" ? 0.05 : 1;
      const { tone, isMixed } = resolveHeaderContrast(
        backdrop,
        toneRef.current,
        fallback,
      );

      if (tone !== toneRef.current || isMixed !== mixedRef.current) {
        toneRef.current = tone;
        mixedRef.current = isMixed;
        setContrast(tone, isMixed);
      }
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    const bindMediaListeners = () => {
      document.querySelectorAll("video, img").forEach((media) => {
        const el = media as HTMLImageElement | HTMLVideoElement;
        if (el.dataset.headerContrastBound) return;
        el.dataset.headerContrastBound = "true";
        el.addEventListener("loadeddata", schedule);
        el.addEventListener("seeked", schedule);
        if (el instanceof HTMLImageElement) {
          el.addEventListener("load", schedule);
        }
      });
    };

    schedule();
    bindMediaListeners();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    const mo = new MutationObserver(() => {
      bindMediaListeners();
      schedule();
    });
    mo.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-header-tone"],
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      mo.disconnect();
    };
  }, [setContrast, resolvedTheme, pathname]);

  return null;
}
