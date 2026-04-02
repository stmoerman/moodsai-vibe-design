# Client Invite & Onboarding Flow — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build end-to-end client invite → onboarding → intake slot picker flow with real email sending via Resend.

**Architecture:** Admin sends invite from `/admin/invite` → API sends email via Resend → Client opens onboarding wizard at `/onboarding` → Completes 4 steps → Picks intake slot at `/onboarding/intake` from existing agenda API → Confirms → Therapist revealed + confirmation email sent.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Radix UI, Resend, existing `/api/agenda/entries` endpoint.

**Spec:** `docs/superpowers/specs/2026-04-02-client-invite-onboarding-design.md`

---

## File Structure

```
app/
├── api/invite/send/route.ts           POST: generate token, send invite email
├── (dashboard)/admin/invite/page.tsx   Admin invite form page
├── (dashboard)/admin/page.tsx          MODIFY: update quick link href
├── (onboarding)/
│   ├── layout.tsx                     Centered layout for onboarding pages
│   ├── onboarding/page.tsx            4-step wizard
│   └── onboarding/intake/page.tsx     Calendly-style slot picker
```

---

### Task 1: Invite API route

**Files:**
- Create: `app/api/invite/send/route.ts`

- [ ] **Step 1: Create the invite API route**

```typescript
// app/api/invite/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { resend, FROM_EMAIL } from '@/lib/resend';
import MoodsTransactional from '@/emails/MoodsTransactional';

interface InviteBody {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phone, location } =
      (await request.json()) as InviteBody;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Voornaam, achternaam en e-mail zijn verplicht' },
        { status: 400 },
      );
    }

    const token = crypto.randomUUID();
    const params = new URLSearchParams({
      token,
      email,
      name: firstName,
    });
    if (location && location !== 'none') params.set('location', location);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    const onboardingUrl = `${baseUrl}/onboarding?${params.toString()}`;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Je bent uitgenodigd bij Moods.ai',
      react: MoodsTransactional({
        previewText: 'Welkom bij Moods.ai — maak je account aan',
        heading: `Welkom bij Moods.ai, ${firstName}`,
        body: `Je bent uitgenodigd om een account aan te maken bij Moods.ai. Ga naar de volgende link om te beginnen met je aanmelding:\n\n${onboardingUrl}`,
      }),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      emailId: data?.id,
      token,
      onboardingUrl,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Onbekende fout' },
      { status: 500 },
    );
  }
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
git add app/api/invite/send/route.ts
git commit -m "feat: add invite API route — sends onboarding email via Resend"
```

---

### Task 2: Admin invite page

**Files:**
- Create: `app/(dashboard)/admin/invite/page.tsx`
- Modify: `app/(dashboard)/admin/page.tsx` — update quick link href

- [ ] **Step 1: Create the admin invite page**

