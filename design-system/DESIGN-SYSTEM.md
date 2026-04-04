# MoodsAI Design System

> **Purpose:** Complete reference for applying MoodsAI's visual language to any frontend. Contains every token, pattern, and component specification needed to one-shot a design overhaul.

---

## 1. Color Tokens

### Core Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `paper` | `#eeeae3` | Page background, primary canvas |
| `surface` | `#f5f2ec` | Card backgrounds, elevated surfaces |
| `surface-hover` | `#ece8e1` | Hover state for cards/rows |
| `text` | `#3a3a3a` | Primary text, active elements |
| `text-muted` | `#7a746e` | Secondary text, labels, metadata |
| `text-faint` | `#b0a99f` | Tertiary text, placeholders, disabled |
| `border` | `#d0cdc6` | Standard borders, dividers |
| `border-subtle` | `#e8e4dd` | Subtle borders, inner dividers |
| `warm` | `#8b6d4f` | Accent — headings, highlights, brand |

### Card Surface Variant

| Context | Hex | Notes |
|---------|-----|-------|
| Widget card bg | `#faf8f5` | Slightly lighter than `surface` |
| KPI cell bg | `#eeeae3` | Same as `paper` — recessed look |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Success/Active | `#5a9a60` | Active status, positive trends |
| Warning/Sick | `#c47050` | Sick status, negative trends, alerts |
| Pending | `#b07a3a` | Partial recovery, pending states |

### Activity Type Colors

| Type | Hex | Label |
|------|-----|-------|
| behandeling | `#2d9e47` | Behandeling (vivid green) |
| workshop | `#7c3aed` | Workshop (bold purple) |
| diagnostiek | `#e68a00` | Diagnostiek (strong orange) |
| evaluatie | `#2577b5` | Evaluatie (clear blue) |
| intake | `#dc4323` | Intake (bright red) |
| reserved | `#78716c` | Gereserveerd (warm gray) |

### Avatar Colors (10-color deterministic palette)

Assigned via name hash: `AVATAR_COLORS[hash(firstName + lastName) % 10]`

```
#6b8f71  #8a7196  #c4924a  #5a8aaa  #b85c3a
#7a6e5d  #5e8c6a  #9a6b8a  #b0885a  #4a7a9a
```

---

## 2. Typography

### Font Stack

| Role | Family | Fallback | CSS Class |
|------|--------|----------|-----------|
| Display | EB Garamond | serif | `font-display` |
| Body | Crimson Pro | Georgia, serif | `font-serif` |
| Mono | Space Mono | monospace | `font-mono` |
| UI | Inter | sans-serif | `font-sans` |

### Google Fonts Import

```
https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Space+Mono:wght@400;700&family=Inter:wght@300;400;500;600&display=swap
```

### Type Scale

| Element | Font | Size | Weight | Letter-spacing | Text-transform |
|---------|------|------|--------|---------------|----------------|
| Hero title | EB Garamond | `clamp(2rem, 5vw, 3.2rem)` | 400 | `-0.02em` | — |
| Page greeting | EB Garamond | `clamp(1.4rem, 2.4vw, 1.9rem)` | 400 | — | — |
| Page heading | EB Garamond | `1.6rem` | 400 | — | — |
| Section title | EB Garamond | `1.5rem` | 500 | — | — |
| Card title | EB Garamond | `1.1rem` | 500 | — | — |
| KPI value | EB Garamond | `1.6rem` | 400 | — | — |
| Stat value (large) | EB Garamond | `2rem` | 400 | — | — |
| Body text | Crimson Pro | `1rem` | 400 | — | — |
| Body secondary | Crimson Pro | `0.95rem` | 400/500 | — | — |
| Body compact | Crimson Pro | `0.9rem` | 400 | — | — |
| Body small | Crimson Pro | `0.85rem` | 400 | — | — |
| Button | Space Mono | `0.8rem` | 700 | `0.05em` | uppercase |
| Nav tab | Space Mono | `0.75rem` | 400 | `0.06em` | uppercase |
| Label | Space Mono | `0.7rem` | 400 | `0.08em` | uppercase |
| Meta/date | Space Mono | `0.7rem` | 400 | `0.04em` | — |
| Small label | Space Mono | `0.65rem` | 400 | `0.06em` | uppercase |
| Tiny label | Space Mono | `0.6rem` | 400 | `0.06em` | uppercase |
| Badge text | Space Mono | `0.6rem` | 400 | `0.06em` | uppercase |
| Widget title | Space Mono | `0.75rem` | 400 | `0.08em` | uppercase |

