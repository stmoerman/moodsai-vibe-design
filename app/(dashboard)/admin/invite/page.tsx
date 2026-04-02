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
              <input type="text" className="w-full font-serif text-base text-text bg-transparent border-b border-border py-2 outline-none focus:border-text transition-colors placeholder:text-text-faint" placeholder="Jan" value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} required />
            </div>

            <div className="mb-5">
              <label className="block font-mono text-[0.7rem] text-text-muted uppercase tracking-wider mb-2">Achternaam</label>
              <input type="text" className="w-full font-serif text-base text-text bg-transparent border-b border-border py-2 outline-none focus:border-text transition-colors placeholder:text-text-faint" placeholder="De Vries" value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} required />
            </div>

            <div className="mb-5">
              <label className="block font-mono text-[0.7rem] text-text-muted uppercase tracking-wider mb-2">E-mail</label>
              <input type="email" className="w-full font-serif text-base text-text bg-transparent border-b border-border py-2 outline-none focus:border-text transition-colors placeholder:text-text-faint" placeholder="jan@voorbeeld.nl" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
            </div>

            <div className="mb-5">
              <label className="block font-mono text-[0.7rem] text-text-muted uppercase tracking-wider mb-2">Telefoon <span className="text-text-faint">(optioneel)</span></label>
              <input type="tel" className="w-full font-serif text-base text-text bg-transparent border-b border-border py-2 outline-none focus:border-text transition-colors placeholder:text-text-faint" placeholder="06-12345678" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
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
                      <DropdownMenu.Item key={loc.value} className={`font-serif text-sm px-4 py-2 cursor-pointer outline-none transition-colors ${form.location === loc.value ? 'bg-text text-paper' : 'text-text-muted hover:bg-surface-hover hover:text-text'}`} onSelect={() => setForm((f) => ({ ...f, location: loc.value }))}>
                        {loc.label}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>

            {error && <div className="mb-4 font-mono text-[0.7rem] text-[#c47050]">{error}</div>}

            <button type="submit" disabled={loading || !form.firstName || !form.lastName || !form.email} className="w-full font-mono text-[0.8rem] font-bold uppercase tracking-wider text-paper bg-text py-3.5 cursor-pointer hover:opacity-85 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
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
            <p className="font-serif text-sm text-text-muted mb-6">Een uitnodiging is verstuurd naar <strong className="text-text">{sentEmail}</strong></p>
            {onboardingUrl && (
              <div className="mb-6 p-3 bg-paper border border-border-subtle">
                <div className="font-mono text-[0.6rem] text-text-faint uppercase tracking-wide mb-1">Onboarding link (demo)</div>
                <a href={onboardingUrl} className="font-mono text-[0.7rem] text-warm break-all hover:underline no-underline">{onboardingUrl}</a>
              </div>
            )}
            <button onClick={reset} className="font-mono text-[0.75rem] uppercase tracking-wide text-paper bg-text px-6 py-2.5 cursor-pointer hover:opacity-85 transition-opacity">Nog een uitnodiging</button>
            <div className="mt-6">
              <Link href="/admin" className="font-serif text-sm text-text-muted hover:text-text transition-colors no-underline">← Terug naar dashboard</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
