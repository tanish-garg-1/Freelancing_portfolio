"use client";

import { useEffect, useState } from "react";

/**
 * The site plays its motion for every visitor, even when the OS asks for reduced motion
 * (many laptops have Windows "Animation effects" switched off, which browsers report as
 * prefers-reduced-motion). Set this to true to honour that setting again in the JS motion;
 * the matching CSS rules were removed and are kept in .undo/always-animate/globals.css.
 */
export const RESPECT_REDUCED_MOTION = false;

const QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion() {
  return RESPECT_REDUCED_MOTION && window.matchMedia(QUERY).matches;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (!RESPECT_REDUCED_MOTION) return;
    const query = window.matchMedia(QUERY);
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}
