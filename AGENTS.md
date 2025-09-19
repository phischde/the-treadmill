# Repository Guidance

## Project Purpose
- This project houses the Eleventy-based microsite for Philippe Schrettenbrunner's short story *The Treadmill* at [https://treadmill.phisch.de/](https://treadmill.phisch.de/).
- The goal is to publish the story alongside companion pages (About, License, future derivative works) with accurate metadata for SEO and AI indexing.

## Content Inventory
- Story text lives in `THE_TREADMILL.md` (Markdown sources are inside `src/content/`).
- Supporting pages include About the Author, License, and room for future work.
- Site metadata such as title, author, and licensing details should remain current to support discovery tools.

## Design Direction
- Aim for a clean, elegant aesthetic with a black background, white text, and refined typography.
- Body text uses [EB Garamond](https://fonts.google.com/specimen/EB+Garamond); headings and navigation use [Raleway](https://fonts.google.com/specimen/Raleway) for contrast.
- The base font size should be 16pt (or other unit, depending) and follow professional type setting.
- Keep navigation minimal but stylish with an elegant top bar and smooth single-page scrolling.
- Primary color (links etc is #8de9ff), secondary color is #dd4516).
- Apply subtle fade-ins for sections, show a reading-progress indicator, and provide a font-size toggle (normal/large).
- Review accessibility considerations continuously (contrast, focus states, motion preferences).

## Implementation Guidelines
- Generate the site statically with Eleventy (11ty) and Nunjucks layouts; render the full story into HTML for SEO.
- Author content in Markdown and keep templates modular.
- Load JavaScript modules (progress, fade-ins, font toggle) deferentially to preserve performance.
- Self-host required assets, including EB Garamond and Raleway font files (WOFF2 format).
- Integrate the Matomo analytics snippet via an include; supply the production snippet before deploying.
- Prepare mobile-first, responsive CSS with careful attention to typography and spacing.

## Technology & Tooling
### Primary Stack
- Eleventy (11ty) static site generator with Nunjucks templates.
- PostCSS (autoprefixer, cssnano) for stylesheet processing.
- esbuild for bundling and minifying JavaScript.
- `sharp`/`@11ty/eleventy-img` for generating responsive images (AVIF/WEBP with JPEG fallbacks).

### Build & Utility Scripts
```json
{
  "scripts": {
    "dev": "eleventy --serve",
    "build:css": "postcss src/assets/css/main.css -o dist/assets/css/main.css",
    "build:js": "esbuild src/assets/js/*.js --bundle --minify --outdir=dist/assets/js --format=esm",
    "build:img": "node scripts/build-images.mjs",
    "build": "ELEVENTY_ENV=prod eleventy && npm-run-all -p build:css build:js build:img",
    "serve": "eleventy --serve"
  }
}
```

## Directory Layout
```
.
├─ package.json
├─ eleventy.config.js
├─ public/                     # static assets copied verbatim (favicons, robots, social images)
├─ src/
│  ├─ assets/
│  │  ├─ fonts/                # self-hosted EB Garamond & Raleway (WOFF2)
│  │  ├─ images/
│  │  ├─ css/
│  │  │  ├─ main.css
│  │  │  └─ typography.css
│  │  └─ js/
│  │     ├─ progress.js
│  │     ├─ fadein.js
│  │     └─ font-toggle.js
│  ├─ content/
│  │  ├─ THE_TREADMILL.md
│  │  ├─ about.md
│  │  └─ license.md
│  ├─ layouts/
│  │  ├─ base.njk
│  │  ├─ story.njk
│  │  └─ page.njk
│  ├─ includes/
│  │  ├─ head-meta.njk
│  │  ├─ header.njk
│  │  └─ footer.njk
│  ├─ data/
│  │  └─ site.json
│  └─ sitemap.njk
└─ dist/                        # generated static HTML output for deployment
```

## SEO & Metadata
- Embed canonical URLs, Open Graph, and Twitter card metadata in `head-meta.njk`.
- Include JSON-LD (`CreativeWork`/`ShortStory`) structured data with the story content.
- Generate sitemap and robots directives during the build.

## Accessibility
- Respect `prefers-reduced-motion` in animations and transitions.
- Maintain a minimum 4.5:1 contrast ratio, visible focus states, and a skip link.
- Keep text measures comfortable (65–75ch) with adequate line height.
