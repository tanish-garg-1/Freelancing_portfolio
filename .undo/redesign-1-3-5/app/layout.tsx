import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Anton, Instrument_Sans, Roboto_Flex } from "next/font/google";
import Script from "next/script";
import SiteNav from "@/components/SiteNav";
import { getSite } from "@/lib/content";
import "./globals.css";

const display = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body" });
/** Variable width + weight font for the hero name's pointer effect. */
const nameFont = Roboto_Flex({ subsets: ["latin"], weight: "variable", axes: ["wdth"], variable: "--font-name" });

/** Runs before first paint: applies the saved theme so switching never flashes. Dark is the default. */
const THEME_SCRIPT = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

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
  return (
    <html lang="en" data-theme="dark" className={`${display.variable} ${body.variable} ${nameFont.variable}`} suppressHydrationWarning>
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_SCRIPT}
        </Script>
        <SiteNav site={site} />
        {children}
      </body>
    </html>
  );
}
