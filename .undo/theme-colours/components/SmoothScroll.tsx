"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * Inertia scrolling (Lenis) on the scrolling pages: category, case study, about.
 * Skipped on the home page, whose fixed stage uses the wheel to rotate the arc.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") return;
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: true });
    lenis.scrollTo(0, { immediate: true }); // each new page starts at the top
    return () => lenis.destroy();
  }, [pathname]);

  return null;
}
