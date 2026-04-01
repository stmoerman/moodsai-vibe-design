'use client';

import { useState, useMemo, useCallback } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  mockAgendaEntries,
  mockLocations,
  mockAgendaStats,
  type AgendaEntry,
  type AgendaActivityType,
  type AgendaLocation,
} from '@/data/agenda-mock-data';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ACTIVITY_COLORS: Record<AgendaActivityType, string> = {
  behandeling: '#5a7a5a',
  workshop:    '#7a5a8a',
  diagnostiek: '#b07a3a',
  evaluatie:   '#4a6e8a',
  intake:      '#8b6d4f',
  reserved:    '#9a9490',
};

const ACTIVITY_LABELS: Record<AgendaActivityType, string> = {
  behandeling: 'Behandeling',
  workshop:    'Workshop',
  diagnostiek: 'Diagnostiek',
  evaluatie:   'Evaluatie',
  intake:      'Intake',
  reserved:    'Gereserveerd',
};

const ALL_TYPES: AgendaActivityType[] = [
  'behandeling',
  'workshop',
  'diagnostiek',
  'evaluatie',
  'intake',
  'reserved',
];

const WEEK_DAYS_NL   = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'];
const WEEK_DAYS_SHORT = ['Ma', 'Di', 'Wo', 'Do', 'Vr'];

// Default week: June 1 2026 (where mock data lives)
const DEFAULT_WEEK_START = new Date(2026, 5, 1);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getWeekDates(weekStart: Date): Date[] {
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });
}

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatWeekLabel(weekStart: Date): string {
  const end = new Date(weekStart);
  end.setDate(weekStart.getDate() + 4);
  const months = [
    'januari', 'februari', 'maart', 'april', 'mei', 'juni',
    'juli', 'augustus', 'september', 'oktober', 'november', 'december',
  ];
  if (weekStart.getMonth() === end.getMonth()) {
    return `${weekStart.getDate()}–${end.getDate()} ${months[weekStart.getMonth()]} ${weekStart.getFullYear()}`;
  }
  return `${weekStart.getDate()} ${months[weekStart.getMonth()]} – ${end.getDate()} ${months[end.getMonth()]} ${weekStart.getFullYear()}`;
}

