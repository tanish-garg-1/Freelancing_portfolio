import type { CSSProperties, SyntheticEvent } from "react";
import { accentOf } from "@/lib/visual";

type Props = {
  /** Tall screenshot of real work. Without one, a sketched page in the category colour stands in. */
  src?: string;
  /** Video files of the category's projects: played in turn, muted, instead of the sketch. */
  reel?: string[];
  accent?: string;
  accentLight?: string;
};

/**
 * "Living tile": real work moving inside the focused arc tile. A screenshot scrolls as if someone is
 * browsing it; a reel of the category's videos plays one after another; with neither, a sketched page
 * in the category colour scrolls. Purely decorative, so it is hidden from screen readers. CSS only
 * runs the scroll while the tile is focused, and ArcCarousel plays or pauses the reel with focus.
 */
export default function LivingPreview({ src, reel, accent, accentLight }: Props) {
  // When one video ends, the next in the reel starts in the same element.
  const playNext = (e: SyntheticEvent<HTMLVideoElement>) => {
    if (!reel || reel.length < 2) return;
    const video = e.currentTarget;
    const next = (Number(video.dataset.index ?? 0) + 1) % reel.length;
    video.dataset.index = String(next);
    video.src = reel[next];
    void video.play().catch(() => {});
  };

  return (
    <div
      className="living"
      aria-hidden="true"
      style={
        {
          "--tile-accent": accentOf(accent),
          ...(accentLight ? { "--tile-accent-light": accentOf(accentLight) } : {}),
        } as CSSProperties
      }
    >
      {src ? (
        <img className="living-shot" src={src} alt="" loading="lazy" draggable={false} />
      ) : reel ? (
        <video
          className="living-shot living-video"
          src={reel[0]}
          muted
          playsInline
          loop={reel.length === 1}
          preload="none"
          onEnded={playNext}
        />
      ) : (
        <div className="living-track">
          <div className="lp-nav">
            <i className="lp-dot" />
            <i className="lp-line lp-w20" />
            <i className="lp-pill" />
          </div>
          <div className="lp-hero">
            <i className="lp-line lp-heading lp-w80" />
            <i className="lp-line lp-heading lp-w60" />
            <i className="lp-line lp-w70" />
            <i className="lp-button" />
          </div>
          <i className="lp-image" />
          <div className="lp-cards">
            <i />
            <i />
            <i />
          </div>
          <i className="lp-line lp-w90" />
          <i className="lp-line lp-w75" />
          <i className="lp-image lp-image-alt" />
          <i className="lp-line lp-w60" />
          <i className="lp-line lp-w80" />
          <div className="lp-footer">
            <i className="lp-line lp-w30" />
            <i className="lp-pill" />
          </div>
        </div>
      )}
      <i className="living-rail">
        <i className="living-thumb" />
      </i>
    </div>
  );
}
