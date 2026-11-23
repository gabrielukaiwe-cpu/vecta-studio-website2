# Vecta Studio website

React 19 + Vite 7. Three pages, one project:

- **Home** (all sections: hero, problem, tools, use cases, how it works, stories, pricing, FAQ, final call to action, footer)
- **Developer** (`#developer`): connect an agent, tools, limits, errors, prompts
- **Community** (`#community`): channels, showcase, guides, quotes

Light and dark mode toggle is in the header. Pages switch by the web address ending (`#developer`, `#community`), so it works on any static host with no server rules.

## Run it
- **Windows:** double-click `start.bat`.
- **Mac:** double-click `start.command` (first time: right-click, Open).
- **VS Code:** File > Open Folder, pick this folder, open the terminal and run `npm install` (first time), then `npm run dev`.

You need Node.js 20 or newer (https://nodejs.org). The browser opens by itself. Ctrl + C stops it.

## Put it live
**GitHub Pages (already set up):** every push to the `main` branch builds the site and publishes it, using `.github/workflows/deploy.yml`. In the repository, open Settings, then Pages, and set Source to "GitHub Actions" once.

**Any other static host:**
1. `npm run build` creates a `dist` folder.
2. Upload the contents of `dist` to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages or your own server). No server code is needed.
3. Point the domain at it.

`npm run preview` shows the built version locally before uploading.

## Where things are
- `src/pages/` Developer and Community pages
- `src/components/` one file per section, plus Header, Footer, DotField (the water-like dots), TypedTitle (keyboard typing), LoopVideo (muted loops with sound button)
- `src/hooks/` typing effect, grow-from-a-box scroll, reveal, light/dark theme
- `src/styles/global.css` all styles and colours (the main colours are at the top)
- `public/media/` compressed video clips and posters

## Before launch
- Links to app.vectastudio.ai, Terms, Privacy, Contact and the social channels are real. Check them once on the final domain.
- The Community page is new and not on the current site yet.
- Videos are samples; swap files in `public/media/` with the same names to change them.