function sortByTime(entries: AgendaEntry[]): AgendaEntry[] {
  return [...entries].sort((a, b) => {
    const [ah, am] = a.startTime.split(':').map(Number);
    const [bh, bm] = b.startTime.split(':').map(Number);
    return ah * 60 + am - (bh * 60 + bm);
  });
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function ChevronDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M3 4l2 2 2-2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 5l2.5 2.5L8 3" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M8 2L4 6l4 4" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M4 2l4 4-4 4" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Stats bar
// ---------------------------------------------------------------------------

function StatsBar() {
  const stats = mockAgendaStats;
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-5 py-2.5 bg-surface border-b border-border">
      <span className="font-mono text-[0.68rem] text-text-faint">
        {stats.totalEntries} afspraken totaal
      </span>
      <div className="w-px h-3.5 bg-border-subtle" />
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        {ALL_TYPES.map((type) => {
          const count = stats.byType[type]?.count ?? 0;
          return (
            <div key={type} className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: ACTIVITY_COLORS[type] }}
              />
              <span className="font-mono text-[0.65rem] text-text-muted">
                {ACTIVITY_LABELS[type]}
              </span>
              <span className="font-mono text-[0.65rem] text-text font-medium">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filter dropdowns
// ---------------------------------------------------------------------------

interface ActivityFilterProps {
  selected: Set<AgendaActivityType>;
  onChange: (type: AgendaActivityType) => void;
}

function ActivityFilter({ selected, onChange }: ActivityFilterProps) {
  const stats = mockAgendaStats;
  const hiddenCount = ALL_TYPES.length - selected.size;
  const hasFilter = hiddenCount > 0;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={`font-mono text-[0.68rem] px-3 py-1.5 border flex items-center gap-2 cursor-pointer transition-colors ${
            hasFilter
              ? 'border-warm text-warm bg-surface'
              : 'border-border text-text-muted bg-paper hover:bg-surface-hover'
          }`}
        >
          Activiteit
          {hasFilter && (
            <span className="bg-warm text-paper text-[0.6rem] px-1.5 py-0.5 rounded-full leading-none">
              {selected.size}/{ALL_TYPES.length}
            </span>
          )}
          <ChevronDown />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-surface border border-border py-1 min-w-[210px] z-50 shadow-sm"
          sideOffset={4}
          align="start"
        >
          {ALL_TYPES.map((type) => {
            const isOn = selected.has(type);
            const count = stats.byType[type]?.count ?? 0;
            return (
              <DropdownMenu.Item
                key={type}
                className="flex items-center gap-2.5 px-3 py-2 cursor-pointer outline-none hover:bg-surface-hover transition-colors"
                onSelect={(e) => { e.preventDefault(); onChange(type); }}
              >
                <span
                  className={`w-4 h-4 border shrink-0 flex items-center justify-center transition-colors ${
                    isOn ? 'border-text bg-text text-paper' : 'border-border'
                  }`}
                >
                  {isOn && <CheckIcon />}
                </span>
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: ACTIVITY_COLORS[type] }}
                />
                <span className="font-serif text-sm text-text flex-1">
                  {ACTIVITY_LABELS[type]}
                </span>
                <span className="font-mono text-[0.65rem] text-text-faint">{count}</span>
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

interface LocationFilterProps {
  selectedLocations: Set<string>;
  onToggle: (loc: string) => void;
}

function LocationFilter({ selectedLocations, onToggle }: LocationFilterProps) {
  const allLocNames = mockLocations.map((l) => l.name);
  const hiddenCount = allLocNames.length - selectedLocations.size;
  const hasFilter = hiddenCount > 0;

  const physical = mockLocations.filter((l) => l.type === 'physical');
  const online   = mockLocations.filter((l) => l.type === 'online');
  const other    = mockLocations.filter((l) => l.type === 'home' || l.type === 'phone');

  function displayName(loc: AgendaLocation): string {
    if (loc.city) return loc.city;
    return loc.name
      .replace('Online behandelkamer ', '')
      .replace('Bij client thuis', 'Bij cliënt thuis')
      .replace('Telefonisch contact', 'Telefonisch');
  }

  function renderGroup(label: string, locs: AgendaLocation[]) {
    return (
      <>
        <div className="px-3 pt-2 pb-1">
          <span className="font-mono text-[0.6rem] uppercase tracking-widest text-text-faint">
            {label}
          </span>
        </div>
        {locs.map((loc) => {
          const isOn = selectedLocations.has(loc.name);
          return (
            <DropdownMenu.Item
              key={loc.name}
              className="flex items-center gap-2.5 px-3 py-1.5 cursor-pointer outline-none hover:bg-surface-hover transition-colors"
              onSelect={(e) => { e.preventDefault(); onToggle(loc.name); }}
            >
              <span
                className={`w-4 h-4 border shrink-0 flex items-center justify-center transition-colors ${
                  isOn ? 'border-text bg-text text-paper' : 'border-border'
                }`}
              >
                {isOn && <CheckIcon />}
              </span>
              <span className="font-serif text-sm text-text flex-1 truncate max-w-[180px]" title={loc.name}>
                {displayName(loc)}
              </span>
            </DropdownMenu.Item>
          );
        })}
      </>
    );
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={`font-mono text-[0.68rem] px-3 py-1.5 border flex items-center gap-2 cursor-pointer transition-colors ${
            hasFilter
              ? 'border-warm text-warm bg-surface'
              : 'border-border text-text-muted bg-paper hover:bg-surface-hover'
          }`}
        >
          Locatie
          {hasFilter && (
            <span className="bg-warm text-paper text-[0.6rem] px-1.5 py-0.5 rounded-full leading-none">
              {selectedLocations.size}/{allLocNames.length}
            </span>
          )}
          <ChevronDown />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-surface border border-border py-1 min-w-[220px] max-h-[360px] overflow-y-auto z-50 shadow-sm"
          sideOffset={4}
          align="start"
        >
          {renderGroup('Fysiek', physical)}
          <div className="border-t border-border-subtle my-1" />
          {renderGroup('Online', online)}
          <div className="border-t border-border-subtle my-1" />
          {renderGroup('Overig', other)}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

interface TherapistFilterProps {
  allTherapists: string[];
  selectedTherapists: Set<string>;
  onToggle: (name: string) => void;
}

function TherapistFilter({ allTherapists, selectedTherapists, onToggle }: TherapistFilterProps) {
  const hiddenCount = allTherapists.length - selectedTherapists.size;
  const hasFilter = hiddenCount > 0;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={`font-mono text-[0.68rem] px-3 py-1.5 border flex items-center gap-2 cursor-pointer transition-colors ${
            hasFilter
              ? 'border-warm text-warm bg-surface'
              : 'border-border text-text-muted bg-paper hover:bg-surface-hover'
          }`}
        >
          Therapeut
          {hasFilter && (
            <span className="bg-warm text-paper text-[0.6rem] px-1.5 py-0.5 rounded-full leading-none">
              {selectedTherapists.size}/{allTherapists.length}
            </span>
          )}
          <ChevronDown />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-surface border border-border py-1 min-w-[220px] max-h-[360px] overflow-y-auto z-50 shadow-sm"
          sideOffset={4}
          align="start"
        >
          {allTherapists.map((name) => {
            const isOn = selectedTherapists.has(name);
            return (
              <DropdownMenu.Item
                key={name}
                className="flex items-center gap-2.5 px-3 py-1.5 cursor-pointer outline-none hover:bg-surface-hover transition-colors"
                onSelect={(e) => { e.preventDefault(); onToggle(name); }}
              >
                <span
                  className={`w-4 h-4 border shrink-0 flex items-center justify-center transition-colors ${
                    isOn ? 'border-text bg-text text-paper' : 'border-border'
                  }`}
                >
                  {isOn && <CheckIcon />}
                </span>
                <span className="font-serif text-sm text-text">{name}</span>
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

// ---------------------------------------------------------------------------
// Entry card — list-based, no absolute positioning
// ---------------------------------------------------------------------------

interface EntryCardProps {
  entry: AgendaEntry;
  onClick: (entry: AgendaEntry) => void;
  showDescription?: boolean;
}

function EntryCard({ entry, onClick, showDescription = false }: EntryCardProps) {
  const color  = ACTIVITY_COLORS[entry.activityType];
  const label  = ACTIVITY_LABELS[entry.activityType];
  const isOpen = !entry.clientName; // intake / reserved slots have no client

  const borderStyle: React.CSSProperties = {
    borderLeftColor: color,
    borderLeftWidth: '3px',
    borderLeftStyle: isOpen ? 'dashed' : 'solid',
  };

  return (
    <button
      onClick={() => onClick(entry)}
      className={`w-full text-left px-3 py-2.5 rounded-sm border border-border-subtle transition-colors hover:bg-surface-hover focus:outline-none focus-visible:ring-1 focus-visible:ring-border ${
        isOpen ? 'bg-paper' : 'bg-paper'
      }`}
      style={borderStyle}
    >
      {/* Time row */}
      <div className="flex items-center gap-1.5 mb-1">
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="font-mono text-[0.7rem] text-text-muted leading-none">
          {entry.startTime} – {entry.endTime}
        </span>
        <span className="font-mono text-[0.65rem] text-text-faint ml-auto leading-none">
          {label}
        </span>
      </div>

      {/* Therapist */}
      <p className="font-serif text-[0.9rem] text-text leading-snug">
        {entry.therapistName}
      </p>

      {/* Client or open indicator */}
      <p className="font-serif text-[0.82rem] leading-snug mt-0.5" style={{ color: isOpen ? color : undefined }}>
        {isOpen
          ? <span className="italic" style={{ color: `${color}cc` }}>Beschikbaar</span>
          : <span className="text-text-muted">{entry.clientName}</span>
        }
      </p>

      {/* Location */}
      <p className="font-mono text-[0.68rem] text-text-faint mt-1 leading-none">
        {entry.location}
      </p>

      {/* Description — only in day view */}
      {showDescription && entry.description && (
        <p className="font-serif text-[0.8rem] text-text-muted italic mt-1.5 leading-snug">
          {entry.description}
        </p>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Day column — list of entry cards, sorted by time
// ---------------------------------------------------------------------------

interface DayColumnProps {
  date: Date;
  dayIndex: number;
  entries: AgendaEntry[];
  onEntryClick: (entry: AgendaEntry) => void;
  showDescription?: boolean;
}

function DayColumn({ date, dayIndex, entries, onEntryClick, showDescription = false }: DayColumnProps) {
  const sorted   = sortByTime(entries);
  const hasData  = entries.length > 0;
  const dayName  = showDescription ? WEEK_DAYS_NL[dayIndex] : WEEK_DAYS_SHORT[dayIndex];

  return (
    <div className="flex flex-col min-w-0">
      {/* Day header */}
      <div
        className={`sticky top-0 z-10 px-3 py-2.5 border-b ${
          hasData
            ? 'bg-surface border-border'
            : 'bg-paper border-border-subtle'
        }`}
      >
        <p className="font-mono text-[0.62rem] uppercase tracking-widest text-text-faint leading-none mb-0.5">
          {dayName}
        </p>
        <p className={`font-display text-lg leading-none ${hasData ? 'text-text' : 'text-text-faint'}`}>
          {date.getDate()}
        </p>
        {hasData && (
          <p className="font-mono text-[0.6rem] text-text-faint mt-0.5">
            {entries.length} {entries.length === 1 ? 'afspraak' : 'afspraken'}
          </p>
        )}
      </div>

      {/* Entry list */}
      <div className="flex flex-col gap-2 p-2.5 flex-1">
        {hasData ? (
          sorted.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onClick={onEntryClick}
              showDescription={showDescription}
            />
          ))
        ) : (
          <div className="flex items-center justify-center py-8">
            <span className="font-serif text-[0.8rem] text-text-faint italic">
              Geen afspraken
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function PlanningTab() {
  // View state
  const [view, setView]                   = useState<'week' | 'dag'>('week');
  const [weekStart, setWeekStart]         = useState<Date>(DEFAULT_WEEK_START);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // Filter state
  const [activeTypes, setActiveTypes]         = useState<Set<AgendaActivityType>>(new Set(ALL_TYPES));
  const [activeLocations, setActiveLocations] = useState<Set<string>>(
    new Set(mockLocations.map((l) => l.name))
  );

  const allTherapists = useMemo(
    () => Array.from(new Set(mockAgendaEntries.map((e) => e.therapistName))).sort(),
    []
  );
  const [activeTherapists, setActiveTherapists] = useState<Set<string>>(new Set(allTherapists));

  const hasActiveFilters = useMemo(
    () =>
      activeTypes.size < ALL_TYPES.length ||
      activeLocations.size < mockLocations.length ||
      activeTherapists.size < allTherapists.length,
    [activeTypes, activeLocations, activeTherapists, allTherapists]
  );

  // Filter handlers
  const toggleType = useCallback((type: AgendaActivityType) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type); else next.add(type);
      return next;
    });
  }, []);

  const toggleLocation = useCallback((loc: string) => {
    setActiveLocations((prev) => {
      const next = new Set(prev);
      if (next.has(loc)) next.delete(loc); else next.add(loc);
      return next;
    });
  }, []);

  const toggleTherapist = useCallback((name: string) => {
    setActiveTherapists((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setActiveTypes(new Set(ALL_TYPES));
    setActiveLocations(new Set(mockLocations.map((l) => l.name)));
    setActiveTherapists(new Set(allTherapists));
  }, [allTherapists]);

  // Week navigation
  const goToPrevWeek = useCallback(() => {
    setWeekStart((prev) => { const d = new Date(prev); d.setDate(d.getDate() - 7); return d; });
  }, []);

  const goToNextWeek = useCallback(() => {
    setWeekStart((prev) => { const d = new Date(prev); d.setDate(d.getDate() + 7); return d; });
  }, []);

  const goToJune = useCallback(() => setWeekStart(DEFAULT_WEEK_START), []);

  // Filtered + grouped entries
  const filteredEntries = useMemo(
    () =>
      mockAgendaEntries.filter(
        (e) =>
          activeTypes.has(e.activityType) &&
          activeTherapists.has(e.therapistName) &&
          Array.from(activeLocations).some(
            (loc) =>
              e.location.toLowerCase().includes(loc.toLowerCase()) ||
              loc.toLowerCase().includes(e.location.toLowerCase())
          )
      ),
    [activeTypes, activeTherapists, activeLocations]
  );

  const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart]);

  const entriesByDate = useMemo(() => {
    const map: Record<string, AgendaEntry[]> = {};
    for (const d of weekDates) map[isoDate(d)] = [];
    for (const e of filteredEntries) {
      if (map[e.date] !== undefined) map[e.date].push(e);
    }
    return map;
  }, [filteredEntries, weekDates]);

  // Days that actually have data (used to skip empty columns in week view)
  const daysWithData = useMemo(
    () => weekDates.filter((d) => (entriesByDate[isoDate(d)] ?? []).length > 0),
    [weekDates, entriesByDate]
  );

  const dayViewDate    = weekDates[selectedDayIndex];
  const dayViewEntries = entriesByDate[isoDate(dayViewDate)] ?? [];

  const handleEntryClick = useCallback((entry: AgendaEntry) => {
    console.log('Clicked:', entry.id);
  }, []);

  return (
    <div className="flex flex-col min-h-0">
      {/* Stats bar */}
      <StatsBar />

      {/* Filters + controls row */}
      <div className="flex flex-wrap items-center gap-2 px-5 py-3 bg-paper border-b border-border">
        {/* Filters */}
        <ActivityFilter selected={activeTypes} onChange={toggleType} />
        <LocationFilter selectedLocations={activeLocations} onToggle={toggleLocation} />
        <TherapistFilter
          allTherapists={allTherapists}
          selectedTherapists={activeTherapists}
          onToggle={toggleTherapist}
        />

        <div className="w-px h-5 bg-border mx-0.5" />

        {/* Week navigation */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={goToPrevWeek}
            className="w-7 h-7 border border-border flex items-center justify-center text-text-muted cursor-pointer hover:bg-surface-hover transition-colors"
            aria-label="Vorige week"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={goToJune}
            className="font-mono text-[0.68rem] text-text-muted px-3 py-1.5 border border-border cursor-pointer hover:bg-surface-hover transition-colors"
            title="Terug naar juni 2026"
          >
            {formatWeekLabel(weekStart)}
          </button>
          <button
            onClick={goToNextWeek}
            className="w-7 h-7 border border-border flex items-center justify-center text-text-muted cursor-pointer hover:bg-surface-hover transition-colors"
            aria-label="Volgende week"
          >
            <ChevronRight />
          </button>
        </div>

        <div className="w-px h-5 bg-border mx-0.5" />

        {/* View toggle */}
        <div className="flex">
          {(['week', 'dag'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`font-mono text-[0.65rem] px-3 py-1.5 border-t border-b first:border-l border-r border-border cursor-pointer transition-colors ${
                view === v
                  ? 'bg-text text-paper'
                  : 'bg-paper text-text-muted hover:bg-surface-hover'
              }`}
            >
              {v === 'week' ? 'Week' : 'Dag'}
            </button>
          ))}
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="font-mono text-[0.65rem] text-warm underline cursor-pointer hover:text-text transition-colors ml-auto"
          >
            Filters wissen
          </button>
        )}
      </div>

      {/* Day selector (dag view only) */}
      {view === 'dag' && (
        <div className="flex border-b border-border bg-paper px-5">
          {weekDates.map((date, i) => {
            const count      = entriesByDate[isoDate(date)]?.length ?? 0;
            const isSelected = i === selectedDayIndex;
            return (
              <button
                key={isoDate(date)}
                onClick={() => setSelectedDayIndex(i)}
                className={`font-mono text-[0.65rem] px-4 py-2.5 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'border-text text-text'
                    : 'border-transparent text-text-muted hover:text-text'
                }`}
              >
                {WEEK_DAYS_SHORT[i]} {date.getDate()}
                {count > 0 && (
                  <span
                    className={`text-[0.55rem] px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-text text-paper' : 'bg-border text-text-muted'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Calendar body */}
      <div className="overflow-auto flex-1">
        {view === 'week' ? (
          // Week view: column per day that has data (skip truly empty days)
          <div
            className="grid divide-x divide-border-subtle"
            style={{
              gridTemplateColumns: `repeat(${Math.max(daysWithData.length, 1)}, minmax(180px, 1fr))`,
              minWidth: `${Math.max(daysWithData.length, 1) * 200}px`,
            }}
          >
            {weekDates.map((date, i) => {
              const dayEntries = entriesByDate[isoDate(date)] ?? [];
              // In week view, only render days that have entries; show all 5 if none have data
              const shouldShow = daysWithData.length === 0 || dayEntries.length > 0;
              if (!shouldShow) return null;
              return (
                <DayColumn
                  key={isoDate(date)}
                  date={date}
                  dayIndex={i}
                  entries={dayEntries}
                  onEntryClick={handleEntryClick}
                  showDescription={false}
                />
              );
            })}
            {/* Fallback: all days are empty */}
            {daysWithData.length === 0 && (
              <div className="col-span-full flex items-center justify-center py-16">
                <span className="font-serif text-[0.9rem] text-text-faint italic">
                  Geen afspraken in deze week
                </span>
              </div>
            )}
          </div>
        ) : (
          // Day view: single wide column with descriptions
          <div className="max-w-xl">
            <DayColumn
              date={dayViewDate}
              dayIndex={selectedDayIndex}
              entries={dayViewEntries}
              onEntryClick={handleEntryClick}
              showDescription={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
