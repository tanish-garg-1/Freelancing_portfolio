"use client";

import { useEffect, useRef } from "react";

type Axes = { wdth: number; wght: number };

/** Resting letter shape, and the two extremes the pointer pulls letters between. */
const REST: Axes = { wdth: 62, wght: 760 };
const THIN: Axes = { wdth: 25, wght: 100 };
const WIDE: Axes = { wdth: 151, wght: 1000 };
const FAR_OPACITY = 0.45;
/** Reach of the pointer, in multiples of the heading's font size. */
const REACH = 1.7;
const SMOOTHING = 0.14;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (t: number) => t * t * (3 - 2 * t);

/**
 * Heading whose letters swell wide and heavy under the mouse pointer while the
 * rest collapse into thin strokes, so neighbours get shoved away horizontally.
 * Uses the width + weight axes of a variable font. Screen readers get the plain
 * text; touch devices and reduced-motion users get the resting heading.
 */
export default function RepelText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduced) return;

    const letters = Array.from(root.querySelectorAll<HTMLElement>("[data-letter]"));
    const state = letters.map(() => ({ ...REST, opacity: 1 }));
    let pointer: { x: number; y: number } | null = null;
    let activity = 0;
    let frame = 0;

    const tick = () => {
      const box = root.getBoundingClientRect();
      const reach = parseFloat(getComputedStyle(root).fontSize) * REACH;
      const near =
        pointer !== null &&
        pointer.x > box.left - reach &&
        pointer.x < box.right + reach &&
        pointer.y > box.top - box.height * 0.6 &&
        pointer.y < box.bottom + box.height * 0.6;
      activity = lerp(activity, near ? 1 : 0, SMOOTHING);

      let moving = Math.abs(activity - (near ? 1 : 0)) > 0.002;
      letters.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const distance = pointer ? Math.abs(rect.left + rect.width / 2 - pointer.x) : Infinity;
        const pull = smoothstep(Math.max(0, 1 - distance / reach));
        const target = {
          wdth: lerp(REST.wdth, lerp(THIN.wdth, WIDE.wdth, pull), activity),
          wght: lerp(REST.wght, lerp(THIN.wght, WIDE.wght, pull), activity),
          opacity: lerp(1, lerp(FAR_OPACITY, 1, pull), activity),
        };
        const s = state[i];
        s.wdth = lerp(s.wdth, target.wdth, SMOOTHING);
        s.wght = lerp(s.wght, target.wght, SMOOTHING);
        s.opacity = lerp(s.opacity, target.opacity, SMOOTHING);
        if (Math.abs(s.wdth - target.wdth) > 0.1 || Math.abs(s.wght - target.wght) > 0.5) moving = true;

        el.style.fontVariationSettings = `"wdth" ${s.wdth.toFixed(1)}`;
        el.style.fontWeight = s.wght.toFixed(0);
        el.style.opacity = s.opacity.toFixed(3);
      });

      frame = moving ? requestAnimationFrame(tick) : 0;
    };

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      wake();
    };
    const onLeave = () => {
      pointer = null;
      wake();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const words = text.split(" ");
  return (
    <h1 ref={ref} className={className} aria-label={text}>
      {words.map((word, w) => (
        <span key={w} className="repel-word" aria-hidden="true">
          {Array.from(word).map((char, c) => (
            <span key={c} className="repel-letter" data-letter="">
              {char}
            </span>
          ))}
          {w < words.length - 1 ? " " : null}
        </span>
      ))}
    </h1>
  );
}
