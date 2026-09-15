import Link from "next/link";
import type { Site } from "@/lib/content";
import { contactHref } from "@/lib/links";
import ThemeToggle from "./ThemeToggle";

function initials(name?: string) {
  if (!name) return undefined;
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function SiteNav({ site }: { site: Site }) {
  const hire = contactHref(site);
  const mark = initials(site.name);
  return (
    <header className="site-nav">
      <Link href="/" className="nav-logo" aria-label={site.name ? `${site.name}, home` : "Home"}>
        <span className="nav-mark" aria-hidden="true">
          {mark ?? <span className="nav-dot" />}
        </span>
        {site.name && <span className="nav-name">{site.name}</span>}
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
