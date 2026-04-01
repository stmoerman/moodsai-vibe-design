# MoodsAI Demo Login Flow & Landing Page Overhaul

**Date:** 2026-04-01
**Status:** Draft

---

## Overview

Transform the MoodsAI demo from a simple dashboard-link page into a full demo experience: marketing landing page, simulated authentication flow, and role-based dashboard routing. All UI-only — no real authentication backend.

---

## Route Structure

```
contexts/
│   └── AuthContext.tsx               Demo auth state (role, email, displayName)
app/
├── page.tsx                          Landing page (replaces current dashboard links)
├── globals.css                       Extended with auth + landing styles
├── layout.tsx                        Root layout (add AuthProvider)
├── (auth)/
│   ├── layout.tsx                   Centered card layout
│   ├── login/page.tsx               Email + password form
│   ├── forgot-password/page.tsx     Email input + confirmation state
│   ├── signup/page.tsx              Name, email, password form
│   └── verify/page.tsx              6-digit OTP input
├── (dashboard)/
│   ├── layout.tsx                   Shared dashboard chrome (top bar, logout, text scaling)
│   ├── therapist/page.tsx           Moved from /therapist-dashboard
│   ├── client/page.tsx              New client dashboard
│   └── admin/page.tsx               Moved from /bi-dashboard
```

**Removed routes:**
- `/therapist-dashboard` → moved to `/(dashboard)/therapist`
- `/bi-dashboard` → moved to `/(dashboard)/admin`
- `/design-system` and `/designs/[id]` — kept as-is (unchanged)

---

## Landing Page

Single-screen marketing page with NL/EN language toggle.

**Sections (top to bottom):**

1. **Nav bar** — Moods logo (left), `EN | NL` toggle (right), "Inloggen" button (right)
2. **Hero** — Large heading + subtitle + CTA button
   - NL: "Mentale gezondheid, slim geregeld."
   - EN: "Mental healthcare, smartly managed."
   - CTA routes to `/(auth)/login`
3. **Feature cards** (3 columns, stack on mobile)
   - BI & Inzicht / BI & Insights
   - Slim Plannen / Smart Planning
   - AskMoody
4. **Dashboard preview** — Static styled preview/screenshot of BI dashboard
5. **Footer** — (c) 2026 Moods AI, Privacy, Voorwaarden, Contact

**Language toggle:**
- Simple React state, no i18n library
- Content object with `nl` and `en` keys per string
- Defaults to `nl`, persisted to `localStorage` key `moods-lang`
- Only applies to landing page — dashboards stay Dutch

---

## Auth Flow

### Shared Auth Layout

All auth screens render inside a centered card:
- Vertically and horizontally centered on page
- Moods logo above the card
- Same paper/cream background as rest of app
- Card: subtle box-shadow, sharp corners

### Login (`/(auth)/login`)

- Email input field
- Password input field
- "Inloggen" submit button
- "Wachtwoord vergeten?" link → `/(auth)/forgot-password`
- Divider ("of")
- "Nog geen account? Registreren" link → `/(auth)/signup`

**On submit:**
1. Show loading spinner for ~1.5 seconds
2. Route to `/(auth)/verify`

### Forgot Password (`/(auth)/forgot-password`)

- Explanatory text
- Email input field
- "Versturen" submit button
- "Terug naar inloggen" link

**On submit:** Show "Herstellink verstuurd" confirmation. Link back to login.

### Sign Up (`/(auth)/signup`)

- Name input
- Email input
- Password input
- "Registreren" submit button
- "Al een account? Inloggen" link

**On submit:** Show "Verificatie e-mail verstuurd" confirmation. Link back to login.

### OTP Verify (`/(auth)/verify`)

- Explanatory text mentioning the email
- 6 individual digit inputs (auto-advance on entry)
- "Verifieren" submit button
- "Code niet ontvangen? Opnieuw versturen" link

**On submit:**
1. User types any 6 digits
2. Show verification spinner for ~1.5 seconds
3. Route to appropriate dashboard based on role

---

## Demo Account Routing

| Email | Role | Dashboard Route | Display Name | Role Label |
|---|---|---|---|---|
| `therapist-demo@moodsai.ai` | `therapist` | `/(dashboard)/therapist` | Demo Therapeut | Therapeut |
| `client-demo@moodsai.ai` | `client` | `/(dashboard)/client` | Demo Client | Client |
| `admin-demo@moodsai.ai` | `admin` | `/(dashboard)/admin` | Demo Beheerder | Beheerder |
| Any other email | `client` | `/(dashboard)/client` | Demo Client | Client |

---

## AuthContext

**File:** `contexts/AuthContext.tsx`

```typescript
interface AuthState {
  role: 'therapist' | 'client' | 'admin' | null
  email: string | null
  displayName: string | null
}
```

- Provided at root layout level
- `login(email: string)` — maps email to role, sets state
- `logout()` — clears state, redirects to `/(auth)/login`
- Persisted to `localStorage` key `moods-demo-auth`
- Dashboard layout reads context, redirects to `/(auth)/login` if role is null

