"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/**
 * Inertia scrolling (Lenis) on the scrolling pages: category, case study, about.
 * Skipped on the home page, whose fixed stage uses the wheel to rotate the arc, and for
 * reduced-motion users, who keep native scrolling.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: true });
    lenis.scrollTo(0, { immediate: true }); // each new page starts at the top
    return () => lenis.destroy();
  }, [pathname]);

  return null;
}
