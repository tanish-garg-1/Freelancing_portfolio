"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, type PointerEvent } from "react";
import gsap from "gsap";
import Media from "./Media";
import LivingPreview from "./LivingPreview";
import type { Category } from "@/lib/content";
import { isPhonePortrait } from "@/lib/visual";

export type ArcHandle = {
  step: (direction: 1 | -1) => void;
  openFocused: () => void;
  /** Rotate the shortest way round to a category index. */
  focusIndex: (index: number) => void;
  /** Place a category in focus instantly (used to restore position after Back). */
  jumpTo: (index: number) => void;
  /** A small there-and-back rotation that shows the arc can move. */
  nudge: () => void;
};

type Props = {
  categories: Category[];
  focusedIndex: number;
  disabled?: boolean;
  reducedMotion?: boolean;
  onFocusChange: (index: number) => void;
  onOpen: (index: number, tile: HTMLElement | null) => void;
};

/** Small category lists are repeated around the ring so the arc always looks full (infinite loop). */
const MIN_SLOTS = 7;

const mod = (a: number, n: number) => ((a % n) + n) % n;

/** Largest lean (degrees) of the focused tile toward the mouse. */
const MAX_TILT = 14;

function setTilt(el: HTMLElement, px: number, py: number) {
  el.dataset.tilt = "1";
  el.style.setProperty("--tilt-x", `${(0.5 - py) * 2 * MAX_TILT}deg`);
  el.style.setProperty("--tilt-y", `${(px - 0.5) * 2 * MAX_TILT}deg`);
  el.style.setProperty("--sheen-x", `${px * 100}%`);
  el.style.setProperty("--sheen-y", `${py * 100}%`);
}

function resetTilt(el: HTMLElement) {
  el.dataset.tilt = "0";
  el.style.setProperty("--tilt-x", "0deg");
  el.style.setProperty("--tilt-y", "0deg");
}

/** Signed distance from `position` to slot `i` on a ring of `m` slots, in [-m/2, m/2). */
function ringOffset(i: number, position: number, m: number) {
  const o = mod(i - position, m);
  return o >= m / 2 ? o - m : o;
}

function arcGeometry(w: number, h: number) {
  if (isPhonePortrait(w, h)) {
    // Shallow arc along the bottom of the phone; the ellipse center sits just below the screen.
    return { cx: w / 2, cy: h * 1.12, rx: w * 0.8, ry: h * 0.33, center: 270, step: 30, size: Math.min(w * 0.26, 120) };
  }
  // Quarter arc around the bottom-right corner: from slightly left of bottom-middle (180°)
  // up to right-middle (270°). The focused tile sits in the middle of the arc (225°).
  return {
    cx: w,
    cy: h,
    rx: w * 0.58,
    ry: h * 0.5,
    center: 225,
    step: 22.5,
    size: Math.max(72, Math.min(w * 0.11, h * 0.2, 180)),
  };
}

