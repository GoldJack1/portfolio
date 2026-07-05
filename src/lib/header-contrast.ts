export type HeaderTone = "on-light" | "on-dark";

export type HeaderContrastResult = {
  tone: HeaderTone;
  isMixed: boolean;
};

export const HEADER_ZONE_MOBILE = 123;
export const HEADER_ZONE_DESKTOP = 155;

const SAMPLE_FRACTIONS = [0.15, 0.32, 0.5, 0.68, 0.85];
const DESKTOP_SAMPLE_X = [0.15, 0.3, 0.5, 0.7, 0.85];
const DESKTOP_HORIZONTAL_PAD = 48; // sm:px-12

export function getHeaderZoneHeight(): number {
  if (typeof window === "undefined") return HEADER_ZONE_DESKTOP;
  return window.matchMedia("(min-width: 640px)").matches
    ? HEADER_ZONE_DESKTOP
    : HEADER_ZONE_MOBILE;
}

/** Visible top bar only — skips the hidden desktop/mobile duplicate in the DOM. */
export function getHeaderTopBarRect(): DOMRect | null {
  if (typeof window === "undefined") return null;

  const bars = document.querySelectorAll<HTMLElement>("[data-header-top-bar]");
  for (const bar of bars) {
    const rect = bar.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) return rect;
  }
  return null;
}

function parseRgb(color: string): [number, number, number, number] | null {
  const rgb = color.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\s*\)/);
  if (rgb) {
    return [
      Number(rgb[1]),
      Number(rgb[2]),
      Number(rgb[3]),
      rgb[4] !== undefined ? Number(rgb[4]) : 1,
    ];
  }

  const hsl = color.match(/hsla?\(\s*([\d.]+)[,\s]+([\d.]+)%[,\s]+([\d.]+)%(?:[,\s/]+([\d.]+))?\s*\)/);
  if (!hsl) return null;

  const h = Number(hsl[1]) / 360;
  const s = Number(hsl[2]) / 100;
  const l = Number(hsl[3]) / 100;
  const a = hsl[4] !== undefined ? Number(hsl[4]) : 1;

  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  let r: number;
  let g: number;
  let b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a];
}

function relativeLuminance(r: number, g: number, b: number): number {
  const linear = [r, g, b].map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function isTransparent(color: string): boolean {
  return (
    color === "transparent" ||
    color === "rgba(0, 0, 0, 0)" ||
    color.endsWith(", 0)") ||
    color.endsWith(",0)")
  );
}

function effectiveLuminance(r: number, g: number, b: number, a: number, backdrop: number): number {
  const blend = (channel: number) => channel * a + backdrop * (1 - a);
  return relativeLuminance(blend(r), blend(g), blend(b));
}

function normalizeBackgroundColor(color: string): string | null {
  if (isTransparent(color)) return null;

  const parsed = parseRgb(color);
  if (parsed) return color;

  if (typeof document === "undefined") return null;

  const probe = document.createElement("span");
  probe.style.display = "none";
  probe.style.backgroundColor = color;
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).backgroundColor;
  probe.remove();

  return isTransparent(computed) ? null : computed;
}

function mediaIsReady(media: HTMLImageElement | HTMLVideoElement): boolean {
  if (media instanceof HTMLImageElement) {
    return media.complete && media.naturalWidth > 0;
  }
  return media.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && media.videoWidth > 0;
}

function luminanceFromMediaAt(
  media: HTMLImageElement | HTMLVideoElement,
  x: number,
  y: number,
): number | null {
  if (!mediaIsReady(media)) return null;

  try {
    const rect = media.getBoundingClientRect();
    const localX = x - rect.left;
    const localY = y - rect.top;
    if (localX < 0 || localY < 0 || localX > rect.width || localY > rect.height) return null;

    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;

    const sourceWidth =
      media instanceof HTMLImageElement ? media.naturalWidth : media.videoWidth;
    const sourceHeight =
      media instanceof HTMLImageElement ? media.naturalHeight : media.videoHeight;

    ctx.drawImage(
      media,
      localX * (sourceWidth / rect.width),
      localY * (sourceHeight / rect.height),
      1,
      1,
      0,
      0,
      1,
      1,
    );

    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return relativeLuminance(r, g, b);
  } catch {
    return null;
  }
}

function findMediaAtPoint(x: number, y: number): HTMLImageElement | HTMLVideoElement | null {
  for (const media of document.querySelectorAll<HTMLImageElement | HTMLVideoElement>("img, video")) {
    const rect = media.getBoundingClientRect();
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      return media;
    }
  }
  return null;
}

