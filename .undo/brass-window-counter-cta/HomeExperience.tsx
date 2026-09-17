"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import ArcCarousel, { type ArcHandle } from "./ArcCarousel";
import FocusInfo from "./FocusInfo";
import SocialDock from "./SocialDock";
import StaticHero from "./StaticHero";
import type { Category, Site } from "@/lib/content";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { EXPAND_OVERLAY_ID, accentStyle, bannerHeightPx, placeholderBackground } from "@/lib/visual";

type Props = { site: Site; categories: Category[] };

/** Session-scoped: return to the same category after opening one and pressing Back. */
const SELECTED_KEY = "arc-selected";
/** Persistent: the swipe hint is shown once per device. */
const HINT_KEY = "arc-touch-hinted";

export default function HomeExperience({ site, categories }: Props) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<ArcHandle>(null);
  const [index, setIndex] = useState(0);
  const [opening, setOpening] = useState(false);
  const [touchHint, setTouchHint] = useState(false);
  const current = categories[index];

  // Home is a fixed stage: wheel and swipes rotate the arc instead of scrolling the page.
  useEffect(() => {
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
    };
  }, []);

  // Restore the last focused category before first paint, so Back doesn't reset the arc.
  useLayoutEffect(() => {
    try {
      const slug = sessionStorage.getItem(SELECTED_KEY);
      const restored = slug ? categories.findIndex((c) => c.slug === slug) : -1;
      if (restored > 0) {
        arcRef.current?.jumpTo(restored);
        setIndex(restored);
      }
    } catch {
      // storage unavailable — start at the first category
    }
  }, [categories]);

  // One-time swipe hint + nudge on touch devices.
  useEffect(() => {
    if (categories.length < 2 || !window.matchMedia("(hover: none)").matches) return;
    try {
      if (localStorage.getItem(HINT_KEY) === "1") return;
    } catch {
      return;
    }
    setTouchHint(true);
    const nudge = reducedMotion ? 0 : window.setTimeout(() => arcRef.current?.nudge(), 900);
    const hide = window.setTimeout(() => {
      setTouchHint(false);
      try {
        localStorage.setItem(HINT_KEY, "1");
      } catch {
        // ignore
      }
    }, 6000);
    return () => {
      window.clearTimeout(nudge);
      window.clearTimeout(hide);
    };
  }, [categories.length, reducedMotion]);

  useEffect(() => {
    if (current) router.prefetch(`/work/${current.slug}`);
  }, [current, router]);

  const handleFocusChange = useCallback(
    (i: number) => {
      setIndex(i);
      setTouchHint(false);
      try {
        sessionStorage.setItem(SELECTED_KEY, categories[i]?.slug ?? "");
        localStorage.setItem(HINT_KEY, "1");
      } catch {
        // ignore
      }
    },
    [categories],
  );

  const handleOpen = useCallback(
    (i: number, tile: HTMLElement | null) => {
      const category = categories[i];
      if (!category || opening) return;
      const href = `/work/${category.slug}`;
      const root = rootRef.current;
      if (reducedMotion || !tile || !root) {
        router.push(href);
        return;
      }

      setOpening(true);
      // Tile-expand: a fixed copy of the tile grows into the category banner's exact box,
      // then the category page mounts underneath and fades this overlay out (CategoryBanner).
      const rect = tile.getBoundingClientRect();
      document.getElementById(EXPAND_OVERLAY_ID)?.remove();
      const overlay = document.createElement("div");
      overlay.id = EXPAND_OVERLAY_ID;
      Object.assign(overlay.style, {
        position: "fixed",
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        borderRadius: getComputedStyle(tile).borderRadius,
        background: category.cover
          ? `center / cover no-repeat url("${category.cover.replace(/["\\\n]/g, "")}"), var(--ph-2)`
          : placeholderBackground(category.accent),
        zIndex: "1000",
        pointerEvents: "none",
      });
      document.body.appendChild(overlay);
      window.setTimeout(() => overlay.remove(), 5000); // never leave it stuck if navigation fails
      tile.style.visibility = "hidden";

      gsap
        .timeline({ onComplete: () => router.push(href) })
        .to(root.querySelectorAll("[data-fade], .arc-tile, .arc-glow"), { opacity: 0, duration: 0.3, ease: "power1.out" }, 0)
        .to(
          overlay,
          {
            left: 0,
            top: 0,
            width: window.innerWidth,
            height: bannerHeightPx(),
            borderRadius: 0,
            duration: 0.7,
            ease: "power3.inOut",
          },
          0.05,
        );
    },
    [categories, opening, reducedMotion, router],
  );

  return (
    <div
      ref={rootRef}
      className="home"
      data-accent-scope=""
      style={accentStyle(current?.accent, current?.accentLight)}
    >
      {/* The arc comes first in tab order: it is the page's primary interaction. */}
      {categories.length > 0 && (
        <ArcCarousel
          ref={arcRef}
          categories={categories}
          focusedIndex={index}
          disabled={opening}
          reducedMotion={reducedMotion}
          onFocusChange={handleFocusChange}
          onOpen={handleOpen}
        />
      )}

      <div className="home-copy">
        <div className="home-hero" data-fade>
          <StaticHero site={site} />
        </div>

        {current ? (
          <div className="home-focus" data-fade>
            <FocusInfo
              categories={categories}
              index={index}
              onOpen={() => arcRef.current?.openFocused()}
              onJump={(i) => arcRef.current?.focusIndex(i)}
              touchHint={touchHint}
            />
          </div>
        ) : (
          <p className="home-empty" data-fade>
            Add a project to a category to fill the arc.
          </p>
        )}

        <div className="home-dock" data-fade>
          <SocialDock site={site} />
          {site.stats && <p className="home-proof meta tabular">{site.stats.join("  ·  ")}</p>}
        </div>
      </div>
    </div>
  );
}
