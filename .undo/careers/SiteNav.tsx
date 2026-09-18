import type { CSSProperties } from "react";
import Link from "next/link";
import type { Site } from "@/lib/content";
import { contactHref } from "@/lib/links";
import ThemeToggle from "./ThemeToggle";

/**
 * The logo mark: initials at rest ("YN"). On hover or keyboard focus the badge widens and the
 * rest of each word slides out letter by letter, spelling the full name.
 * Only the first two words show an initial at rest; any later words are hidden entirely.
 */
function LogoMark({ name }: { name: string }) {
  const words = name.split(/\s+/).filter(Boolean);
  return (
    <>
      {words.map((word, w) => {
        const initial = w < 2 ? word[0].toUpperCase() : "";
        const rest = Array.from(w < 2 ? word.slice(1) : word);
        return (
          <span key={w} className="logo-word">
            {initial && <span className="logo-initial">{initial}</span>}
            {rest.length > 0 && (
              <span className="logo-rest">
                <span>
                  {rest.map((char, i) => (
                    <i key={i} style={{ "--i": i } as CSSProperties}>
                      {char}
                    </i>
                  ))}
                </span>
              </span>
            )}
          </span>
        );
      })}
    </>
  );
}

export default function SiteNav({ site }: { site: Site }) {
  const hire = contactHref(site);
  return (
    <header className="site-nav">
      <Link href="/" className="nav-logo" aria-label={site.name ? `${site.name}, home` : "Home"}>
        <span className="nav-mark" aria-hidden="true">
          {site.name ? <LogoMark name={site.name} /> : <span className="nav-dot" />}
        </span>
      </Link>
      <nav className="nav-links" aria-label="Main">
        <Link href="/">Work</Link>
        {site.about && <Link href="/about">About</Link>}
        <ThemeToggle />
        {hire && (
          <a href={hire} className="pill">
            Hire me
          </a>
        )}
      </nav>
    </header>
  );
}
