# Demo Login Flow & Landing Page Overhaul — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current dashboard-link homepage with a marketing landing page, simulated auth flow (login/signup/forgot-password/OTP), and role-based routing to three dashboards (therapist, client, admin).

**Architecture:** Next.js App Router route groups — `(auth)` for login flow screens with shared centered-card layout, `(dashboard)` for all three dashboards with shared top bar. AuthContext (React context + localStorage) manages demo role state. No real auth backend.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Modules, Tailwind CSS 4, existing Radix UI primitives.

**Spec:** `docs/superpowers/specs/2026-04-01-demo-login-flow-overhaul-design.md`

---

## File Structure

```
contexts/
  AuthContext.tsx              — React context: role, email, displayName + login/logout

app/
  layout.tsx                   — Modified: wrap children with AuthProvider
  page.tsx                     — Replaced: marketing landing page
  page.module.css              — Replaced: landing page styles
  globals.css                  — Modified: add auth/landing CSS variables

  (auth)/
    layout.tsx                 — Centered card wrapper with logo
    layout.module.css          — Auth layout styles
    login/page.tsx             — Email + password form
    login/page.module.css      — Login styles
    forgot-password/page.tsx   — Email input + confirmation
    signup/page.tsx            — Name + email + password form
    verify/page.tsx            — 6-digit OTP input
    auth.module.css            — Shared auth form styles (inputs, buttons, links)

  (dashboard)/
    layout.tsx                 — Shared top bar: logo, role label, A+/A-, logout
    layout.module.css          — Dashboard layout styles
    therapist/page.tsx         — Moved from app/therapist-dashboard/page.tsx (dark mode stripped)
    therapist/page.module.css  — Moved from app/therapist-dashboard/page.module.css (dark mode stripped)
    admin/page.tsx             — Moved from app/bi-dashboard/page.tsx (dark mode stripped)
    admin/page.module.css      — Moved from app/bi-dashboard/page.module.css (dark mode stripped)
    client/page.tsx            — New: 3-column client dashboard
    client/page.module.css     — New: client dashboard styles

  therapist-dashboard/         — DELETED (moved)
  bi-dashboard/                — DELETED (moved)
```

---

### Task 1: AuthContext

**Files:**
- Create: `contexts/AuthContext.tsx`

- [ ] **Step 1: Create the contexts directory and AuthContext**

```tsx
// contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthState {
  role: 'therapist' | 'client' | 'admin' | null;
  email: string | null;
  displayName: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string) => void;
  logout: () => void;
}

const ROLE_MAP: Record<string, { role: AuthState['role']; displayName: string }> = {
  'therapist-demo@moodsai.ai': { role: 'therapist', displayName: 'Demo Therapeut' },
  'client-demo@moodsai.ai': { role: 'client', displayName: 'Demo Cliënt' },
  'admin-demo@moodsai.ai': { role: 'admin', displayName: 'Demo Beheerder' },
};

const ROLE_ROUTES: Record<string, string> = {
  therapist: '/therapist',
  client: '/client',
  admin: '/admin',
};

const STORAGE_KEY = 'moods-demo-auth';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({ role: null, email: null, displayName: null });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setState(JSON.parse(saved));
    } catch {}
  }, []);

  const login = useCallback((email: string) => {
    const mapped = ROLE_MAP[email.toLowerCase()] ?? { role: 'client' as const, displayName: 'Demo Cliënt' };
    const newState: AuthState = { role: mapped.role, email, displayName: mapped.displayName };
    setState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }, []);

  const logout = useCallback(() => {
    setState({ role: null, email: null, displayName: null });
    localStorage.removeItem(STORAGE_KEY);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { ROLE_ROUTES };
```

- [ ] **Step 2: Verify file compiles**

Run: `cd /Users/stephan/Developer/MoodsAI/moodsai-demo && npx tsc --noEmit contexts/AuthContext.tsx 2>&1 | head -20`

Note: May show import errors since we haven't wired it into the app yet — that's fine. Just check for syntax errors.

- [ ] **Step 3: Commit**

```bash
git add contexts/AuthContext.tsx
git commit -m "feat: add AuthContext for demo role-based routing"
```

---

### Task 2: Root Layout — Add AuthProvider

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update root layout to wrap children with AuthProvider**

Replace the entire content of `app/layout.tsx` with:

```tsx
import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata: Metadata = {
  title: 'Moods.ai — Mentale gezondheid, slim geregeld',
  description: 'Moods.ai platform demo — BI dashboard, therapist agenda, client portal',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Space+Mono:wght@400;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Verify dev server starts**

Run: `cd /Users/stephan/Developer/MoodsAI/moodsai-demo && npm run build 2>&1 | tail -20`

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: wrap root layout with AuthProvider"
```

---

### Task 3: Auth Layout (shared centered card)

**Files:**
- Create: `app/(auth)/layout.tsx`
- Create: `app/(auth)/layout.module.css`
- Create: `app/(auth)/auth.module.css`

- [ ] **Step 1: Create auth layout CSS**

```css
/* app/(auth)/layout.module.css */
.root {
  min-height: 100vh;
  background-color: var(--color-paper);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.logo {
  margin-bottom: 32px;
}

.logoImg {
  display: block;
}

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 40px 36px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

@media (max-width: 480px) {
  .card {
    padding: 32px 24px;
    max-width: 100%;
  }
}
```

- [ ] **Step 2: Create shared auth form styles**

