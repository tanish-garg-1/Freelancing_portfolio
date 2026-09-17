import type { Site } from "@/lib/content";
import HeroMeta from "@/components/HeroMeta";
import RepelText from "@/components/RepelText";

/**
 * Mono metadata line, the name, then one sentence that carries the role. The role is the single
 * serif-italic moment on the page; the name keeps its variable-font pointer effect.
 */
export default function StaticHero({ site }: { site: Site }) {
  const role = site.role?.replace(/[.\s]+$/, "");
  return (
    <>
      <HeroMeta city={site.city} timezone={site.timezone} availability={site.availability} />
      {site.name && <RepelText text={site.name} className="display hero-name" />}
      {(role || site.intro) && (
        <p className="hero-intro">
          {role && <em className="hero-role">{role}.</em>}
          {role && site.intro ? " " : null}
          {site.intro}
        </p>
      )}
    </>
  );
}
