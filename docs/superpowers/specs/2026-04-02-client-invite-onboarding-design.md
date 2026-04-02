# Client invite & onboarding flow

**Date:** 2026-04-02
**Status:** Draft

---

## Overview

End-to-end flow: admin invites a client via email → client completes onboarding wizard → client picks an intake slot from a Calendly-style picker → therapist is revealed on confirmation.

All UI-only demo with real email sending via Resend.

---

## Route structure

```
app/
├── (dashboard)/admin/invite/
│   └── page.tsx                    Admin invite form (centered card page)
├── (onboarding)/
│   ├── layout.tsx                  Centered layout: logo + card, paper background
│   ├── onboarding/
│   │   └── page.tsx               4-step wizard
│   └── onboarding/intake/
│       └── page.tsx               Calendly-style slot picker + confirmation
├── api/
│   └── invite/
│       └── send/route.ts          POST: generate token, send invite email via Resend
```

---

## 1. Admin invite page (`/admin/invite`)

Dedicated page linked from the "Cliënt uitnodigen" quick link on the admin Overzicht tab.

**Layout:** Centered card on paper background with Moods logo above (same aesthetic as auth pages). "← Terug naar dashboard" link.

**Form fields:**
- Voornaam (text, required)
- Achternaam (text, required)
- E-mail (email, required)
- Telefoon (tel, optional)
- Locatie (optional Radix dropdown): Amsterdam, Utrecht, Rotterdam, Nijmegen, Heerlen, Venray, Online, or "Geen voorkeur" (default)

**On submit:**
1. Show spinner: "Uitnodiging versturen..."
2. `POST /api/invite/send` with `{ firstName, lastName, email, phone?, location? }`
3. API generates a random token, sends branded email via Resend
4. Show confirmation: "Uitnodiging verstuurd naar {email}" + "Nog een uitnodiging" button + back link

**API route (`POST /api/invite/send`):**
- Generate random token: `crypto.randomUUID()`
- Build onboarding URL: `/onboarding?token={token}&email={email}&name={firstName}&location={location}`
- Send email via Resend using MoodsTransactional template:
  - Subject: "Je bent uitgenodigd bij Moods.ai"
  - Heading: "Welkom bij Moods.ai, {firstName}"
  - Body: "Je bent uitgenodigd om een account aan te maken. Klik op de link hieronder om te beginnen met je aanmelding."
  - (In a real app the link would be in the email body — for the demo, just include the URL as text)
- Return `{ success: true, token, onboardingUrl }`

---

## 2. Onboarding layout (`(onboarding)/layout.tsx`)

Centered vertically and horizontally on paper background. Moods logo above the card. Same visual treatment as the `(auth)` layout. Can reuse `app/(auth)/layout.module.css` styles or duplicate with Tailwind.

No dashboard top bar, no navigation — clean and calming.

---

## 3. Onboarding wizard (`/onboarding`)

Multi-step wizard, all client-side state. 4 steps.

**Progress indicator:** Row of 4 dots at top of card. Current = filled, others = outlined. Step label below.

**Reads from URL params on mount:**
- `?token=` — stored but not validated (demo)
- `?email=` — pre-fills display
- `?name=` — pre-fills greeting
- `?location=` — if present, skip step 3 (location already chosen by admin)

### Step 1: Welkom
- "Welkom bij Moods.ai, {name}"
- "Maak je account aan om verder te gaan"
- Wachtwoord (password input)
- Wachtwoord bevestigen (password input)
- Button: "Verder"
- Validation: both fields match, min 8 chars

### Step 2: Taal
- "In welke taal wil je behandeld worden?"
- Two large selectable cards side by side:
  - Nederlands (with NL flag/label)
  - English (with EN flag/label)
- Click auto-advances to next step

### Step 3: Locatie (skipped if `?location=` present)
- "Waar wil je behandeld worden?"
- Grid of location cards: Amsterdam, Utrecht, Rotterdam, Nijmegen, Heerlen, Venray
- Plus "Online (landelijk)" card
- Single select, click auto-advances

### Step 4: Reden
- "Kun je kort omschrijven waarom je hulp zoekt?"
- Textarea, placeholder: "Bijv. ik ervaar veel stress op werk..."
- Optional — can leave empty
- Small note: "Je antwoord wordt alleen gedeeld met je therapeut"
- Button: "Verder naar intake planning"

**State storage:** All answers saved to `localStorage` key `moods-onboarding`:
```json
{
  "token": "abc-123",
  "email": "jan@example.nl",
  "firstName": "Jan",
  "language": "NL",
  "location": "Utrecht",
  "reason": "Stress op werk",
  "completedAt": "2026-04-02T10:00:00Z"
}
```

After step 4, redirect to `/onboarding/intake`.

---

## 4. Slot picker (`/onboarding/intake`)

Calendly-style week view showing available intake slots.

**Page layout:** Full width within the onboarding layout (card expands wider for the calendar). Logo at top, "Kies een moment voor je intake" heading, "Duur: 60 minuten · Video" subtitle.

**Data source:** `GET /api/agenda/entries?start={weekStart}&end={weekEnd}&types=intake`
- If onboarding has a location preference, additionally filter slots whose description or location matches that region
- Only show slots where `clientName` is null (open/unbooked)

**Week view:**
- 5 columns (Mon–Fri)
- Day headers: "Ma 1", "Di 2", etc.
- Week navigation: ← → arrows + current week label
- Each slot rendered as a time-only button: "09:30", "10:00", "13:30"
- NO therapist name shown
- Slots styled as pills: cream background, border, warm hover state
- If no slots in a day: subtle "Geen slots" text

**On slot click → confirm overlay:**
- Inline overlay within the page (not a full-screen modal)
- Shows: full date ("Woensdag 3 juni 2026"), time range ("09:00 – 10:00"), "Video · Online" badge
- "Bevestigen" button + "Annuleren" link

**After confirm → reveal + confirmation:**
Replace the entire page content with:
- Green checkmark + "Je intake is ingepland"
- Full date and time
- **Therapist reveal:** "Je therapeut: {therapistName}" with `/r/{slug}` link
- Video room: location from the slot data
- "Een bevestiging is verstuurd naar {email}"
- Sends confirmation email via `POST /api/email/send`

**Confirmation email content:**
- Subject: "Je intake is bevestigd — Moods.ai"
- Heading: "Je intake is ingepland"
- Body: date, time, therapist name, video room info

---

## Styling

All pages follow the existing warm paper aesthetic:
- Background: `--color-paper` (#eeeae3)
- Card: `--color-surface` (#f5f2ec) with border
- Typography: EB Garamond headings, Crimson Pro body, Space Mono labels
- Sharp corners throughout (no border-radius)
- Underline-style inputs
- Solid dark buttons

The onboarding steps should feel calm and spacious — generous padding, one clear action per step.

---

## Files to create

- `app/(dashboard)/admin/invite/page.tsx`
- `app/api/invite/send/route.ts`
- `app/(onboarding)/layout.tsx`
- `app/(onboarding)/onboarding/page.tsx`
- `app/(onboarding)/onboarding/intake/page.tsx`

## Files to modify

- `app/(dashboard)/admin/page.tsx` — update "Cliënt uitnodigen" quick link href from `#` to `/admin/invite`
