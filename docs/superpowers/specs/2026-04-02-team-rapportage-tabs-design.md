# Team & Rapportage Tabs Design

**Date:** 2026-04-02
**Status:** Approved
**Scope:** Build the two remaining placeholder tabs in the admin dashboard

---

## Overview

Complete the admin dashboard by building the Team and Rapportage tabs. Both use existing API endpoints — no new backend work needed. Designs follow MoodsAI's existing warm/earthy design language and are validated against Nielsen Norman Group best practices.

## Context

The admin dashboard at `/admin` has 5 tabs. Three are built (Overzicht, Planning, HR & Verlof). Two are placeholders showing "Binnenkort beschikbaar":
- **Team** — employee directory with card/table views
- **Rapportage** — KPI cards + monthly trend chart + top therapists

Both tabs will be separate component files (like `planning.tsx` and `hr-verlof.tsx`).

---

## Team Tab

### Data Sources

Three API calls on mount:

1. `/api/hr/employees?active=true` — returns flat objects with: firstName, lastName, email, function, isActive, contractType, contractStart, contractEnd, locatie (string), team (string), functieCode, doelstellingProcent
2. `/api/hr/stats` — returns: activeEmployees, inactiveEmployees, currentlySick, onLeaveToday, contractsExpiring90d
3. `/api/hr/sick-leave` — returns: entries[] with firstName, lastName, percentage, status — used to cross-reference which employees are currently sick (for the "Ziek" status badge on cards/rows)

### Layout

Three sections, top to bottom:

#### 1. KPI Strip

Compact stat row (same pattern as HR & Verlof tab):

| Stat | Source |
|------|--------|
| Medewerkers (total active) | `/api/hr/stats` → activeEmployees |
| Locaties (distinct count) | Derived: `new Set(employees.map(e => e.locatie)).size` |
| Ziek gemeld | `/api/hr/stats` → currentlySick |
| Teams (distinct count) | Derived: `new Set(employees.map(e => e.team)).size` |
| Verlof vandaag | `/api/hr/stats` → onLeaveToday |

Note: Locaties and Teams counts require the employees fetch to complete. Show skeleton until ready.

#### 2. Filter Bar + View Toggle

```
[Search input]  [Status ▾]  [Locatie ▾]  [Team ▾]          [Cards|List toggle]
```

- **Search** — filters by name (firstName + lastName), always visible
- **Status** — Actief / Inactief / Alle
- **Locatie** — dynamic dropdown from employee data, hidden if <2 unique locations
- **Team** — dynamic dropdown from employee data, hidden if <2 unique teams
- **View toggle** — switches between card grid and table view, persisted to localStorage
- Active filter count shown on each dropdown (same pattern as planning filters)
- "Wissen" link to clear all filters (same pattern as planning)

#### 3a. Card Grid View (default)

4 columns on desktop (xl), 3 on large (lg), 2 on tablet (md), 1 on mobile.

Each card contains, in strict hierarchy:
1. **Initials avatar** — 2-letter initials in a colored circle (color derived from name hash)
2. **Full name** — font-serif, bold, largest text. `firstName lastName`
3. **Function** — font-mono, text-text-muted, uppercase, small
4. **Location** — font-mono, text-text-faint, small
5. **Team** — font-mono, text-text-faint, small
6. **Status badge** — tiny pill at bottom: "Actief" (green), "Inactief" (muted), "Ziek" (warm). Sick status is determined by cross-referencing employee name against `/api/hr/sick-leave` entries that have no phaseEnd.

NN/g requirements:
- Entire card is clickable (logs to console for now — no detail page yet)
- Layout is identical per card — missing data shows "—", never collapses
- No colored borders per role, no icons per field — name dominates
- `cursor-pointer` on cards, hover state with `bg-surface-hover` transition

#### 3b. Table View

Sortable columns:

| Column | Sort | Alignment |
|--------|------|-----------|
| Naam | alphabetical (default) | left |
| Functie | alphabetical | left |
| Locatie | alphabetical | left |
| Team | alphabetical | left |
| Status | — | left |
| Contract | alphabetical | left |

