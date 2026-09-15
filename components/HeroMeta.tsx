"use client";

import { useEffect, useState } from "react";

type Props = { city?: string; timezone?: string; availability?: string };

/**
 * Small mono metadata line above the name: availability with a violet marker dot, then the city
 * and the owner's local time. The time is filled in after mount (the server can't know it), with a
 * same-width placeholder so the line doesn't shift.
 */
export default function HeroMeta({ city, timezone, availability }: Props) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    if (!timezone) return;
    let format: Intl.DateTimeFormat;
    try {
      format = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: timezone });
    } catch {
      return; // unknown time zone in site.json: just leave the time out
    }
    const update = () => setTime(format.format(new Date()));
    update();
    const id = window.setInterval(update, 20_000);
    return () => window.clearInterval(id);
  }, [timezone]);

  if (!availability && !city && !timezone) return null;

  return (
    <p className="hero-meta meta">
      {availability && (
        <span className="meta-item">
          <span className="meta-dot" aria-hidden="true" />
          {availability}
        </span>
      )}
      {(city || timezone) && (
        <span className="meta-item">
          {city}
          {city && timezone ? " " : null}
          {timezone && <time className="tabular">{time ?? "--:--"}</time>}
        </span>
      )}
    </p>
  );
}
