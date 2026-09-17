import type { CSSProperties } from "react";
import { accentOf } from "@/lib/visual";

type Props = {
  /** Tall screenshot of real work. Without one, a sketched page in the category colour stands in. */
  src?: string;
  accent?: string;
};

/**
 * "Living tile": a page that slowly scrolls inside the focused arc tile, as if someone is browsing
 * the project. Purely decorative, so it is hidden from screen readers. CSS only runs the scroll
 * while the tile is focused.
 */
export default function LivingPreview({ src, accent }: Props) {
  return (
    <div className="living" aria-hidden="true" style={{ "--tile-accent": accentOf(accent) } as CSSProperties}>
      {src ? (
        <img className="living-shot" src={src} alt="" loading="lazy" draggable={false} />
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
