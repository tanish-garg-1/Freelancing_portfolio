import type { Site } from "./content";

export type SocialKey = "email" | "phone" | "whatsapp" | "linkedin" | "instagram" | "github" | "x";
export type SocialLink = { key: SocialKey; label: string; href: string; external: boolean };

export function whatsappHref(number?: string) {
  const digits = number?.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : undefined;
}

export function phoneHref(number?: string) {
  const dialable = number?.replace(/[^\d+]/g, "");
  return dialable && /\d/.test(dialable) ? `tel:${dialable}` : undefined;
}

/** Where "Hire me" / "Contact" point: email first, then WhatsApp. Undefined hides those buttons. */
export function contactHref(site: Site) {
  return site.email ? `mailto:${site.email}` : whatsappHref(site.whatsapp);
}

/** Where "Careers" points: a separate inbox, so applications don't mix with client enquiries. */
export function careersHref(site: Site) {
  if (!site.careersEmail) return undefined;
  const subject = encodeURIComponent(`Careers at ${site.name ?? "your studio"}`);
  return `mailto:${site.careersEmail}?subject=${subject}`;
}

export function socialLinks(site: Site): SocialLink[] {
  const s = site.socials ?? {};
  const candidates: [SocialKey, string, string | undefined, boolean][] = [
    ["email", "Email", site.email ? `mailto:${site.email}` : undefined, false],
    ["phone", "Call", phoneHref(site.phone), false],
    ["whatsapp", "WhatsApp", whatsappHref(site.whatsapp), true],
    ["linkedin", "LinkedIn", s.linkedin, true],
    ["instagram", "Instagram", s.instagram, true],
    ["github", "GitHub", s.github, true],
    ["x", "X", s.x, true],
  ];
  return candidates.flatMap(([key, label, href, external]) => (href ? [{ key, label, href, external }] : []));
}
