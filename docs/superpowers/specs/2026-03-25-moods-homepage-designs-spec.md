# Moods AI — 10 Homepage Design Explorations Spec

> 10 fully independent SaaS homepage designs for Moods AI, each a different creative interpretation rooted in the Remarkable product aesthetic.

---

## Product Context

Moods AI is a multi-tenant SaaS platform for Dutch mental health organizations (GGZ). It replaces 5-10 separate tools with one integrated platform: AI clinical documentation, practice management, HR, video consultations, team chat, analytics, and billing. Target: practice owners, therapists, HR managers in the Netherlands.

**Source brief:** `/Users/stephan/Developer/MoodsAI/MOODSAIVIBE/frontend/docs/LANDING_PAGE_BRIEF.md`

---

## Design Principles (All 10)

All designs share **Remarkable DNA**:
- Paper textures, dot grids, ruled lines
- Monospace + serif typography pairings
- Muted, paper-derived color palettes (greys, warm whites, pencil tones)
- Precise grid systems with intentional whitespace
- No heavy gradients, no rounded-everything, no generic SaaS aesthetic
- Restrained color accents (one or two per design)
- Print-inspired details: margins, folios, section markers

**Language:** English
**Variation level:** Full — different messaging strategies, section choices, layout structures, animation approaches, and navigation patterns.

---

## Technical Architecture

### Flash Fix
Replace inline `<style>` tags with **CSS Modules** (`.module.css` per design). Next.js preloads CSS modules during route transitions, eliminating the white flash between designs.

### GSAP Setup
- Install `gsap` (v3.12+) with `ScrollTrigger`, `ScrollToPlugin`
- **No SplitText plugin** — use manual `<span>` wrapping for character-level text animations (SplitText requires a paid GSAP Club license)
- Each design is a `'use client'` component that registers and uses GSAP plugins
- GSAP animations initialized in `useLayoutEffect` with proper cleanup on unmount
- Use `gsap.context()` for scoped cleanup
- **`prefers-reduced-motion`**: check media query at init; if reduced motion preferred, skip all GSAP animations and show content immediately

### Migration Plan
The current codebase has single-file components (`components/designs/Design01.tsx` etc.) with inline `<style>` tags. These are throwaway prototypes — delete them entirely and replace with the new directory structure. No content needs to be preserved (the product content is changing completely based on the new brief).

### File Structure
```
components/designs/
  Design01/
    index.tsx          # 'use client' component
    styles.module.css  # All styles for this design
  Design02/
    index.tsx
    styles.module.css
  ...
```

Update `app/designs/[id]/page.tsx` imports to use the new paths (`@/components/designs/Design01` etc.). Use `next/dynamic` with `ssr: false` for each design component to enable code-splitting (each design + its GSAP code loads only when visited).

### Shared
- `app/globals.css` — minimal reset only (no font imports here)
- `components/DesignNav.tsx` — updated to Remarkable aesthetic (paper-grey, monospace, dot-grid accent)

### Font Loading Strategy
12+ font families across all designs. Do NOT load all globally. Each design imports only its own fonts at the top of its CSS module using `@import url(...)`. Since designs are code-split via `next/dynamic`, fonts load only when a design is visited. Critical fonts shared by 3+ designs (Space Mono, Crimson Pro, EB Garamond) can be loaded in `globals.css`.

**Full font manifest:**
| Font | Used in Designs |
|------|----------------|
| EB Garamond | 01, 06, 07 |
| IBM Plex Mono | 01, 03, 07 |
| Space Mono | 02, 04, 08, 09, 10 |
| Inter | 02, 08 |
| DM Sans | 02, 04 |
| Caveat | 03 |
| Crimson Pro | 03, 09, 10 |
| Playfair Display | 05, 09 |
| Source Serif Pro | 05 |
| Courier Prime | 05 |
| JetBrains Mono | 06 |
| IBM Plex Sans | 07 |

