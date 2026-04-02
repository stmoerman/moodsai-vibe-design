'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SickEntry {
  dossierId: string;
  firstName: string;
  lastName: string;
  percentage: number;
  phaseStart: string;
  expectedReturn: string | null;
  phaseEnd: string | null;
  status: string;
  notes: string | null;
}

const STATUS_LABELS: Record<string, string> = {
  REPORTED_SICK: 'Ziek gemeld',
  RECOVERED: 'Hersteld',
  PARTIAL_RECOVERY: 'Gedeeltelijk herstel',
};

export default function ZiekmeldingenPage() {
  const [entries, setEntries] = useState<SickEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'percentage'>('date');

  useEffect(() => {
    fetch('/api/hr/sick-leave')
      .then(r => r.json())
      .then(data => setEntries(data.entries ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  let filtered = showActiveOnly ? entries.filter(e => !e.phaseEnd) : entries;

  if (searchQuery) {
    filtered = filtered.filter(e =>
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Group by person (latest phase per dossier)
  const grouped = new Map<string, SickEntry>();
  for (const e of filtered) {
    const key = `${e.firstName}-${e.lastName}-${e.dossierId}`;
    if (!grouped.has(key) || new Date(e.phaseStart) > new Date(grouped.get(key)!.phaseStart)) {
      grouped.set(key, e);
    }
  }

  const list = Array.from(grouped.values()).sort((a, b) => {
    if (sortBy === 'name') {
      const lastCmp = a.lastName.localeCompare(b.lastName, 'nl');
      return lastCmp !== 0 ? lastCmp : a.firstName.localeCompare(b.firstName, 'nl');
    }
    if (sortBy === 'percentage') {
      return b.percentage - a.percentage;
    }
    // 'date' — phaseStart descending (default)
    return new Date(b.phaseStart).getTime() - new Date(a.phaseStart).getTime();
  });

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-[1200px] mx-auto px-8 py-8">
        <Link href="/admin?tab=hr" className="font-mono text-xs text-text-muted hover:text-text transition-colors no-underline">← Terug naar HR & Verlof</Link>
        <h1 className="font-display text-2xl text-warm mt-2 mb-1">Ziekmeldingen</h1>
        <p className="font-mono text-xs text-text-muted mb-6">{list.length} {showActiveOnly ? 'actieve' : 'totaal'} meldingen</p>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={() => setShowActiveOnly(true)}
            className={`font-mono text-[0.7rem] uppercase tracking-wide px-3 py-1.5 border cursor-pointer transition-colors ${showActiveOnly ? 'bg-text text-paper border-text' : 'border-border text-text-muted hover:bg-surface-hover'}`}
          >Alleen actief</button>
          <button
            onClick={() => setShowActiveOnly(false)}
            className={`font-mono text-[0.7rem] uppercase tracking-wide px-3 py-1.5 border cursor-pointer transition-colors ${!showActiveOnly ? 'bg-text text-paper border-text' : 'border-border text-text-muted hover:bg-surface-hover'}`}
          >Alle fases</button>

          <span className="w-px h-5 bg-border-subtle shrink-0" />

          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Zoek op naam..."
            className="font-serif text-sm text-text bg-transparent border-b border-border py-1.5 outline-none focus:border-text transition-colors placeholder:text-text-faint w-48"
          />

          <span className="w-px h-5 bg-border-subtle shrink-0" />

          {(['date', 'name', 'percentage'] as const).map(option => {
            const labels: Record<typeof option, string> = { date: 'Datum', name: 'Naam', percentage: 'Ernst' };
            return (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`font-mono text-[0.7rem] uppercase tracking-wide px-3 py-1.5 border cursor-pointer transition-colors ${sortBy === option ? 'bg-text text-paper border-text' : 'border-border text-text-muted hover:bg-surface-hover'}`}
              >{labels[option]}</button>
            );
          })}
        </div>

        {loading ? (
          <div className="font-mono text-sm text-text-faint animate-pulse py-8">Laden...</div>
        ) : list.length === 0 ? (
          <div className="font-serif text-text-muted py-8">Geen ziekmeldingen gevonden</div>
        ) : (
          <div className="space-y-2">
            {list.map((entry, i) => {
              const isActive = !entry.phaseEnd;
              const initials = `${entry.firstName.charAt(0)}${entry.lastName.charAt(0)}`;
              const startDate = new Date(entry.phaseStart).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
              const endDate = entry.phaseEnd ? new Date(entry.phaseEnd).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' }) : null;
              const expectedDate = entry.expectedReturn ? new Date(entry.expectedReturn).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' }) : null;
              const daysAgo = Math.floor((Date.now() - new Date(entry.phaseStart).getTime()) / 86400000);

              return (
                <div key={`${entry.dossierId}-${i}`} className={`border bg-surface p-5 ${isActive ? 'border-border' : 'border-border-subtle/50 opacity-70'}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-paper border border-border-subtle flex items-center justify-center font-mono text-xs text-text-muted shrink-0">{initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-serif text-base text-text font-medium">{entry.firstName} {entry.lastName}</span>
                        <span className={`font-mono text-[0.65rem] uppercase tracking-wide px-2 py-0.5 border ${isActive ? (entry.percentage >= 100 ? 'border-[#c47050] text-[#c47050]' : 'border-[#b07a3a] text-[#b07a3a]') : 'border-[#5a9a60] text-[#5a9a60]'}`}>
                          {isActive ? (entry.percentage >= 100 ? 'Ziek' : `${100 - entry.percentage}% herstel`) : 'Hersteld'}
                        </span>
                      </div>
                      <div className="font-mono text-[0.75rem] text-text-muted">
                        Sinds {startDate} · {isActive ? `${daysAgo} dagen` : `Tot ${endDate}`}
                      </div>
                      {expectedDate && isActive && (
                        <div className="font-mono text-[0.7rem] text-text-faint mt-1">Verwacht herstel: {expectedDate}</div>
                      )}
                      {entry.notes && (
                        <div className="font-serif text-[0.85rem] text-text-faint mt-2 italic">{entry.notes}</div>
                      )}
                    </div>
                    <div className="font-mono text-[0.65rem] text-text-faint shrink-0">
                      {entry.percentage}% ziek
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
