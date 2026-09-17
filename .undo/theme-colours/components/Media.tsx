import { placeholderBackground } from "@/lib/visual";

type Props = {
  src?: string;
  title: string;
  accent?: string;
  className?: string;
  /** Draw the title on the placeholder. Off by default: the title is always shown beside it. */
  showTitle?: boolean;
};

/** An image when `src` exists, otherwise a glow-gradient placeholder — images are never required. */
export default function Media({ src, title, accent, className = "", showTitle = false }: Props) {
  if (src) {
    return <img className={`media ${className}`} src={src} alt={title} loading="lazy" draggable={false} />;
  }
  return (
    <div
      className={`media media-placeholder ${className}`}
      style={{ background: placeholderBackground(accent) }}
      role="img"
      aria-label={title}
    >
      {showTitle && <span>{title}</span>}
    </div>
  );
}
