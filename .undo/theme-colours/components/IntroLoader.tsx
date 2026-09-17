"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

/** Session-scoped: the intro plays once per visit, not on every page. */
export const INTRO_KEY = "intro-seen";
/** Never finish faster than this, so the count reads as a count and not a flash. */
const MIN_MS = 900;
/** Never hold the visitor longer than this, even on a slow connection. */
const MAX_MS = 2400;

/**
 * Typographic preloader: the name in serif italic in the middle and a big mono % counter in the
 * corner. The counter follows real milestones (fonts ready, window load) instead of a fake timer,
 * then the curtain retracts upward. It is server-rendered so the page never flashes before it; the
 * beforeInteractive script in the layout hides it for repeat visits, and CSS hides it when
 * JavaScript is off.
 */
export default function IntroLoader({ label }: { label?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let seen = document.documentElement.classList.contains(INTRO_KEY);
    try {
      seen ||= sessionStorage.getItem(INTRO_KEY) === "1";
    } catch {
      // storage blocked: still play once for this page load
    }
    if (seen || prefersReducedMotion()) {
      setDone(true);
      return;
    }

    const start = performance.now();
    let target = 12;
    let shown = 0;
    let frame = 0;
    let leaveTimer = 0;
    const reach = (value: number) => {
      target = Math.max(target, value);
    };

    document.fonts?.ready.then(() => reach(64));
    const onLoad = () => reach(100);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    const cap = window.setTimeout(() => reach(100), MAX_MS);

    const tick = (now: number) => {
      // rAF timestamps can be slightly earlier than `start`, so never let the count go below 0.
      const goal = Math.min(target, Math.max(0, (100 * (now - start)) / MIN_MS));
      shown += (goal - shown) * 0.14;
      if (goal - shown < 0.4) shown = goal;
      if (countRef.current) countRef.current.textContent = String(Math.round(shown)).padStart(2, "0");
      if (shown >= 100) {
        try {
          sessionStorage.setItem(INTRO_KEY, "1");
        } catch {
          // ignore
        }
        root.classList.add("is-leaving");
        leaveTimer = window.setTimeout(() => setDone(true), 750);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(cap);
      window.clearTimeout(leaveTimer);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  if (done) return null;

  return (
    <div ref={rootRef} className="intro-loader" aria-hidden="true">
      {label && <span className="intro-name">{label}</span>}
      <span className="intro-count">
        <span ref={countRef}>00</span>
        <small>%</small>
      </span>
    </div>
  );
}
