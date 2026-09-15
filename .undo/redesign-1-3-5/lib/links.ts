import type { Site } from "./content";

export type SocialKey = "email" | "whatsapp" | "linkedin" | "instagram" | "github" | "x";
export type SocialLink = { key: SocialKey; label: string; href: string; external: boolean };

export function whatsappHref(number?: string) {
  const digits = number?.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : undefined;
}

/** Where "Hire me" / "Contact" point: email first, then WhatsApp. Undefined hides those buttons. */
export function contactHref(site: Site) {
  return site.email ? `mailto:${site.email}` : whatsappHref(site.whatsapp);
}

export function socialLinks(site: Site): SocialLink[] {
  const s = site.socials ?? {};
  const candidates: [SocialKey, string, string | undefined, boolean][] = [
    ["email", "Email", site.email ? `mailto:${site.email}` : undefined, false],
    ["whatsapp", "WhatsApp", whatsappHref(site.whatsapp), true],
    ["linkedin", "LinkedIn", s.linkedin, true],
    ["instagram", "Instagram", s.instagram, true],
    ["github", "GitHub", s.github, true],
    ["x", "X", s.x, true],
  ];
  return candidates.flatMap(([key, label, href, external]) => (href ? [{ key, label, href, external }] : []));
}
