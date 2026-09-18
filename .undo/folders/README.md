# Freelancing portfolio

A dark portfolio site built with Next.js and GSAP. The home page stays fixed, and square category tiles sit on a curved arc. Scroll, use the arrow keys, or swipe to rotate the arc, then press Enter or click the big tile to open that category.

## Run it

Everything, including Node itself, lives inside this folder, and nothing is installed globally.

```powershell
. .\activate.ps1   # use the portable Node in .node\ for this terminal
npm install        # only needed after a fresh copy
npm run dev        # http://localhost:3000
```

`npm run build` makes a production build. `npm run lint` type-checks the code.

## Add or edit content

All content lives in `content/` as JSON. **Every field is optional**, so leave a field out or set it to `""` and that part of the page just won't show. Missing images become glowing placeholders.

| File | What it controls |
| --- | --- |
| `content/site.json` | `name`, `role`, `intro`, `stats` (short proof points in one line on the home page, e.g. `["24 projects", "9 clients"]`), `about` (the About page only exists when this is set), `email`, `phone` (with country code; shows a call icon), `whatsapp`, and `socials` (`linkedin`, `instagram`, `github`, `x`). The "Hire me" button uses the email first, then WhatsApp. |
| `content/categories/<slug>.json` | One tile on the arc: `title`, `oneLiner`, `cover` (image), `accent` (hex like `#8b5cf6`, tints image placeholders; the dark theme uses one brass accent everywhere), `accentLight` (hex, the category colour in the light theme; falls back to clay), `order`. |
| `content/projects/<category-slug>/<slug>.json` | One project: `title`, `summary`, `tags` (these become filter tabs), `thumbnail`, `gallery` (list of images), `liveUrl`, `videoUrl` (`.mp4`/`.webm` plays inline, anything else becomes a "Watch video" button), `problem`, `solution`, `results`, `order`. |

- **Adding a category:** add a JSON file to `content/categories/`. It shows up on the arc automatically.
- **File names:** these become URLs, so use only letters, numbers, `-`, and `_`.
- **Images:** put them in `public/images/` and reference them as `"/images/name.jpg"`, or use a full `https://` URL.
- **Videos:** put `.mp4` or `.webm` files (about 5 MB each, H.264 MP4 plays everywhere) in a subfolder of `public/videos/`: `demo/` for self-initiated demo work, and one folder per brand for client work (e.g. `public/videos/brand-name/`). Reference them as `"videoUrl": "/videos/demo/name.mp4"` or `"/videos/brand-name/name.mp4"`. They play inline on the project page; set a `thumbnail` too, since it becomes the video's poster frame. Use lowercase names with `-` instead of spaces. Longer or larger videos belong on YouTube/Vimeo: paste that link as `videoUrl` and it becomes a "Watch video" button.
- **Placeholders:** the current content is all placeholder text, so replace or delete it.