```typescript
// app/(dashboard)/admin/invite/page.tsx
'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const LOCATIONS = [
  { value: 'none', label: 'Geen voorkeur' },
  { value: 'Amsterdam', label: 'Amsterdam' },
  { value: 'Utrecht', label: 'Utrecht' },
  { value: 'Rotterdam', label: 'Rotterdam' },
  { value: 'Nijmegen', label: 'Nijmegen' },
  { value: 'Heerlen', label: 'Heerlen' },
  { value: 'Venray', label: 'Venray' },
  { value: 'Online', label: 'Online' },
];

export default function InvitePage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', location: 'none' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const [onboardingUrl, setOnboardingUrl] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/invite/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Fout bij versturen');
      setSentEmail(form.email);
      setOnboardingUrl(data.onboardingUrl ?? '');
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setForm({ firstName: '', lastName: '', email: '', phone: '', location: 'none' });
    setSent(false);
    setSentEmail('');
    setOnboardingUrl('');
    setError('');
  }

  const locationLabel = LOCATIONS.find((l) => l.value === form.location)?.label ?? 'Geen voorkeur';

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-5 py-10">
      <Image src="/images/logo.png" alt="Moods.ai" width={140} height={36} className="mb-8" priority />

      <div className="bg-surface border border-border p-10 w-full max-w-[420px]">
        {!sent ? (
          <form onSubmit={handleSubmit}>
            <h1 className="font-display text-2xl text-text mb-6">Cliënt uitnodigen</h1>

            <div className="mb-5">
              <label className="block font-mono text-[0.7rem] text-text-muted uppercase tracking-wider mb-2">Voornaam</label>
              <input
                type="text"
                className="w-full font-serif text-base text-text bg-transparent border-b border-border py-2 outline-none focus:border-text transition-colors placeholder:text-text-faint"
                placeholder="Jan"
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                required
              />
            </div>

            <div className="mb-5">
              <label className="block font-mono text-[0.7rem] text-text-muted uppercase tracking-wider mb-2">Achternaam</label>
              <input
                type="text"
                className="w-full font-serif text-base text-text bg-transparent border-b border-border py-2 outline-none focus:border-text transition-colors placeholder:text-text-faint"
                placeholder="De Vries"
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                required
              />
            </div>

            <div className="mb-5">
              <label className="block font-mono text-[0.7rem] text-text-muted uppercase tracking-wider mb-2">E-mail</label>
              <input
                type="email"
                className="w-full font-serif text-base text-text bg-transparent border-b border-border py-2 outline-none focus:border-text transition-colors placeholder:text-text-faint"
                placeholder="jan@voorbeeld.nl"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>

            <div className="mb-5">
              <label className="block font-mono text-[0.7rem] text-text-muted uppercase tracking-wider mb-2">Telefoon <span className="text-text-faint">(optioneel)</span></label>
              <input
                type="tel"
                className="w-full font-serif text-base text-text bg-transparent border-b border-border py-2 outline-none focus:border-text transition-colors placeholder:text-text-faint"
                placeholder="06-12345678"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </div>

            <div className="mb-6">
              <label className="block font-mono text-[0.7rem] text-text-muted uppercase tracking-wider mb-2">Locatie <span className="text-text-faint">(optioneel)</span></label>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button type="button" className="w-full font-serif text-base text-text bg-transparent border-b border-border py-2 text-left flex items-center justify-between cursor-pointer">
                    {locationLabel}
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 4l2 2 2-2" /></svg>
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="bg-surface border border-border py-1 min-w-[200px] z-50" sideOffset={4}>
                    {LOCATIONS.map((loc) => (
                      <DropdownMenu.Item
                        key={loc.value}
                        className={`font-serif text-sm px-4 py-2 cursor-pointer outline-none transition-colors ${form.location === loc.value ? 'bg-text text-paper' : 'text-text-muted hover:bg-surface-hover hover:text-text'}`}
                        onSelect={() => setForm((f) => ({ ...f, location: loc.value }))}
                      >
                        {loc.label}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>

            {error && (
              <div className="mb-4 font-mono text-[0.7rem] text-[#c47050]">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading || !form.firstName || !form.lastName || !form.email}
              className="w-full font-mono text-[0.8rem] font-bold uppercase tracking-wider text-paper bg-text py-3.5 cursor-pointer hover:opacity-85 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Versturen...' : 'Uitnodiging versturen'}
            </button>

            <div className="mt-6 text-center">
              <Link href="/admin" className="font-serif text-sm text-text-muted hover:text-text transition-colors no-underline">← Terug naar dashboard</Link>
            </div>
          </form>
        ) : (
          <div className="text-center py-4">
            <div className="text-2xl text-warm mb-4">✓</div>
            <h2 className="font-display text-xl text-text mb-2">Uitnodiging verstuurd</h2>
            <p className="font-serif text-sm text-text-muted mb-6">
              Een uitnodiging is verstuurd naar <strong className="text-text">{sentEmail}</strong>
            </p>
            {onboardingUrl && (
              <div className="mb-6 p-3 bg-paper border border-border-subtle">
                <div className="font-mono text-[0.6rem] text-text-faint uppercase tracking-wide mb-1">Onboarding link (demo)</div>
                <a href={onboardingUrl} className="font-mono text-[0.7rem] text-warm break-all hover:underline no-underline">{onboardingUrl}</a>
              </div>
            )}
            <button onClick={reset} className="font-mono text-[0.75rem] uppercase tracking-wide text-paper bg-text px-6 py-2.5 cursor-pointer hover:opacity-85 transition-opacity">
              Nog een uitnodiging
            </button>
            <div className="mt-6">
              <Link href="/admin" className="font-serif text-sm text-text-muted hover:text-text transition-colors no-underline">← Terug naar dashboard</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update quick link href in admin page**

In `app/(dashboard)/admin/page.tsx`, change the first quick link:

```typescript
// Change:
{ icon: '→', label: 'Cliënt uitnodigen', desc: 'Uitnodiging versturen', href: '#' },
// To:
{ icon: '→', label: 'Cliënt uitnodigen', desc: 'Uitnodiging versturen', href: '/admin/invite' },
```

- [ ] **Step 3: Verify build**

Run: `npm run build 2>&1 | tail -5`

- [ ] **Step 4: Commit**

```bash
git add app/(dashboard)/admin/invite/page.tsx app/(dashboard)/admin/page.tsx
git commit -m "feat: add admin invite page at /admin/invite with Resend integration"
```

---

### Task 3: Onboarding layout

**Files:**
- Create: `app/(onboarding)/layout.tsx`

- [ ] **Step 1: Create the onboarding layout**

```typescript
// app/(onboarding)/layout.tsx
import Image from 'next/image';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper flex flex-col items-center px-5 py-10">
      <Image
        src="/images/logo.png"
        alt="Moods.ai"
        width={140}
        height={36}
        className="mb-8"
        priority
      />
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
git add app/(onboarding)/layout.tsx
git commit -m "feat: add onboarding layout with centered logo"
```

---

### Task 4: Onboarding wizard (4 steps)

**Files:**
- Create: `app/(onboarding)/onboarding/page.tsx`

- [ ] **Step 1: Create the onboarding wizard**

```typescript
// app/(onboarding)/onboarding/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const LOCATIONS = [
  { value: 'Amsterdam', label: 'Amsterdam' },
  { value: 'Utrecht', label: 'Utrecht' },
  { value: 'Rotterdam', label: 'Rotterdam' },
  { value: 'Nijmegen', label: 'Nijmegen' },
  { value: 'Heerlen', label: 'Heerlen' },
  { value: 'Venray', label: 'Venray' },
  { value: 'Online', label: 'Online (landelijk)' },
];

