import fs from "node:fs";
import path from "node:path";

/*
 * The only module that reads portfolio content. Everything comes from JSON files in /content,
 * and EVERY field is optional: missing, empty ("") or invalid values become `undefined`, and the
 * UI simply leaves that element out. A title falls back to the file name. To move to a CMS later,
 * re-implement these functions and keep the returned shapes.
 */

export type Socials = { linkedin?: string; instagram?: string; github?: string; x?: string };

export type Site = {
  name?: string;
  role?: string;
  intro?: string;
  about?: string;
  email?: string;
  whatsapp?: string;
  socials?: Socials;
};

export type Category = {
  slug: string;
  title: string;
  oneLiner?: string;
  cover?: string;
  accent?: string;
  order?: number;
  projectCount: number;
};

export type Project = {
  slug: string;
  category: string;
  title: string;
  summary?: string;
  tags?: string[];
  thumbnail?: string;
  gallery?: string[];
  liveUrl?: string;
  videoUrl?: string;
  problem?: string;
  solution?: string;
  results?: string;
  order?: number;
};

const CONTENT_DIR = path.join(process.cwd(), "content");
const SLUG = /^[a-z0-9][a-z0-9_-]*$/i;

type Raw = Record<string, unknown>;

function readJson(file: string): Raw {
  try {
    const data: unknown = JSON.parse(fs.readFileSync(file, "utf8"));
    return data && typeof data === "object" && !Array.isArray(data) ? (data as Raw) : {};
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`[content] Ignoring ${path.relative(process.cwd(), file)}: ${(error as Error).message}`);
    }
    return {};
  }
}

function slugsIn(dir: string): string[] {
  let files: string[];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }
  return files
    .map((f) => f.slice(0, -".json".length))
    .filter((slug) => {
      if (SLUG.test(slug)) return true;
      console.warn(`[content] Skipping "${slug}.json": use only letters, numbers, - and _ in file names.`);
      return false;
    });
}

const text = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : undefined);

/** Only absolute http(s) URLs or site-relative paths like "/images/shot.png" are let through. */
const url = (v: unknown) => {
  const s = text(v);
  return s && (/^https?:\/\//i.test(s) || /^\/(?!\/)/.test(s)) ? s : undefined;
};

const email = (v: unknown) => {
  const s = text(v);
  return s && /^[^\s@]+@[^\s@]+$/.test(s) ? s : undefined;
};

function list<T>(v: unknown, pick: (x: unknown) => T | undefined): T[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out = v.map(pick).filter((x): x is T => x !== undefined);
  return out.length ? out : undefined;
}

const humanize = (slug: string) => slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const byOrder = <T extends { order?: number; title: string }>(a: T, b: T) =>
  (a.order ?? Infinity) - (b.order ?? Infinity) || a.title.localeCompare(b.title);

export function getSite(): Site {
  const raw = readJson(path.join(CONTENT_DIR, "site.json"));
  const socials = (raw.socials && typeof raw.socials === "object" ? raw.socials : {}) as Raw;
  return {
    name: text(raw.name),
    role: text(raw.role),
    intro: text(raw.intro),
    about: text(raw.about),
    email: email(raw.email),
    whatsapp: text(raw.whatsapp),
    socials: {
      linkedin: url(socials.linkedin),
      instagram: url(socials.instagram),
      github: url(socials.github),
      x: url(socials.x),
    },
  };
}

export function getProjects(category: string): Project[] {
  if (!SLUG.test(category)) return [];
  const dir = path.join(CONTENT_DIR, "projects", category);
  return slugsIn(dir)
    .map((slug): Project => {
      const raw = readJson(path.join(dir, `${slug}.json`));
      return {
        slug,
        category,
        title: text(raw.title) ?? humanize(slug),
        summary: text(raw.summary),
        tags: list(raw.tags, text),
        thumbnail: url(raw.thumbnail),
        gallery: list(raw.gallery, url),
        liveUrl: url(raw.liveUrl),
        videoUrl: url(raw.videoUrl),
        problem: text(raw.problem),
        solution: text(raw.solution),
        results: text(raw.results),
        order: num(raw.order),
      };
    })
    .sort(byOrder);
}

export function getCategories(): Category[] {
  const dir = path.join(CONTENT_DIR, "categories");
  return slugsIn(dir)
    .map((slug): Category => {
      const raw = readJson(path.join(dir, `${slug}.json`));
      return {
        slug,
        title: text(raw.title) ?? humanize(slug),
        oneLiner: text(raw.oneLiner),
        cover: url(raw.cover),
        accent: text(raw.accent),
        order: num(raw.order),
        projectCount: getProjects(slug).length,
      };
    })
    .sort(byOrder);
}

export const getCategory = (slug: string) => getCategories().find((c) => c.slug === slug);

export const getProject = (category: string, slug: string) =>
  getProjects(category).find((p) => p.slug === slug);
