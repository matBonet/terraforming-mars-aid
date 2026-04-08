# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Dev server at localhost:3000
npm test         # Run tests (interactive watch mode)
npm run build    # Production build
npm run deploy   # Build and deploy to GitHub Pages (gh-pages)
```

To run a single test file: `npm test -- --testPathPattern=App.test.js`

## Architecture

This is a Create React App single-page app that randomizes Milestones & Awards for the Terraforming Mars board game. It is deployed to GitHub Pages at `matbonet.github.io/terraforming-mars-aid`.

**Data flow:**
1. `App.js` reads URL query parameters (`exclude_milestones`, `exclude_awards`, `max_pair_synergy`, `max_total_synergy`) at module load time (not inside the component).
2. `generateMilestonesAwards()` in `randomizer.js` runs once on page load and returns `{ milestones, awards, synergies }`.
3. Results are passed to `MilestonesAwards` → `Card` components for rendering.

**Key data files in `src/ma-data/`:**
- `milestones.json` / `awards.json` — keyed by a short slug (e.g. `"builder"`, `"landlord"`). Each entry has `name`, `description`, `official`, `source`.
- `synergies.json` — nested object `{ slug1: { slug2: score } }` where keys are always in alphabetical order (lower key first).

**Randomization algorithm (`randomizer.js`):**
- Picks milestones and awards alternately, keeping counts balanced.
- Each candidate is rejected probabilistically based on its pairwise synergy with already-selected items, using a linear-decrease probability curve (`probCurve`).
- After filling 10 slots, if total synergy exceeds `maxTotalSynergy` the selection is restarted.

**Responsive layout (`App.js`):**
- Uses `useWindowSize` hook; renders a horizontal layout (`body-ma-h`) when `width >= 1.3 * height`, vertical (`body-ma-v`) otherwise.

**Card icons:** `public/ma-icons/<slug>.png`. If the image fails to load, the `onError` handler in `Card.js` swaps the `className` to show the title text as a fallback.

**URL parameter convention:** expansion-specific links exclude certain slugs via `exclude_milestones` and `exclude_awards` comma-separated lists (see README for per-expansion examples).