const ArcCarousel = forwardRef<ArcHandle, Props>(function ArcCarousel(
  { categories, focusedIndex, disabled = false, reducedMotion = false, onFocusChange, onOpen },
  ref,
) {
  const n = categories.length;
  const m = n * Math.max(1, Math.ceil(MIN_SLOTS / Math.max(n, 1)));

  const stageRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  tileRefs.current.length = m;
  // Untilted box of each tile inside the stage, so pointer maths never feeds back on the tilt.
  const boxes = useRef<{ x: number; y: number; size: number }[]>([]);
  const position = useRef({ value: 0 }); // animated, continuous
  const target = useRef(0); // integer slot the arc is heading to
  const tween = useRef<gsap.core.Tween | null>(null);

  // Latest props, read by the window listeners that are bound only once.
  const live = useRef({ disabled, reducedMotion, onFocusChange, onOpen });
  useEffect(() => {
    live.current = { disabled, reducedMotion, onFocusChange, onOpen };
  });

  const layout = useCallback(() => {
    const stage = stageRef.current;
    if (!stage || !m) return;
    const g = arcGeometry(stage.clientWidth, stage.clientHeight);
    const rad = Math.PI / 180;

    tileRefs.current.forEach((el, slot) => {
      if (!el) return;
      const o = ringOffset(slot, position.current.value, m);
      const angle = (g.center + o * g.step) * rad;
      const x = g.cx + g.rx * Math.cos(angle);
      const y = g.cy + g.ry * Math.sin(angle);
      const closeness = Math.max(0, 1 - Math.abs(o));
      el.style.width = `${g.size}px`;
      el.style.height = `${g.size}px`;
      const scale = 1 + 0.35 * closeness;
      el.style.transform =
        `translate3d(${x - g.size / 2}px, ${y - g.size / 2}px, 0) ` +
        `perspective(700px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) scale(${scale})`;
      boxes.current[slot] = { x, y, size: g.size * scale };
      // Fully visible within 2 steps, gone by 3 — so the wrap-around jump at m/2 is never seen.
      el.style.opacity = String(Math.min(1, Math.max(0, 3 - Math.abs(o))));
      el.style.zIndex = String(100 - Math.round(Math.abs(o) * 10));
      el.dataset.focus = closeness > 0.5 ? "1" : "0";
      if (el.dataset.focus === "0" && el.dataset.tilt === "1") resetTilt(el);
    });

    const a = g.center * rad;
    stage.style.setProperty("--glow-x", `${g.cx + g.rx * Math.cos(a)}px`);
    stage.style.setProperty("--glow-y", `${g.cy + g.ry * Math.sin(a)}px`);
    stage.style.setProperty("--glow-size", `${g.size * 3.2}px`);
  }, [m]);

  const goTo = useCallback(
    (next: number) => {
      target.current = next;
      live.current.onFocusChange(mod(next, n));
      tween.current?.kill();
      if (live.current.reducedMotion) {
        position.current.value = next;
        layout();
        return;
      }
      tween.current = gsap.to(position.current, { value: next, duration: 0.65, ease: "power3.out", onUpdate: layout });
    },
    [layout, n],
  );

  const step = useCallback(
    (direction: 1 | -1) => {
      if (live.current.disabled || !n) return;
      goTo(target.current + direction);
    },
    [goTo, n],
  );

  const openFocused = useCallback(() => {
    if (live.current.disabled || !n) return;
    const slot = mod(target.current, m);
    const tile = tileRefs.current[slot];
    if (tile?.dataset.tilt === "1") {
      // Flatten instantly so the expand transition starts from the tile's true square.
      tile.style.transition = "none";
      resetTilt(tile);
      void tile.offsetWidth;
      tile.style.transition = "";
    }
    live.current.onOpen(slot % n, tile ?? null);
  }, [m, n]);

  const focusIndex = useCallback(
    (index: number) => {
      if (live.current.disabled || !n) return;
      let delta = mod(index - mod(target.current, n), n);
      if (delta > n / 2) delta -= n;
      if (delta !== 0) goTo(target.current + delta);
    },
    [goTo, n],
  );

  const jumpTo = useCallback(
    (index: number) => {
      if (!n) return;
      tween.current?.kill();
      target.current = index;
      position.current.value = index;
      layout();
    },
    [layout, n],
  );

  const nudge = useCallback(() => {
    if (live.current.disabled || live.current.reducedMotion || !n) return;
    tween.current?.kill();
    tween.current = gsap.to(position.current, {
      value: target.current + 0.35,
      duration: 0.5,
      ease: "power2.inOut",
      yoyo: true,
      repeat: 1,
      onUpdate: layout,
    });
  }, [layout, n]);

  useImperativeHandle(ref, () => ({ step, openFocused, focusIndex, jumpTo, nudge }), [
    step,
    openFocused,
    focusIndex,
    jumpTo,
    nudge,
  ]);

  /** The focused tile leans toward a mouse pointer, and a light sheen follows it. */
  const handleTilt = (slot: number, e: PointerEvent<HTMLDivElement>) => {
    const el = tileRefs.current[slot];
    const box = boxes.current[slot];
    const stage = stageRef.current;
    if (!el || !box || !stage || e.pointerType !== "mouse") return;
    if (live.current.reducedMotion || live.current.disabled || el.dataset.focus !== "1") return;
    const s = stage.getBoundingClientRect();
    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    const px = clamp((e.clientX - s.left - (box.x - box.size / 2)) / box.size);
    const py = clamp((e.clientY - s.top - (box.y - box.size / 2)) / box.size);
    setTilt(el, px, py);
  };

  const handleTiltEnd = (slot: number) => {
    const el = tileRefs.current[slot];
    if (el?.dataset.tilt === "1") resetTilt(el);
  };

  const handleTileClick = (slot: number) => {
    if (live.current.disabled) return;
    const o = Math.round(ringOffset(slot, target.current, m));
    if (o === 0) openFocused();
    else goTo(target.current + o);
  };

  useEffect(() => {
    layout();
    window.addEventListener("resize", layout);
    return () => window.removeEventListener("resize", layout);
  }, [layout]);

  useEffect(() => {
    if (disabled) tween.current?.kill();
  }, [disabled]);

  useEffect(() => () => void tween.current?.kill(), []);

  // Input: wheel, keyboard, and swipes on both axes all rotate the arc by one step.
  useEffect(() => {
    let lastWheel = 0;
    let lastStep = 0;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = performance.now();
      const sameGesture = now - lastWheel < 160;
      lastWheel = now;
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 2) return;
      // One step per gesture: trackpad momentum keeps firing events, so a continuous stream
      // only steps again after 0.7s; separate wheel flicks can step every 350ms.
      if (now - lastStep < (sameGesture ? 700 : 350)) return;
      lastStep = now;
      step(delta > 0 ? 1 : -1);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target instanceof HTMLElement ? e.target : null;
      if (t?.closest("input, textarea, select, [contenteditable='true']")) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "Enter" && !t?.closest("a, button")) {
        e.preventDefault();
        openFocused();
      }
    };

    let startX = 0;
    let startY = 0;
    let tracking = false;
    const onTouchStart = (e: TouchEvent) => {
      tracking = e.touches.length === 1;
      if (!tracking) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (tracking) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return; // a tap, not a swipe
      // Left/right and up/down swipes do the same job: swiping left or up moves to the next tile.
      const delta = Math.abs(dx) > Math.abs(dy) ? -dx : -dy;
      step(delta > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [step, openFocused]);

  return (
    <div
      ref={stageRef}
      className="arc-stage"
      role="listbox"
      tabIndex={0}
      aria-label="Work categories. Use the arrow keys to browse and Enter to open."
      aria-activedescendant={n ? `arc-option-${focusedIndex}` : undefined}
    >
      <div className="arc-glow" aria-hidden="true" />
      {Array.from({ length: m }, (_, slot) => {
        const category = categories[slot % n];
        const primary = slot < n; // repeats exist only to fill the ring; hide them from screen readers
        return (
          <div
            key={slot}
            id={primary ? `arc-option-${slot}` : undefined}
            ref={(el) => {
              tileRefs.current[slot] = el;
            }}
            className="arc-tile"
            role={primary ? "option" : undefined}
            aria-selected={primary ? slot === focusedIndex : undefined}
            aria-hidden={primary ? undefined : true}
            onClick={() => handleTileClick(slot)}
            onPointerMove={(e) => handleTilt(slot, e)}
            onPointerLeave={() => handleTiltEnd(slot)}
          >
            <Media src={category.cover} title={category.title} accent={category.accent} />
            <LivingPreview src={category.preview} accent={category.accent} />
            <span className="arc-tile-sheen" aria-hidden="true" />
            <span className="arc-tile-label">{category.title}</span>
          </div>
        );
      })}
    </div>
  );
});

export default ArcCarousel;