### Line Height

- Body text: `1.6`
- Display/heading: `1.2`
- KPI values: `1`
- Labels: `1` (default)

---

## 3. Spacing & Layout

### Spacing Scale

| Size | Pixels | Usage |
|------|--------|-------|
| xs | 2px | Grid gaps (card grids) |
| sm | 4px | Tight internal |
| md | 8px | Input padding, small margins |
| base | 12px | List item gaps, icon spacing |
| lg | 16px | Section margins, layout gaps |
| xl | 20px | Column gaps, card padding (compact) |
| 2xl | 24px | Card padding (standard), divider margins |
| 3xl | 32px | Page padding (desktop), section spacing |
| 4xl | 40px | Auth card padding, hero padding |

### Page Layout

| Property | Value |
|----------|-------|
| Max content width | `1600px` |
| Standard content width | `1200px` |
| Page padding (desktop) | `32px` horizontal |
| Page padding (mobile) | `16px`–`20px` horizontal |
| Page bottom padding | `64px` |

### Grid Patterns

| Pattern | Columns | Gap | Usage |
|---------|---------|-----|-------|
| Widget grid | 2 cols (1 on mobile) | 2px | Dashboard overview cards |
| KPI row | 4-5 cols (2 on mobile) | 2px | Stats bar |
| Quick links | 4 cols (2 on mobile) | 2px | Action tiles |
| Card grid (team) | 4/3/2/1 responsive | 12px | Employee cards |
| Feature grid | 3 cols (1 on mobile) | 2px | Homepage features |
| Calendar month | 5 or 7 cols | 0 | Planning month view |

### Responsive Breakpoints

| Breakpoint | Tailwind | Usage |
|------------|----------|-------|
| ≤480px | — | Small mobile (single column everything) |
| ≤640px | `sm:` | Mobile (hide role labels) |
| ≤768px | `md:` | Tablet (table→cards, 2-col grids) |
| ≤900px | `lg:` | Large tablet (dashboard grid→single col) |

---

## 4. Component Patterns

### Widget Card

```
Background: #faf8f5
Border: 1px solid #d0cdc6
Padding: 24px
Animation: staggerIn 0.4s ease (with 0.05s delay per card)
```

Title: Space Mono, 0.75rem, uppercase, `#7a746e`, letter-spacing 0.08em, margin-bottom 18px

### KPI Cell

```
Background: #eeeae3 (paper — recessed within card)
Border: 1px solid #e8e4dd
Padding: 20px 14px
Text-align: center
```

Value: EB Garamond, 1.6rem, `#3a3a3a`
Label: Space Mono, 0.65rem, uppercase, `#b0a99f`

### Status Badge

```
Font: Space Mono, 0.6rem, uppercase
Padding: 3px 10px (or px-2 py-0.5)
Border: 1px solid
Display: inline-block
```

| Status | Border/Text Color | Background |
|--------|-------------------|------------|
| Actief | `#5a9a60` | `#5a9a60` at 5% opacity |
| Ziek | `#c47050` | `#c47050` at 5% opacity |
| Inactief | `#d0cdc6` (border) | `#f5f2ec` (surface) |
| Pending | `#5a9a60` | `#5a9a60` at 5% opacity |
| Warning | `#c47050` | `#c47050` at 5% opacity |

### List Item

```
Display: flex, align-items: center, gap: 12px
Padding: 10px 0
Border-bottom: 1px solid #e8e4dd
```

Avatar: 32×32px, `#eeeae3` bg, Space Mono 0.7rem, `#7a746e`
Name: Crimson Pro, 1rem, `#3a3a3a`
Meta: Space Mono, 0.7rem, `#b0a99f`

### Button (Primary)

```
Font: Space Mono, 0.8rem, weight 700, uppercase
Letter-spacing: 0.05em
Color: #eeeae3 (paper)
Background: #3a3a3a (text)
Border: none
Padding: 14px 0 (full-width) or 8px 20px (inline)
Cursor: pointer
Transition: opacity 0.2s
Hover: opacity 0.85
Disabled: opacity 0.5, cursor not-allowed
```

### Button (Secondary/Ghost)

```
Font: Space Mono, 0.65rem-0.7rem, uppercase
Letter-spacing: 0.06em
Color: #7a746e (text-muted)
Background: transparent
Border: 1px solid #d0cdc6
Padding: 6px 12px
Transition: background 0.2s, color 0.2s
Hover: background #3a3a3a, color #eeeae3
```