function luminanceFromMarkedAt(x: number, y: number): number | null {
  for (const el of document.querySelectorAll<HTMLElement>("[data-header-tone]")) {
    const rect = el.getBoundingClientRect();
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) continue;
    return el.dataset.headerTone === "light" ? 0.92 : 0.08;
  }
  return null;
}

function luminanceFromElement(
  start: HTMLElement,
  x: number,
  y: number,
  backdropLuminance: number,
): number {
  const mediaAtPoint = findMediaAtPoint(x, y);
  if (mediaAtPoint) {
    const mediaLum = luminanceFromMediaAt(mediaAtPoint, x, y);
    if (mediaLum !== null) return mediaLum;
  }

  let node: HTMLElement | null = start;
  while (node && node !== document.documentElement) {
    const normalized = normalizeBackgroundColor(getComputedStyle(node).backgroundColor);
    if (normalized) {
      const parsed = parseRgb(normalized);
      if (!parsed) return backdropLuminance;
      const [r, g, b, a] = parsed;
      return effectiveLuminance(r, g, b, a, backdropLuminance);
    }
    node = node.parentElement;
  }

  return backdropLuminance;
}

function elementsBehindHeader(x: number, y: number): HTMLElement[] {
  const header = document.querySelector("header");
  const previous = header?.style.pointerEvents ?? "";
  if (header) header.style.pointerEvents = "none";

  try {
    return document.elementsFromPoint(x, y).filter(
      (el) => !(el as HTMLElement).closest("header"),
    ) as HTMLElement[];
  } finally {
    if (header) header.style.pointerEvents = previous;
  }
}

function sampleAt(x: number, y: number, backdropLuminance: number): number {
  const marked = luminanceFromMarkedAt(x, y);
  if (marked !== null) return marked;

  const behind = elementsBehindHeader(x, y);
  for (const el of behind) {
    return luminanceFromElement(el, x, y, backdropLuminance);
  }

  return backdropLuminance;
}

function isDesktopViewport(): boolean {
  return window.matchMedia("(min-width: 640px)").matches;
}

export function collectHeaderSamples(backdropLuminance: number): number[] {
  const bar = getHeaderTopBarRect();
  if (!bar) return [];

  const samples: number[] = [];

  if (isDesktopViewport()) {
    const sampleWidth = window.innerWidth - DESKTOP_HORIZONTAL_PAD * 2;
    const sampleLeft = DESKTOP_HORIZONTAL_PAD;
    const barYs = [
      bar.top + bar.height * 0.45,
      bar.bottom - 3,
    ].map((y) => Math.max(bar.top + 2, Math.min(bar.bottom - 2, y)));

    for (const y of barYs) {
      for (const xFraction of DESKTOP_SAMPLE_X) {
        const x = sampleLeft + sampleWidth * xFraction;
        samples.push(sampleAt(x, y, backdropLuminance));
      }
    }

    return samples;
  }

  const y = Math.max(bar.top + 2, Math.min(bar.bottom - 3, bar.bottom - 4));
  for (const fraction of SAMPLE_FRACTIONS) {
    const x = bar.left + bar.width * fraction;
    samples.push(sampleAt(x, y, backdropLuminance));
  }

  return samples;
}

function samplesAreMixed(samples: number[]): boolean {
  if (samples.length < 2) return false;

  const lightVotes = samples.filter((s) => s >= 0.52).length;
  const darkVotes = samples.filter((s) => s <= 0.42).length;
  if (lightVotes > 0 && darkVotes > 0) return true;

  const spread = Math.max(...samples) - Math.min(...samples);
  return spread >= 0.45;
}

export function toneFromSamples(
  samples: number[],
  previous: HeaderTone,
  fallback: HeaderTone,
): HeaderTone {
  if (samples.length === 0) return fallback;

  if (samplesAreMixed(samples)) return "on-light";

  const avg = samples.reduce((sum, value) => sum + value, 0) / samples.length;
  const lightVotes = samples.filter((s) => s >= 0.52).length;
  const darkVotes = samples.filter((s) => s <= 0.42).length;
  const majority = Math.ceil(samples.length / 2);

  if (lightVotes >= majority) return "on-light";
  if (darkVotes >= majority) return "on-dark";

  if (avg >= 0.54) return "on-light";
  if (avg <= 0.46) return "on-dark";

  return previous ?? fallback;
}

export function resolveHeaderContrast(
  backdropLuminance: number,
  previous: HeaderTone,
  fallback: HeaderTone,
): HeaderContrastResult {
  const samples = collectHeaderSamples(backdropLuminance);
  return {
    tone: toneFromSamples(samples, previous, fallback),
    isMixed: samplesAreMixed(samples),
  };
}
