# Moods AI Homepage Designs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 10 fully independent SaaS homepage design explorations for Moods AI, each with unique visual identity, messaging, GSAP animations, and Remarkable aesthetic DNA.

**Architecture:** Each design is a self-contained `'use client'` React component with its own CSS Module and GSAP animations. Designs are code-split via `next/dynamic`. No shared component library — maximum creative independence per design.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, CSS Modules, GSAP (ScrollTrigger, ScrollToPlugin), Google Fonts

**Spec:** `docs/superpowers/specs/2026-03-25-moods-homepage-designs-spec.md`
**Product brief:** `/Users/stephan/Developer/MoodsAI/MOODSAIVIBE/frontend/docs/LANDING_PAGE_BRIEF.md`

**Testing note:** This is a visual design project — no unit tests. Verification is visual: `npm run dev` and check each design in browser. Each task ends with a build check (`npx tsc --noEmit`) to catch TypeScript errors without conflicting with parallel builds.

**Tailwind note:** The current `globals.css` imports `@tailwind base/components/utilities` but no existing code uses Tailwind classes (all designs use inline styles). We intentionally drop Tailwind from globals since all new designs use CSS Modules.

---

## Common Patterns (Read Before Any Design Task)

Every design component (Tasks 3-12) MUST follow these patterns:

### GSAP Boilerplate
```tsx
'use client'
import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './styles.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function DesignXX() {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    // Skip animations if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // All GSAP animations go here
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return <div ref={rootRef}>...</div>
}
```

### Z-Index Scale
- `1-10`: design content layers
- `50`: sticky navs within designs
- `100`: DesignNav component (shared, do not exceed)
- `999`: modals/overlays if any

### Shared Fonts (Available Globally)
These fonts are loaded in `globals.css` — do NOT re-import in CSS modules:
- Space Mono (400, 700)
- Crimson Pro (300-700, italic)
- EB Garamond (400-600, italic)

### Product Brief Access
The full product brief is at `/Users/stephan/Developer/MoodsAI/MOODSAIVIBE/frontend/docs/LANDING_PAGE_BRIEF.md`. Read this file to write accurate copy for each design's sections.

---

## File Map

### Infrastructure (shared)
| Action | File | Purpose |
|--------|------|---------|
| Modify | `package.json` | Add gsap dependency |
| Modify | `app/globals.css` | Minimal reset + shared font imports (Space Mono, Crimson Pro, EB Garamond) |
| Modify | `app/page.tsx` | Gallery page redesign with Remarkable aesthetic + CSS Module |
| Create | `app/page.module.css` | Gallery page styles |
| Modify | `app/designs/[id]/page.tsx` | Dynamic imports with next/dynamic |
| Modify | `components/DesignNav.tsx` | Restyle to Remarkable aesthetic |
| Create | `components/DesignNav.module.css` | DesignNav styles |
| Delete | `components/designs/Design01.tsx` through `Design10.tsx` | Remove old single-file prototypes |

### Per-Design (x10)
| Action | File | Purpose |
|--------|------|---------|
| Create | `components/designs/DesignXX/index.tsx` | 'use client' component with GSAP |
| Create | `components/designs/DesignXX/styles.module.css` | All styles for this design |

---

## Task 0: Infrastructure — Install GSAP & Clean Up

**Files:**
- Modify: `package.json`
- Delete: `components/designs/Design01.tsx` through `Design10.tsx`

- [ ] **Step 1: Install GSAP**

```bash
cd /Users/stephan/Developer/MoodsAI/moods-design
npm install gsap
```

- [ ] **Step 2: Delete old design files**

```bash
rm components/designs/Design01.tsx
rm components/designs/Design02.tsx
rm components/designs/Design03.tsx
rm components/designs/Design04.tsx
rm components/designs/Design05.tsx
rm components/designs/Design06.tsx
rm components/designs/Design07.tsx
rm components/designs/Design08.tsx
rm components/designs/Design09.tsx
rm components/designs/Design10.tsx
```

- [ ] **Step 3: Create directory structure for all 10 designs**

```bash
mkdir -p components/designs/Design{01,02,03,04,05,06,07,08,09,10}
```

- [ ] **Step 4: Create placeholder index.tsx for each design**

Each file should be a minimal `'use client'` component that renders the design name, so the app doesn't break while designs are built incrementally:

```tsx
// components/designs/Design01/index.tsx
'use client'
export default function Design01() {
  return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>Design 01 — The Manifesto (coming soon)</div>
}
```

Create the same pattern for Design02 through Design10, changing the name/number.

- [ ] **Step 5: Create empty CSS module files**

