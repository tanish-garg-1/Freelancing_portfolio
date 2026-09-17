import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Anton, Geist_Mono, Instrument_Sans, Instrument_Serif, Roboto_Flex } from "next/font/google";
import Script from "next/script";
import IntroLoader from "@/components/IntroLoader";
import SiteNav from "@/components/SiteNav";
import SmoothScroll from "@/components/SmoothScroll";
import { getSite } from "@/lib/content";
import "./globals.css";

const display = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body" });
/** Variable width + weight font for the hero name's pointer effect. */
const nameFont = Roboto_Flex({ subsets: ["latin"], weight: "variable", axes: ["wdth"], variable: "--font-name" });
/** Small uppercase metadata labels: availability, local time, counts, tags. */
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
/** The single serif-italic moment: the role in the intro, and the name on the loader. */
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: "italic", variable: "--font-serif" });

/**
 * Runs before first paint: applies the saved theme so switching never flashes (light is the default),
 * and hides the intro loader for visitors who already saw it this session.
 */
const BOOT_SCRIPT = `try{var d=document.documentElement,t=localStorage.getItem("theme");if(t==="light"||t==="dark")d.setAttribute("data-theme",t);if(sessionStorage.getItem("intro-seen")==="1")d.classList.add("intro-seen")}catch(e){}`;

/** Browser chrome (mobile address bar) matches the default light background. */
export const viewport: Viewport = { themeColor: "#efeae3", colorScheme: "light dark" };

export function generateMetadata(): Metadata {
  const site = getSite();
  const name = site.name ?? "Portfolio";
  return {
    title: { default: site.role ? `${name}, ${site.role}` : name, template: `%s | ${name}` },
    description: site.intro ?? "Websites, CRM dashboards, videos, and AI chatbots.",
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const site = getSite();
  const fonts = [display, body, nameFont, mono, serif].map((f) => f.variable).join(" ");
  return (
    <html lang="en" data-theme="light" className={fonts} suppressHydrationWarning>
      <body>
        <Script id="boot" strategy="beforeInteractive">
          {BOOT_SCRIPT}
        </Script>
        <noscript>
          <style>{`.intro-loader{display:none}`}</style>
        </noscript>
        <IntroLoader label={site.name} />
        <SmoothScroll />
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        <SiteNav site={site} />
        <div id="content">{children}</div>
      </body>
    </html>
  );
}
