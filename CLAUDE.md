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

This is a Create React App single-page app that randomizes Milestones & Awards for the Terraforming Mars board game. Deployed to GitHub Pages at `matbonet.github.io/terraforming-mars-aid`.

### Data files (`src/ma-data/`)
- `milestones.json` / `awards.json` — keyed by slug (e.g. `"builder"`). Each entry has `name`, `description`, `official`, `source`.
- `synergies.json` — nested object `{ slug1: { slug2: score } }`. Keys always in alphabetical order (lower key first).

### Randomization (`src/randomizer.js`)
Pure functions — no side effects, no imports from store. Picks milestones and awards alternately to keep counts balanced. Each candidate is rejected probabilistically based on pairwise synergy with already-selected items using a linear-decay curve (`probCurve`). After all 10 slots are filled, total synergy is checked against `maxTotalSynergy`; if exceeded, the draw restarts.

### State management (`src/store.js`)
Zustand store with `persist` middleware (localStorage, version 2). Persisted keys: `availableMilestones`, `availableAwards`, `draw`, `showDescriptions`, `markers`. A `migrate` function filters stale slugs on load.

**State shape:**
- `draw: { milestones: string[], awards: string[] }` — current 5+5 selection
- `availableMilestones / availableAwards` — pool of enabled slugs
- `markers: { [slug]: 'red'|'yellow'|'green'|'black'|'blue' }` — player claim markers
- `pendingAction: fn | null` — queued action waiting for confirmation
- `showDescriptions: boolean`
- `error: string | null`

**Confirmation gate pattern:** Components call `requestAction(fn)` instead of actions directly. If any markers exist, `fn` is stored as `pendingAction` and a `ConfirmModal` appears. `confirmAction()` executes and clears it; `cancelAction()` discards it. All reroll/remove/rerandomize operations go through this gate. `setAvailable` (Settings) does not.

**Marker rules:** max 3 claimed per group (milestones or awards). Reroll/remove/rerandomize actions clear affected markers automatically.

### Platform detection (`src/hooks/usePlatform.js`)
Uses `(hover: none) and (pointer: coarse)` media query — detects touch/pointer capability, not viewport size. Returns `{ isMobile, isHorizontal }`. `isHorizontal` is true when `width >= 1.3 * height`.

### Component architecture
Barrel pattern for platform variants:
- `Card.js` → `Card.desktop.js` / `Card.mobile.js`
- `NavBar.js` → `NavBar.desktop.js` / `NavBar.mobile.js`

**Layout:** `App.js` renders `body-ma-h` (horizontal) or `body-ma-v` (vertical) based on `isHorizontal`. Desktop shows cards in a grid with per-card hover buttons; mobile fills the screen with cards and uses a floating bottom bar for Randomize/Settings.

**Key components:**
- `MilestonesAwards` — renders a group (milestones or awards) with a section pill (desktop) or plain cards (mobile)
- `Card.desktop` — shows reroll/exclude buttons on hover; cube marker row at bottom
- `Card.mobile` — opens `CardActionSheet` on tap
- `CardActionSheet` — bottom sheet with marker cube row, reroll, exclude
- `IsoCube` — SVG isometric cube; props: `color`, `size`. Colors: red/yellow/green/black/blue
- `ConfirmModal` — reads `pendingAction` from store directly; self-hides when null; rendered conditionally in `App.js`
- `SettingsModal` — expansion toggles, card toggles, descriptions toggle (desktop only)
- `HelpModal` — platform-aware tutorial, GitHub link, disclaimer

### Hooks
- `usePlatform()` — platform/layout detection (see above)
- `useBackButton(onClose)` — pushes a history entry on mount; intercepts browser back to call `onClose` instead. Used in all modals and `CardActionSheet`.

### Icons
All icons use `react-icons/fa6`: `FaRotateRight` (reroll), `FaXmark` (close/exclude), `FaGear` (settings), `FaCircleQuestion` (help). No unicode character fallbacks.

### Card images
`public/ma-icons/<slug>.png`. Cards without a matching image show their title text instead (controlled by `ICON_SLUGS` set in each Card variant).

### URL parameters
`exclude_milestones`, `exclude_awards` — comma-separated slug lists read at module load time in `App.js`. Used for expansion-specific links.