```bash
touch components/designs/Design{01,02,03,04,05,06,07,08,09,10}/styles.module.css
```

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json components/designs/
git commit -m "chore: install gsap, scaffold new design directory structure, remove old prototypes"
```

---

## Task 1: Infrastructure — Update Routing & Dynamic Imports

**Files:**
- Modify: `app/designs/[id]/page.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Update the dynamic route page to use next/dynamic imports**

Replace `app/designs/[id]/page.tsx` with:

```tsx
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import DesignNav from '@/components/DesignNav'

const designMap: Record<number, ReturnType<typeof dynamic>> = {
  1: dynamic(() => import('@/components/designs/Design01'), { ssr: false }),
  2: dynamic(() => import('@/components/designs/Design02'), { ssr: false }),
  3: dynamic(() => import('@/components/designs/Design03'), { ssr: false }),
  4: dynamic(() => import('@/components/designs/Design04'), { ssr: false }),
  5: dynamic(() => import('@/components/designs/Design05'), { ssr: false }),
  6: dynamic(() => import('@/components/designs/Design06'), { ssr: false }),
  7: dynamic(() => import('@/components/designs/Design07'), { ssr: false }),
  8: dynamic(() => import('@/components/designs/Design08'), { ssr: false }),
  9: dynamic(() => import('@/components/designs/Design09'), { ssr: false }),
  10: dynamic(() => import('@/components/designs/Design10'), { ssr: false }),
}

export function generateStaticParams() {
  return Array.from({ length: 10 }, (_, i) => ({ id: String(i + 1) }))
}

export default function DesignPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const DesignComponent = designMap[id]
  if (!DesignComponent) notFound()
  return (
    <>
      <DesignNav current={id} total={10} />
      <DesignComponent />
    </>
  )
}
```

- [ ] **Step 2: Update globals.css**

Replace `app/globals.css` with minimal reset + shared font imports for the 3 fonts used in 3+ designs:

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
/* NOTE: No scroll-behavior: smooth — it conflicts with GSAP ScrollTrigger snap scrolling */

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add app/designs/\[id\]/page.tsx app/globals.css
git commit -m "feat: switch to dynamic imports for code-splitting, update globals with shared fonts"
```

---

## Task 2: Infrastructure — DesignNav & Gallery Page

**Files:**
- Modify: `components/DesignNav.tsx`
- Create: `components/DesignNav.module.css`
- Modify: `app/page.tsx`
- Create: `app/page.module.css`

- [ ] **Step 1: Create DesignNav CSS module**

Create `components/DesignNav.module.css` with Remarkable aesthetic:
- Paper-grey background (#eeeae3) with 1px solid border (#d0cdc6)
- Space Mono font for numbers
- Pencil-grey text (#3a3a3a)
- Dot separators (·) between elements
- No backdrop blur, no dark background
- Fixed top-center, z-index 100
- Subtle box-shadow for depth

- [ ] **Step 2: Update DesignNav.tsx**

Convert `DesignNav.tsx` to use the CSS module. Keep the same functionality (prev/next/all links, current indicator) but apply Remarkable styling. Import styles from the module.

- [ ] **Step 3: Create Gallery page CSS module**

Create `app/page.module.css` with:
- Dot-grid background using `radial-gradient` (dots at 24px intervals, color #d0cdc6 on #eeeae3)
- Space Mono + Crimson Pro typography
- Card styles: white (#faf8f5), 1px border (#d0cdc6), no border-radius
- Hover: translateY(-2px), subtle shadow, dot-grid shifts via background-position
- Responsive grid (auto-fill, minmax 280px)

- [ ] **Step 4: Update Gallery page**

Rewrite `app/page.tsx` to use CSS module classes. Update design descriptions to reflect the new concepts:

```tsx
const designs = [
  { id: 1, name: 'The Manifesto', desc: 'Why mental healthcare documentation is broken' },
  { id: 2, name: 'The Blueprint', desc: 'The architectural plan for a modern practice' },
  { id: 3, name: 'The Notebook', desc: 'Your trusted companion, one page at a time' },
  { id: 4, name: 'The Grid', desc: 'A system of perfectly organized parts' },
  { id: 5, name: 'The Broadsheet', desc: 'Editorial authority, front-page treatment' },
  { id: 6, name: 'The Terminal', desc: 'Technical credibility, under the hood' },
  { id: 7, name: 'The Whitepaper', desc: 'Calm academic authority, peer-reviewed' },
  { id: 8, name: 'The Dashboard', desc: 'Show, don\'t tell — you\'re already inside' },
  { id: 9, name: 'The Letterpress', desc: 'Craft and care, stamped with intention' },
  { id: 10, name: 'The Remarkable', desc: 'Paper-perfect, dot-grid precision' },
]
```

- [ ] **Step 5: Verify dev server**

```bash
npm run dev
```

Open `http://localhost:3000`. Verify: gallery renders with dot-grid background, cards show new names, navigation to `/designs/1` shows placeholder without flash.