- Row hover highlight (`bg-surface-hover`)
- Rows are clickable (same as cards)
- On mobile (<768px): table view auto-switches to card layout (NN/g: don't horizontal-scroll tables)
- Sticky header row

### Empty & Loading States

- **Loading:** Skeleton cards (8 placeholders) or skeleton table rows
- **Empty (no results after filter):** "Geen medewerkers gevonden" centered message
- **API error:** Falls back to empty state with "Kon medewerkers niet laden" message

---

## Rapportage Tab

### Data Sources

All existing endpoints — no new API routes:
- `/api/agenda/stats?start=...&end=...` → totalEntries, byType (count, avgDuration, withClient), byMonth
- `/api/agenda/therapists?start=...&end=...` → therapist names with entry counts and activity types
- `/api/hr/stats` → activeEmployees (for "therapeuten actief" count)

### Layout

Four sections, top to bottom:

#### 1. KPI Cards Row

5 cards in a horizontal row (same card style as Overzicht tab):

| KPI | Source | Detail |
|-----|--------|--------|
| Sessies (deze maand) | stats.totalEntries | Show delta vs previous period if available |
| Declarabiliteit % | Computed: behandeling+diagnostiek entries / total × 100 | Subtle progress bar toward 75% target |
| Therapeuten actief | stats.byMonth → distinct therapists for current month | — |
| Gem. duur | Weighted average from stats.byType[*].avgDuration | "per sessie" subtitle |
| Met cliënt | Sum of stats.byType[*].withClient | Total entries with a client linked (not distinct clients) |

#### 2. Period Selector

```
[Deze maand ▾]  [Apr 2026]  ← →
```

- Dropdown options: Deze week, Deze maand, Dit kwartaal, Dit jaar
- Arrow navigation moves within the selected granularity (prev/next month, etc.)
- Changes update all sections (KPIs, chart, table)
- Persisted to localStorage

Period selector computes `start` and `end` dates, passed to API calls.

#### 3. Monthly Trend Chart (CSS-only)

Stacked bar chart showing sessions per month, broken down by activity type.

- 6-month rolling window (current month + 5 previous)
- Bars use `ACTIVITY_COLORS` from planning.tsx (behandeling=green, workshop=purple, etc.)
- Legend below chart using same colored dots + labels as planning legend
- Y-axis: session count (auto-scaled)
- X-axis: month abbreviations (Jan, Feb, Mar, ...)
- Bars are divs with percentage heights — no chart library needed
- Hover on bar segment shows tooltip with count

Data from a single `/api/agenda/stats` call with a 6-month date range. The API already returns a `byMonth` array with per-month totals and therapist counts, so one call covers all 6 months.

#### 4. Top Therapeuten Table

Compact table showing top 5 therapists by session count:

| Column | Data |
|--------|------|
| Therapeut | therapist name |
| Sessies | entry count |
| Activiteiten | activity type badges (colored pills) |

- Sorted by session count descending
- No pagination needed (top 5 only)
- Row hover highlight
- Data from `/api/agenda/therapists?start=...&end=...`

### Empty & Loading States

- **Loading:** Skeleton KPI cards + skeleton bars + skeleton table
- **No data for period:** "Geen data beschikbaar voor deze periode" centered
- **API error:** Show KPIs as "—" and empty chart/table with error message

---

## Shared Patterns

Both tabs follow existing conventions:

| Pattern | Implementation |
|---------|---------------|
| Component file | `team.tsx` and `rapportage.tsx` in `app/(dashboard)/admin/` |
| Export | Named export `TeamTab` and `RapportageTab` |
| Tab rendering | Added to admin page.tsx tab content switch |
| State persistence | localStorage for view toggle, period selection, filters |
| Fetching | `useEffect` + `fetch()` with AbortController (same as planning.tsx) |
| Fallback | Mock data or empty state on API error |
| Styling | Tailwind classes inline, font-serif for headings, font-mono for data/labels |
| Filter dropdowns | Radix DropdownMenu (same as planning filters) |
| Color tokens | Uses existing CSS vars: text, text-muted, text-faint, surface, surface-hover, border, warm, paper |

## File Changes

### New Files

| File | Purpose |
|------|---------|
| `app/(dashboard)/admin/team.tsx` | TeamTab component |
| `app/(dashboard)/admin/rapportage.tsx` | RapportageTab component |

### Modified Files

| File | Change |
|------|--------|
| `app/(dashboard)/admin/page.tsx` | Import TeamTab + RapportageTab, replace placeholder content in tab switch |

### Unchanged

Everything else — no API changes, no new dependencies, no style changes.

## Out of Scope

- Team member detail page/panel (cards log to console for now)
- Chart library (CSS-only bars)
- Drill-down from KPIs to filtered views
- Export/download functionality
- Real declarabiliteit calculation (approximated from activity type ratios)
- BI dashboard builder (MOODSVIBE Tier 5 feature)
