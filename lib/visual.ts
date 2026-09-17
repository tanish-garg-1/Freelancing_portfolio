import type { CSSProperties } from "react";

export const DEFAULT_ACCENT = "#8b5cf6";
export const MOBILE_BREAKPOINT = 768;

/**
 * Phone layout = narrow AND portrait; short landscape screens keep the desktop arc.
 * Keep in sync with the "(max-width: 767px) and (orientation: portrait)" media query in globals.css.
 */
export const isPhonePortrait = (width: number, height: number) => width < MOBILE_BREAKPOINT && height >= width;

/** Category banner size. The home tile-expand animation grows to exactly this box. */
export const BANNER = { desktopVh: 52, mobileVh: 42, desktopMin: 340, mobileMin: 280 };

/** DOM id of the temporary element that carries the expanding tile from home to the category page. */
export const EXPAND_OVERLAY_ID = "arc-expand-overlay";

const isHex = (value?: string): value is string => !!value && /^#[0-9a-f]{6}$/i.test(value);

export function accentOf(accent?: string) {
  return isHex(accent) ? accent : DEFAULT_ACCENT;
}

/**
 * Inline style for an accent scope. `--accent` drives the dark theme; `--accent-light`, when the
 * category has one, replaces it in the light theme (see --accent-now in globals.css).
 */
export function accentStyle(accent?: string, accentLight?: string) {
  return {
    "--accent": accentOf(accent),
    ...(isHex(accentLight) ? { "--accent-light": accentLight } : {}),
  } as CSSProperties;
}

/**
 * Glow-gradient stand-in used wherever an image is missing. Strength and base colors come from
 * theme tokens (--ph-*), so the same placeholder reads as a dark glow or a soft light wash.
 */
export function placeholderBackground(accent?: string) {
  const c = accentOf(accent);
  return [
    `radial-gradient(120% 90% at 18% 12%, color-mix(in srgb, ${c} var(--ph-strong), transparent) 0%, transparent 55%)`,
    `radial-gradient(90% 80% at 92% 100%, color-mix(in srgb, ${c} var(--ph-soft), transparent) 0%, transparent 60%)`,
    "linear-gradient(160deg, var(--ph-1) 0%, var(--ph-2) 100%)",
  ].join(", ");
}

export function bannerHeightPx() {
  const mobile = isPhonePortrait(window.innerWidth, window.innerHeight);
  const vh = mobile ? BANNER.mobileVh : BANNER.desktopVh;
  return Math.max(mobile ? BANNER.mobileMin : BANNER.desktopMin, (window.innerHeight * vh) / 100);
}

export const isVideoFile = (url: string) => /\.(mp4|webm|ogg|mov)(\?|#|$)/i.test(url);
