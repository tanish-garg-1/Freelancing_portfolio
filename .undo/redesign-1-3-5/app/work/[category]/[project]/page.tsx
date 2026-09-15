import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Media from "@/components/Media";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@/components/Icon";
import { getCategories, getCategory, getProject, getProjects, getSite } from "@/lib/content";
import { contactHref } from "@/lib/links";
import { accentOf, isVideoFile } from "@/lib/visual";

type Params = Promise<{ category: string; project: string }>;

export function generateStaticParams() {
  return getCategories().flatMap((c) => getProjects(c.slug).map((p) => ({ category: c.slug, project: p.slug })));
}

function find(categorySlug: string, projectSlug: string) {
  const category = getCategory(categorySlug);
  const project = category ? getProject(category.slug, projectSlug) : undefined;
  return { category, project };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category, project } = await params;
  const found = find(category, project).project;
  return found ? { title: found.title, description: found.summary } : {};
}

const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

export default async function ProjectPage({ params }: { params: Params }) {
  const slugs = await params;
  const { category, project } = find(slugs.category, slugs.project);
  if (!category || !project) notFound();

  // Every section is optional — a project with only a title still renders a clean page.
  const sections = [
    { heading: "Problem", body: project.problem },
    { heading: "Solution", body: project.solution },
    { heading: "Results", body: project.results },
  ].filter((s): s is { heading: string; body: string } => Boolean(s.body));

  const video = project.videoUrl;
  const inlineVideo = video && isVideoFile(video) ? video : undefined;
  const externalVideo = video && !inlineVideo ? video : undefined;

  const siblings = getProjects(category.slug);
  const position = siblings.findIndex((p) => p.slug === project.slug);
  const next = siblings.length > 1 ? siblings[(position + 1) % siblings.length] : undefined;
  const hire = contactHref(getSite());

  return (
    <main className="case" data-accent-scope="" style={{ "--accent": accentOf(category.accent) } as CSSProperties}>
      <div className="container">
        <Link href={`/work/${category.slug}`} className="back">
          <ArrowLeft />
          {category.title}
        </Link>
        <h1 className="display case-title">{project.title}</h1>
        {project.summary && <p className="lead">{project.summary}</p>}
        {project.tags && (
          <ul className="tags case-tags">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}

        {(project.liveUrl || externalVideo) && (
          <div className="case-actions">
            {project.liveUrl && (
              <a className="pill" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                Visit live site
                <ArrowUpRight />
              </a>
            )}
            {externalVideo && (
              <a className="pill pill-ghost" href={externalVideo} target="_blank" rel="noopener noreferrer">
                Watch video
                <ArrowUpRight />
              </a>
            )}
          </div>
        )}

        {/* No empty cover: media only renders when the project actually has some. */}
        {inlineVideo ? (
          <video className="case-video" src={inlineVideo} controls preload="metadata" poster={project.thumbnail} />
        ) : project.thumbnail ? (
          <Media className="case-cover" src={project.thumbnail} title={project.title} accent={category.accent} />
        ) : null}

        {sections.length > 0 && (
          <div className="case-sections">
            {sections.map((section) => (
              <section key={section.heading} className="case-section">
                <h2>{section.heading}</h2>
                {paragraphs(section.body).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </section>
            ))}
          </div>
        )}

        {project.gallery && (
          <div className="gallery">
            {project.gallery.map((src, i) => (
              <Media key={src} src={src} title={`${project.title} — image ${i + 1}`} accent={category.accent} />
            ))}
          </div>
        )}

        {(next || hire) && (
          <nav className={next ? "case-next" : "case-next case-next--solo"} aria-label="What's next">
            {next && (
              <Link href={`/work/${category.slug}/${next.slug}`} className="case-next-link">
                <span className="case-next-label">Next project</span>
                <span className="display case-next-title">
                  {next.title}
                  <ArrowRight />
                </span>
              </Link>
            )}
            {hire && (
              <div className="case-hire">
                <p>Have a project like this in mind?</p>
                <a className="pill" href={hire}>
                  Start a project
                </a>
              </div>
            )}
          </nav>
        )}
      </div>
    </main>
  );
}
