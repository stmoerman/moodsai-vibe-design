'use client';

import { useState, useEffect, useMemo } from 'react';
import { mockAgendaEntries, type AgendaEntry } from '@/data/agenda-mock-data';

const DAY_LABELS = ['Ma', 'Di', 'Wo', 'Do', 'Vr'];
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

  useEffect(() => {
    try {
      const saved = localStorage.getItem('moods-onboarding');
      if (saved) setOnboarding(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    setLoading(true);
    const dates = getWeekDates(weekDate);
    const start = isoDate(dates[0]);
    const end = isoDate(dates[4]);

    fetch(`/api/agenda/entries?start=${start}&end=${end}&types=intake&limit=200`)
      .then((r) => r.json())
      .then((data) => {
        if (data.entries?.length > 0) {
          setAllSlots(data.entries.filter((e: AgendaEntry) => !e.clientName));
        } else {
          setAllSlots(mockAgendaEntries.filter((e) => e.activityType === 'intake' && !e.clientName && e.date >= start && e.date <= end));
        }
      })
      .catch(() => {
        const dates2 = getWeekDates(weekDate);
        setAllSlots(mockAgendaEntries.filter((e) => e.activityType === 'intake' && !e.clientName && e.date >= isoDate(dates2[0]) && e.date <= isoDate(dates2[4])));
      })
      .finally(() => setLoading(false));
  }, [weekDate]);

  const filteredSlots = useMemo(() => {
    if (!onboarding.location || onboarding.location === 'Online') return allSlots;
    const loc = onboarding.location.toLowerCase();
    return allSlots.filter((s) => s.description.toLowerCase().includes(loc) || s.location.toLowerCase().includes(loc));
  }, [allSlots, onboarding.location]);

  const weekDates = useMemo(() => getWeekDates(weekDate), [weekDate]);

  const slotsByDate = useMemo(() => {
    const map: Record<string, AgendaEntry[]> = {};
    for (const d of weekDates) map[isoDate(d)] = [];
    for (const s of filteredSlots) { if (map[s.date]) map[s.date].push(s); }
    return map;
  }, [filteredSlots, weekDates]);

  async function handleConfirm() {
    if (!selected) return;
    setSending(true);
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

  const therapistSlug = selected ? selected.therapistName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : '';

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
        <p className="font-mono text-[0.65rem] text-text-faint">Een bevestiging is verstuurd naar {onboarding.email ?? 'je e-mail'}</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border w-full max-w-[720px]">
      <div className="p-6 border-b border-border-subtle">
        <h1 className="font-display text-xl text-text mb-1">Kies een moment voor je intake</h1>
        <p className="font-mono text-[0.7rem] text-text-muted">Duur: 60 minuten · Video</p>
      </div>

      <div className="flex items-center justify-center gap-3 py-4 border-b border-border-subtle">
        <button onClick={() => setWeekDate((d) => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; })} className="w-8 h-8 border border-border flex items-center justify-center font-mono text-sm text-text-muted cursor-pointer hover:bg-surface-hover transition-colors">←</button>
        <span className="font-display text-sm text-text min-w-[200px] text-center">{formatWeekLabel(weekDates)}</span>
        <button onClick={() => setWeekDate((d) => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; })} className="w-8 h-8 border border-border flex items-center justify-center font-mono text-sm text-text-muted cursor-pointer hover:bg-surface-hover transition-colors">→</button>
      </div>

      <div className="grid grid-cols-5 min-h-[300px]">
        {weekDates.map((wd, i) => {
          const key = isoDate(wd);
          const daySlots = slotsByDate[key] ?? [];
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const isPast = wd < today;
          return (
            <div key={i} className={`border-r border-border-subtle/50 last:border-r-0 ${isPast ? 'opacity-40' : ''}`}>
              <div className="text-center py-3 border-b border-border-subtle">
                <div className="font-mono text-[0.65rem] text-text-muted uppercase">{DAY_LABELS[i]}</div>
                <div className="font-display text-lg text-text">{wd.getDate()}</div>
              </div>
              <div className="p-2 space-y-1.5">
                {loading && i === 0 && <div className="font-mono text-[0.6rem] text-text-faint text-center py-4 animate-pulse">Laden...</div>}
                {!loading && !isPast && daySlots.map((slot) => (
                  <button key={slot.id} onClick={() => setSelected(slot)} className={`w-full py-2.5 px-3 border text-center cursor-pointer transition-colors ${selected?.id === slot.id ? 'border-warm bg-warm/10 text-text' : 'border-border-subtle bg-paper hover:border-border hover:bg-surface-hover text-text'}`}>
                    <span className="font-mono text-[0.75rem]">{slot.startTime}</span>
                  </button>
                ))}
                {!loading && isPast && daySlots.length > 0 && <div className="font-mono text-[0.6rem] text-text-faint/50 text-center py-6">Verlopen</div>}
                {!loading && !isPast && daySlots.length === 0 && <div className="font-mono text-[0.6rem] text-text-faint/50 text-center py-6">—</div>}
              </div>
            </div>
          );
        })}
      </div>

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
              <button onClick={() => setSelected(null)} className="font-mono text-[0.7rem] text-text-muted border border-border px-4 py-2 cursor-pointer hover:bg-surface-hover transition-colors">Annuleren</button>
              <button onClick={handleConfirm} disabled={sending} className="font-mono text-[0.7rem] text-white bg-warm px-4 py-2 cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50">{sending ? 'Bevestigen...' : 'Bevestigen'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