### Content & Copy
Developers should write copy inspired by the product brief (`LANDING_PAGE_BRIEF.md`). Each design's spec provides headline snippets and section descriptions that set the tone — expand from there. Copy does not need to be final/polished; these are design explorations. Placeholder body text is acceptable for longer sections.

### SVG & Illustration Assets
All illustrations should be created inline as SVG code — no external asset files. Hand-drawn-style SVGs (Design 10 underlines, arrows, checkmarks) should use simple path data with `stroke-dasharray`/`stroke-dashoffset` for draw animations. Waveforms, charts, and diagrams are all CSS/SVG — no raster images.

### Responsive Strategy
Each design must be usable at mobile widths (< 768px). Per-design guidance:
- **Multi-column layouts** (02, 05, 07, 09, 10): stack to single column on mobile
- **Horizontal scroll sections** (02): convert to vertical stacked cards on mobile
- **Sidebar navigation** (07, 08): collapse to hamburger or bottom sheet on mobile
- **Snap scroll** (01, 06): keep snap but reduce section height to `auto` min-height on mobile
- **App-like layout** (08): stack sidebar nav into top tabs on mobile

### Z-Index Scale
Shared z-index values to avoid conflicts:
- `1-10`: design content layers
- `50`: sticky navs within designs
- `100`: DesignNav component (shared)
- `999`: modals/overlays if any

### Dependencies to Add
- `gsap` (with ScrollTrigger, ScrollToPlugin)
- No other new deps needed

---

## The 10 Designs

---

### Design 01 — "The Manifesto"

**Messaging angle:** Why mental healthcare documentation is broken, and why Moods exists. Emotionally driven, story-first.

**Navigation pattern:** Full-screen snap sections (ScrollTrigger.snap). Each section fills the viewport.

