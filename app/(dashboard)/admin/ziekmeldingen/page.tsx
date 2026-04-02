'use client';

import { useState, useEffect, useMemo } from 'react';
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

const MONTH_NAMES = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];

export default function ZiekmeldingenPage() {
  const [entries, setEntries] = useState<SickEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'percentage'>('date');
  const [filterMonth, setFilterMonth] = useState<string>('all'); // 'all' or 'YYYY-MM'

  useEffect(() => {
    fetch('/api/hr/sick-leave')
      .then(r => r.json())
      .then(data => setEntries(data.entries ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Available months for filter
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    for (const e of entries) {
      if (e.phaseStart) months.add(e.phaseStart.slice(0, 7));
    }
    return Array.from(months).sort().reverse();
  }, [entries]);

  let filtered = showActiveOnly ? entries.filter(e => !e.phaseEnd) : entries;
  if (searchQuery) {
    filtered = filtered.filter(e => `${e.firstName} ${e.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()));
  }
  if (filterMonth !== 'all') {
    filtered = filtered.filter(e => e.phaseStart.startsWith(filterMonth));
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
    if (sortBy === 'name') return a.lastName.localeCompare(b.lastName, 'nl') || a.firstName.localeCompare(b.firstName, 'nl');
    if (sortBy === 'percentage') return b.percentage - a.percentage;
    return new Date(b.phaseStart).getTime() - new Date(a.phaseStart).getTime();
  });

  // Stats for sidebar
  const activeCount = entries.filter(e => !e.phaseEnd).length;
  const fullySick = entries.filter(e => !e.phaseEnd && e.percentage >= 100).length;
  const partialRecovery = entries.filter(e => !e.phaseEnd && e.percentage < 100).length;
  const recoveredThisMonth = entries.filter(e => {
    if (!e.phaseEnd) return false;
    const now = new Date();
    return e.phaseEnd.startsWith(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
  }).length;

  // Average sick duration for active cases
  const avgDays = activeCount > 0
    ? Math.round(entries.filter(e => !e.phaseEnd).reduce((sum, e) => sum + Math.floor((Date.now() - new Date(e.phaseStart).getTime()) / 86400000), 0) / activeCount)
    : 0;

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <Link href="/admin?tab=hr" className="font-mono text-xs text-text-muted hover:text-text transition-colors no-underline">← Terug naar HR & Verlof</Link>
        <h1 className="font-display text-2xl text-warm mt-2 mb-1">Ziekmeldingen</h1>
        <p className="font-mono text-xs text-text-muted mb-6">{list.length} {showActiveOnly ? 'actieve' : 'totaal'} meldingen</p>

        <div className="flex gap-6">
          {/* Main list */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <button onClick={() => setShowActiveOnly(true)} className={`font-mono text-[0.7rem] uppercase tracking-wide px-3 py-1.5 border cursor-pointer transition-colors ${showActiveOnly ? 'bg-text text-paper border-text' : 'border-border text-text-muted hover:bg-surface-hover'}`}>Actief</button>
              <button onClick={() => setShowActiveOnly(false)} className={`font-mono text-[0.7rem] uppercase tracking-wide px-3 py-1.5 border cursor-pointer transition-colors ${!showActiveOnly ? 'bg-text text-paper border-text' : 'border-border text-text-muted hover:bg-surface-hover'}`}>Alle</button>
              <span className="w-px h-5 bg-border-subtle" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Zoek op naam..." className="font-serif text-sm text-text bg-transparent border-b border-border py-1.5 outline-none focus:border-text transition-colors placeholder:text-text-faint w-44" />
              <span className="w-px h-5 bg-border-subtle" />
              {(['date', 'name', 'percentage'] as const).map(opt => (
                <button key={opt} onClick={() => setSortBy(opt)} className={`font-mono text-[0.65rem] uppercase tracking-wide px-2.5 py-1.5 border cursor-pointer transition-colors ${sortBy === opt ? 'bg-text text-paper border-text' : 'border-border text-text-muted hover:bg-surface-hover'}`}>
                  {opt === 'date' ? 'Datum' : opt === 'name' ? 'Naam' : 'Ernst'}
                </button>
              ))}
            </div>

            {/* List */}
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
                          {expectedDate && isActive && <div className="font-mono text-[0.7rem] text-text-faint mt-1">Verwacht herstel: {expectedDate}</div>}
                          {entry.notes && <div className="font-serif text-[0.85rem] text-text-faint mt-2 italic">{entry.notes}</div>}
                        </div>
                        <div className="font-mono text-[0.65rem] text-text-faint shrink-0">{entry.percentage}% ziek</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-72 shrink-0 space-y-4">
            {/* Stats */}
            <div className="bg-surface border border-border p-5">
              <div className="font-mono text-[0.7rem] text-text-muted uppercase tracking-wide mb-4">Overzicht</div>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="font-serif text-sm text-text">Actief ziek</span><span className="font-mono text-sm text-text font-medium">{activeCount}</span></div>
                <div className="flex justify-between"><span className="font-serif text-sm text-text-muted">Volledig ziek</span><span className="font-mono text-sm text-text-muted">{fullySick}</span></div>
                <div className="flex justify-between"><span className="font-serif text-sm text-text-muted">Gedeeltelijk herstel</span><span className="font-mono text-sm text-text-muted">{partialRecovery}</span></div>
                <div className="border-t border-border-subtle pt-3 flex justify-between"><span className="font-serif text-sm text-text-muted">Gem. duur actief</span><span className="font-mono text-sm text-text-muted">{avgDays} dagen</span></div>
                <div className="flex justify-between"><span className="font-serif text-sm text-text-muted">Hersteld deze maand</span><span className="font-mono text-sm text-text-muted">{recoveredThisMonth}</span></div>
              </div>
            </div>

            {/* Month filter */}
            <div className="bg-surface border border-border p-5">
              <div className="font-mono text-[0.7rem] text-text-muted uppercase tracking-wide mb-3">Filter op maand</div>
              <div className="space-y-1 max-h-[300px] overflow-y-auto">
                <button
                  onClick={() => setFilterMonth('all')}
                  className={`w-full text-left font-serif text-sm px-3 py-1.5 transition-colors cursor-pointer ${filterMonth === 'all' ? 'bg-text text-paper' : 'text-text-muted hover:bg-surface-hover hover:text-text'}`}
                >Alle maanden</button>
                {availableMonths.map(m => {
                  const [y, mo] = m.split('-');
                  const label = `${MONTH_NAMES[parseInt(mo) - 1]} ${y}`;
                  const count = entries.filter(e => e.phaseStart.startsWith(m)).length;
                  return (
                    <button
                      key={m}
                      onClick={() => setFilterMonth(m)}
                      className={`w-full text-left font-serif text-sm px-3 py-1.5 flex items-center justify-between transition-colors cursor-pointer ${filterMonth === m ? 'bg-text text-paper' : 'text-text-muted hover:bg-surface-hover hover:text-text'}`}
                    >
                      <span>{label}</span>
                      <span className="font-mono text-[0.65rem]">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
