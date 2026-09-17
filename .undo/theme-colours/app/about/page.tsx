import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SocialDock from "@/components/SocialDock";
import { getSite } from "@/lib/content";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  const site = getSite();
  if (!site.about) notFound(); // the About link is hidden too when there's no about text

  return (
    <main className="case about">
      <div className="container">
        <h1 className="display case-title">{site.name ?? "About"}</h1>
        <div className="about-body">
          {site.about
            .split(/\n\s*\n/)
            .filter((p) => p.trim())
            .map((p, i) => (
              <p key={i}>{p.trim()}</p>
            ))}
        </div>
        <SocialDock site={site} className="about-dock" />
      </div>
    </main>
  );
}
