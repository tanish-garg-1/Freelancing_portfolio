# Portfolio handoff: continue from here

This file is for whoever picks the project up next (you on another machine, a teammate, or a new Claude chat).
Last updated: 2026-09-15.

## 1. Run it on a new computer
The share zip leaves out the heavy, machine-specific folders (`node_modules/`, `.next/`, `.node/`, `.npm-cache/`). To get running:

1. Install **Node.js 20 or newer** (or copy a portable Node into `.node\` and use `. .\activate.ps1`, as the original setup does).
2. In this folder run:
   ```bash
   npm install
   npm run dev
   ```
3. Open http://localhost:3000. `npm run build` makes a production build; `npm run lint` type-checks.

## 2. What the site is now
- **Stack:** Next.js 16 (App Router) + TypeScript + GSAP + Lenis. Content is JSON in `content/` (every field optional, see README.md).
- **Home:** fixed stage with an infinite arc carousel of category tiles (wheel, arrows, swipe; Enter/click expands the tile into the category banner).
- **Theme:** **light is the default**; dark is the toggle. Tokens live at the top of `app/globals.css`.
- **Look (directions 1 + 3 + 5, chosen after measuring 15 Awwwards portfolio winners):**
  - neutral grounds (`#f5f4f1` light / `#0b0b0c` dark), violet only as small markers (`--marker`);
  - Geist Mono uppercase labels, an availability + city + live-time line above the name (`components/HeroMeta.tsx`);
  - Instrument Serif italic on the role in the intro;
  - Emil Kowalski motion tokens (`--ease-out`, `--ease-in-out`, `:active` scale .97), Lenis smooth scroll on scrolling pages
    (`components/SmoothScroll.tsx`), a once-per-session `%` intro loader (`components/IntroLoader.tsx`).
- **Motion kept from earlier:** hero name letters swell under the cursor (`RepelText.tsx`, Roboto Flex variable font), the living tile (a page scrolls
  inside the focused tile), 3D tilt + sheen on the focused tile, the "YN" logo unfolding into the full name. No glows (removed on purpose).
- **Accessibility:** reduced-motion respected everywhere, a skip-to-content link, focus-visible rings, `theme-color` meta.

## 3. Fill these in (placeholders)
`content/site.json`: `name`, `role`, `intro`, `about`, `email`, socials, **`city: "Your City"`**, **`timezone: "UTC"`** (use an IANA zone such as
`"Asia/Kolkata"` or `"Europe/London"`), `availability`. The project JSON files in `content/projects/` are placeholders too.

## 4. Open tasks, in order
1. **Dark theme background** (the user said it feels empty). 8 options were generated in ChatGPT and saved in `design-assets/dark-backgrounds/`:
   grid A textures: 1 film grain, 2 dot grid, 3 grainy gradient into ink-violet, 4 blueprint lines;
   grid B objects: 5 black stone, 6 black silk, 7 particle planet edge, 8 torn black paper.
   **Not picked yet.** Suggestion: 3 or 1 as the base texture plus 7 behind the arc. Apply only under `[data-theme="dark"] .home`.
2. **Category cover images** (device-mockup covers in bright, sunlit, colour-blocked studio-photo colours, different per category). Websites 4-option
   grid generated but not picked; CRM Dashboards unverified; Videos and AI Chatbots still to do. Save to `public/covers/`, set `"cover"` in `content/categories/*.json`.
3. **Motion ideas not built yet:** numbered 1–38 in `brain/skills/web-motion-recipes/ideas-catalog.md` (e.g. 33 loader that cycles covers in brackets,
   34 photos inside a headline, 35 scattered letters on scroll, 37 grid↔list toggle, 24 arc as a real 3D path).

## 5. Undo backups
`.undo/<feature>/` holds the files as they were before each change: `living-tile`, `tile-tilt`, `logo-expand`, `remove-glow`,
`redesign-1-3-5` (with after-screenshots), `light-default`. Copy a folder's files back over the project to undo that step.

## 6. The "brain" (research that drives the design decisions)
If the bundle includes a `brain/` folder next to this project, it holds:
- `creative-library/`: design research (start at `INDEX.md`). Key files for this site:
  `videos/2026-09-15_portfolio-inspo-dissection.md` (measured fonts/colours/easing of award winners),
  `videos/2026-09-15_3d-portfolio-sites-live-research.md`, `principles/cover-image-craft.md`, `principles/ui-design-fundamentals.md`,
  `prompting/dark-background-texture-prompts.md`, `boards/2026-09-15/` (visual boards + specimen sheet), `scripts/` (site capture + dissection).
- `client-acquisition-library/`: playbook for finding freelance clients.
- `memory/`: the project handoff notes and working preferences (images over text, numbered options, ChatGPT image generation, undo backups, no glow).
- `skills/web-motion-recipes/`: the motion effects built on this site, with code and the numbered ideas catalog.

To continue with Claude, give it this file and `brain/memory/project_freelancing_portfolio.md` first.