### Filter Dropdown (Radix DropdownMenu)

Trigger button:
```
Font: Space Mono, 0.68rem, uppercase
Padding: px-3 py-1.5
Border: 1px solid #d0cdc6
Color: #7a746e (inactive) or #8b6d4f (active)
Background: paper (inactive) or surface (active)
Active state: border-color #8b6d4f
```

Menu content:
```
Background: #f5f2ec
Border: 1px solid #d0cdc6
Shadow: 0 4px 16px rgba(0,0,0,0.08)
Min-width: 160px-200px
Max-height: 264px (overflow-y auto)
```

Menu item:
```
Padding: px-3 py-2
Hover: bg-surface-hover
Checkbox: 16×16px border, filled with #3a3a3a when checked
Label: Crimson Pro, text-sm, #3a3a3a
```

### Input Field

```
Font: Crimson Pro, 1rem
Color: #3a3a3a
Background: transparent
Border: none (bottom only)
Border-bottom: 1px solid #d0cdc6
Padding: 8px 0
Focus: border-bottom-color #3a3a3a
Transition: border-color 0.2s
```

### Search Input (Dashboard)

```
Font: Space Mono, 0.68rem
Padding: px-3 py-1.5
Border: 1px solid #d0cdc6
Background: paper
Placeholder color: #b0a99f
Focus: border-color #3a3a3a
Width: 192px (w-48)
```

### Navigation Tabs

```
Font: Space Mono, 0.75rem, uppercase
Letter-spacing: 0.06em
Color: #7a746e (inactive), #3a3a3a (active)
Padding: 10px 18px
Border-bottom: 2px solid transparent (inactive), 2px solid #3a3a3a (active)
Transition: color 0.15s, border-color 0.15s
```

### View Toggle (Segmented Control)

```
Font: Space Mono, 0.65rem, uppercase
Padding: px-3 py-1.5
Border: 1px solid #d0cdc6 (shared edges)
Active: bg #3a3a3a, text #eeeae3
Inactive: bg paper, text #7a746e, hover bg-surface-hover
```

### Table

Header row:
```
Font: Space Mono, 0.6rem, uppercase
Letter-spacing: wider
Color: #7a746e
Padding: py-2.5 px-3
Border-bottom: 1px solid #d0cdc6
Background: surface
Position: sticky top-0
Sortable: cursor pointer, hover text color #3a3a3a
Active sort: arrow indicator (↑/↓)
```

Body row:
```
Border-bottom: 1px solid border-subtle at 60% opacity
Hover: bg-surface-hover
Cursor: pointer (if clickable)
Transition: background-color
Cell padding: py-2.5 px-3
Cell font: Space Mono, 0.7rem, #7a746e (data cells)
Name cell: Crimson Pro, 0.9rem, font-medium, #3a3a3a
```

### Activity Type Pills

```
Font: Space Mono, 0.55rem (tiny) or 0.6rem (small), uppercase
Padding: px-1.5 py-0.5
Border: 1px solid (activity color)
Color: (activity color)
Background: transparent
```

### Entry Card (Calendar/Planning)

```
Border-left: 4px solid (activity color)
Background: (activity color) at ~7% opacity (#12 hex alpha)
Rounded: rounded-r-sm (right side only)
Padding: py-0.5 pl-2
Time: Space Mono, 0.6rem, text-faint
Name: Crimson Pro, 0.8rem, text
```

---

## 5. Shadows & Depth

| Level | Shadow | Usage |
|-------|--------|-------|
| None | — | Most cards (flat design) |
| Subtle | `0 2px 8px rgba(0,0,0,0.04)` | Auth cards |
| Dropdown | `0 4px 16px rgba(0,0,0,0.08)` | Filter menus, popovers |
| Panel | `shadow-lg` (Tailwind) | Day detail drawer |

---

## 6. Animations & Transitions

### Timing

| Duration | Usage |
|----------|-------|
| 0.15s | Button/link color, border, menu open |
| 0.2s | General transitions (bg, opacity, border) |
| 0.3s | Dashboard content reveal |
| 0.4s | Card stagger-in |
| 0.8s | Boot screen fade |
| 1.2s | Greeting underline draw |

### Easing

| Curve | Usage |
|-------|-------|
| `ease` | Standard transitions |
| `ease-out` | Exit animations |
| `cubic-bezier(0.16, 1, 0.3, 1)` | Dashboard reveal (spring) |

### Keyframes