```css
/* app/(auth)/auth.module.css */
.title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 24px;
}

.field {
  margin-bottom: 20px;
}

.label {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}

.input {
  width: 100%;
  font-family: var(--font-serif);
  font-size: 1rem;
  color: var(--color-text);
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--color-border);
  padding: 8px 0;
  outline: none;
  transition: border-color 0.2s;
}

.input:focus {
  border-bottom-color: var(--color-text);
}

.input::placeholder {
  color: var(--color-text-faint);
}

.button {
  width: 100%;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-paper);
  background: var(--color-text);
  border: none;
  padding: 14px 0;
  cursor: pointer;
  transition: opacity 0.2s;
  margin-top: 8px;
}

.button:hover {
  opacity: 0.85;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-text-faint);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.link {
  font-family: var(--font-serif);
  font-size: 0.9rem;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 0.2s;
}

.link:hover {
  color: var(--color-text);
}

.linkAccent {
  color: var(--color-warm);
}

.linkAccent:hover {
  color: var(--color-text);
}

.footer {
  text-align: center;
  margin-top: 24px;
  font-family: var(--font-serif);
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  gap: 16px;
}

.spinnerDot {
  width: 8px;
  height: 8px;
  background: var(--color-text-muted);
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.spinnerText {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-text-faint);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.successMessage {
  text-align: center;
  padding: 24px 0;
}

.successIcon {
  font-size: 2rem;
  margin-bottom: 16px;
  color: var(--color-warm);
}

.successText {
  font-family: var(--font-serif);
  font-size: 1rem;
  color: var(--color-text);
  margin-bottom: 8px;
}

.successSub {
  font-family: var(--font-serif);
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: 24px;
}

/* OTP input row */
.otpRow {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 24px;
}

.otpInput {
  width: 44px;
  height: 52px;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 1.2rem;
  color: var(--color-text);
  background: transparent;
  border: none;
  border-bottom: 2px solid var(--color-border);
  outline: none;
  transition: border-color 0.2s;
}

.otpInput:focus {
  border-bottom-color: var(--color-text);
}
```

- [ ] **Step 3: Create auth layout component**

```tsx
// app/(auth)/layout.tsx
import Image from 'next/image';
import s from './layout.module.css';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={s.root}>
      <Image
        src="/images/logo.png"
        alt="Moods.ai"
        width={140}
        height={36}
        className={s.logoImg}
        priority
      />
      <div className={s.card}>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify build**

Run: `cd /Users/stephan/Developer/MoodsAI/moodsai-demo && npm run build 2>&1 | tail -20`

- [ ] **Step 5: Commit**

```bash
git add app/(auth)/layout.tsx app/(auth)/layout.module.css app/(auth)/auth.module.css
git commit -m "feat: add auth layout with centered card and shared form styles"
```

---

### Task 4: Login Page

**Files:**
- Create: `app/(auth)/login/page.tsx`
- Create: `app/(auth)/login/page.module.css`

- [ ] **Step 1: Create login page styles**

```css
/* app/(auth)/login/page.module.css */
.passwordRow {
  position: relative;
}

.forgotLink {
  position: absolute;
  right: 0;
  top: 0;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--color-text-faint);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  transition: color 0.2s;
}

