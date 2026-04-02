'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TimeOffEntry {
  firstName: string;
  lastName: string;
  type: string;
  baseType: string;
  startDate: string;
  endDate: string;
  leaveUnit: string;
  budgetTotal: number | null;
  notes: string | null;
}

const TYPE_LABELS: Record<string, string> = {
  LEAVE: 'Verlof',
  OVERTIME_PAYOUT: 'Overuren uitbetaling',
  OVERTIME_TIME_OFF_IN_LIEU: 'Overuren opname',
  TRANSACTION_CORRECTION: 'Correctie',
  TRANSACTION_SPENT: 'Transactie',
};

const RANGE_OPTIONS = [
  { label: '30 dagen', days: 30 },
  { label: '90 dagen', days: 90 },
  { label: '180 dagen', days: 180 },
  { label: '1 jaar', days: 365 },
];

export default function VerlofPage() {
  const [entries, setEntries] = useState<TimeOffEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [rangeDays, setRangeDays] = useState(90);

  useEffect(() => {
    setLoading(true);
    const now = new Date();
    const start = now.toISOString().slice(0, 10);
    const end = new Date(now.getTime() + rangeDays * 86400000).toISOString().slice(0, 10);

    fetch(`/api/hr/time-off?start=${start}&end=${end}`)
      .then(r => r.json())
      .then(data => setEntries(data.entries ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [rangeDays]);

  // Group by month
  const byMonth = new Map<string, TimeOffEntry[]>();
  for (const e of entries) {
    const month = new Date(e.startDate).toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });
    if (!byMonth.has(month)) byMonth.set(month, []);
    byMonth.get(month)!.push(e);
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-[1200px] mx-auto px-8 py-8">
        <Link href="/admin?tab=hr" className="font-mono text-xs text-text-muted hover:text-text transition-colors no-underline">← Terug naar HR & Verlof</Link>
        <h1 className="font-display text-2xl text-warm mt-2 mb-1">Verlof aankomend</h1>
        <p className="font-mono text-xs text-text-muted mb-6">{entries.length} verlofaanvragen · komende {rangeDays} dagen</p>

        <div className="flex items-center gap-1 mb-6">
          {RANGE_OPTIONS.map(opt => (
            <button
              key={opt.days}
              onClick={() => setRangeDays(opt.days)}
              className={`font-mono text-[0.7rem] uppercase tracking-wide px-3 py-1.5 border cursor-pointer transition-colors ${rangeDays === opt.days ? 'bg-text text-paper border-text' : 'border-border text-text-muted hover:bg-surface-hover'}`}
            >{opt.label}</button>
          ))}
        </div>

        {loading ? (
          <div className="font-mono text-sm text-text-faint animate-pulse py-8">Laden...</div>
        ) : entries.length === 0 ? (
          <div className="font-serif text-text-muted py-8">Geen verlof ingepland</div>
        ) : (
          Array.from(byMonth.entries()).map(([month, monthEntries]) => (
            <div key={month} className="mb-8">
              <h2 className="font-mono text-[0.75rem] text-text-muted uppercase tracking-wider mb-3 capitalize">{month}</h2>
              <div className="space-y-2">
                {monthEntries.map((entry, i) => {
                  const initials = `${entry.firstName.charAt(0)}${entry.lastName.charAt(0)}`;
                  const start = new Date(entry.startDate).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' });
                  const end = new Date(entry.endDate).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' });
                  const isSingleDay = entry.startDate === entry.endDate;
                  const days = Math.max(1, Math.ceil((new Date(entry.endDate).getTime() - new Date(entry.startDate).getTime()) / 86400000));

                  return (
                    <div key={i} className="border border-border bg-surface p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-paper border border-border-subtle flex items-center justify-center font-mono text-xs text-text-muted shrink-0">{initials}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-serif text-base text-text font-medium">{entry.firstName} {entry.lastName}</span>
                            <span className="font-mono text-[0.65rem] uppercase tracking-wide px-2 py-0.5 border border-[#5a9a60] text-[#5a9a60]">
                              {TYPE_LABELS[entry.type] ?? entry.baseType}
                            </span>
                          </div>
                          <div className="font-mono text-[0.75rem] text-text-muted">
                            {isSingleDay ? start : `${start} – ${end}`}
                            {!isSingleDay && ` · ${days} dagen`}
                            {entry.leaveUnit === 'HOURS' && entry.budgetTotal ? ` · ${entry.budgetTotal}u` : ''}
                          </div>
                          {entry.notes && (
                            <div className="font-serif text-[0.85rem] text-text-faint mt-2 italic">{entry.notes}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