```css
/* Fade in */
@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

/* Stagger in (cards) */
@keyframes staggerIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Greeting underline draw */
@keyframes drawGreetingLine { to { stroke-dashoffset: 0; } }

/* Spinner pulse */
@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
```

### Stagger Pattern

Cards use `animation-delay` increments of `0.05s`:
```css
.card:nth-child(1) { animation-delay: 0.05s; }
.card:nth-child(2) { animation-delay: 0.1s; }
.card:nth-child(3) { animation-delay: 0.15s; }
.card:nth-child(4) { animation-delay: 0.2s; }
```

---

## 7. Decorative Elements

### Dot Grid Background

```css
position: fixed;
inset: 0;
background-image: radial-gradient(circle, #d0cdc6 0.6px, transparent 0.6px);
background-size: 20px 20px;
pointer-events: none;
z-index: 0;
```

### Greeting Underline (SVG)

```svg
<svg width="280" height="12" viewBox="0 0 280 12">
  <path
    d="M0,6 C23,1 46,11 70,5 C93,0 116,10 140,4 C163,-1 186,9 210,5 C233,1 256,9 280,6"
    fill="none" stroke="#8b6d4f" stroke-width="1.5" stroke-linecap="round"
    stroke-dasharray="300" stroke-dashoffset="300"
    style="animation: drawGreetingLine 1.2s ease forwards 0.3s"
  />
</svg>
```

### Today Indicator (Calendar)

Day number in a filled circle:
```
Display: inline-flex, items-center, justify-center
Size: w-6 h-6
Border-radius: rounded-full
Background: #8b6d4f (warm)
Color: #eeeae3 (paper)
Font: Space Mono, text-xs, font-bold
```

---

## 8. Interaction States Summary

| Element | Default | Hover | Active/Selected | Disabled |
|---------|---------|-------|-----------------|----------|
| Primary button | bg:text, text:paper | opacity:0.85 | — | opacity:0.5 |
| Ghost button | bg:transparent, border | bg:text, text:paper | — | opacity:0.25 |
| Card | bg:surface | bg:surface-hover | ring-1 ring-warm/40 | — |
| Table row | bg:transparent | bg:surface-hover | — | — |
| Nav tab | text:text-muted | text:text | text:text, border-b:text | — |
| Input | border-b:border | — | border-b:text | opacity:0.5 |
| Filter trigger | border:border, text:muted | bg:surface-hover | border:warm, text:warm | — |
| Link | text:text-muted | text:text | — | — |
| View toggle | bg:paper, text:muted | bg:surface-hover | bg:text, text:paper | — |

---

## 9. Icon Guidelines

- **Library:** Inline SVG (no icon library dependency)
- **Size:** 10×10px for small UI (chevrons, checks), 24×24px for feature icons
- **Stroke:** `currentColor`, width 1.5-2px, linecap round
- **No emojis as icons** — always SVG
- **Activity dots:** 8×8px (`w-2 h-2`) colored circles using activity colors

---

## 10. Language & Copy

| Context | Language | Style |
|---------|----------|-------|
| UI labels | Dutch (NL) | Uppercase, Space Mono |
| Button text | Dutch | Uppercase, Space Mono |
| Body copy | Dutch | Sentence case, Crimson Pro |
| Error messages | Dutch | Sentence case, Crimson Pro |
| Dates | Dutch locale | `nl-NL` formatting |
| Time | 24h format | `HH:MM` |
| Numbers | Dutch locale | Decimal comma |

### Common Labels

```
Zoeken → Search
Wissen → Clear filters
Vandaag → Today
Sluiten → Close
Laden → Loading
Bekijk alle → View all
Binnenkort beschikbaar → Coming soon
Geen data beschikbaar → No data available
```

---

## 11. CSS Custom Properties (Tailwind v4 @theme)

Add to your CSS entry point:

```css
@import "tailwindcss";

@theme {
  --color-paper: #eeeae3;
  --color-surface: #f5f2ec;
  --color-surface-hover: #ece8e1;
  --color-text: #3a3a3a;
  --color-text-muted: #7a746e;
  --color-text-faint: #b0a99f;
  --color-border: #d0cdc6;
  --color-border-subtle: #e8e4dd;
  --color-warm: #8b6d4f;

  --font-serif: 'Crimson Pro', 'Georgia', serif;
  --font-display: 'EB Garamond', serif;
  --font-mono: 'Space Mono', monospace;
  --font-sans: 'Inter', sans-serif;
}
```

This enables all `text-text`, `bg-paper`, `border-border`, `font-serif`, etc. utilities.
