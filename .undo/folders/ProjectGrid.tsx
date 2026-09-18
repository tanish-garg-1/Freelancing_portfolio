"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Media from "./Media";
import { ArrowLeft } from "./Icon";
import type { Project } from "@/lib/content";

const ALL = "All";

type Props = { projects: Project[]; accent?: string; hireHref?: string };

export default function ProjectGrid({ projects, accent, hireHref }: Props) {
  const tags = useMemo(() => Array.from(new Set(projects.flatMap((p) => p.tags ?? []))), [projects]);
  const [active, setActive] = useState(ALL);

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

  const shown = active === ALL ? projects : projects.filter((p) => p.tags?.includes(active));

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
      {/* Square tiles with the arc's focus treatment, so the page continues the home language. */}
      <ul className="work-grid">
        {shown.map((project) => (
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
        ))}
      </ul>
    </>
  );
}
