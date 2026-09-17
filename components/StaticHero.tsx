import type { Site } from "@/lib/content";
import HeroMeta from "@/components/HeroMeta";
import { ArrowRight } from "@/components/Icon";
import RepelText from "@/components/RepelText";
import { contactHref, whatsappHref } from "@/lib/links";

/**
 * Mono metadata line, the name, then one sentence that carries the role. The role is the single
 * serif-italic moment on the page; the name keeps its variable-font pointer effect. Below it sits
 * the page's primary action: start a project (email first, then WhatsApp), plus a WhatsApp chat
 * button when both are filled in.
 */
export default function StaticHero({ site }: { site: Site }) {
  const role = site.role?.replace(/[.\s]+$/, "");
  const contact = contactHref(site);
  const whatsapp = site.email ? whatsappHref(site.whatsapp) : undefined;
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
      {contact && (
        <div className="hero-actions">
          <a className="pill hero-cta" href={contact}>
            Start a project
            <ArrowRight />
          </a>
          {whatsapp && (
            <a className="pill pill-ghost" href={whatsapp} target="_blank" rel="noopener noreferrer">
              Chat on WhatsApp
            </a>
          )}
        </div>
      )}
    </>
  );
}