- [ ] **Step 6: Commit**

```bash
git add components/DesignNav.tsx components/DesignNav.module.css app/page.tsx app/page.module.css
git commit -m "feat: restyle gallery and nav to Remarkable aesthetic with CSS modules"
```

---

## Task 3: Design 01 — "The Manifesto"

**Files:**
- Modify: `components/designs/Design01/index.tsx`
- Modify: `components/designs/Design01/styles.module.css`

**Reference:** Spec section "Design 01 — The Manifesto"

**Key technical details:**
- Full-screen snap sections (7 sections, each 100vh) using `ScrollTrigger.snap` with `snapTo: 1/6` (6 intervals between 7 sections)
- Color: near-black (#1a1a1a) on warm off-white (#f5f2ed), red accent (#c44)
- Fonts: EB Garamond (headlines, loaded globally), IBM Plex Mono (body, import in CSS module)
- Character stagger: wrap each character of headline in `<span>`, animate with GSAP stagger
- Counter: GSAP tween from 0 to target number, snap to integers, displayed in monospace
- Tool merge: 10 absolutely positioned SVG icons, GSAP animates their x/y to center point + scale to 0, then Moods logo fades in
- Waveform → text: SVG waveform paths morph (using GSAP `attr` tween on path `d` attribute) into straight horizontal lines, then text fades in above
- `prefers-reduced-motion`: check `window.matchMedia('(prefers-reduced-motion: reduce)')` — if true, skip all GSAP, show all content immediately
- Mobile: keep snap but sections get `min-height: 100vh; height: auto` on < 768px

- [ ] **Step 1: Write CSS module**

Write `styles.module.css` with:
- Import IBM Plex Mono font
- Section styles (100vh, flex centering, backgrounds)
- Typography (headline sizes, counter style, feature list)
- Mobile breakpoints
- Paper grain texture overlay using SVG data URI

- [ ] **Step 2: Write component with all 7 sections**

Write `index.tsx` as a `'use client'` component:
- Use `useRef` for root container and key animated elements
- Use `useLayoutEffect` for GSAP setup with `gsap.context()`
- Register ScrollTrigger plugin
- Implement all 7 sections with full copy from product brief
- Character-wrap utility function for the headline
- Return cleanup function from useLayoutEffect

- [ ] **Step 3: Wire up GSAP animations**

Inside the `gsap.context()`:
- ScrollTrigger.create for snap scrolling
- Character stagger timeline for hero headline
- Counter tween for stats
- Tool icon merge animation (ScrollTrigger-driven)
- Waveform morph animation
- Parallax on hero text layers

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Navigate to `/designs/1`. Verify:
- Snap scrolling works between all 7 sections
- Headline characters stagger in
- Counter animates
- No console errors
- Mobile layout works at 375px width

- [ ] **Step 5: Type check**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add components/designs/Design01/
git commit -m "feat: implement Design 01 — The Manifesto (snap scroll, character stagger, counter)"
```

---

## Task 4: Design 02 — "The Blueprint"

**Files:**
- Modify: `components/designs/Design02/index.tsx`
- Modify: `components/designs/Design02/styles.module.css`

**Reference:** Spec section "Design 02 — The Blueprint"

**Key technical details:**
- Long scroll with sticky nav showing page indicators (01/08 ... 08/08)
- Color: blueprint blue-grey (#2c3e50) on warm white (#faf8f5), blue accent (#5a7fa0)
- Fonts: Space Mono (headings, global), Inter or DM Sans (body, import in CSS module)
- Horizontal scroll: pinned container with 6 panels at 80vw each. ScrollTrigger pin with `end: "+=" + (panelCount * 80vw - 100vw)`. Inner container uses `display: flex` and GSAP tweens `x` property.
- SVG path draw: use `stroke-dasharray` = path length, `stroke-dashoffset` starts at path length, GSAP tweens to 0
- Radial diagram: SVG with lines from center node to integration logos, paths draw on scroll
- Mobile: horizontal scroll converts to vertical stacked cards
- Section indicator in nav: tracks scroll position, updates current section number

- [ ] **Step 1: Write CSS module**

Import DM Sans. Define all section styles, the sticky nav with section indicators, horizontal scroll panel container, blueprint-style grid lines, and responsive breakpoints.

- [ ] **Step 2: Write component with 8 sections**

Build all sections. The hero has an SVG isometric floor plan (simple geometric shapes). Platform overview section contains 6 flex panels. Feature flowcharts use SVG with `<path>` elements. Integration diagram is an SVG radial layout.

- [ ] **Step 3: Wire up GSAP animations**

- ScrollTrigger for sticky nav section tracking
- Pinned horizontal scroll section: pin the container, tween inner `x` from 0 to -(totalWidth - viewportWidth)
- SVG path draw animations triggered per section
- Stagger reveals on nodes
- Leader line draw on pricing table

- [ ] **Step 4: Verify in browser**

Navigate to `/designs/2`. Verify horizontal scroll pins and scrolls correctly, SVG lines draw, nav indicators update. Check mobile fallback (vertical cards).

- [ ] **Step 5: Type check & commit**

```bash
npx tsc --noEmit
git add components/designs/Design02/
git commit -m "feat: implement Design 02 — The Blueprint (horizontal scroll, SVG path draw)"
```

---

## Task 5: Design 03 — "The Notebook"

**Files:**
- Modify: `components/designs/Design03/index.tsx`
- Modify: `components/designs/Design03/styles.module.css`

**Reference:** Spec section "Design 03 — The Notebook"

**Key technical details:**
- Long scroll, no visible nav. Right-edge tab markers for section jumps (position fixed, right: 0)
- Color: warm cream (#f7f4ef), pencil grey (#4a4a4a), red margin line (#d4a0a0), blue ink (#3a5a8c)
- Fonts: Caveat (accent, import in CSS), Crimson Pro (body, global), IBM Plex Mono (data, import in CSS)
- Typewriter effect: queue of characters, GSAP `delayedCall` or timeline with per-character `set` calls
- Notebook pages: each feature section has CSS `transform: rotate(random 1-2deg)`, `box-shadow` for stacking depth, torn-edge top via SVG clip-path or CSS mask
- Transcript reveal: `<p>` elements with `opacity: 0`, GSAP stagger reveal triggered by ScrollTrigger
- Ruled lines: `repeating-linear-gradient` background
- Mobile: pages stack without rotation, tabs become bottom dots

- [ ] **Step 1: Write CSS module**

Import Caveat and IBM Plex Mono. Ruled-line background, notebook page cards with rotation and shadow, tab markers, margin line (left border), responsive styles.

- [ ] **Step 2: Write component with 7 sections**

Hero with typewriter headline. 4-5 feature "notebook pages" (AI, Practice Management, Communication, HR, Analytics). AskMoody chat mockup on a notebook page. Transcript reveal section. Stats section. Pricing. CTA.

- [ ] **Step 3: Wire up GSAP animations**

- Typewriter: GSAP timeline with `to` per character span (opacity 0→1), staggered timing
- Page stack/unstack: ScrollTrigger per page, animate `rotation` and `y` offset
- Transcript lines: stagger reveal
- Parallax: different `scrollTrigger` speeds on stacked pages
- Tab markers: highlight based on scroll position

- [ ] **Step 4: Verify, type check, commit**

```bash
npm run dev  # verify at /designs/3
npx tsc --noEmit
git add components/designs/Design03/
git commit -m "feat: implement Design 03 — The Notebook (typewriter, page stacking, ruled lines)"
```

---

## Task 6: Design 04 — "The Grid"

**Files:**
- Modify: `components/designs/Design04/index.tsx`
- Modify: `components/designs/Design04/styles.module.css`

**Reference:** Spec section "Design 04 — The Grid"

**Key technical details:**
- Sticky nav with smooth-scroll anchors and progress indicator (thin line at top, width tracks scroll %)
- Color: paper white (#f2f0eb), charcoal (#2a2a2a), warm grey (#e8e5df), teal accent (#4a8c7f)
- Fonts: DM Sans (import in CSS), Space Mono (global)
- Bento grid: CSS Grid with `grid-template-columns` and `grid-template-rows`, named grid areas. Cards use `grid-column: span 2` etc.
- Mini-demos in cards: CSS-only tiny calendar (grid of colored dots), chat bubble (border + triangle), waveform (inline SVG bars), chart (SVG line)
- Breathing motion: GSAP `to` with `yoyo: true, repeat: -1, duration: 3` on y (0.5px)
- Timeline: horizontal flex, each step is a div, GSAP expands width/opacity per step on scroll
- Mobile: bento grid becomes single column, timeline becomes vertical

- [ ] **Step 1: Write CSS module**

Import DM Sans. Dot-grid background. Bento grid layout with named areas. Card styles. Mini-demo styles (calendar grid, chat bubble, waveform bars, chart SVG). Nav with progress bar. Responsive single-column fallback.

- [ ] **Step 2: Write component**

Minimal hero. Large bento grid section (8-10 cards with mini-demos covering: scheduling, AI chat, dictation, analytics, video, HR, leave management, billing, care chat, knowledge base). AI spotlight card. Workflow timeline (6 steps). Integration grid. Bento pricing. Footer.

- [ ] **Step 3: Wire up GSAP animations**

- Stagger reveal: `ScrollTrigger.batch` on cards with stagger
- Breathing: `gsap.to` each card with subtle y oscillation
- Timeline expand: pin the timeline section, expand steps sequentially
- Progress indicator: ScrollTrigger on body, update width of progress bar
- AI text stream in spotlight card

- [ ] **Step 4: Verify, type check, commit**

```bash
npm run dev  # verify at /designs/4
npx tsc --noEmit
git add components/designs/Design04/
git commit -m "feat: implement Design 04 — The Grid (bento layout, mini-demos, progress nav)"
```

---

## Task 7: Design 05 — "The Broadsheet"

**Files:**
- Modify: `components/designs/Design05/index.tsx`
- Modify: `components/designs/Design05/styles.module.css`

**Reference:** Spec section "Design 05 — The Broadsheet"

**Key technical details:**
- Long scroll with fixed masthead at top (z-index 50). Horizontal rules with section names as dividers.
- Color: newsprint (#f5f3ee), deep black (#111), aged paper (#e8e2d4), red dateline (#8b2020)
- Fonts: Playfair Display + Source Serif Pro + Courier Prime (all imported in CSS module)
- Multi-column layout: CSS `column-count: 3` for feature articles, with `break-inside: avoid` on article blocks
- Ink-bleed transition: overlay div with `clip-path: circle(0% at 50% 50%)`, GSAP tweens to `circle(150% at 50% 50%)` with blur, ~400ms total, triggered at section boundaries
- Classified ads: grid of small bordered boxes with monospace headers and serif body
- Mobile: columns collapse to 1, masthead becomes smaller

- [ ] **Step 1: Write CSS module**

Import Playfair Display, Source Serif Pro, Courier Prime. Masthead with horizontal rules. Column layouts. Article card styles. Classified ad grid. Pull quote styling (large italic, left border). Dateline formatting. Responsive column collapse.

- [ ] **Step 2: Write component with 6 sections**

Masthead (logo, date, edition). Above the fold (lead story on AI documentation, sidebar stats, illustration). Feature articles (4-5 articles covering product pillars in newspaper column layout). Opinion column (why we built Moods). Classifieds (pricing as ads). Back page (integrations, compliance, CTA).

- [ ] **Step 3: Wire up GSAP animations**

- Parallax between column blocks (slight y offset differences)
- Line-by-line text reveals via `clip-path: inset()` tween
- Ink-bleed overlay triggered between major sections
- Pull quotes slide in from edges
- All subtle — editorial restraint

- [ ] **Step 4: Verify, type check, commit**

```bash
npm run dev  # verify at /designs/5
npx tsc --noEmit
git add components/designs/Design05/
git commit -m "feat: implement Design 05 — The Broadsheet (newspaper layout, ink-bleed transitions)"
```

---

## Task 8: Design 06 — "The Terminal"

**Files:**
- Modify: `components/designs/Design06/index.tsx`
- Modify: `components/designs/Design06/styles.module.css`

**Reference:** Spec section "Design 06 — The Terminal"

**Key technical details:**
- Full-screen snap sections. Persistent terminal prompt in bottom-left (fixed, z-index 10) showing current "directory" that updates per section.
- Color: dark warm grey (#1e1e1e), soft green (#a8c89a), white (#e0e0e0), amber (#d4a843)
- Fonts: JetBrains Mono (import in CSS), EB Garamond (global, for blockquotes only)
- Typing animation utility: function that takes a string, target ref, and speed, returns a GSAP timeline. Reused across all sections.
- ASCII diagram: `<pre>` block with the diagram text, wrap each line in a `<span>`, GSAP stagger reveals lines
- Terminal table: monospace formatted pricing using template literals for alignment
- Scanline: overlay div with `height: 2px`, green, `opacity: 0.1`, GSAP tweens `y` from top to bottom (~600ms) on section transition
- Mobile: snap sections become auto-height, prompt moves to top

- [ ] **Step 1: Write CSS module**

Import JetBrains Mono. Dark background. Terminal-style text (green on dark). Prompt styling. Code block styling. Scanline overlay. Section styles. Cursor blink keyframe. Responsive adjustments.

- [ ] **Step 2: Write component with 7 sections**

Hero (boot sequence). System overview (ASCII diagram of platform modules). Features as commands (8-10 CLI-style feature presentations). Live AskMoody demo (terminal session). Security (certificate display). Pricing (terminal table). CTA (command).

- [ ] **Step 3: Wire up GSAP animations**

- Snap scrolling
- Typing utility function, called per section
- ASCII diagram line-by-line reveal
- Counter tick-ups on stats
- Scanline sweep between sections (ScrollTrigger `onEnter` per section)
- Prompt directory updates based on active section
- AskMoody streaming with variable-speed token reveal

- [ ] **Step 4: Verify, type check, commit**

```bash
npm run dev  # verify at /designs/6
npx tsc --noEmit
git add components/designs/Design06/
git commit -m "feat: implement Design 06 — The Terminal (typing animations, ASCII diagram, scanline)"
```

---

## Task 9: Design 07 — "The Whitepaper"

**Files:**
- Modify: `components/designs/Design07/index.tsx`
- Modify: `components/designs/Design07/styles.module.css`

**Reference:** Spec section "Design 07 — The Whitepaper"

**Key technical details:**
- Long scroll with sticky left sidebar TOC (position sticky, top 100px). Current section highlights via ScrollTrigger `onToggle`.
- Color: pure white (#fff), academic grey (#333), blue links (#2a5a8c), margin grey (#888)
- Fonts: EB Garamond (global), IBM Plex Mono (import in CSS), IBM Plex Sans (import in CSS)
- Academic structure: numbered headings (1., 1.1, 2., 2.1), indented abstracts, figure captions ("Fig. 1"), footnotes, dotted TOC leaders
- Margin notes: positioned absolutely to the left of main content (negative left offset), contain stats or callouts
- This is the quietest design — GSAP is minimal (opacity fades only, no transforms except margin notes)
- Mobile: sidebar TOC collapses to horizontal scrollable top bar or hamburger. Margin notes move inline.

- [ ] **Step 1: Write CSS module**

Import IBM Plex Mono and IBM Plex Sans. Two-column layout (sidebar + main). Academic typography (large line-height, proper heading hierarchy). Dotted leader TOC lines. Figure caption styles. Margin note positioning. Footnote styles. Responsive sidebar collapse.

- [ ] **Step 2: Write component with 10 sections**

Title page. Abstract. TOC (generated from section data). Chapter 1: The Problem (stats on GGZ admin burden). Chapter 2: The Platform (subsections per pillar). Chapter 3: AI Architecture (with "Fig." labeled diagrams). Chapter 4: Security. Appendix A: Pricing table. Appendix B: Integrations. References.

- [ ] **Step 3: Wire up GSAP animations**

- ScrollTrigger per section to update TOC highlight
- Gentle fade-in (opacity 0→1, duration 0.6s) on each section entering viewport
- Margin notes slide in from left (translateX -20px→0 + opacity)
- Figure captions fade in 200ms after figure enters viewport
- No snapping, no transforms on main content — just opacity

- [ ] **Step 4: Verify, type check, commit**

```bash
npm run dev  # verify at /designs/7
npx tsc --noEmit
git add components/designs/Design07/
git commit -m "feat: implement Design 07 — The Whitepaper (academic layout, sticky TOC, margin notes)"
```

---

## Task 10: Design 08 — "The Dashboard"

**Files:**
- Modify: `components/designs/Design08/index.tsx`
- Modify: `components/designs/Design08/styles.module.css`

**Reference:** Spec section "Design 08 — The Dashboard"

**Key technical details:**
- App-like layout: left sidebar (240px, charcoal #2a2826) + main content area. Welcome bar at top.
- Color: app-grey (#f6f4f0), white cards (#fff), charcoal sidebar (#2a2826), green (#4a7c59), red (#9c4040)
- Fonts: Inter (import in CSS), Space Mono (global)
- **Click-triggered tabs** (not scroll-driven): 5 tabs that swap dashboard view content. Use React `useState` for active tab, GSAP `timeline.to()` for cross-fade (old content opacity 1→0 over 200ms, new content 0→1 over 200ms).
- Dashboard widgets: CSS Grid layout. Revenue chart (SVG `<polyline>`), calendar (CSS grid of colored cells), AskMoody chat (styled div with streaming text), notification bell (SVG with badge).
- Chart line draw: SVG `<polyline>` with `stroke-dasharray`/`stroke-dashoffset`, GSAP tweens offset to 0
- Mobile: sidebar becomes top tab bar, dashboard widgets stack vertically

- [ ] **Step 1: Write CSS module**

Import Inter. Sidebar styles. Dashboard grid layout. Widget card styles. Tab bar. Chart container. Calendar grid. Chat panel. Notification badge pulse keyframe. Responsive sidebar→tabs conversion.

- [ ] **Step 2: Write component**

Welcome bar. Sidebar with nav items (icons + labels). Main area with dashboard widgets. Tab system with 5 views: each tab renders different widget configurations simulating AI, Scheduling, HR, Analytics, Communication dashboards. Settings/security panel section. Pricing as plan selector. CTA.

- [ ] **Step 3: Wire up GSAP animations**

- Widget stagger-in on initial load (translateY 20→0 + opacity, stagger 0.1s)
- Chart polyline draw
- Number count-ups on stat cards
- Tab cross-fade: onClick handler creates GSAP timeline
- Notification badge scale pulse (`gsap.to` with `yoyo: true, repeat: -1`)
- AskMoody streaming text in chat panel
- ScrollTrigger for "Under the Hood" and pricing sections (further down the page)

- [ ] **Step 4: Verify, type check, commit**

```bash
npm run dev  # verify at /designs/8
npx tsc --noEmit
git add components/designs/Design08/
git commit -m "feat: implement Design 08 — The Dashboard (app-like layout, click tabs, chart draw)"
```

---

## Task 11: Design 09 — "The Letterpress"

**Files:**
- Modify: `components/designs/Design09/index.tsx`
- Modify: `components/designs/Design09/styles.module.css`

**Reference:** Spec section "Design 09 — The Letterpress"

**Key technical details:**
- Long scroll with oversized section numbers (01-08) in left margin, fixed/sticky, tracking scroll position
- Color: warm white (#f3f0ea), charcoal (#2d2d2d), copper accent (#a0785a)
- Fonts: Playfair Display (headlines, import in CSS), Crimson Pro (body, global), Space Mono (numerals, global)
- Deboss/emboss: `box-shadow: inset 2px 2px 4px rgba(0,0,0,0.15), inset -1px -1px 2px rgba(255,255,255,0.5)`. GSAP animates shadow values from `none` to full values.
- Paper texture: SVG noise filter overlay (similar to Design 01 but with warm tone)
- Stamp effect: text appears at `scale(1.02), opacity(0)` then tweens to `scale(1), opacity(1)` — gives a "pressed into paper" feel
- Three-stage AI section: pinned, three panels animate sequentially (waveform appears → dots pulse → report fades in)
- Persona cards: three cards with different feature lists per role
- Mobile: section numbers become small inline headers, columns stack

- [ ] **Step 1: Write CSS module**

Import Playfair Display. Paper texture overlay. Section number styles (large, light grey, fixed left). Embossed card borders. Copper accent highlights. Persona card layout. Stat section typography. Responsive adjustments.

- [ ] **Step 2: Write component with 8 sections**

Hero (debossed headline "Care deserves care"). Philosophy (2-3 short paragraphs). Platform features (6 pillar cards with embossed borders). AI in Action (three-stage pinned section). By the Numbers (large stats). Who It's For (3 persona cards). Pricing (embossed cards). Footer.

- [ ] **Step 3: Wire up GSAP animations**

- Box-shadow transitions on scroll (deboss reveal)
- Stamp effect: scale + opacity per text block
- Section numbers: fixed position, value updates or opacity swaps based on scroll position
- Three-stage AI: ScrollTrigger pin, sequential timeline (waveform → dots → report)
- Copper accent elements fade with slight warm glow (box-shadow color transition)
- Count animation on stat numbers

- [ ] **Step 4: Verify, type check, commit**

```bash
npm run dev  # verify at /designs/9
npx tsc --noEmit
git add components/designs/Design09/
git commit -m "feat: implement Design 09 — The Letterpress (deboss effects, stamp animation, copper accents)"
```

---

## Task 12: Design 10 — "The Remarkable"

**Files:**
- Modify: `components/designs/Design10/index.tsx`
- Modify: `components/designs/Design10/styles.module.css`

**Reference:** Spec section "Design 10 — The Remarkable"

**Key technical details:**
- Pinned header with thin scroll progress bar (height 2px, background pencil-grey, width tracks scroll %)
- Color: dot-grid paper (#eeeae3), pencil grey (#3a3a3a), grid dots (#d0cdc6), CTA accent (#5a5a5a→#2a2a2a on hover)
- Fonts: Crimson Pro (global), Space Mono (global) — no CSS font imports needed
- Dot-grid background: `radial-gradient(circle, #d0cdc6 1px, transparent 1px)` with `background-size: 24px 24px`
- Hand-drawn SVGs: simple `<path>` elements with organic curves. Use `stroke-dasharray` = total path length, `stroke-dashoffset` = total path length initially, GSAP tweens to 0 for draw effect. Create paths for: underline, arrow, checkmarks.
- E-ink flash: fixed overlay `<div>`, GSAP `timeline.to(overlay, {opacity: 1, backgroundColor: '#000', duration: 0.1}).to(overlay, {backgroundColor: '#fff', duration: 0.08}).to(overlay, {opacity: 0, duration: 0.2})`. Triggered by ScrollTrigger at section boundaries.
- Strikethrough: `<span>` with pseudo-element `::after` (height 2px, background pencil-grey), GSAP tweens `scaleX` from 0 to 1
- E-ink chat: styled to look like reMarkable UI — grey text on slightly lighter grey, no colors, blinking cursor
- This is the **flagship** design — highest polish, most refined animations
- Mobile: single column, progress bar stays, dot-grid continues, SVG draws still work

- [ ] **Step 1: Write CSS module**

Dot-grid background. Pinned header with progress bar. Clean typography hierarchy. Timeline layout (alternating left/right with connecting vertical line). E-ink chat styles. Spec sheet grid. Quote card styles. Hand-drawn checkmark/arrow placeholder containers. Footer with fading dot-grid. Responsive single-column.

- [ ] **Step 2: Write component with 9 sections**

Hero (headline with SVG underline draw, tagline, CTA). What We Replace (strikethrough list vs unified Moods). Product Tour (6-node vertical timeline with alternating cards and line-art SVG illustrations). AskMoody (e-ink chat simulation). Security Spec Sheet (compliance grid with SVG checkmarks). Social Proof (3 quote cards on dot-grid). Pricing (three-column table with SVG checkmarks). CTA (hand-drawn arrow pointing to button). Footer.

- [ ] **Step 3: Create hand-drawn SVG paths**

Define SVG path data for:
- Underline: wavy path beneath "Moods.ai" (~200px wide, slight vertical wave)
- Arrow: curved arrow path pointing right-down toward CTA button
- Checkmark: simple ✓ stroke path (~16x16)
- Line-art illustrations for timeline cards: simple icons for each feature (calendar, chat, chart, shield, person, brain)

All paths should feel organic — slight imperfections, not mathematically perfect curves.

- [ ] **Step 4: Wire up GSAP animations**

- Progress bar: ScrollTrigger on page, update width
- SVG underline draw on hero (path animation, triggered on load with 0.5s delay)
- Strikethroughs on "What We Replace" (stagger, triggered on scroll)
- Timeline cards alternate slide-in (left cards from -30px, right from +30px)
- E-ink flash overlay between sections
- Checkmark draw animations (stagger per row in spec sheet and pricing)
- Dot-grid parallax (background-position shifts on scroll)
- Arrow path loops: draws once, slight pause, draws again
- Chat text streaming with cursor blink

- [ ] **Step 5: Polish pass**

This is the flagship. Extra attention to:
- Animation timing curves (use `power2.out` for reveals, `power1.inOut` for morphs)
- Consistent spacing and alignment
- Dot-grid alignment with content grid
- Smooth progress bar tracking
- E-ink flash feels authentic (not jarring)

- [ ] **Step 6: Verify, build, commit**

```bash
npm run dev  # verify at /designs/10
npx tsc --noEmit
git add components/designs/Design10/
git commit -m "feat: implement Design 10 — The Remarkable (flagship, hand-drawn SVG, e-ink flash, dot-grid)"
```

---

## Task 13: Final Integration & Verification

**Files:**
- All design files (read-only verification)
- Potentially minor fixes across any files

- [ ] **Step 1: Full build check**

```bash
npm run build
```

Expected: Clean build, no errors, no warnings.

- [ ] **Step 2: Navigate through all designs**

Start dev server, navigate through all 10 designs via the gallery. Check:
- No flash between page transitions
- Each design loads its own fonts (no flash of unstyled text from other designs' fonts)
- GSAP animations play and clean up properly (no memory leaks — navigate away and back)
- DesignNav works on every design
- Gallery page looks correct

- [ ] **Step 3: Mobile spot-check**

Using browser dev tools at 375px width, check:
- Gallery is usable
- At least designs 01, 04, 08, 10 render reasonably on mobile
- No horizontal overflow

- [ ] **Step 4: Fix any issues found**

Address anything broken in steps 2-3.

- [ ] **Step 5: Final commit if fixes were made**

```bash
git add -A
git commit -m "fix: final integration fixes across designs"
```
