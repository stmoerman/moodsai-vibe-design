'use client';

import { useState, useMemo } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import { mockIntakeSlots, type IntakeSlot } from '@/data/intake-slots';

/* ── Helpers ── */
const DAY_LABELS = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
const DAY_LABELS_FULL = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
const MONTH_NAMES = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

function getWeekDates(date: Date): Date[] {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    week.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return week;
}

function dk(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getWeekNumber(d: Date) {
  const start = new Date(d.getFullYear(), 0, 1);
  const diff = d.getTime() - start.getTime() + (start.getTimezoneOffset() - d.getTimezoneOffset()) * 60000;
  return Math.ceil((diff / 86400000 + start.getDay() + 1) / 7);
}

const REGION_COLORS: Record<string, string> = {
  Amsterdam: '#4a6e8a',
  Utrecht: '#8b6d4f',
  Limburg: '#7a8a5a',
  Rotterdam: '#9a6a6a',
  Nijmegen: '#6a7a9a',
};

/* ── Extract filter options from data ── */
const allRegions = [...new Set(mockIntakeSlots.map((s) => s.region).filter(Boolean))] as string[];
const allTherapists = [...new Set(mockIntakeSlots.map((s) => s.therapistName))].sort();

export default function IntakeCalendarPage() {
  const [weekDate, setWeekDate] = useState(() => new Date(2026, 5, 1)); // June 1 2026
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [langFilter, setLangFilter] = useState<string | null>(null);
  const [therapistFilter, setTherapistFilter] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<IntakeSlot | null>(null);

  const weekDates = getWeekDates(weekDate);
  const weekNum = getWeekNumber(weekDates[0]);

  const filteredSlots = useMemo(() => {
    return mockIntakeSlots.filter((slot) => {
      if (regionFilter && slot.region !== regionFilter) return false;
      if (langFilter && !slot.languages.includes(langFilter)) return false;
      if (therapistFilter && slot.therapistName !== therapistFilter) return false;
      return true;
    });
  }, [regionFilter, langFilter, therapistFilter]);

  const slotsByDate = useMemo(() => {
    const map: Record<string, IntakeSlot[]> = {};
    for (const slot of filteredSlots) {
      if (!map[slot.date]) map[slot.date] = [];
      map[slot.date].push(slot);
    }
    // Sort each day by start time
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
    return map;
  }, [filteredSlots]);

  const totalThisWeek = weekDates.reduce((sum, wd) => sum + (slotsByDate[dk(wd)]?.length ?? 0), 0);

  function prevWeek() { setWeekDate((d) => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; }); }
  function nextWeek() { setWeekDate((d) => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; }); }
  function goToday() { setWeekDate(new Date(2026, 5, 1)); } // Jump to first data week

  const activeFilters = [regionFilter, langFilter, therapistFilter].filter(Boolean).length;

  return (
    <div className="relative min-h-screen bg-paper font-serif text-text">
      {/* Dot grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle, #d0cdc6 0.6px, transparent 0.6px)', backgroundSize: '20px 20px' }} />

      <div className="relative z-1 max-w-[1600px] mx-auto px-8 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-1">
          <Link href="/admin?tab=planning" className="font-mono text-xs text-text-muted hover:text-text transition-colors no-underline">← Terug naar planning</Link>
        </div>
        <h1 className="font-display text-2xl text-text mb-1">Intake agenda</h1>
        <p className="font-mono text-xs text-text-muted tracking-wide mb-6">Beschikbare intake slots · {totalThisWeek} {totalThisWeek === 1 ? 'slot' : 'slots'} deze week</p>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          {/* Region filter */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="font-mono text-[0.7rem] text-text bg-surface border border-border px-3 py-1.5 uppercase tracking-wide cursor-pointer flex items-center gap-2 hover:bg-surface-hover transition-colors">
                {regionFilter ?? 'Alle regio\'s'}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 4l2 2 2-2" /></svg>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-surface border border-border py-1 min-w-[160px] z-50" sideOffset={4}>
                <DropdownMenu.Item className={`font-mono text-[0.7rem] uppercase tracking-wide px-3 py-2 cursor-pointer outline-none transition-colors ${!regionFilter ? 'bg-text text-paper' : 'text-text-muted hover:bg-surface-hover hover:text-text'}`} onSelect={() => setRegionFilter(null)}>Alle regio&apos;s</DropdownMenu.Item>
                {allRegions.map((r) => (
                  <DropdownMenu.Item key={r} className={`font-mono text-[0.7rem] uppercase tracking-wide px-3 py-2 cursor-pointer outline-none transition-colors ${regionFilter === r ? 'bg-text text-paper' : 'text-text-muted hover:bg-surface-hover hover:text-text'}`} onSelect={() => setRegionFilter(r)}>{r}</DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {/* Language filter */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="font-mono text-[0.7rem] text-text bg-surface border border-border px-3 py-1.5 uppercase tracking-wide cursor-pointer flex items-center gap-2 hover:bg-surface-hover transition-colors">
                {langFilter ? `Taal: ${langFilter}` : 'Alle talen'}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 4l2 2 2-2" /></svg>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-surface border border-border py-1 min-w-[120px] z-50" sideOffset={4}>
                <DropdownMenu.Item className={`font-mono text-[0.7rem] uppercase tracking-wide px-3 py-2 cursor-pointer outline-none transition-colors ${!langFilter ? 'bg-text text-paper' : 'text-text-muted hover:bg-surface-hover hover:text-text'}`} onSelect={() => setLangFilter(null)}>Alle talen</DropdownMenu.Item>
                <DropdownMenu.Item className={`font-mono text-[0.7rem] uppercase tracking-wide px-3 py-2 cursor-pointer outline-none transition-colors ${langFilter === 'NL' ? 'bg-text text-paper' : 'text-text-muted hover:bg-surface-hover hover:text-text'}`} onSelect={() => setLangFilter('NL')}>NL</DropdownMenu.Item>
                <DropdownMenu.Item className={`font-mono text-[0.7rem] uppercase tracking-wide px-3 py-2 cursor-pointer outline-none transition-colors ${langFilter === 'EN' ? 'bg-text text-paper' : 'text-text-muted hover:bg-surface-hover hover:text-text'}`} onSelect={() => setLangFilter('EN')}>EN</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {/* Therapist filter */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="font-mono text-[0.7rem] text-text bg-surface border border-border px-3 py-1.5 uppercase tracking-wide cursor-pointer flex items-center gap-2 hover:bg-surface-hover transition-colors">
                {therapistFilter ?? 'Alle therapeuten'}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 4l2 2 2-2" /></svg>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-surface border border-border py-1 min-w-[220px] z-50 max-h-[300px] overflow-y-auto" sideOffset={4}>
                <DropdownMenu.Item className={`font-mono text-[0.7rem] uppercase tracking-wide px-3 py-2 cursor-pointer outline-none transition-colors ${!therapistFilter ? 'bg-text text-paper' : 'text-text-muted hover:bg-surface-hover hover:text-text'}`} onSelect={() => setTherapistFilter(null)}>Alle therapeuten</DropdownMenu.Item>
                {allTherapists.map((t) => (
                  <DropdownMenu.Item key={t} className={`font-mono text-[0.65rem] tracking-wide px-3 py-2 cursor-pointer outline-none transition-colors ${therapistFilter === t ? 'bg-text text-paper' : 'text-text-muted hover:bg-surface-hover hover:text-text'}`} onSelect={() => setTherapistFilter(t)}>{t}</DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {activeFilters > 0 && (
            <button
              className="font-mono text-[0.65rem] text-text-faint hover:text-text transition-colors cursor-pointer bg-transparent border-none underline"
              onClick={() => { setRegionFilter(null); setLangFilter(null); setTherapistFilter(null); }}
            >
              Filters wissen ({activeFilters})
            </button>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Week navigation */}
          <button className="font-mono text-sm text-text-muted border border-border w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-text hover:text-paper transition-colors" onClick={prevWeek}>←</button>
          <span className="font-display text-base text-text min-w-[180px] text-center">
            Week {weekNum} · {MONTH_NAMES[weekDates[0].getMonth()]} {weekDates[0].getFullYear()}
          </span>
          <button className="font-mono text-sm text-text-muted border border-border w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-text hover:text-paper transition-colors" onClick={nextWeek}>→</button>
          <button className="font-mono text-[0.7rem] text-text-muted border border-border px-3 py-1.5 uppercase tracking-wide cursor-pointer hover:bg-text hover:text-paper transition-colors" onClick={goToday}>Juni</button>
        </div>

        {/* Week grid */}
        <div className="grid grid-cols-5 gap-px" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {/* Only show Mon-Fri (no weekend slots in data) */}
          {weekDates.slice(0, 5).map((wd, di) => {
            const key = dk(wd);
            const daySlots = slotsByDate[key] ?? [];
            const isToday = key === dk(new Date());
            return (
              <div key={di} className="min-h-[200px]">
                {/* Day header */}
                <div className={`text-center py-3 border-b border-border-subtle ${isToday ? 'bg-warm/5' : ''}`}>
                  <div className="font-mono text-[0.65rem] text-text-muted uppercase tracking-wider">{DAY_LABELS[di]}</div>
                  <div className={`font-display text-lg ${isToday ? 'text-warm font-semibold' : 'text-text'}`}>{wd.getDate()}</div>
                </div>

                {/* Slots */}
                <div className="p-2 space-y-1.5">
                  {daySlots.map((slot) => (
                    <button
                      key={slot.hciTimeEntryId}
                      className={`w-full text-left p-3 border transition-all cursor-pointer group ${
                        selectedSlot?.hciTimeEntryId === slot.hciTimeEntryId
                          ? 'border-warm bg-warm/8 ring-1 ring-warm/30'
                          : 'border-border-subtle bg-surface hover:border-border hover:bg-surface-hover'
                      }`}
                      onClick={() => setSelectedSlot(selectedSlot?.hciTimeEntryId === slot.hciTimeEntryId ? null : slot)}
                    >
                      {/* Time */}
                      <div className="font-mono text-[0.65rem] text-text-muted mb-1">{slot.startTime} – {slot.endTime}</div>

                      {/* Therapist name */}
                      <div className="font-serif text-sm text-text mb-1.5">{slot.therapistName}</div>

                      {/* Tags row */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Region badge */}
                        {slot.region && (
                          <span
                            className="font-mono text-[0.55rem] uppercase tracking-wide px-1.5 py-0.5 border"
                            style={{ borderColor: REGION_COLORS[slot.region] ?? '#7a746e', color: REGION_COLORS[slot.region] ?? '#7a746e' }}
                          >
                            {slot.region}
                          </span>
                        )}
                        {!slot.region && (
                          <span className="font-mono text-[0.55rem] uppercase tracking-wide px-1.5 py-0.5 border border-border-subtle text-text-faint">Landelijk</span>
                        )}

                        {/* Language tags */}
                        {slot.languages.map((lang) => (
                          <span key={lang} className={`font-mono text-[0.55rem] uppercase tracking-wide px-1.5 py-0.5 ${lang === 'EN' ? 'bg-[#4a6e8a]/10 text-[#4a6e8a]' : 'text-text-faint'}`}>
                            {lang}
                          </span>
                        ))}

                        {/* Video indicator */}
                        <span className="font-mono text-[0.55rem] text-text-faint ml-auto">video</span>
                      </div>
                    </button>
                  ))}

                  {daySlots.length === 0 && (
                    <div className="text-center py-8">
                      <div className="font-mono text-[0.6rem] text-text-faint/50 uppercase tracking-wide">Geen slots</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected slot detail drawer */}
        {selectedSlot && (
          <div
            className="fixed inset-0 bg-text/10 z-50 flex justify-end"
            onClick={(e) => e.target === e.currentTarget && setSelectedSlot(null)}
          >
            <div className="bg-surface border-l border-border w-full max-w-md h-full shadow-lg flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
                <h3 className="font-display text-lg text-text">Slot details</h3>
                <button className="font-mono text-xs text-text-muted border border-border px-3 py-1 uppercase tracking-wide hover:bg-text hover:text-paper transition-colors cursor-pointer" onClick={() => setSelectedSlot(null)}>Sluiten</button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Date & time */}
                <div>
                  <div className="font-mono text-[0.65rem] text-text-muted uppercase tracking-wide mb-1">Datum & tijd</div>
                  <div className="font-display text-lg text-text">
                    {DAY_LABELS_FULL[new Date(selectedSlot.date + 'T00:00').getDay() === 0 ? 6 : new Date(selectedSlot.date + 'T00:00').getDay() - 1]} {new Date(selectedSlot.date + 'T00:00').getDate()} {MONTH_NAMES[new Date(selectedSlot.date + 'T00:00').getMonth()]}
                  </div>
                  <div className="font-mono text-sm text-text-muted mt-0.5">{selectedSlot.startTime} – {selectedSlot.endTime} · {selectedSlot.duration} min</div>
                </div>

                {/* Therapist */}
                <div>
                  <div className="font-mono text-[0.65rem] text-text-muted uppercase tracking-wide mb-1">Therapeut</div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-paper border border-border-subtle flex items-center justify-center font-mono text-xs text-text-muted">
                      {selectedSlot.therapistName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-serif text-base text-text">{selectedSlot.therapistName}</div>
                      <div className="font-mono text-[0.65rem] text-warm">/r/{selectedSlot.therapistMemberId.replace('mem-', '')}</div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <div className="font-mono text-[0.65rem] text-text-muted uppercase tracking-wide mb-1">Locatie</div>
                  <div className="font-serif text-sm text-text">{selectedSlot.location}</div>
                  <a href="#" className="inline-block mt-1 font-mono text-[0.65rem] text-warm border border-border-subtle px-2 py-0.5 hover:bg-warm hover:text-paper transition-colors no-underline">
                    Video link openen
                  </a>
                </div>

                {/* Region & language */}
                <div className="flex gap-6">
                  <div>
                    <div className="font-mono text-[0.65rem] text-text-muted uppercase tracking-wide mb-1">Regio</div>
                    <span className="font-mono text-xs px-2 py-0.5 border" style={{ borderColor: REGION_COLORS[selectedSlot.region ?? ''] ?? '#7a746e', color: REGION_COLORS[selectedSlot.region ?? ''] ?? '#7a746e' }}>
                      {selectedSlot.region ?? 'Landelijk'}
                    </span>
                  </div>
                  <div>
                    <div className="font-mono text-[0.65rem] text-text-muted uppercase tracking-wide mb-1">Talen</div>
                    <div className="flex gap-1">
                      {selectedSlot.languages.map((l) => (
                        <span key={l} className="font-mono text-xs text-text-muted">{l}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Book CTA */}
                <div className="pt-3 border-t border-border-subtle">
                  <button className="w-full font-mono text-[0.75rem] uppercase tracking-wide text-paper bg-text py-3 cursor-pointer hover:opacity-85 transition-opacity">
                    Client toewijzen aan dit slot
                  </button>
                  <p className="font-mono text-[0.6rem] text-text-faint text-center mt-2">Dit slot is nog niet ingepland</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
