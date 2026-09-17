import type { ReactNode } from "react";
import type { Site } from "@/lib/content";
import { socialLinks, type SocialKey } from "@/lib/links";

const ICONS: Record<SocialKey, ReactNode> = {
  email: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  phone: (
    <path d="M5 4h3.5l1.8 4.6-2.3 1.4a11 11 0 0 0 6 6l1.4-2.3L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z" />
  ),
  whatsapp: (
    <>
      <path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3.2 3.2z" />
      <path d="M9.2 8.8c-.3 2.9 2.9 6.1 5.8 5.8l.8-1.3-1.8-1-1 .7a4 4 0 0 1-2.2-2.2l.7-1-1-1.8z" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10.5V17M8 7.5v.01M12 17v-6.5M12 13.5c0-1.7 1-3 2.5-3s2.5 1.3 2.5 3V17" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5v.01" />
    </>
  ),
  github: (
    <path d="M9 19c-4 1.5-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  ),
  x: <path d="M4 4l16 16M20 4 4 20" />,
};

/** Renders nothing when no contact or social links are filled in. */
export default function SocialDock({ site, className = "" }: { site: Site; className?: string }) {
  const links = socialLinks(site);
  if (!links.length) return null;
  return (
    <ul className={`dock ${className}`.trim()}>
      {links.map((link) => (
        <li key={link.key}>
          <a
            href={link.href}
            aria-label={link.label}
            title={link.label}
            {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {ICONS[link.key]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
