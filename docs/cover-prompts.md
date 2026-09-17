# Category cover prompts: "Quiet luxury studio"

Chosen 2026-09-17. One hero object per category, photographed like an Apple / Aesop product shot.
Each prompt asks ChatGPT for a numbered 2×2 grid (4 options) so one can be picked per category.
The chosen cell is then regenerated alone at full size, compressed to WebP, saved to `public/covers/<slug>.webp`
and set as `"cover": "/covers/<slug>.webp"` in `content/categories/<slug>.json`.

Why these rules: covers show as small square arc tiles (~130–180px) and as a wide category banner
(`object-fit: cover`), so the subject must read instantly at thumbnail size and sit centred with generous
space around it. No text, no logos, no glow (site rule).

## Shared style block (pasted into every prompt)

> Premium quiet-luxury product photography. One hero object, centred, with generous negative space around it
> so it survives both a square crop and a wide 21:9 crop. Matte travertine or warm limestone surface and a
> seamless plaster backdrop in muted warm neutrals (bone, sand, greige, soft taupe). Soft, directional window
> light from the left, long gentle shadows, subtle film grain, shallow depth of field, 85mm lens, true-to-life
> materials (brushed aluminium, frosted glass, anodised metal, linen). A single restrained hint of {ACCENT}
> in one small detail only. Editorial, calm, expensive, minimal, like an Apple or Aesop campaign.
> No text, no words, no logos, no brand marks, no UI lettering, no people, no neon, no glow, no lens flare,
> no clutter.

## 1. Websites (accent: soft violet #8b5cf6)

> Create one image that is a 2×2 grid of four square options, separated by thin off-white gutters, with a
> small number 1–4 in the top-left corner of each cell (numbers only, nothing else).
> Subject: a slim aluminium laptop, lid open at a relaxed angle, its screen showing an elegant, abstract,
> text-free website layout (large image block, soft columns, one violet button shape).
> 1: three-quarter view on travertine with a folded linen cloth. 2: straight-on low angle, screen glowing softly
> against a plaster wall with an arched shadow. 3: laptop beside a matching tablet showing the same layout,
> a small ceramic vase. 4: top-down flat lay, laptop half-closed revealing the screen, a smooth stone paperweight.
> {SHARED STYLE, ACCENT = soft violet}

## 2. CRM Dashboards (accent: indigo #6366f1)

> Same 2×2 numbered grid format.
> Subject: a large ultra-thin monitor or tablet showing a refined, text-free analytics dashboard: clean line
> chart, a few rounded KPI cards, a donut chart, all in soft greys with one indigo data line.
> 1: monitor on a minimal oak and stone desk, three-quarter view. 2: tablet propped on a stone stand, close-up
> with shallow focus on the chart. 3: floating frosted-glass panels with chart shapes, suspended above a stone
> plinth. 4: top-down flat lay of a tablet with the dashboard, a leather notebook and a brass pen.
> {SHARED STYLE, ACCENT = indigo}

## 3. Videos (accent: magenta #d946ef)

> Same 2×2 numbered grid format.
> Subject: filmmaking gear as sculpture: a compact matte-black cinema camera with a prime lens.
> 1: camera on a stone plinth, three-quarter view, lens catching a soft reflection. 2: close-up macro of the lens
> glass with a faint magenta coating reflection. 3: camera on a small carbon tripod beside a clapperboard with no
> writing. 4: top-down flat lay: camera body, two prime lenses, a film reel, arranged on travertine.
> {SHARED STYLE, ACCENT = magenta, only as a lens-coating reflection}

## 4. AI Chatbots (accent: purple #a855f7)

> Same 2×2 numbered grid format.
> Subject: conversation made physical and calm, with no robots or faces.
> 1: a smartphone standing on a stone stand, screen showing abstract text-free chat bubbles (one purple bubble).
> 2: two frosted-glass speech-bubble sculptures resting on a plaster ledge, one tinted faintly purple.
> 3: a smooth ceramic smart-speaker-like object with a tiny purple light, beside a phone showing chat bubbles.
> 4: a translucent glass sphere with soft internal purple haze (not glowing), on a stone base, beside a phone.
> {SHARED STYLE, ACCENT = purple}

## Status (2026-09-17)

- All four 2×2 grids generated in ChatGPT chat "Create product grid image"
  (https://chatgpt.com/c/6aabd29e-bc24-83ee-a338-df15ed88f50a), account Tanish Garg (free plan).
- Picks "for now" (user not fully satisfied, expect another round): **Websites 2, CRM Dashboards 2, Videos 1, AI Chatbots 3**.
- Next: regenerate each pick as a single image, download (ask first), convert to WebP in `public/covers/`, set `"cover"`.
- Interrupted: while sending the Websites regeneration, ChatGPT went to /auth/logout ("Logging out of all accounts").
- Done: after signing in to a different account, the four picks were regenerated from full descriptions in chat
  "Product Image Prompt" (https://chatgpt.com/c/6aabe1d2-a7bc-83e8-953a-dd1e0974a46a), converted in-browser to WebP
  (q 0.86, 1254×1254, 83–127 KB) and saved to `public/covers/`. `"cover"` set in all four category files
  (backup `.undo/covers/`). Known limits: 1254px is soft when stretched across the wide banner, and the square
  image is cropped hard there; a wide 21:9 banner version per category would fix both.

## Final single-image regeneration (after a pick)

> Regenerate option {N} from the grid above as a single image, square 1:1 at the highest resolution, same
> composition, lighting and materials, subject centred with extra space on all sides. No numbers, no text.
