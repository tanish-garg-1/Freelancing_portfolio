"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Media from "./Media";
import { ArrowLeft } from "./Icon";
import type { Brand, Project } from "@/lib/content";

const ALL = "All";
/** Search param that holds the open folder, so Back closes it and a folder can be linked to. */
const FOLDER_PARAM = "folder";
/** Fanned card positions for a folder's thumbnails by how many there are; the first one sits in front. */
const FAN: Record<number, { x: number; r: number }[]> = {
  1: [{ x: 0, r: 0 }],
  2: [
    { x: -22, r: -6 },
    { x: 22, r: 6 },
  ],
  3: [
    { x: 0, r: 0 },
    { x: -40, r: -9 },
    { x: 40, r: 9 },
  ],
};

type Props = {
  projects: Project[];
  /** Brands with work in this category; each becomes a folder in the "All" view. */
  brands?: Brand[];
  categoryTitle: string;
  accent?: string;
  hireHref?: string;
};

function readFolder() {
  return new URLSearchParams(window.location.search).get(FOLDER_PARAM);
}

export default function ProjectGrid({ projects, brands = [], categoryTitle, accent, hireHref }: Props) {
  const tags = useMemo(() => Array.from(new Set(projects.flatMap((p) => p.tags ?? []))), [projects]);
  const [active, setActive] = useState(ALL);
  const [folderSlug, setFolderSlug] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setFolderSlug(readFolder());
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  if (!projects.length) {
    // Normally unreachable from home (empty categories are hidden), but a direct link must not dead-end.
    return (
      <div className="empty">
        <h2 className="empty-title">No projects here yet.</h2>
        <p className="empty-line">Want to be the first? Tell me what you need.</p>
        <div className="empty-actions">
          {hireHref && (
            <a className="pill" href={hireHref}>
              Start a project
            </a>
          )}
          <Link href="/" className="text-link">
            <ArrowLeft />
            All work
          </Link>
        </div>
      </div>
    );
  }

  const inBrand = (slug: string) => projects.filter((p) => p.brand === slug);
  const folder = brands.find((b) => b.slug === folderSlug);
  const unit = projects.every((p) => p.videoUrl) ? ["video", "videos"] : ["project", "projects"];
  const countLabel = (n: number) => `${n} ${n === 1 ? unit[0] : unit[1]}`;

  const openFolder = (slug: string) => {
    window.history.pushState(null, "", `?${FOLDER_PARAM}=${encodeURIComponent(slug)}`);
    setFolderSlug(slug);
    setActive(ALL);
  };
  const closeFolder = () => {
    window.history.pushState(null, "", window.location.pathname);
    setFolderSlug(null);
  };

  // An open folder shows just its work, under its own heading.
  if (folder) {
    const items = inBrand(folder.slug);
    return (
      <>
        <div className="folder-head">
          <button type="button" className="back" onClick={closeFolder}>
            <ArrowLeft />
            All {categoryTitle.toLowerCase()}
          </button>
          <h2 className="display folder-title">{folder.title}</h2>
          <p className="folder-sub meta">
            {folder.subtitle && <>{folder.subtitle} · </>}
            {countLabel(items.length)}
          </p>
        </div>
        <ProjectTiles items={items} accent={accent} />
      </>
    );
  }

  // "All" groups branded work into folders; a tag shows every match, across folders.
  const grouped = active === ALL && brands.length > 0;
  const shown = active === ALL ? projects : projects.filter((p) => p.tags?.includes(active));
  const loose = grouped ? shown.filter((p) => !brands.some((b) => b.slug === p.brand)) : shown;

  return (
    <>
      {/* filter tabs only appear once projects have tags */}
      {tags.length > 0 && (
        <div className="filters" role="group" aria-label="Filter projects">
          {[ALL, ...tags].map((tag) => (
            <button
              key={tag}
              type="button"
              className="filter"
              aria-pressed={active === tag}
              onClick={() => setActive(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
      <ul className="work-grid">
        {grouped &&
          brands.map((brand) => {
            const items = inBrand(brand.slug);
            const fan = FAN[Math.min(items.length, 3)] ?? FAN[1];
            return (
              <li key={`folder-${brand.slug}`}>
                <button type="button" className="work-tile folder-tile" onClick={() => openFolder(brand.slug)}>
                  <div className="work-media folder-media">
                    {items.slice(0, 3).map((p, i) => (
                      <span
                        key={p.slug}
                        className="folder-card"
                        style={{ "--x": `${fan[i].x}%`, "--r": `${fan[i].r}deg`, zIndex: 3 - i } as CSSProperties}
                      >
                        <Media src={p.thumbnail} title="" accent={accent} />
                      </span>
                    ))}
                  </div>
                  <div className="work-body">
                    <p className="meta folder-meta">Folder · {countLabel(items.length)}</p>
                    <h2 className="work-title">{brand.title}</h2>
                    {brand.subtitle && <p className="work-summary">{brand.subtitle}</p>}
                  </div>
                </button>
              </li>
            );
          })}
        <ProjectTiles items={loose} accent={accent} bare />
      </ul>
    </>
  );
}

/** Square tiles with the arc's focus treatment, so the page continues the home language. */
function ProjectTiles({ items, accent, bare = false }: { items: Project[]; accent?: string; bare?: boolean }) {
  const tiles = items.map((project) => (
    <li key={project.slug}>
      <Link className="work-tile" href={`/work/${project.category}/${project.slug}`}>
        <div className="work-media">
          <Media src={project.thumbnail} title={project.title} accent={accent} />
        </div>
        <div className="work-body">
          <h2 className="work-title">{project.title}</h2>
          {project.summary && <p className="work-summary">{project.summary}</p>}
          {project.tags && (
            <ul className="tags">
              {project.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}
        </div>
      </Link>
    </li>
  ));
  return bare ? <>{tiles}</> : <ul className="work-grid">{tiles}</ul>;
}
