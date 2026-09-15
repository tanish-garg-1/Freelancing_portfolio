"use client";

import Link from "next/link";
import { useEffect, type CSSProperties } from "react";
import gsap from "gsap";
import Media from "./Media";
import { ArrowLeft } from "./Icon";
import { BANNER, EXPAND_OVERLAY_ID } from "@/lib/visual";

type Props = { title: string; oneLiner?: string; cover?: string; accent?: string; count: number };

export default function CategoryBanner({ title, oneLiner, cover, accent, count }: Props) {
  useEffect(() => {
    const overlay = document.getElementById(EXPAND_OVERLAY_ID);
    if (!overlay) return;
    // The expanding home tile landed exactly on this banner's box — fade it out to reveal the page.
    const frame = requestAnimationFrame(() => {
      gsap.to(overlay, { opacity: 0, duration: 0.35, ease: "power1.out", onComplete: () => overlay.remove() });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const size = {
    "--banner-d": `${BANNER.desktopVh}vh`,
    "--banner-m": `${BANNER.mobileVh}vh`,
    "--banner-min-d": `${BANNER.desktopMin}px`,
    "--banner-min-m": `${BANNER.mobileMin}px`,
  } as CSSProperties;

  return (
    <header className="banner" style={size}>
      <Media className="banner-media" src={cover} title={title} accent={accent} />
      <div className="banner-text">
        <Link href="/" className="back">
          <ArrowLeft />
          All work
        </Link>
        <h1 className="display banner-title">{title}</h1>
        {oneLiner && <p className="banner-line">{oneLiner}</p>}
        {count > 0 && (
          <p className="banner-meta tabular">
            {count} {count === 1 ? "project" : "projects"}
          </p>
        )}
      </div>
    </header>
  );
}