---

## Shared Dashboard Layout

**Top bar contains:**
- Moods logo (left)
- Role label: "Therapeut Dashboard" / "Client Dashboard" / "Beheerder Dashboard" (left of center)
- Text scaling controls: A+ / A- (right)
- "Uitloggen" button (right) — calls `logout()` from AuthContext

**No dark mode toggle.** All pages are light mode only.

Text scaling uses the same pattern as existing dashboards — CSS variable for base font size, A+/A- adjusts it.

---

## Client Dashboard (`/(dashboard)/client`)

Three-column layout (stacks to single column on mobile).

### Column 1: Afspraken (Appointments)

List of upcoming appointments:
- Date, time, appointment type, therapist name
- Status badges: Bevestigd / In afwachting
- Workshop entries appear here too with "Workshop" type label

Mock data: 4-5 entries including 1-2 workshops over the next two weeks.

### Column 2: E-health Opdrachten (Assignments)

Checklist-style:
- Title, deadline, completion status
- Icons: open (circle), completed (filled circle + check)
- Progress summary: "2 van 4 voltooid"

Mock data: 4 assignments, 2 completed.

### Column 3: AskMoody Chat

Chat widget:
- Greeting message from Moody pre-populated
- Text input with send button at bottom
- Typing any message shows a canned AI response after ~1 second delay
- 1-2 demo messages pre-loaded

### Greeting

Time-of-day greeting (Goedemorgen/Goedemiddag/Goedenavond) + display name from AuthContext.

---

## Dark Mode Removal

Remove all dark mode from the entire application:
- Remove `.darkTheme` CSS classes from therapist dashboard
- Remove `.darkTheme` CSS classes from BI dashboard
- Remove dark mode toggle buttons from both dashboards
- Remove `moods-dark-mode` localStorage usage
- Remove all dark mode color variables and overrides
- Remove `darkMode` state and related useEffect hooks

Everything is light mode only.

---

## Responsive Design

All pages must work on mobile (320px+), tablet (768px+), and desktop (1024px+).

### Landing Page
- Nav: hamburger or stacked on mobile
- Hero: text scales down, CTA full-width on mobile
- Feature cards: 3 columns → 1 column stack on mobile
- Dashboard preview: scales proportionally

### Auth Screens
- Card: max-width on desktop, full-width with horizontal padding on mobile
- Inputs: full-width always

### BI Dashboard (Admin)
- Override react-grid-layout absolute positioning on mobile
- Stack all widgets vertically in single column
- Maintains existing responsive fix from commit e6c071f

### Therapist Dashboard
- Agenda timeline: full-width on mobile
- Side panels stack below timeline
- Appointment cards full-width

### Client Dashboard
- 3 columns → single column stack on mobile
- Order on mobile: Afspraken, E-health Opdrachten, AskMoody
- AskMoody chat takes more vertical space on mobile

---

## Styling

Consistent across all new pages:

- **Background:** `--color-paper` (#eeeae3)
- **Surface:** `--color-surface` (#f5f2ec)
- **Text:** `--color-text` (#3a3a3a)
- **Muted text:** `--color-text-muted` (#7a746e)
- **Borders:** `--color-border` (#d0cdc6)
- **Fonts:** EB Garamond (headings), Crimson Pro (body), Space Mono (data/labels)
- **Corners:** No border-radius anywhere (sharp corners)
- **Inputs:** Bottom-border/underline style
- **Buttons:** Solid fill, `--color-text` background, `--color-paper` text, sharp corners
- **Animations:** Fade-in on page load, subtle translateY hover on interactive elements

---

## Files to Create

- `contexts/AuthContext.tsx` (project root, not inside app/)
- `app/(auth)/layout.tsx`
- `app/(auth)/layout.module.css`
- `app/(auth)/login/page.tsx`
- `app/(auth)/forgot-password/page.tsx`
- `app/(auth)/signup/page.tsx`
- `app/(auth)/verify/page.tsx`
- `app/(dashboard)/layout.tsx`
- `app/(dashboard)/layout.module.css`
- `app/(dashboard)/therapist/page.tsx` (moved + adapted)
- `app/(dashboard)/therapist/page.module.css` (moved)
- `app/(dashboard)/client/page.tsx`
- `app/(dashboard)/client/page.module.css`
- `app/(dashboard)/admin/page.tsx` (moved + adapted)
- `app/(dashboard)/admin/page.module.css` (moved)

## Files to Modify

- `app/page.tsx` — replace with landing page
- `app/page.module.css` — replace with landing page styles
- `app/layout.tsx` — wrap with AuthProvider
- `app/globals.css` — add auth and landing page CSS variables/styles

## Files to Remove

- `app/therapist-dashboard/page.tsx`
- `app/therapist-dashboard/page.module.css`
- `app/bi-dashboard/page.tsx`
- `app/bi-dashboard/page.module.css`
