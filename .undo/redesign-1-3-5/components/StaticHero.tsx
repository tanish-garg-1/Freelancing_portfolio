import type { Site } from "@/lib/content";
import RepelText from "@/components/RepelText";

/** Name, then one sentence that carries the role — no label stacked above the heading. */
export default function StaticHero({ site }: { site: Site }) {
  const role = site.role?.replace(/[.\s]+$/, "");
  return (
    <>
      {site.name && <RepelText text={site.name} className="display hero-name" />}
      {(role || site.intro) && (
        <p className="hero-intro">
          {role && <strong className="hero-role">{role}.</strong>}
          {role && site.intro ? " " : null}
          {site.intro}
        </p>
      )}
    </>
  );
}
