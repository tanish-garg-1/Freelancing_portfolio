import type { Category } from "@/lib/content";
import { ArrowRight, ChevronDown, ChevronUp } from "./Icon";

type Props = {
  categories: Category[];
  index: number;
  onOpen: () => void;
  /** One-time swipe hint for touch devices. */
  touchHint: boolean;
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function FocusInfo({ categories, index, onOpen, touchHint }: Props) {
  const category = categories[index];
  const count = category.projectCount;

  return (
    <div className="focus-info">
      {/* keyed so the text re-animates each time the focused tile changes */}
      <div key={category.slug} className="focus-swap" aria-live="polite">
        <h2 className="display focus-title">{category.title}</h2>
        {category.oneLiner && <p className="focus-line">{category.oneLiner}</p>}
      </div>

      <div className="focus-actions">
        <button type="button" className="focus-open" onClick={onOpen}>
          <span className="tabular">
            {count > 0 ? `View ${count} ${count === 1 ? "project" : "projects"}` : "Take a look"}
          </span>
          <ArrowRight />
        </button>

        {categories.length > 1 && (
          <p className="arc-count meta tabular">
            <span className="arc-count-now">{pad(index + 1)}</span>
            <span aria-hidden="true"> / </span>
            <span className="sr-only"> of </span>
            {pad(categories.length)}
          </p>
        )}
      </div>

      <p className="focus-hint focus-hint-keys">
        <span className="kbd-group">
          <kbd>
            <ChevronUp />
            <span className="sr-only">Up arrow</span>
          </kbd>
          <kbd>
            <ChevronDown />
            <span className="sr-only">Down arrow</span>
          </kbd>
        </span>
        <span>or scroll to browse,</span>
        <kbd>Enter</kbd>
        <span>to open</span>
      </p>
      {touchHint && (
        <p className="focus-hint focus-hint-touch" role="status">
          Swipe the tiles to browse
        </p>
      )}
    </div>
  );
}