**Color palette:** Near-black (#1a1a1a) on warm off-white (#f5f2ed). Single red accent for emphasis (#c44).

**Typography:** Large serif headlines (EB Garamond), monospace body (IBM Plex Mono).

**Sections:**
1. **Hero** — Bold manifesto: "Therapists became therapists to help people. Not to type reports." Animated monospace counter: hours wasted on documentation per year.
2. **The Problem** — Split screen timeline: a therapist's day drowning in admin (left) vs. same day with Moods (right).
3. **The Solution** — "One platform. Not ten." Visual: 10 tool icons collapsing/merging into the Moods logo.
4. **AI Documentation** — AskMoody spotlight. Voice waveform visualization, live dictation-to-report demo animation.
5. **Security** — NEN 7510/7513 as a technical blueprint/architectural drawing. Encryption layers visualized.
6. **Pricing** — Three plans, monospace numbers, minimal cards on dot-grid.
7. **CTA** — "Your practice deserves better." Single button.

**GSAP animations:**
- ScrollTrigger snap between sections
- Manual `<span>`-wrapped character stagger reveal on manifesto headline
- Counter ticks up (hours wasted)
- Tool icons physically translate and merge into one
- Parallax depth on hero text layers
- Waveform → text morphing on AI section

---

### Design 02 — "The Blueprint"

**Messaging angle:** Moods as the architectural plan for a modern practice. Technical precision, system thinking.

**Navigation pattern:** Long scroll with sticky top nav. Section indicators styled as page numbers (01/08, 02/08...).

**Color palette:** Blueprint blue-grey (#2c3e50) on warm white (#faf8f5). Thin blue accent lines (#5a7fa0).

**Typography:** Monospace headings (Space Mono), clean sans body (Inter or DM Sans).

**Sections:**
1. **Hero** — Dot-grid with Moods platform rendered as an isometric floor plan. "The intelligent practice, designed from the ground up."
2. **Platform Overview** — Horizontal scroll carousel (pinned section). 6 panels, each 80vw wide. Total scroll distance = (6 * 80vw) - 100vw. Each panel is a product pillar as a "room" in the blueprint.
3. **AI Features** — Flowchart: AskMoody, Dictated Reports, Session Reports as connected nodes with data flow lines.
4. **Practice Management** — Process diagrams: scheduling, onboarding pipeline, triage flow.
5. **Integrations** — Radial connection diagram: HCI, Nmbrs, Whereby, Stripe radiating from Moods center node.
6. **Security** — Layered encryption visualization: field → record → database → infrastructure.
7. **Pricing** — Blueprint-style table with dotted leader lines between feature and checkmark.
8. **Footer** — "Build your practice on solid ground."

**GSAP animations:**
- SVG path draw animations (blueprint lines extending on scroll)
- Horizontal scroll section pinned with ScrollTrigger
- Connection nodes animate with stagger
- Floor plan rooms illuminate sequentially
- Dotted leader lines draw themselves

---

### Design 03 — "The Notebook"

**Messaging angle:** Personal, intimate. Moods as the therapist's trusted companion.

**Navigation pattern:** Long scroll, no visible nav. Right-edge page markers (like notebook tabs) for section jumps.

**Color palette:** Warm cream (#f7f4ef) with pencil grey (#4a4a4a). Red margin line (#d4a0a0). Blue ink accent (#3a5a8c).

**Typography:** Handwriting-inspired serif (Caveat or similar for accents), clean serif body (Crimson Pro), monospace for data (IBM Plex Mono).

**Sections:**
1. **Hero** — Ruled notebook lines as background. Headline writes itself character by character: "Everything your practice needs. Nothing it doesn't."
2. **Feature Pages** — Each feature category as a notebook "page" with torn-edge top, slight rotation (1-2deg), stacking depth effect.
3. **AskMoody** — Chat interface rendered on a notebook page. Sample: "What was our revenue last month?" → streamed answer.
4. **Voice-to-Report** — Animated transcript lines appearing one by one on ruled notebook lines, as if being transcribed in real-time. (Distinct from Design 01's waveform approach — this one shows text appearing, not waveform morphing.)
5. **The Numbers** — Large monospace stats: "30 min → 5 min", "NEN 7510", "10+ tools → 1".
6. **Pricing** — Clean grid with handwritten-style annotations and arrows.
7. **CTA** — "Start writing a new chapter."

**GSAP animations:**
- Character-by-character text reveal (typewriter effect)
- Notebook pages stack/unstack on scroll with 3D rotation
- Transcript lines reveal sequentially on ruled lines
- Parallax depth on stacked pages
- Margin notes slide in from right edge

---

### Design 04 — "The Grid"

**Messaging angle:** Moods as a system of perfectly organized parts. Information-dense, showcasing breadth.

**Navigation pattern:** Sticky nav with smooth-scroll anchors. Scroll progress indicator. App-like.

**Color palette:** Paper white (#f2f0eb) with charcoal (#2a2a2a). Warm grey cards (#e8e5df). Single teal accent (#4a8c7f).

**Typography:** Geometric sans (DM Sans), monospace for labels (Space Mono).

**Sections:**
1. **Hero** — Minimal: logo, single-line tagline, dot-grid background, one CTA button. Maximum whitespace.
2. **Bento Grid** — Asymmetric grid of feature cards (1x1, 2x1, 2x2 sizes). Each card is a mini-demo: tiny calendar, chat bubble, waveform, chart, scheduling view.
3. **AI Spotlight** — Expanded 2x2 card: AskMoody with streaming text animation.
4. **Workflow Timeline** — Horizontal: Referral → Triage → Matching → Intake → Treatment → Report. Steps expand on scroll.
5. **Integrations** — Small logo grid with subtle connection lines.
6. **Pricing** — Bento-style (not traditional cards). Plan features as grid items.
7. **Footer** — Grid of links, monospace, dot-grid background.

**GSAP animations:**
- Bento cards stagger-reveal on scroll (fade + slight translateY)
- Cards have subtle floating/breathing motion (0.5px translate loop)
- Timeline steps expand sequentially as scroll progresses
- Progress indicator in nav tracks scroll position
- AI text streams in the spotlight card

---

### Design 05 — "The Broadsheet"

**Messaging angle:** Editorial authority. Moods presented as a premium newspaper front page.

**Navigation pattern:** Long scroll. Masthead fixed at top. Horizontal rules with section names as dividers.

**Color palette:** Newsprint (#f5f3ee) with deep black (#111). Aged paper tone (#e8e2d4) for sidebar blocks. Red dateline accent (#8b2020).

**Typography:** Newspaper serif headlines (Playfair Display), body serif (Source Serif Pro), monospace for datelines (Courier Prime).

**Sections:**
1. **Masthead** — "Moods.ai" in large serif. Dateline, edition number ("Vol. I, No. 1"), horizontal rules above and below.
2. **Above the Fold** — Three-column layout: lead story (AI documentation revolution), sidebar (key metrics in boxes), thumbnail illustration.
3. **Feature Articles** — Multi-column newspaper layout. Each feature is an "article" with headline, byline, body text, and pull quote.
4. **Opinion Column** — "Why we built Moods" — single column, italic serif, founder's perspective.
5. **The Classifieds** — Pricing presented as classified ads (playful but clear).
6. **Back Page** — Integrations as "business directory", compliance badges, CTA.

**GSAP animations:**
- Subtle parallax between columns
- Text reveals line-by-line (typesetting effect)
- Ink-bleed crossfade on section transitions: expanding dark circle (`clip-path: circle()` scaling from 0 to full, combined with 2px `filter: blur()` during transition, ~400ms total)
- Pull quotes fade in from the side
- Minimal, precise — matches the editorial restraint

---

### Design 06 — "The Terminal"

**Messaging angle:** Technical credibility. For the practice owner who respects engineering and wants to see what's under the hood.

**Navigation pattern:** Full-screen snap sections. Persistent terminal prompt in bottom-left showing current "directory" (e.g., `~/moods/features`).

**Color palette:** Dark warm grey (#1e1e1e) on soft green terminal text (#a8c89a). White (#e0e0e0) for body text. Amber accent (#d4a843) for highlights.

**Typography:** Full monospace (JetBrains Mono or Fira Code). Serif only for the occasional blockquote (EB Garamond).

**Sections:**
1. **Hero** — Terminal boot sequence: cursor blinks, tagline types out character by character. Below: three stats animate with monospace counters.
2. **System Overview** — Platform diagram built as a `<pre>` block of monospace text characters (box-drawing chars ┌─┐│└─┘ and arrows →←↑↓). Stored as a string array, revealed line by line via `clip-path` or per-line opacity.
3. **Features as Commands** — Each feature as a CLI command with description: `moods ai:dictate --input=voice --output=report`, `moods schedule:view --week=current`.
4. **Live Demo** — Simulated AskMoody terminal session. Questions type, answers stream with realistic token-by-token speed.
5. **Security** — Certificate-style: compliance standards, SHA hashes, encryption specifications in monospace blocks.
6. **Pricing** — `moods plan:compare` rendered as terminal table output.
7. **CTA** — `moods practice:start --trial=14d`

**GSAP animations:**
- Typing animations throughout (variable speed per "command")
- Cursor blink (CSS + GSAP sync)
- ASCII diagram draws progressively (line by line)
- Counters tick up
- Terminal scroll/clear effect between sections
- Green scanline sweep on section transitions

---

### Design 07 — "The Whitepaper"

**Messaging angle:** Calm academic authority. Moods as a thoroughly researched, peer-reviewed solution.

**Navigation pattern:** Long scroll with sticky left sidebar table of contents. Current section highlights as you scroll. Page numbers in margin.

**Color palette:** Pure white (#ffffff) with academic grey (#333). Thin blue citation links (#2a5a8c). Margin note grey (#888).

**Typography:** Serif body (EB Garamond), monospace for code/data (IBM Plex Mono), sans for captions (IBM Plex Sans).

**Sections:**
1. **Title Page** — Centered: title, subtitle, version, date. Generous whitespace. Horizontal rule.
2. **Abstract** — One-paragraph summary in slightly smaller serif. Indented.
3. **Table of Contents** — Numbered with dotted leaders to page markers.
4. **Chapter 1: The Problem** — Documentation burden in GGZ, statistics, the cost of fragmented tools.
5. **Chapter 2: The Platform** — Each product pillar as a subsection with numbered headings (2.1, 2.2, ...).
6. **Chapter 3: AI Architecture** — AskMoody, dictation, report generation. Figures labeled "Fig. 1", "Fig. 2" with captions.
7. **Chapter 4: Security & Compliance** — NEN standards detailed. Presented as methodology.
8. **Appendix A: Pricing** — Clean table with footnotes.
9. **Appendix B: Integrations** — Listed citation-style with descriptions.
10. **References** — Partner links formatted as academic citations.

**GSAP animations:**
- Extremely subtle: gentle fade-ins (opacity only, no transforms)
- Margin notes slide in from left on scroll
- TOC highlights track scroll position smoothly
- Figure captions fade in after figure is visible
- Quietest animation of all 10 designs

---

### Design 08 — "The Dashboard"

**Messaging angle:** Show, don't tell. The homepage IS a product demo.

**Navigation pattern:** App-like with left sidebar navigation. Feels like you've already logged in.

**Color palette:** App-grey (#f6f4f0) with white cards (#ffffff). Charcoal sidebar (#2a2826). Subtle green for positive metrics (#4a7c59). Red for alerts (#9c4040).

**Typography:** System-UI feel: clean sans (Inter), monospace for data points (Space Mono).

**Sections:**
1. **Welcome Bar** — Thin top banner: "This is a preview of Moods AI" with Sign Up / Log In buttons.
2. **Simulated Dashboard** — Full mock: revenue chart (line drawing animation), appointment calendar with color-coded entries, AskMoody chat panel, notification bell with badge count, sidebar with navigation items.
3. **Feature Tabs** — **Click-triggered** (not scroll-triggered) tabs swap the dashboard view: AI Documentation, Scheduling, HR & Leave, Analytics, Communication. Each tab shows a different simulated dashboard state. Tabs use GSAP `timeline.to()` for cross-fade transitions (200ms out, 200ms in). This is the only design mixing click-driven and scroll-driven GSAP animations.
4. **Under the Hood** — Styled as a settings/security panel: compliance toggles, encryption indicators, audit log preview.
5. **Pricing** — Plan selector UI (radio buttons, feature comparison) — looks like in-app plan selection.
6. **CTA** — "This could be your dashboard tomorrow."

**GSAP animations:**
- Most animation-heavy design
- Dashboard widgets stagger in (translateY + opacity)
- Chart lines draw with ScrollTrigger
- Numbers count up to their values
- Tab transitions cross-fade (GSAP timeline)
- Notification badge pulses
- AskMoody text streams in the chat panel

---

### Design 09 — "The Letterpress"

**Messaging angle:** Craft and care. Built with the same attention therapists give their clients.

**Navigation pattern:** Long scroll with oversized section numbers (01, 02, 03...) in the left margin, tracking scroll position.

**Color palette:** Textured warm white (#f3f0ea) with debossed charcoal (#2d2d2d). Copper accent (#a0785a) for highlights. Subtle paper texture overlay.

**Typography:** Bold condensed serif for headlines (Playfair Display), elegant body serif (Crimson Pro), monospace numerals (Space Mono).

**Sections:**
1. **Hero** — Large debossed headline: "Care deserves care." Paper texture background, copper foil accent on key word. Subtle letterpress impression effect (inner shadows).
2. **Philosophy** — Short, punchy paragraphs about why Moods was built. Generous leading and spacing.
3. **The Platform** — Feature cards with embossed borders and inner shadows. Organized by pillar (AI, Practice, Communication, HR, Analytics, Security).
4. **AI in Action** — Three-stage split: therapist dictating (waveform) → AI processing (animated dots) → finished report (formatted text). Flows left to right.
5. **By the Numbers** — Full-width typographic stats section. Oversized monospace numbers with serif labels below.
6. **Who It's For** — Three persona cards: Practice Owner (top features: analytics, billing, HR), Therapist (AI docs, scheduling, care chat), HR Manager (leave, absence, onboarding).
7. **Pricing** — Embossed card style with copper accent on recommended plan.
8. **Footer** — "Crafted in Amsterdam." Minimal, centered.

**GSAP animations:**
- Deboss/emboss via animated box-shadow transitions on scroll
- Text stamps into place (slight scale 1.02→1 + opacity)
- Section numbers count/animate as they enter viewport
- Three-stage AI animation plays sequentially when pinned
- Copper accent elements fade in with warm glow

---

### Design 10 — "The Remarkable"

**Messaging angle:** The purest Remarkable expression. Paper-perfect, dot-grid precision, pencil-grey. The flagship.

**Navigation pattern:** Pinned header with thin scroll progress bar. Clean, minimal. Content scrolls beneath.

**Color palette:** Dot-grid paper (#eeeae3) with pencil grey (#3a3a3a). Light grid dots (#d0cdc6). Single warm accent for CTAs (#5a5a5a with hover to #2a2a2a).

**Typography:** Clean serif (Crimson Pro), monospace for all labels/data (Space Mono), no decorative fonts.

**Sections:**
1. **Hero** — Dot-grid background. Large pencil-grey headline. Hand-drawn SVG underline animates beneath "Moods.ai". Tagline + single CTA. Maximum whitespace.
2. **What We Replace** — Two columns: left lists 10 tools practices juggle (each with strikethrough animation), right shows them unified under Moods with connecting lines merging.
3. **Product Tour** — Vertical timeline alternating left/right. Each node is a feature card with line-art illustration (SVG, sketch style). Dot-grid continues behind.
4. **AskMoody** — E-ink-style chat simulation. Grey on slightly lighter grey. Blinking cursor. Response streams in.
5. **Security Spec Sheet** — Grid of compliance items (NEN 7510, NEN 7513, AES-256, RBAC, etc.) with hand-drawn checkmarks that draw themselves.
6. **Social Proof** — Quotes on dot-grid cards with subtle paper-curl shadow.
7. **Pricing** — Clean three-column table on dot-grid. Hand-drawn checkmarks for included features.
8. **CTA** — "Start your free trial" with hand-drawn SVG arrow pointing to button.
9. **Footer** — Minimal centered links. Dot-grid fades to solid background.

**GSAP animations:**
- SVG hand-drawn lines draw on scroll (path animation)
- Dot-grid has subtle parallax shift
- Strikethrough lines animate across replaced tools
- Timeline cards slide in alternating left/right
- E-ink "refresh" flash effect on section transitions: full-screen overlay flashes black (100ms) → white (80ms) → fade to transparent (200ms). Total ~380ms. Triggered by ScrollTrigger at section boundaries.
- Checkmarks draw themselves
- Hand-drawn arrow loops its path animation
- Most refined, polished animation suite

---

## Gallery Page (app/page.tsx)

Update the gallery index to match the Remarkable aesthetic:
- Dot-grid background
- Monospace + serif typography
- Cards show design number, name, and a one-line description of the messaging angle
- Subtle hover: card lifts with shadow, dot-grid shifts
- No flash on navigation (CSS module for gallery too)

---

## DesignNav Update

Restyle the floating nav bar:
- Paper-grey background with subtle border (no blur/dark backdrop)
- Monospace font for numbers
- Pencil-grey text
- Dot separators between elements
- Consistent with Remarkable DNA

---

## Implementation Notes

- Each design is fully independent: own TSX, own CSS module, own GSAP timeline
- No shared component library — each design owns its markup and styles
- GSAP contexts scoped to component root ref, cleaned up on unmount
- ScrollTrigger.refresh() called after initial render for accurate measurements
- Images/illustrations: use SVG inline for hand-drawn elements, CSS for textures/patterns
- Responsive: each design handles its own breakpoints (mobile considerations per design)
- Font loading: use `next/font/google` for critical fonts, `@import` fallback for variety fonts