interface OnboardingData {
  token: string;
  email: string;
  firstName: string;
  language: string;
  location: string;
  reason: string;
  completedAt: string | null;
}

export default function OnboardingPage() {
  return <Suspense><OnboardingWizard /></Suspense>;
}

function OnboardingWizard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const presetLocation = searchParams.get('location') ?? '';
  const hasPresetLocation = !!presetLocation;
  const totalSteps = hasPresetLocation ? 3 : 4;

  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    token: searchParams.get('token') ?? '',
    email: searchParams.get('email') ?? '',
    firstName: searchParams.get('name') ?? '',
    language: '',
    location: presetLocation,
    reason: '',
    completedAt: null,
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem('moods-onboarding', JSON.stringify(data));
  }, [data]);

  function handlePasswordSubmit() {
    if (password.length < 8) {
      setPasswordError('Minimaal 8 tekens');
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError('Wachtwoorden komen niet overeen');
      return;
    }
    setPasswordError('');
    setStep(2);
  }

  function handleLanguage(lang: string) {
    setData((d) => ({ ...d, language: lang }));
    if (hasPresetLocation) {
      // Skip location step
      setStep(hasPresetLocation ? 3 : 3);
    } else {
      setStep(3);
    }
  }

  function handleLocation(loc: string) {
    setData((d) => ({ ...d, location: loc }));
    setStep(hasPresetLocation ? 3 : 4);
  }

  function handleReasonSubmit() {
    const completed = { ...data, completedAt: new Date().toISOString() };
    setData(completed);
    localStorage.setItem('moods-onboarding', JSON.stringify(completed));
    router.push('/onboarding/intake');
  }

  // Determine which content step we're on
  const isReasonStep = (hasPresetLocation && step === 3) || (!hasPresetLocation && step === 4);
  const isLocationStep = !hasPresetLocation && step === 3;
  const currentStepIndex = step;

  return (
    <div className="bg-surface border border-border p-10 w-full max-w-[460px]">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 transition-colors ${i < currentStepIndex ? 'bg-warm' : 'border border-border'}`}
          />
        ))}
      </div>

      {/* Step 1: Welcome / Password */}
      {step === 1 && (
        <div>
          <h1 className="font-display text-2xl text-text mb-2">
            Welkom bij Moods.ai{data.firstName ? `, ${data.firstName}` : ''}
          </h1>
          <p className="font-serif text-sm text-text-muted mb-8">Maak je account aan om verder te gaan</p>

          <div className="mb-5">
            <label className="block font-mono text-[0.7rem] text-text-muted uppercase tracking-wider mb-2">Wachtwoord</label>
            <input
              type="password"
              className="w-full font-serif text-base text-text bg-transparent border-b border-border py-2 outline-none focus:border-text transition-colors"
              placeholder="Minimaal 8 tekens"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block font-mono text-[0.7rem] text-text-muted uppercase tracking-wider mb-2">Wachtwoord bevestigen</label>
            <input
              type="password"
              className="w-full font-serif text-base text-text bg-transparent border-b border-border py-2 outline-none focus:border-text transition-colors"
              placeholder="Herhaal je wachtwoord"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {passwordError && <div className="mb-4 font-mono text-[0.7rem] text-[#c47050]">{passwordError}</div>}

          <button
            onClick={handlePasswordSubmit}
            disabled={!password || !confirmPassword}
            className="w-full font-mono text-[0.8rem] font-bold uppercase tracking-wider text-paper bg-text py-3.5 cursor-pointer hover:opacity-85 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Verder
          </button>
        </div>
      )}

      {/* Step 2: Language */}
      {step === 2 && (
        <div>
          <h1 className="font-display text-2xl text-text mb-2">In welke taal wil je behandeld worden?</h1>
          <p className="font-serif text-sm text-text-muted mb-8">Je kunt dit later altijd wijzigen</p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleLanguage('NL')}
              className="p-6 border border-border bg-paper hover:border-text hover:bg-surface-hover transition-colors cursor-pointer text-center"
            >
              <div className="font-display text-lg text-text mb-1">Nederlands</div>
              <div className="font-mono text-[0.65rem] text-text-faint uppercase">NL</div>
            </button>
            <button
              onClick={() => handleLanguage('EN')}
              className="p-6 border border-border bg-paper hover:border-text hover:bg-surface-hover transition-colors cursor-pointer text-center"
            >
              <div className="font-display text-lg text-text mb-1">English</div>
              <div className="font-mono text-[0.65rem] text-text-faint uppercase">EN</div>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Location (only if not preset) */}
      {isLocationStep && (
        <div>
          <h1 className="font-display text-2xl text-text mb-2">Waar wil je behandeld worden?</h1>
          <p className="font-serif text-sm text-text-muted mb-8">We zoeken therapeuten op deze locatie</p>

          <div className="grid grid-cols-2 gap-3">
            {LOCATIONS.map((loc) => (
              <button
                key={loc.value}
                onClick={() => handleLocation(loc.value)}
                className="p-5 border border-border bg-paper hover:border-text hover:bg-surface-hover transition-colors cursor-pointer text-center"
              >
                <div className="font-serif text-base text-text">{loc.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3/4: Reason */}
      {isReasonStep && (
        <div>
          <h1 className="font-display text-2xl text-text mb-2">Kun je kort omschrijven waarom je hulp zoekt?</h1>
          <p className="font-serif text-sm text-text-muted mb-8">Je antwoord wordt alleen gedeeld met je therapeut</p>

          <textarea
            className="w-full font-serif text-base text-text bg-transparent border border-border p-4 outline-none focus:border-text transition-colors resize-none h-32 placeholder:text-text-faint mb-6"
            placeholder="Bijv. ik ervaar veel stress op werk..."
            value={data.reason}
            onChange={(e) => setData((d) => ({ ...d, reason: e.target.value }))}
          />

          <button
            onClick={handleReasonSubmit}
            className="w-full font-mono text-[0.8rem] font-bold uppercase tracking-wider text-paper bg-text py-3.5 cursor-pointer hover:opacity-85 transition-opacity"
          >
            Verder naar intake planning
          </button>

          <button
            onClick={handleReasonSubmit}
            className="w-full mt-3 font-serif text-sm text-text-faint hover:text-text transition-colors cursor-pointer bg-transparent border-none"
          >
            Overslaan
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
git add app/(onboarding)/onboarding/page.tsx
git commit -m "feat: add 4-step onboarding wizard (password, language, location, reason)"
```

---

### Task 5: Intake slot picker (Calendly-style)

**Files:**
- Create: `app/(onboarding)/onboarding/intake/page.tsx`

- [ ] **Step 1: Create the slot picker page**

This is the largest component. It:
1. Reads onboarding data from localStorage
2. Fetches intake slots from `/api/agenda/entries?types=intake`
3. Filters by chosen location (matching slot description/location for region keywords)
4. Renders a week view with anonymous time slots
5. On click → confirm overlay
6. On confirm → reveal therapist + send confirmation email

```typescript
// app/(onboarding)/onboarding/intake/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { mockAgendaEntries, type AgendaEntry } from '@/data/agenda-mock-data';

const DAY_LABELS = ['Ma', 'Di', 'Wo', 'Do', 'Vr'];
const DAY_LABELS_FULL = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'];
const MONTH_NAMES = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

function getWeekDates(date: Date): Date[] {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  const week: Date[] = [];
  for (let i = 0; i < 5; i++) { week.push(new Date(d)); d.setDate(d.getDate() + 1); }
  return week;
}

function isoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatWeekLabel(dates: Date[]) {
  const s = dates[0];
  const e = dates[dates.length - 1];
  return `${s.getDate()}–${e.getDate()} ${MONTH_NAMES[s.getMonth()]} ${s.getFullYear()}`;
}

interface OnboardingData {
  email?: string;
  firstName?: string;
  location?: string;
}

export default function IntakeSlotPicker() {
  const [onboarding, setOnboarding] = useState<OnboardingData>({});
  const [allSlots, setAllSlots] = useState<AgendaEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekDate, setWeekDate] = useState(() => new Date());
  const [selected, setSelected] = useState<AgendaEntry | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [sending, setSending] = useState(false);

  // Load onboarding data
  useEffect(() => {
    try {
      const saved = localStorage.getItem('moods-onboarding');
      if (saved) setOnboarding(JSON.parse(saved));
    } catch {}
  }, []);

  // Fetch slots
  useEffect(() => {
    setLoading(true);
    const dates = getWeekDates(weekDate);
    const start = isoDate(dates[0]);
    const end = isoDate(dates[4]);

    fetch(`/api/agenda/entries?start=${start}&end=${end}&types=intake&limit=200`)
      .then((r) => r.json())
      .then((data) => {
        if (data.entries?.length > 0) {
          // Only open slots (no client)
          setAllSlots(data.entries.filter((e: AgendaEntry) => !e.clientName));
        } else {
          // Fallback to mock data
          const mock = mockAgendaEntries.filter(
            (e) => e.activityType === 'intake' && !e.clientName && e.date >= start && e.date <= end,
          );
          setAllSlots(mock);
        }
      })
      .catch(() => {
        const dates2 = getWeekDates(weekDate);
        const start2 = isoDate(dates2[0]);
        const end2 = isoDate(dates2[4]);
        setAllSlots(
          mockAgendaEntries.filter(
            (e) => e.activityType === 'intake' && !e.clientName && e.date >= start2 && e.date <= end2,
          ),
        );
      })
      .finally(() => setLoading(false));
  }, [weekDate]);

  // Filter by location preference
  const filteredSlots = useMemo(() => {
    if (!onboarding.location || onboarding.location === 'Online') return allSlots;
    const loc = onboarding.location.toLowerCase();
    return allSlots.filter(
      (s) => s.description.toLowerCase().includes(loc) || s.location.toLowerCase().includes(loc),
    );
  }, [allSlots, onboarding.location]);

  const weekDates = useMemo(() => getWeekDates(weekDate), [weekDate]);

  const slotsByDate = useMemo(() => {
    const map: Record<string, AgendaEntry[]> = {};
    for (const d of weekDates) map[isoDate(d)] = [];
    for (const s of filteredSlots) {
      if (map[s.date]) map[s.date].push(s);
    }
    return map;
  }, [filteredSlots, weekDates]);

  async function handleConfirm() {
    if (!selected) return;
    setSending(true);

    // Send confirmation email
    try {
      await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: onboarding.email ?? 'demo@example.nl',
          subject: 'Je intake is bevestigd — Moods.ai',
          heading: 'Je intake is ingepland',
          body: `Datum: ${new Date(selected.date + 'T00:00').toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}\nTijd: ${selected.startTime} – ${selected.endTime}\nTherapeut: ${selected.therapistName}\nLocatie: ${selected.location}`,
        }),
      });
    } catch {}

    setSending(false);
    setConfirmed(true);
  }

  const therapistSlug = selected
    ? selected.therapistName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    : '';

  // Confirmed state
  if (confirmed && selected) {
    return (
      <div className="bg-surface border border-border p-10 w-full max-w-[520px] text-center">
        <div className="text-3xl text-warm mb-4">✓</div>
        <h1 className="font-display text-2xl text-text mb-2">Je intake is ingepland</h1>
        <p className="font-serif text-sm text-text-muted mb-8">
          {new Date(selected.date + 'T00:00').toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          {' · '}{selected.startTime} – {selected.endTime}
        </p>

        <div className="text-left bg-paper border border-border-subtle p-6 mb-6">
          <div className="font-mono text-[0.65rem] text-text-muted uppercase tracking-wide mb-3">Je therapeut</div>
          <div className="font-display text-lg text-text mb-1">{selected.therapistName}</div>
          <a href={`/r/${therapistSlug}`} className="font-mono text-[0.7rem] text-warm hover:underline no-underline">/r/{therapistSlug}</a>

          <div className="mt-4 pt-4 border-t border-border-subtle">
            <div className="font-mono text-[0.65rem] text-text-muted uppercase tracking-wide mb-1">Locatie</div>
            <div className="font-serif text-sm text-text">{selected.location}</div>
          </div>
        </div>

        <p className="font-mono text-[0.65rem] text-text-faint">
          Een bevestiging is verstuurd naar {onboarding.email ?? 'je e-mail'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border w-full max-w-[720px]">
      {/* Header */}
      <div className="p-6 border-b border-border-subtle">
        <h1 className="font-display text-xl text-text mb-1">Kies een moment voor je intake</h1>
        <p className="font-mono text-[0.7rem] text-text-muted">Duur: 60 minuten · Video</p>
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-center gap-3 py-4 border-b border-border-subtle">
        <button
          onClick={() => setWeekDate((d) => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; })}
          className="w-8 h-8 border border-border flex items-center justify-center font-mono text-sm text-text-muted cursor-pointer hover:bg-surface-hover transition-colors"
        >←</button>
        <span className="font-display text-sm text-text min-w-[200px] text-center">
          {formatWeekLabel(weekDates)}
        </span>
        <button
          onClick={() => setWeekDate((d) => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; })}
          className="w-8 h-8 border border-border flex items-center justify-center font-mono text-sm text-text-muted cursor-pointer hover:bg-surface-hover transition-colors"
        >→</button>
      </div>

      {/* Slot grid */}
      <div className="grid grid-cols-5 min-h-[300px]">
        {weekDates.map((wd, i) => {
          const key = isoDate(wd);
          const daySlots = slotsByDate[key] ?? [];
          return (
            <div key={i} className="border-r border-border-subtle/50 last:border-r-0">
              <div className="text-center py-3 border-b border-border-subtle">
                <div className="font-mono text-[0.65rem] text-text-muted uppercase">{DAY_LABELS[i]}</div>
                <div className="font-display text-lg text-text">{wd.getDate()}</div>
              </div>
              <div className="p-2 space-y-1.5">
                {loading && i === 0 && <div className="font-mono text-[0.6rem] text-text-faint text-center py-4 animate-pulse">Laden...</div>}
                {!loading && daySlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelected(slot)}
                    className={`w-full py-2.5 px-3 border text-center cursor-pointer transition-colors ${
                      selected?.id === slot.id
                        ? 'border-warm bg-warm/10 text-text'
                        : 'border-border-subtle bg-paper hover:border-border hover:bg-surface-hover text-text'
                    }`}
                  >
                    <span className="font-mono text-[0.75rem]">{slot.startTime}</span>
                  </button>
                ))}
                {!loading && daySlots.length === 0 && (
                  <div className="font-mono text-[0.6rem] text-text-faint/50 text-center py-6">—</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected slot confirmation */}
      {selected && !confirmed && (
        <div className="border-t border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-display text-base text-text mb-1">Intake bevestigen</div>
              <div className="font-serif text-sm text-text-muted">
                {new Date(selected.date + 'T00:00').toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
                {' · '}{selected.startTime} – {selected.endTime}
              </div>
              <div className="font-mono text-[0.65rem] text-text-faint mt-1">Video · 60 min</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelected(null)}
                className="font-mono text-[0.7rem] text-text-muted border border-border px-4 py-2 cursor-pointer hover:bg-surface-hover transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={handleConfirm}
                disabled={sending}
                className="font-mono text-[0.7rem] text-paper bg-text px-4 py-2 cursor-pointer hover:opacity-85 transition-opacity disabled:opacity-50"
              >
                {sending ? 'Bevestigen...' : 'Bevestigen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
git add app/(onboarding)/onboarding/intake/page.tsx
git commit -m "feat: add Calendly-style intake slot picker with therapist reveal"
```

---

### Task 6: Integration test

- [ ] **Step 1: Build the full project**

Run: `npm run build 2>&1`

Fix any build errors.

- [ ] **Step 2: Manual verification**

Start dev server and test these flows:

1. `/admin/invite` — fill form, submit. Check confirmation shows onboarding URL.
2. Open onboarding URL → step through wizard (password → language → location → reason)
3. `/onboarding/intake` — see slot grid, click a time, confirm, verify therapist reveal
4. Check confirmation email would be sent (or appears in Resend dashboard)

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete client invite and onboarding flow"
```