.forgotLink:hover {
  color: var(--color-text-muted);
}
```

- [ ] **Step 2: Create login page component**

```tsx
// app/(auth)/login/page.tsx
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import a from '../auth.module.css';
import s from './page.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    login(email);
    setTimeout(() => {
      router.push('/verify');
    }, 1500);
  }

  if (loading) {
    return (
      <div className={a.spinner}>
        <div className={a.spinnerDot} />
        <span className={a.spinnerText}>Bezig met inloggen...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className={a.title}>Inloggen</h1>

      <div className={a.field}>
        <label className={a.label} htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          className={a.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="naam@voorbeeld.nl"
          autoComplete="email"
          required
        />
      </div>

      <div className={`${a.field} ${s.passwordRow}`}>
        <label className={a.label} htmlFor="password">Wachtwoord</label>
        <Link href="/forgot-password" className={s.forgotLink}>Vergeten?</Link>
        <input
          id="password"
          type="password"
          className={a.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </div>

      <button type="submit" className={a.button}>Inloggen</button>

      <div className={a.divider}>of</div>

      <div className={a.footer}>
        Nog geen account?{' '}
        <Link href="/signup" className={a.linkAccent}>Registreren</Link>
      </div>
    </form>
  );
}
```

- [ ] **Step 3: Verify page loads**

Run: `cd /Users/stephan/Developer/MoodsAI/moodsai-demo && npm run build 2>&1 | tail -20`

- [ ] **Step 4: Commit**

```bash
git add app/(auth)/login/
git commit -m "feat: add login page with email/password form and loading state"
```

---

### Task 5: Forgot Password Page

**Files:**
- Create: `app/(auth)/forgot-password/page.tsx`

- [ ] **Step 1: Create forgot password page**

```tsx
// app/(auth)/forgot-password/page.tsx
'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import a from '../auth.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  }

  if (sent) {
    return (
      <div className={a.successMessage}>
        <div className={a.successIcon}>✓</div>
        <p className={a.successText}>Herstellink verstuurd</p>
        <p className={a.successSub}>Controleer je inbox voor een link om je wachtwoord te herstellen.</p>
        <Link href="/login" className={a.linkAccent}>Terug naar inloggen</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className={a.title}>Wachtwoord vergeten</h1>
      <p className={a.footer} style={{ textAlign: 'left', marginTop: 0, marginBottom: 24 }}>
        Voer je e-mailadres in en we sturen je een herstellink.
      </p>

      <div className={a.field}>
        <label className={a.label} htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          className={a.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="naam@voorbeeld.nl"
          autoComplete="email"
          required
        />
      </div>

      <button type="submit" className={a.button}>Versturen</button>

      <div className={a.footer}>
        <Link href="/login" className={a.link}>← Terug naar inloggen</Link>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/(auth)/forgot-password/
git commit -m "feat: add forgot password page with confirmation state"
```

---

### Task 6: Sign Up Page

**Files:**
- Create: `app/(auth)/signup/page.tsx`

- [ ] **Step 1: Create sign up page**

```tsx
// app/(auth)/signup/page.tsx
'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import a from '../auth.module.css';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) return;
    setSent(true);
  }

  if (sent) {
    return (
      <div className={a.successMessage}>
        <div className={a.successIcon}>✓</div>
        <p className={a.successText}>Verificatie e-mail verstuurd</p>
        <p className={a.successSub}>Controleer je inbox om je account te activeren.</p>
        <Link href="/login" className={a.linkAccent}>Terug naar inloggen</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className={a.title}>Registreren</h1>

      <div className={a.field}>
        <label className={a.label} htmlFor="name">Naam</label>
        <input
          id="name"
          type="text"
          className={a.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Volledige naam"
          autoComplete="name"
          required
        />
      </div>

      <div className={a.field}>
        <label className={a.label} htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          className={a.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="naam@voorbeeld.nl"
          autoComplete="email"
          required
        />
      </div>

      <div className={a.field}>
        <label className={a.label} htmlFor="password">Wachtwoord</label>
        <input
          id="password"
          type="password"
          className={a.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
          required
        />
      </div>

      <button type="submit" className={a.button}>Registreren</button>

      <div className={a.footer}>
        Al een account?{' '}
        <Link href="/login" className={a.linkAccent}>Inloggen</Link>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/(auth)/signup/
git commit -m "feat: add sign up page with confirmation state"
```

---

### Task 7: OTP Verify Page

**Files:**
- Create: `app/(auth)/verify/page.tsx`

- [ ] **Step 1: Create OTP verify page**

```tsx
// app/(auth)/verify/page.tsx
'use client';

import { useState, useRef, type FormEvent, type KeyboardEvent, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, ROLE_ROUTES } from '@/contexts/AuthContext';
import a from '../auth.module.css';

export default function VerifyPage() {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { email, role } = useAuth();
  const router = useRouter();

  function handleChange(index: number, e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) return;
    const next = [...digits];
    next[index] = val[val.length - 1];
    setDigits(next);
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (digits.some((d) => !d)) return;
    setLoading(true);
    const dest = ROLE_ROUTES[role ?? 'client'] ?? '/client';
    setTimeout(() => {
      router.push(dest);
    }, 1500);
  }

  function handleResend() {
    setDigits(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  }

  if (loading) {
    return (
      <div className={a.spinner}>
        <div className={a.spinnerDot} />
        <span className={a.spinnerText}>Code verifiëren...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className={a.title}>Verificatie</h1>
      <p className={a.footer} style={{ textAlign: 'left', marginTop: 0, marginBottom: 24 }}>
        Voer de 6-cijferige code in die we naar{' '}
        <strong>{email ?? 'je e-mail'}</strong> hebben gestuurd.
      </p>

      <div className={a.otpRow}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className={a.otpInput}
            value={digit}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            autoFocus={i === 0}
          />
        ))}
      </div>

      <button
        type="submit"
        className={a.button}
        disabled={digits.some((d) => !d)}
      >
        Verifiëren
      </button>

      <div className={a.footer}>
        Code niet ontvangen?{' '}
        <button type="button" onClick={handleResend} className={a.linkAccent} style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>
          Opnieuw versturen
        </button>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Verify build with all auth pages**

Run: `cd /Users/stephan/Developer/MoodsAI/moodsai-demo && npm run build 2>&1 | tail -20`

- [ ] **Step 3: Commit**

```bash
git add app/(auth)/verify/
git commit -m "feat: add OTP verify page with auto-advance digit inputs"
```

---

### Task 8: Dashboard Layout (shared top bar)

**Files:**
- Create: `app/(dashboard)/layout.tsx`
- Create: `app/(dashboard)/layout.module.css`

- [ ] **Step 1: Create dashboard layout styles**

```css
/* app/(dashboard)/layout.module.css */
.topBar {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
  gap: 16px;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logoImg {
  display: block;
}

.roleLabel {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.spacer {
  flex: 1;
}

.sizeControls {
  display: flex;
  gap: 4px;
}

.sizeBtn {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  padding: 4px 8px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.sizeBtn:hover:not(:disabled) {
  background: var(--color-text);
  color: var(--color-paper);
}

.sizeBtn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.sizeBtnPlus,
.sizeBtnMinus {
  font-size: 0.55rem;
  vertical-align: super;
}

.logoutBtn {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-text-muted);
  background: transparent;
  border: 1px solid var(--color-border);
  padding: 6px 12px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  transition: background 0.2s, color 0.2s;
}

.logoutBtn:hover {
  background: var(--color-text);
  color: var(--color-paper);
}

.content {
  min-height: calc(100vh - 53px);
}

@media (max-width: 640px) {
  .topBar {
    padding: 10px 16px;
    gap: 8px;
  }

  .roleLabel {
    display: none;
  }

  .sizeControls {
    display: none;
  }
}
```

- [ ] **Step 2: Create dashboard layout component**

```tsx
// app/(dashboard)/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import s from './layout.module.css';

const ROLE_LABELS: Record<string, string> = {
  therapist: 'Therapeut Dashboard',
  client: 'Cliënt Dashboard',
  admin: 'Beheerder Dashboard',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role, logout } = useAuth();
  const router = useRouter();
  const [textSize, setTextSize] = useState(0);

  useEffect(() => {
    if (role === null) {
      // Check localStorage directly to handle page refresh race condition
      const saved = localStorage.getItem('moods-demo-auth');
      if (!saved) {
        router.push('/login');
      }
    }
  }, [role, router]);

  const sizeClass = textSize !== 0
    ? `dashboard-size-${textSize > 0 ? 'up' : 'down'}-${Math.abs(textSize)}`
    : '';

  return (
    <div className={sizeClass}>
      <header className={s.topBar}>
        <div className={s.logo}>
          <Image
            src="/images/logo.png"
            alt="Moods.ai"
            width={100}
            height={26}
            className={s.logoImg}
            priority
          />
        </div>
        <span className={s.roleLabel}>{ROLE_LABELS[role ?? ''] ?? ''}</span>
        <div className={s.spacer} />
        <div className={s.sizeControls}>
          <button
            className={s.sizeBtn}
            onClick={() => setTextSize((v) => Math.max(-2, v - 1))}
            disabled={textSize <= -2}
            title="Kleiner"
          >
            A<span className={s.sizeBtnMinus}>−</span>
          </button>
          <button
            className={s.sizeBtn}
            onClick={() => setTextSize((v) => Math.min(2, v + 1))}
            disabled={textSize >= 2}
            title="Groter"
          >
            A<span className={s.sizeBtnPlus}>+</span>
          </button>
        </div>
        <button className={s.logoutBtn} onClick={logout}>Uitloggen</button>
      </header>
      <main className={s.content}>
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/stephan/Developer/MoodsAI/moodsai-demo && npm run build 2>&1 | tail -20`

- [ ] **Step 4: Commit**

```bash
git add app/(dashboard)/layout.tsx app/(dashboard)/layout.module.css
git commit -m "feat: add shared dashboard layout with top bar, text scaling, and logout"
```

---

### Task 9: Move & Strip BI Dashboard → Admin

**Files:**
- Create: `app/(dashboard)/admin/page.tsx` (from `app/bi-dashboard/page.tsx`, dark mode stripped)
- Create: `app/(dashboard)/admin/page.module.css` (from `app/bi-dashboard/page.module.css`, dark mode stripped)
- Delete: `app/bi-dashboard/page.tsx`
- Delete: `app/bi-dashboard/page.module.css`

- [ ] **Step 1: Copy BI dashboard files to new location**

```bash
mkdir -p app/\(dashboard\)/admin
cp app/bi-dashboard/page.tsx app/\(dashboard\)/admin/page.tsx
cp app/bi-dashboard/page.module.css app/\(dashboard\)/admin/page.module.css
```

- [ ] **Step 2: Strip dark mode from admin/page.tsx**

In `app/(dashboard)/admin/page.tsx`, make these changes:
1. Remove the `darkMode` state and both `useEffect` hooks for dark mode (localStorage get/set)
2. Remove `Link` and `Image` imports (top bar is now in the shared layout)
3. Remove the entire top bar `<header>` block (lines ~488-537 in original) — this is handled by the dashboard layout now
4. Replace the root div className from `${s.root} ${darkMode ? s.darkTheme : ''} ${textSize...}` to just `${s.root} ${textSize...}` — but since text scaling is now in the dashboard layout, simplify to just `className={s.root}`
5. Replace all `darkMode ? 'color1' : 'color2'` ternaries in chart colors with just the light-mode color
6. Remove the `setDarkMode` and `darkMode` references throughout
7. Remove the `setTextSize`, `textSize` state and the size controls (handled by layout)
8. Keep all chart logic, data, grid layout, widget visibility, and other functionality intact

The key color replacements in chart sections:
- `darkMode ? '#a08060' : '#d0cdc6'` → `'#d0cdc6'`
- `darkMode ? '#c4a070' : '#b8a898'` → `'#b8a898'`
- `darkMode ? '#e8e4dd' : '#8b6d4f'` → `'#8b6d4f'`
- `darkMode ? '#9a9490' : '#3a3a3a'` → `'#3a3a3a'`
- `darkMode ? '#6a6460' : '#d0cdc6'` → `'#d0cdc6'`
- Logo Image: use just `"/images/logo.png"` (no dark variant)

- [ ] **Step 3: Strip dark mode from admin/page.module.css**

Remove every `.darkTheme` rule block from the CSS file. This is approximately lines 172-338 and 1486-1506 in the original file. Remove the `.darkTheme` class definition itself too. Keep all other styles intact.

Also remove the `.themeToggle` and `.themeToggleActive` styles since the toggle is gone.

- [ ] **Step 4: Remove the top bar styles that are now in the shared layout**

Since the top bar (logo, size controls, theme toggle, username, avatar) is now handled by the dashboard layout, remove these style classes from `admin/page.module.css` if they exist:
- `.themeToggle`, `.themeToggleActive`

Keep the `.topBar`, `.logo`, `.logoImg` etc. styles only if they're still referenced by the dashboard's own welcome/greeting section. If the dashboard still renders its own greeting section below the shared layout top bar, keep those styles.

- [ ] **Step 5: Delete old BI dashboard files**

```bash
rm app/bi-dashboard/page.tsx app/bi-dashboard/page.module.css
rmdir app/bi-dashboard
```

- [ ] **Step 6: Verify build**

Run: `cd /Users/stephan/Developer/MoodsAI/moodsai-demo && npm run build 2>&1 | tail -20`

- [ ] **Step 7: Commit**

```bash
git add app/(dashboard)/admin/ && git add -u app/bi-dashboard/
git commit -m "feat: move BI dashboard to /(dashboard)/admin, strip dark mode"
```

---

### Task 10: Move & Strip Therapist Dashboard

**Files:**
- Create: `app/(dashboard)/therapist/page.tsx` (from `app/therapist-dashboard/page.tsx`, dark mode stripped)
- Create: `app/(dashboard)/therapist/page.module.css` (from `app/therapist-dashboard/page.module.css`, dark mode stripped)
- Delete: `app/therapist-dashboard/page.tsx`
- Delete: `app/therapist-dashboard/page.module.css`

- [ ] **Step 1: Copy therapist dashboard files to new location**

```bash
mkdir -p app/\(dashboard\)/therapist
cp app/therapist-dashboard/page.tsx app/\(dashboard\)/therapist/page.tsx
cp app/therapist-dashboard/page.module.css app/\(dashboard\)/therapist/page.module.css
```

- [ ] **Step 2: Strip dark mode from therapist/page.tsx**

In `app/(dashboard)/therapist/page.tsx`, make these changes:
1. Remove `darkMode` state and both dark mode `useEffect` hooks
2. Remove `Link` and `Image` imports (top bar handled by shared layout)
3. Remove the entire top bar `<header>` block (~lines 530-561)
4. Simplify root div className: remove `darkMode ? s.darkTheme : ''` and the textSize classes (handled by layout)
5. In the `ColorOption` interface, remove the `darkBg` property
6. In `COLOR_PALETTE`, remove all `darkBg` values
7. Replace `darkMode ? palette.darkBg : palette.lightBg` with just `palette.lightBg` in the appointment style logic
8. Remove `setDarkMode`, `setTextSize`, `textSize` state
9. Keep all appointment logic, schedule data, color customization, boot screen, and tabs

- [ ] **Step 3: Strip dark mode from therapist/page.module.css**

Remove every `.darkTheme` rule block (~lines 216-407 and 2121-2230). Remove `.themeToggle`, `.themeToggleActive` styles. Keep everything else.

- [ ] **Step 4: Delete old therapist dashboard files**

```bash
rm app/therapist-dashboard/page.tsx app/therapist-dashboard/page.module.css
rmdir app/therapist-dashboard
```

- [ ] **Step 5: Verify build**

Run: `cd /Users/stephan/Developer/MoodsAI/moodsai-demo && npm run build 2>&1 | tail -20`

- [ ] **Step 6: Commit**

```bash
git add app/(dashboard)/therapist/ && git add -u app/therapist-dashboard/
git commit -m "feat: move therapist dashboard to /(dashboard)/therapist, strip dark mode"
```

---

### Task 11: Client Dashboard

**Files:**
- Create: `app/(dashboard)/client/page.tsx`
- Create: `app/(dashboard)/client/page.module.css`

- [ ] **Step 1: Create client dashboard styles**

```css
/* app/(dashboard)/client/page.module.css */
.root {
  min-height: 100%;
  background-color: var(--color-paper);
  padding: 32px 24px 60px;
}

.greeting {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 400;
  color: var(--color-text);
  margin-bottom: 4px;
}

.dateStr {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 32px;
}

.columns {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2px;
  max-width: 1200px;
}

/* ── Shared card ── */
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 24px 20px;
}

.cardTitle {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 20px;
}

/* ── Appointments ── */
.aptItem {
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border-subtle);
}

.aptItem:last-child {
  border-bottom: none;
}

.aptDate {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--color-text-faint);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 4px;
}

.aptName {
  font-family: var(--font-serif);
  font-size: 0.95rem;
  color: var(--color-text);
  margin-bottom: 2px;
}

.aptMeta {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--color-text-muted);
}

.aptType {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 2px 6px;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  margin-top: 4px;
}

.aptTypeWorkshop {
  border-color: var(--color-warm);
  color: var(--color-warm);
}

/* ── E-health ── */
.progressText {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--color-text-faint);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 16px;
}

.taskItem {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border-subtle);
}

.taskItem:last-child {
  border-bottom: none;
}

.taskCheck {
  width: 16px;
  height: 16px;
  border: 1.5px solid var(--color-border);
  flex-shrink: 0;
  margin-top: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  color: var(--color-warm);
}

.taskCheckDone {
  background: var(--color-warm);
  border-color: var(--color-warm);
  color: white;
}

.taskName {
  font-family: var(--font-serif);
  font-size: 0.9rem;
  color: var(--color-text);
}

.taskNameDone {
  text-decoration: line-through;
  color: var(--color-text-faint);
}

.taskDeadline {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--color-text-faint);
  margin-top: 2px;
}

/* ── AskMoody ── */
.chatContainer {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 400px;
}

.chatMessages {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  margin-bottom: 16px;
}

.chatBubble {
  max-width: 85%;
  padding: 10px 14px;
  font-family: var(--font-serif);
  font-size: 0.9rem;
  line-height: 1.5;
}

.chatBubbleAi {
  background: var(--color-paper);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  align-self: flex-start;
}

.chatBubbleUser {
  background: var(--color-text);
  color: var(--color-paper);
  align-self: flex-end;
}

.chatInputRow {
  display: flex;
  gap: 8px;
  border-top: 1px solid var(--color-border-subtle);
  padding-top: 12px;
}

.chatInput {
  flex: 1;
  font-family: var(--font-serif);
  font-size: 0.9rem;
  color: var(--color-text);
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--color-border);
  padding: 6px 0;
  outline: none;
}

.chatInput:focus {
  border-bottom-color: var(--color-text);
}

.chatInput::placeholder {
  color: var(--color-text-faint);
}

.chatSend {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  background: var(--color-text);
  color: var(--color-paper);
  border: none;
  padding: 6px 12px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.chatSend:hover {
  opacity: 0.85;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .columns {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: Create client dashboard component**

```tsx
// app/(dashboard)/client/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import s from './page.module.css';

function getGreeting(hour: number) {
  if (hour < 12) return 'Goedemorgen';
  if (hour < 18) return 'Goedemiddag';
  return 'Goedenavond';
}

function formatDate(date: Date) {
  const days = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];
  const months = [
    'januari', 'februari', 'maart', 'april', 'mei', 'juni',
    'juli', 'augustus', 'september', 'oktober', 'november', 'december',
  ];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
}

/* Mock data */
const appointments = [
  { date: 'Ma 7 apr · 10:00', name: 'Behandeling', therapist: 'Dhr. Van den Berg', type: 'behandeling', status: 'Bevestigd' },
  { date: 'Wo 9 apr · 14:00', name: 'Stressmanagement Workshop', therapist: '8 deelnemers', type: 'workshop', status: 'Bevestigd' },
  { date: 'Do 10 apr · 11:00', name: 'Vervolgconsult', therapist: 'Dhr. Van den Berg', type: 'consult', status: 'Bevestigd' },
  { date: 'Vr 11 apr · 10:00', name: 'Mindfulness Basis Workshop', therapist: '12 deelnemers', type: 'workshop', status: 'In afwachting' },
  { date: 'Ma 14 apr · 09:30', name: 'Behandeling', therapist: 'Dhr. Van den Berg', type: 'behandeling', status: 'Bevestigd' },
];

const tasks = [
  { name: 'Dagboek bijhouden', deadline: 'Deadline: 6 apr', done: false },
  { name: 'GAD-7 vragenlijst', deadline: 'Voltooid 1 apr', done: true },
  { name: 'Ontspanningsoefening', deadline: 'Deadline: 9 apr', done: false },
  { name: 'Workshop voorbereiding', deadline: 'Deadline: 10 apr', done: false },
];

const CANNED_RESPONSES = [
  'Ik begrijp het. Het is heel normaal om je zo te voelen. Wil je er wat meer over vertellen?',
  'Dat klinkt als een goede stap. Heb je al nagedacht over wat je deze week anders wilt doen?',
  'Goed bezig! Vergeet niet om je ontspanningsoefeningen te doen voor je volgende afspraak.',
];

interface ChatMessage {
  role: 'ai' | 'user';
  text: string;
}

export default function ClientDashboard() {
  const { displayName } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: 'Hoi! Ik ben Moody, je digitale assistent. Hoe kan ik je vandaag helpen?' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [responseIndex, setResponseIndex] = useState(0);

  useEffect(() => {
    const now = new Date();
    setGreeting(getGreeting(now.getHours()));
    setDateStr(formatDate(now));
  }, []);

  function handleSend() {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: chatInput.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    const idx = responseIndex;
    setResponseIndex((v) => (v + 1) % CANNED_RESPONSES.length);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'ai', text: CANNED_RESPONSES[idx] }]);
    }, 1000);
  }

  const completedCount = tasks.filter((t) => t.done).length;

  return (
    <div className={s.root}>
      <h1 className={s.greeting}>{greeting}, {displayName ?? 'Demo Cliënt'}</h1>
      <div className={s.dateStr}>Cliënt · {dateStr}</div>

      <div className={s.columns}>
        {/* Column 1: Appointments */}
        <div className={s.card}>
          <h2 className={s.cardTitle}>Afspraken</h2>
          {appointments.map((apt, i) => (
            <div key={i} className={s.aptItem}>
              <div className={s.aptDate}>{apt.date}</div>
              <div className={s.aptName}>{apt.name}</div>
              <div className={s.aptMeta}>{apt.therapist} · {apt.status}</div>
              <span className={`${s.aptType} ${apt.type === 'workshop' ? s.aptTypeWorkshop : ''}`}>
                {apt.type}
              </span>
            </div>
          ))}
        </div>

        {/* Column 2: E-health */}
        <div className={s.card}>
          <h2 className={s.cardTitle}>E-health Opdrachten</h2>
          <div className={s.progressText}>{completedCount} van {tasks.length} voltooid</div>
          {tasks.map((task, i) => (
            <div key={i} className={s.taskItem}>
              <div className={`${s.taskCheck} ${task.done ? s.taskCheckDone : ''}`}>
                {task.done ? '✓' : ''}
              </div>
              <div>
                <div className={`${s.taskName} ${task.done ? s.taskNameDone : ''}`}>{task.name}</div>
                <div className={s.taskDeadline}>{task.deadline}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Column 3: AskMoody */}
        <div className={s.card}>
          <h2 className={s.cardTitle}>AskMoody</h2>
          <div className={s.chatContainer}>
            <div className={s.chatMessages}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`${s.chatBubble} ${msg.role === 'ai' ? s.chatBubbleAi : s.chatBubbleUser}`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className={s.chatInputRow}>
              <input
                type="text"
                className={s.chatInput}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Typ hier..."
              />
              <button className={s.chatSend} onClick={handleSend}>→</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/stephan/Developer/MoodsAI/moodsai-demo && npm run build 2>&1 | tail -20`

- [ ] **Step 4: Commit**

```bash
git add app/(dashboard)/client/
git commit -m "feat: add client dashboard with appointments, e-health, and AskMoody chat"
```

---

### Task 12: Landing Page

**Files:**
- Modify: `app/page.tsx` (replace entirely)
- Modify: `app/page.module.css` (replace entirely)

- [ ] **Step 1: Replace landing page styles**

```css
/* app/page.module.css */
.root {
  min-height: 100vh;
  background-color: var(--color-paper);
}

/* ── Nav ── */
.nav {
  display: flex;
  align-items: center;
  padding: 16px 40px;
  gap: 16px;
}

.navLogo {
  display: flex;
  align-items: center;
}

.navSpacer {
  flex: 1;
}

.langToggle {
  display: flex;
  gap: 0;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.06em;
}

.langBtn {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  padding: 4px 10px;
  cursor: pointer;
  font: inherit;
  transition: background 0.2s, color 0.2s;
}

.langBtn:first-child {
  border-right: none;
}

.langBtnActive {
  background: var(--color-text);
  color: var(--color-paper);
  border-color: var(--color-text);
}

.navLogin {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-paper);
  background: var(--color-text);
  border: none;
  padding: 8px 20px;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.2s;
}

.navLogin:hover {
  opacity: 0.85;
}

/* ── Hero ── */
.hero {
  text-align: center;
  padding: 80px 40px 60px;
  max-width: 720px;
  margin: 0 auto;
}

.heroTitle {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 400;
  color: var(--color-text);
  letter-spacing: -0.02em;
  margin-bottom: 16px;
  line-height: 1.2;
}

.heroSub {
  font-family: var(--font-serif);
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 32px;
}

.heroCta {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-paper);
  background: var(--color-text);
  border: none;
  padding: 14px 36px;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.2s, transform 0.2s;
}

.heroCta:hover {
  opacity: 0.85;
  transform: translateY(-1px);
}

/* ── Features ── */
.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  max-width: 960px;
  margin: 0 auto;
  padding: 0 40px 60px;
}

.featureCard {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 32px 24px;
}

.featureIcon {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  margin-bottom: 16px;
  color: var(--color-warm);
}

.featureTitle {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 8px;
}

.featureDesc {
  font-family: var(--font-serif);
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

/* ── Preview ── */
.preview {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 40px 80px;
}

.previewBox {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 24px;
  text-align: center;
}

.previewLabel {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--color-text-faint);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 16px;
}

.previewGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.previewStat {
  background: var(--color-paper);
  border: 1px solid var(--color-border-subtle);
  padding: 16px 12px;
}

.previewStatValue {
  font-family: var(--font-display);
  font-size: 1.4rem;
  color: var(--color-text);
  margin-bottom: 4px;
}

.previewStatLabel {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--color-text-faint);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* ── Footer ── */
.footer {
  border-top: 1px solid var(--color-border);
  padding: 24px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--color-text-faint);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.footerLinks {
  display: flex;
  gap: 20px;
}

.footerLink {
  color: var(--color-text-faint);
  text-decoration: none;
  transition: color 0.2s;
}

.footerLink:hover {
  color: var(--color-text-muted);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .nav {
    padding: 12px 20px;
  }

  .hero {
    padding: 60px 20px 40px;
  }

  .features {
    grid-template-columns: 1fr;
    padding: 0 20px 40px;
  }

  .preview {
    padding: 0 20px 60px;
  }

  .previewGrid {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer {
    flex-direction: column;
    gap: 12px;
    text-align: center;
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .previewGrid {
    grid-template-columns: 1fr;
  }

  .langToggle {
    display: none;
  }
}
```

- [ ] **Step 2: Replace landing page component**

```tsx
// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import s from './page.module.css';

const content = {
  nl: {
    login: 'Inloggen',
    heroTitle: 'Mentale gezondheid, slim geregeld.',
    heroSub: 'Moods.ai is het alles-in-één platform voor GGZ-praktijken. Van agenda en declaraties tot AI-ondersteunde cliëntenzorg — alles op één plek.',
    heroCta: 'Aan de slag',
    features: [
      { icon: '◈', title: 'BI & Inzicht', desc: 'Realtime overzicht op omzet, cliënten, declaraties en trends. Altijd weten hoe je praktijk ervoor staat.' },
      { icon: '◉', title: 'Slim Plannen', desc: 'Agenda, e-health opdrachten en workshops in één overzicht. Voor therapeuten én cliënten.' },
      { icon: '◎', title: 'AskMoody', desc: 'AI-assistent voor cliënten en therapeuten. Vraag, ontvang en leer — op elk moment.' },
    ],
    previewLabel: 'Dashboard preview',
    stats: [
      { value: '€139k', label: 'Omzet' },
      { value: '342', label: 'Cliënten' },
      { value: '87%', label: 'Declarabiliteit' },
      { value: '24u', label: 'Directe uren' },
    ],
    copyright: '© 2026 Moods AI',
    privacy: 'Privacy',
    terms: 'Voorwaarden',
    contact: 'Contact',
  },
  en: {
    login: 'Log in',
    heroTitle: 'Mental healthcare, smartly managed.',
    heroSub: 'Moods.ai is the all-in-one platform for mental health practices. From scheduling and billing to AI-powered client care — all in one place.',
    heroCta: 'Get started',
    features: [
      { icon: '◈', title: 'BI & Insights', desc: 'Real-time overview of revenue, clients, billing, and trends. Always know where your practice stands.' },
      { icon: '◉', title: 'Smart Planning', desc: 'Agenda, e-health assignments, and workshops in one view. For therapists and clients alike.' },
      { icon: '◎', title: 'AskMoody', desc: 'AI assistant for clients and therapists. Ask, receive, and learn — at any moment.' },
    ],
    previewLabel: 'Dashboard preview',
    stats: [
      { value: '€139k', label: 'Revenue' },
      { value: '342', label: 'Clients' },
      { value: '87%', label: 'Billing rate' },
      { value: '24h', label: 'Direct hours' },
    ],
    copyright: '© 2026 Moods AI',
    privacy: 'Privacy',
    terms: 'Terms',
    contact: 'Contact',
  },
};

type Lang = 'nl' | 'en';

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>('nl');
  const t = content[lang];

  useEffect(() => {
    const saved = localStorage.getItem('moods-lang') as Lang | null;
    if (saved === 'en' || saved === 'nl') setLang(saved);
  }, []);

  function switchLang(l: Lang) {
    setLang(l);
    localStorage.setItem('moods-lang', l);
  }

  return (
    <div className={s.root}>
      {/* Nav */}
      <nav className={s.nav}>
        <div className={s.navLogo}>
          <Image src="/images/logo.png" alt="Moods.ai" width={110} height={28} priority />
        </div>
        <div className={s.navSpacer} />
        <div className={s.langToggle}>
          <button
            className={`${s.langBtn} ${lang === 'nl' ? s.langBtnActive : ''}`}
            onClick={() => switchLang('nl')}
          >
            NL
          </button>
          <button
            className={`${s.langBtn} ${lang === 'en' ? s.langBtnActive : ''}`}
            onClick={() => switchLang('en')}
          >
            EN
          </button>
        </div>
        <Link href="/login" className={s.navLogin}>{t.login}</Link>
      </nav>

      {/* Hero */}
      <section className={s.hero}>
        <h1 className={s.heroTitle}>{t.heroTitle}</h1>
        <p className={s.heroSub}>{t.heroSub}</p>
        <Link href="/login" className={s.heroCta}>{t.heroCta}</Link>
      </section>

      {/* Features */}
      <section className={s.features}>
        {t.features.map((f, i) => (
          <div key={i} className={s.featureCard}>
            <div className={s.featureIcon}>{f.icon}</div>
            <h3 className={s.featureTitle}>{f.title}</h3>
            <p className={s.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Preview */}
      <section className={s.preview}>
        <div className={s.previewBox}>
          <div className={s.previewLabel}>{t.previewLabel}</div>
          <div className={s.previewGrid}>
            {t.stats.map((stat, i) => (
              <div key={i} className={s.previewStat}>
                <div className={s.previewStatValue}>{stat.value}</div>
                <div className={s.previewStatLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={s.footer}>
        <span>{t.copyright}</span>
        <div className={s.footerLinks}>
          <a href="#" className={s.footerLink}>{t.privacy}</a>
          <a href="#" className={s.footerLink}>{t.terms}</a>
          <a href="#" className={s.footerLink}>{t.contact}</a>
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/stephan/Developer/MoodsAI/moodsai-demo && npm run build 2>&1 | tail -20`

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx app/page.module.css
git commit -m "feat: replace homepage with marketing landing page (NL/EN)"
```

---

### Task 13: Clean Up globals.css

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Remove dark mode color variable**

In `app/globals.css`, remove the `--color-dark` and `--color-ink` lines from the `@theme` block — they were only used for dark mode. Keep everything else.

Actually, check if `--color-dark` or `--color-ink` are used in light mode styles first. If they are (e.g., as a text color in new auth styles), keep them. If only used in `.darkTheme` blocks, remove them.

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "chore: clean up globals.css, remove unused dark mode variables"
```

---

### Task 14: Full Integration Test

- [ ] **Step 1: Build the entire project**

Run: `cd /Users/stephan/Developer/MoodsAI/moodsai-demo && npm run build 2>&1`

Fix any build errors.

- [ ] **Step 2: Start dev server and manually verify the flow**

Run: `cd /Users/stephan/Developer/MoodsAI/moodsai-demo && npm run dev`

Test these paths:
1. `/` — Landing page loads, NL/EN toggle works, "Inloggen" button navigates to `/login`
2. `/login` — Login form renders, entering email + password → spinner → redirects to `/verify`
3. `/verify` — OTP form renders, 6 digits → spinner → redirects to correct dashboard
4. `/forgot-password` — Form renders, submit shows confirmation
5. `/signup` — Form renders, submit shows confirmation
6. Test all three demo emails route to correct dashboards:
   - `therapist-demo@moodsai.ai` → `/therapist`
   - `client-demo@moodsai.ai` → `/client`
   - `admin-demo@moodsai.ai` → `/admin`
7. Dashboard top bar shows correct role label and logout works
8. Client dashboard: 3 columns, chat responds to messages
9. Responsive: resize browser to mobile width, verify stacking

- [ ] **Step 3: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: integration fixes for demo login flow"
```
