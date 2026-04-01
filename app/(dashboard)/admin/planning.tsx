'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  behandeling: '#6b8f71',
  workshop: '#8a7196',
  diagnostiek: '#c4924a',
  evaluatie: '#5a8aaa',
  intake: '#b85c3a',
  reserved: '#a8a29e',
};

const ACTIVITY_LABELS: Record<AgendaActivityType, string> = {
  behandeling: 'Behandeling',
  workshop: 'Workshop',
  diagnostiek: 'Diagnostiek',
  evaluatie: 'Evaluatie',
  intake: 'Intake',
  reserved: 'Gereserveerd',
};

const ALL_TYPES: AgendaActivityType[] = [
  'behandeling',
  'workshop',
  'diagnostiek',
  'evaluatie',
  'intake',
  'reserved',
];

// Time grid: 08:00 – 17:00, 30-min slots
const GRID_START = 8 * 60; // 480 minutes
const GRID_END = 17 * 60; // 1020 minutes
const PX_PER_MIN = 96 / 60; // 1.6px per minute
const TOTAL_HEIGHT = (GRID_END - GRID_START) * PX_PER_MIN; // 864px

const TIME_LABELS: string[] = [];
for (let m = GRID_START; m < GRID_END; m += 30) {
  const h = Math.floor(m / 60);
  const min = m % 60;
  TIME_LABELS.push(`${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
}

const WEEK_DAYS_NL = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'];
const WEEK_DAYS_SHORT = ['Ma', 'Di', 'Wo', 'Do', 'Vr'];
const MONTH_DAY_HEADERS = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
const MONTH_NAMES = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];

// Default to current week (Monday)
function getCurrentMonday(): Date {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
const DEFAULT_WEEK_START = getCurrentMonday();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function entryTop(entry: AgendaEntry): number {
  return (toMinutes(entry.startTime) - GRID_START) * PX_PER_MIN;
}

function entryHeight(entry: AgendaEntry): number {
  return Math.max(entry.duration * PX_PER_MIN, 28);
}

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

interface MonthDay {
  day: number;
  current: boolean;
}

function getMonthGrid(year: number, month: number): MonthDay[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  let startDay = first.getDay() - 1;
  if (startDay < 0) startDay = 6;
  const prevLast = new Date(year, month, 0).getDate();
  const days: MonthDay[] = [];
  for (let i = startDay - 1; i >= 0; i--) days.push({ day: prevLast - i, current: false });
  for (let d = 1; d <= last.getDate(); d++) days.push({ day: d, current: true });
  let nextDay = 1;
  while (days.length % 7 !== 0) days.push({ day: nextDay++, current: false });
  return days;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
}

// Resolve overlapping entries into columns
interface LayoutEntry {
  entry: AgendaEntry;
  col: number;
  colCount: number;
}

function layoutEntries(entries: AgendaEntry[]): LayoutEntry[] {
  if (entries.length === 0) return [];

  // Sort by start time
  const sorted = [...entries].sort(
    (a, b) => toMinutes(a.startTime) - toMinutes(b.startTime)
  );

  const result: LayoutEntry[] = sorted.map((entry) => ({ entry, col: 0, colCount: 1 }));
  const cols: number[] = []; // tracks end minute of the last entry in each column

  for (let i = 0; i < result.length; i++) {
    const start = toMinutes(result[i].entry.startTime);
    const end = start + result[i].entry.duration;

    // Find the first available column
    let placed = false;
    for (let c = 0; c < cols.length; c++) {
      if (cols[c] <= start) {
        result[i].col = c;
        cols[c] = end;
        placed = true;
        break;
      }
    }
    if (!placed) {
      result[i].col = cols.length;
      cols.push(end);
    }
  }

  // Second pass: determine total column count for overlapping groups
  for (let i = 0; i < result.length; i++) {
    const startI = toMinutes(result[i].entry.startTime);
    const endI = startI + result[i].entry.duration;
    let maxCol = result[i].col;
    for (let j = 0; j < result.length; j++) {
      if (i === j) continue;
      const startJ = toMinutes(result[j].entry.startTime);
      const endJ = startJ + result[j].entry.duration;
      if (startJ < endI && endJ > startI) {
        maxCol = Math.max(maxCol, result[j].col);
      }
    }
    result[i].colCount = maxCol + 1;
  }

  return result;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

// Chevron icon for dropdowns
function ChevronDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M3 4l2 2 2-2" />
    </svg>
  );
}

// Check icon for active checkboxes
function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 5l2.5 2.5L8 3" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Stats bar
// ---------------------------------------------------------------------------

function StatsBar() {
  const stats = mockAgendaStats;
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3 bg-surface border-b border-border">
      <span className="font-mono text-[0.68rem] text-text-muted uppercase tracking-wide">
        {stats.totalEntries} afspraken · {stats.period.replace(' to ', ' – ')}
      </span>
      <div className="w-px h-4 bg-border" />
      {ALL_TYPES.map((type) => {
        const count = stats.byType[type]?.count ?? 0;
        return (
          <div key={type} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: ACTIVITY_COLORS[type] }}
            />
            <span className="font-mono text-[0.65rem] text-text-muted">
              {ACTIVITY_LABELS[type]} <span className="text-text font-medium">{count}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filter dropdowns
// ---------------------------------------------------------------------------

interface ActivityFilterProps {
  selected: Set<AgendaActivityType>;
  onChange: (type: AgendaActivityType) => void;
  counts: Record<AgendaActivityType, number>;
}

function ActivityFilter({ selected, onChange, counts }: ActivityFilterProps) {
  const hasFilter = selected.size < ALL_TYPES.length;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className={`font-mono text-[0.68rem] uppercase tracking-wide px-3 py-1.5 border flex items-center gap-2 cursor-pointer transition-colors ${hasFilter ? 'border-warm text-warm bg-surface' : 'border-border text-text-muted bg-paper hover:bg-surface-hover'}`}>
          Activiteit
          {hasFilter && (
            <span className="text-warm text-[0.6rem] leading-none">
              {selected.size}/{ALL_TYPES.length}
            </span>
          )}
          <ChevronDown />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-surface border border-border py-1 min-w-[200px] z-50 shadow-sm"
          sideOffset={4}
          align="start"
        >
          {ALL_TYPES.map((type) => {
            const isOn = selected.has(type);
            const count = counts[type] ?? 0;
            return (
              <DropdownMenu.Item
                key={type}
                className="flex items-center gap-2.5 px-3 py-2 cursor-pointer outline-none hover:bg-surface-hover transition-colors"
                onSelect={(e) => { e.preventDefault(); onChange(type); }}
              >
                <span
                  className={`w-4 h-4 border shrink-0 flex items-center justify-center transition-colors ${isOn ? 'border-text bg-text text-paper' : 'border-border'}`}
                >
                  {isOn && <CheckIcon />}
                </span>
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: ACTIVITY_COLORS[type] }}
                />
                <span className="font-serif text-sm text-text flex-1">{ACTIVITY_LABELS[type]}</span>
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
  const hasFilter = selectedLocations.size < allLocNames.length && selectedLocations.size > 0;
  // group by type
  const physical = mockLocations.filter((l) => l.type === 'physical');
  const online = mockLocations.filter((l) => l.type === 'online');
  const other = mockLocations.filter((l) => l.type === 'home' || l.type === 'phone');

  const activeCount = allLocNames.length - selectedLocations.size;

  function renderGroup(label: string, locs: AgendaLocation[]) {
    return (
      <>
        <div className="px-3 pt-2 pb-1">
          <span className="font-mono text-[0.6rem] uppercase tracking-widest text-text-faint">{label}</span>
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
                className={`w-4 h-4 border shrink-0 flex items-center justify-center transition-colors ${isOn ? 'border-text bg-text text-paper' : 'border-border'}`}
              >
                {isOn && <CheckIcon />}
              </span>
              <span className="font-serif text-sm text-text flex-1 truncate max-w-[180px]" title={loc.name}>
                {loc.city ?? loc.name.replace('Online behandelkamer ', '').replace('Thuis', 'Thuis').replace('Bij client thuis', 'Bij cliënt thuis').replace('Telefonisch contact', 'Telefonisch')}
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
        <button className={`font-mono text-[0.68rem] uppercase tracking-wide px-3 py-1.5 border flex items-center gap-2 cursor-pointer transition-colors ${hasFilter ? 'border-warm text-warm bg-surface' : 'border-border text-text-muted bg-paper hover:bg-surface-hover'}`}>
          Locatie
          {hasFilter && (
            <span className="bg-warm text-paper text-[0.6rem] px-1.5 py-0.5 rounded-full leading-none">
              {activeCount}
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
  onToggle: (t: string) => void;
}

function TherapistFilter({ allTherapists, selectedTherapists, onToggle }: TherapistFilterProps) {
  const hasFilter = selectedTherapists.size < allTherapists.length && selectedTherapists.size > 0;
  const activeCount = allTherapists.length - selectedTherapists.size;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className={`font-mono text-[0.68rem] uppercase tracking-wide px-3 py-1.5 border flex items-center gap-2 cursor-pointer transition-colors ${hasFilter ? 'border-warm text-warm bg-surface' : 'border-border text-text-muted bg-paper hover:bg-surface-hover'}`}>
          Therapeut
          {hasFilter && (
            <span className="bg-warm text-paper text-[0.6rem] px-1.5 py-0.5 rounded-full leading-none">
              {activeCount}
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
                  className={`w-4 h-4 border shrink-0 flex items-center justify-center transition-colors ${isOn ? 'border-text bg-text text-paper' : 'border-border'}`}
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
// Entry card (week view)
// ---------------------------------------------------------------------------

interface EntryCardProps {
  entry: AgendaEntry;
  col: number;
  colCount: number;
  onClick: (entry: AgendaEntry) => void;
  dayView?: boolean;
}

function EntryCard({ entry, col, colCount, onClick, dayView = false }: EntryCardProps) {
  const top = entryTop(entry);
  const height = entryHeight(entry);
  const isIntake = entry.activityType === 'intake';
  const isReserved = entry.activityType === 'reserved';
  const color = ACTIVITY_COLORS[entry.activityType];
  const label = ACTIVITY_LABELS[entry.activityType];
  const displayName = entry.clientName ?? (isIntake || isReserved ? 'Beschikbaar' : '—');
  const isOpen = isIntake || (isReserved && !entry.clientName);

  // Column layout math
  const widthPct = 100 / colCount;
  const leftPct = (col / colCount) * 100;

  const cardStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${top}px`,
    height: `${height}px`,
    left: `calc(${leftPct}% + ${col > 0 ? 2 : 0}px)`,
    width: `calc(${widthPct}% - ${col > 0 ? 3 : 2}px)`,
    borderLeft: `3px solid ${color}`,
    borderTop: isOpen ? `1px dashed ${color}` : `1px solid transparent`,
    borderRight: isOpen ? `1px dashed ${color}` : '1px solid transparent',
    borderBottom: isOpen ? `1px dashed ${color}` : `1px solid transparent`,
    backgroundColor: isOpen
      ? `${color}12`
      : `${color}18`,
    cursor: 'pointer',
    overflow: 'hidden',
    zIndex: 2,
    transition: 'box-shadow 0.15s ease',
  };

  if (dayView) {
    // Day view: full-width, more detail
    return (
      <div
        style={{
          ...cardStyle,
          left: '2px',
          width: 'calc(100% - 4px)',
        }}
        onClick={() => onClick(entry)}
        className="group p-2 hover:shadow-md"
        title={entry.description || label}
      >
        <div className="flex items-start gap-2 h-full">
          {/* Therapist avatar */}
          <div
            className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center font-mono text-[0.58rem] text-paper"
            style={{ backgroundColor: color }}
          >
            {getInitials(entry.therapistName)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span
                className="font-mono text-[0.58rem] uppercase tracking-wide"
                style={{ color }}
              >
                {label}
              </span>
              {isOpen && (
                <span
                  className="font-mono text-[0.55rem] px-1.5 py-0.5 rounded-full uppercase tracking-wide text-paper"
                  style={{ backgroundColor: color }}
                >
                  Beschikbaar
                </span>
              )}
            </div>
            <p className="font-serif text-[0.82rem] text-text leading-tight truncate">
              {entry.therapistName}
            </p>
            {entry.clientName && (
              <p className="font-serif text-[0.78rem] text-text-muted leading-tight truncate">
                {entry.clientName}
              </p>
            )}
            {height > 64 && (
              <>
                <p className="font-mono text-[0.58rem] text-text-faint mt-1 truncate">{entry.location}</p>
                {entry.description && (
                  <p className="font-serif text-[0.72rem] text-text-muted italic mt-0.5 line-clamp-2">{entry.description}</p>
                )}
              </>
            )}
            <p className="font-mono text-[0.6rem] text-text-faint mt-auto">
              {entry.startTime} – {entry.endTime}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Week view card (compact)
  return (
    <div
      style={cardStyle}
      onClick={() => onClick(entry)}
      className="group px-1.5 py-1 hover:shadow-md"
      title={`${label} · ${entry.therapistName}${entry.clientName ? ` · ${entry.clientName}` : ''}`}
    >
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex items-center gap-1 mb-0.5 flex-wrap">
          <span
            className="font-mono text-[0.55rem] uppercase tracking-wide leading-none shrink-0"
            style={{ color }}
          >
            {label}
          </span>
          {isOpen && (
            <span
              className="font-mono text-[0.5rem] px-1 leading-4 rounded-full uppercase tracking-wide text-paper shrink-0"
              style={{ backgroundColor: color }}
            >
              Open
            </span>
          )}
        </div>
        {height > 36 && (
          <p className="font-serif text-[0.72rem] text-text leading-tight truncate">
            {entry.therapistName}
          </p>
        )}
        {height > 52 && (
          <p className="font-serif text-[0.68rem] text-text-muted leading-tight truncate">
            {displayName}
          </p>
        )}
        {height > 72 && (
          <p className="font-mono text-[0.58rem] text-text-faint mt-auto leading-none">
            {entry.startTime}–{entry.endTime}
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Time column (left axis)
// ---------------------------------------------------------------------------

function TimeAxis() {
  return (
    <div
      className="shrink-0 w-14 border-r border-border-subtle"
      style={{ height: `${TOTAL_HEIGHT}px`, position: 'relative' }}
    >
      {TIME_LABELS.map((label, i) => {
        const top = i * 30 * PX_PER_MIN;
        return (
          <div
            key={label}
            style={{ position: 'absolute', top: `${top}px`, left: 0, right: 0 }}
            className="flex items-start justify-end pr-2"
          >
            <span className="font-mono text-[0.58rem] text-text-faint leading-none -translate-y-1/2">
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Day column (week view)
// ---------------------------------------------------------------------------

interface DayColumnProps {
  date: Date;
  entries: AgendaEntry[];
  dayIndex: number;
  onEntryClick: (entry: AgendaEntry) => void;
  dayView?: boolean;
}

function DayColumn({ date, entries, dayIndex, onEntryClick, dayView = false }: DayColumnProps) {
  const laid = layoutEntries(entries);
  const hasData = entries.length > 0;

  return (
    <div className="flex-1 min-w-0 border-r border-border-subtle last:border-r-0">
      {/* Day header */}
      <div className={`px-2 py-2 text-center border-b ${hasData ? 'border-border bg-surface' : 'border-border-subtle bg-paper'}`}>
        <p className="font-mono text-[0.6rem] uppercase tracking-widest text-text-faint">
          {WEEK_DAYS_SHORT[dayIndex]}
        </p>
        <p className={`font-display text-base leading-none ${hasData ? 'text-text' : 'text-text-faint'}`}>
          {date.getDate()}
        </p>
      </div>

      {/* Time grid */}
      <div
        className="relative"
        style={{ height: `${TOTAL_HEIGHT}px` }}
      >
        {/* Horizontal grid lines every 30 min */}
        {TIME_LABELS.map((label, i) => {
          const top = i * 30 * PX_PER_MIN;
          const isHour = i % 2 === 0;
          return (
            <div
              key={label}
              style={{
                position: 'absolute',
                top: `${top}px`,
                left: 0,
                right: 0,
                height: '1px',
                backgroundColor: isHour ? '#e8e4dd' : '#f0ede8',
              }}
            />
          );
        })}

        {/* Entries */}
        {laid.map(({ entry, col, colCount }) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            col={col}
            colCount={colCount}
            onClick={onEntryClick}
            dayView={dayView}
          />
        ))}

        {/* Empty state */}
        {entries.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-[0.75rem] text-text-faint italic">Geen afspraken</span>
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
  const searchParams = useSearchParams();
  const router = useRouter();

  // --- Read initial filter state from URL ---
  const initialTypes = useMemo(() => {
    const p = searchParams.get('types');
    if (p) return new Set(p.split(',').filter((t) => ALL_TYPES.includes(t as AgendaActivityType)) as AgendaActivityType[]);
    return new Set<AgendaActivityType>(['intake']);
  }, []);

  const allTherapists = useMemo(
    () => Array.from(new Set(mockAgendaEntries.map((e) => e.therapistName))).sort(),
    []
  );

  const initialTherapists = useMemo(() => {
    const p = searchParams.get('therapeuten');
    if (p) return new Set(p.split(','));
    return new Set(allTherapists);
  }, []);

  const initialLocations = useMemo(() => {
    const p = searchParams.get('locaties');
    if (p) return new Set(p.split(','));
    return new Set(mockLocations.map((l) => l.name));
  }, []);

  // --- View state ---
  const [view, setView] = useState<'maand' | 'week' | 'dag'>('maand');
  const [calMonth, setCalMonth] = useState(() => { const n = new Date(); return { year: n.getFullYear(), month: n.getMonth() }; });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState<Date>(DEFAULT_WEEK_START);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // --- Filter state ---
  const [activeTypes, setActiveTypes] = useState<Set<AgendaActivityType>>(initialTypes);
  const [activeLocations, setActiveLocations] = useState<Set<string>>(initialLocations);
  const [activeTherapists, setActiveTherapists] = useState<Set<string>>(initialTherapists);

  // --- Sync filters to URL ---
  const syncFiltersToUrl = useCallback((types: Set<AgendaActivityType>, therapists: Set<string>, locations: Set<string>) => {
    const params = new URLSearchParams(searchParams.toString());
    // Only write non-default values
    if (types.size === ALL_TYPES.length || (types.size === 1 && types.has('intake'))) {
      if (types.size === 1 && types.has('intake')) params.delete('types');
      else params.delete('types');
    }
    if (types.size > 0 && !(types.size === 1 && types.has('intake')) && types.size < ALL_TYPES.length) {
      params.set('types', Array.from(types).join(','));
    } else if (types.size === ALL_TYPES.length) {
      params.delete('types');
    }
    if (therapists.size < allTherapists.length) {
      params.set('therapeuten', Array.from(therapists).join(','));
    } else {
      params.delete('therapeuten');
    }
    if (locations.size < mockLocations.length) {
      params.set('locaties', Array.from(locations).join(','));
    } else {
      params.delete('locaties');
    }
    router.replace(`/admin?${params.toString()}`, { scroll: false });
  }, [searchParams, router, allTherapists]);

  // --- Derived: is any filter active ---
  const hasActiveFilters = useMemo(
    () =>
      activeTypes.size < ALL_TYPES.length ||
      activeLocations.size < mockLocations.length ||
      activeTherapists.size < allTherapists.length,
    [activeTypes, activeLocations, activeTherapists, allTherapists]
  );

  // --- Filter toggle handlers ---
  const toggleType = useCallback((type: AgendaActivityType) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      syncFiltersToUrl(next, activeTherapists, activeLocations);
      return next;
    });
  }, [syncFiltersToUrl, activeTherapists, activeLocations]);

  const toggleLocation = useCallback((loc: string) => {
    setActiveLocations((prev) => {
      const next = new Set(prev);
      if (next.has(loc)) next.delete(loc);
      else next.add(loc);
      syncFiltersToUrl(activeTypes, activeTherapists, next);
      return next;
    });
  }, [syncFiltersToUrl, activeTypes, activeTherapists]);

  const toggleTherapist = useCallback((name: string) => {
    setActiveTherapists((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      syncFiltersToUrl(activeTypes, next, activeLocations);
      return next;
    });
  }, [syncFiltersToUrl, activeTypes, activeLocations]);

  const clearFilters = useCallback(() => {
    const types = new Set(ALL_TYPES);
    const locs = new Set(mockLocations.map((l) => l.name));
    const therps = new Set(allTherapists);
    setActiveTypes(types);
    setActiveLocations(locs);
    setActiveTherapists(therps);
    syncFiltersToUrl(types, therps, locs);
  }, [allTherapists, syncFiltersToUrl]);

  // --- Week navigation ---
  const goToPrevWeek = useCallback(() => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  }, []);

  const goToNextWeek = useCallback(() => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  }, []);

  const goToCurrentWeek = useCallback(() => {
    setWeekStart(DEFAULT_WEEK_START);
  }, []);

  // --- Filtered entries ---
  const filteredEntries = useMemo(
    () =>
      mockAgendaEntries.filter(
        (e) =>
          activeTypes.has(e.activityType) &&
          activeTherapists.has(e.therapistName) &&
          // Location matching: check if entry location contains any selected location name
          Array.from(activeLocations).some((loc) =>
            e.location.toLowerCase().includes(loc.toLowerCase()) ||
            loc.toLowerCase().includes(e.location.toLowerCase())
          )
      ),
    [activeTypes, activeTherapists, activeLocations]
  );

  // Counts per activity type (from all entries, ignoring type filter)
  const activityCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const t of ALL_TYPES) c[t] = 0;
    for (const e of mockAgendaEntries) c[e.activityType] = (c[e.activityType] ?? 0) + 1;
    return c as Record<AgendaActivityType, number>;
  }, []);

  // --- Entries grouped by date ---
  const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart]);

  const entriesByDate = useMemo(() => {
    const map: Record<string, AgendaEntry[]> = {};
    for (const date of weekDates) {
      map[isoDate(date)] = [];
    }
    for (const entry of filteredEntries) {
      if (map[entry.date] !== undefined) {
        map[entry.date].push(entry);
      }
    }
    return map;
  }, [filteredEntries, weekDates]);

  // --- Day view: selected day entries ---
  const dayViewDate = weekDates[selectedDayIndex];
  const dayViewEntries = entriesByDate[isoDate(dayViewDate)] ?? [];

  // --- Entry click ---
  const handleEntryClick = useCallback((entry: AgendaEntry) => {
    console.log('Clicked:', entry.id);
  }, []);

  return (
    <div className="flex flex-col min-h-0">
      {/* Stats bar */}
      {view !== 'maand' && <StatsBar />}

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-2 px-5 py-3 bg-paper border-b border-border">
        {/* Activity type filter */}
        <ActivityFilter selected={activeTypes} onChange={toggleType} counts={activityCounts} />

        {/* Location filter */}
        <LocationFilter
          selectedLocations={activeLocations}
          onToggle={toggleLocation}
        />

        {/* Therapist filter */}
        <TherapistFilter
          allTherapists={allTherapists}
          selectedTherapists={activeTherapists}
          onToggle={toggleTherapist}
        />

        <div className="w-px h-5 bg-border mx-1" />

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={view === 'maand' ? () => setCalMonth((m) => m.month === 0 ? { year: m.year - 1, month: 11 } : { ...m, month: m.month - 1 }) : goToPrevWeek}
            className="w-7 h-7 border border-border flex items-center justify-center text-text-muted font-mono text-sm cursor-pointer hover:bg-surface-hover transition-colors"
          >
            ←
          </button>
          <button
            onClick={view === 'maand' ? () => { const n = new Date(); setCalMonth({ year: n.getFullYear(), month: n.getMonth() }); } : goToCurrentWeek}
            className="font-display text-sm text-text px-3 py-1 border border-border cursor-pointer hover:bg-surface-hover transition-colors min-w-[160px] text-center"
          >
            {view === 'maand' ? `${MONTH_NAMES[calMonth.month]} ${calMonth.year}` : formatWeekLabel(weekStart)}
          </button>
          <button
            onClick={view === 'maand' ? () => setCalMonth((m) => m.month === 11 ? { year: m.year + 1, month: 0 } : { ...m, month: m.month + 1 }) : goToNextWeek}
            className="w-7 h-7 border border-border flex items-center justify-center text-text-muted font-mono text-sm cursor-pointer hover:bg-surface-hover transition-colors"
          >
            →
          </button>
        </div>

        <div className="w-px h-5 bg-border mx-1" />

        {/* View toggle */}
        <div className="flex">
          {(['maand', 'week', 'dag'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`font-mono text-[0.65rem] uppercase tracking-wide px-3 py-1.5 border-t border-b first:border-l border-r border-border cursor-pointer transition-colors ${view === v ? 'bg-text text-paper' : 'bg-paper text-text-muted hover:bg-surface-hover'}`}
            >
              {v === 'maand' ? 'Maand' : v === 'week' ? 'Week' : 'Dag'}
            </button>
          ))}
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="font-mono text-[0.65rem] uppercase tracking-wide text-warm underline cursor-pointer hover:text-text transition-colors ml-auto"
          >
            Filters wissen
          </button>
        )}
      </div>

      {/* ═══ Month view ═══ */}
      {view === 'maand' && (() => {
        const grid = getMonthGrid(calMonth.year, calMonth.month);
        const todayKey = isoDate(new Date());
        return (
          <div className="bg-surface border border-border p-6 relative">
            {/* Legend */}
            <div className="flex gap-5 mb-5 flex-wrap">
              {ALL_TYPES.filter((t) => activeTypes.has(t)).map((type) => (
                <div key={type} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 shrink-0" style={{ background: ACTIVITY_COLORS[type] }} />
                  <span className="font-mono text-[0.65rem] text-text-muted uppercase tracking-wide">{ACTIVITY_LABELS[type]}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {MONTH_DAY_HEADERS.map((d) => (
                <div key={d} className="font-mono text-[0.7rem] text-text-muted uppercase tracking-wider text-center py-2.5">{d}</div>
              ))}
              {grid.map((gd, i) => {
                const dk = gd.current ? `${calMonth.year}-${String(calMonth.month + 1).padStart(2, '0')}-${String(gd.day).padStart(2, '0')}` : null;
                const dayEntries = dk ? (entriesByDate[dk] ?? []) : [];
                const isToday = dk === todayKey;
                const isSelected = dk === selectedDay;
                return (
                  <div
                    key={i}
                    className={[
                      'min-h-[130px] p-2 overflow-hidden transition-colors',
                      gd.current ? 'border-t border-border-subtle/60 cursor-pointer hover:bg-surface-hover' : 'opacity-40',
                      isToday && !isSelected ? 'bg-warm/5!' : '',
                      isSelected ? 'bg-warm/10! ring-1 ring-warm/40 ring-inset' : '',
                      'bg-surface',
                    ].join(' ')}
                    onClick={() => gd.current && dk && setSelectedDay(selectedDay === dk ? null : dk)}
                  >
                    <span className={`block font-mono text-xs mb-1.5 ${gd.current && isToday ? 'text-warm font-bold' : gd.current ? 'text-text' : 'text-text'}`}>{gd.day}</span>
                    {dayEntries.slice(0, 3).map((ev, j) => (
                      <div key={j} className="flex gap-1 items-baseline py-0.5 pl-2 mb-0.5 border-l-[3px] bg-paper/60" style={{ borderLeftColor: ACTIVITY_COLORS[ev.activityType] }}>
                        <span className="font-mono text-[0.6rem] text-text-faint shrink-0">{ev.startTime}</span>
                        <span className="font-serif text-[0.8rem] text-text truncate">{ev.therapistName}</span>
                      </div>
                    ))}
                    {dayEntries.length > 3 && (
                      <div className="font-mono text-[0.6rem] text-text-muted pl-2 pt-0.5">+{dayEntries.length - 3} meer</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Day detail drawer */}
            {selectedDay && entriesByDate[selectedDay] && (
              <div
                className="absolute inset-0 bg-text/10 z-10 flex justify-end p-4"
                onClick={(e) => e.target === e.currentTarget && setSelectedDay(null)}
              >
                <div className="bg-surface border border-border w-full max-w-md h-full shadow-lg flex flex-col">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
                    <h3 className="font-display text-lg text-text capitalize">
                      {new Date(selectedDay + 'T00:00').toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h3>
                    <button className="font-mono text-xs text-text-muted border border-border px-3 py-1 uppercase tracking-wide hover:bg-text hover:text-paper transition-colors cursor-pointer" onClick={() => setSelectedDay(null)}>Sluiten</button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-3">
                    {entriesByDate[selectedDay].map((entry) => (
                      <div
                        key={entry.id}
                        className="border-l-[3px] bg-paper p-4 cursor-pointer hover:bg-surface-hover transition-colors"
                        style={{ borderLeftColor: ACTIVITY_COLORS[entry.activityType], borderLeftStyle: entry.clientName ? 'solid' : 'dashed' }}
                        onClick={() => console.log('Clicked:', entry.id)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACTIVITY_COLORS[entry.activityType] }} />
                          <span className="font-mono text-[0.7rem] text-text-muted">{entry.startTime} – {entry.endTime}</span>
                          <span className="font-mono text-[0.6rem] text-text-faint ml-auto">{ACTIVITY_LABELS[entry.activityType]}</span>
                        </div>
                        <div className="font-serif text-[0.95rem] text-text">{entry.therapistName}</div>
                        <div className="font-serif text-[0.85rem] text-text-muted">{entry.clientName ?? 'Beschikbaar'}</div>
                        <div className="font-mono text-[0.65rem] text-text-faint mt-1">{entry.location}</div>
                        {entry.description && <div className="font-serif text-[0.8rem] text-text-faint mt-1 italic">{entry.description}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Day selector (only in dag view) */}
      {view === 'dag' && (
        <div className="flex border-b border-border bg-paper px-5">
          {weekDates.map((date, i) => {
            const key = isoDate(date);
            const count = entriesByDate[key]?.length ?? 0;
            const isSelected = i === selectedDayIndex;
            return (
              <button
                key={key}
                onClick={() => setSelectedDayIndex(i)}
                className={`font-mono text-[0.65rem] uppercase tracking-wide px-4 py-2.5 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${isSelected ? 'border-text text-text' : 'border-transparent text-text-muted hover:text-text'}`}
              >
                {WEEK_DAYS_SHORT[i]} {date.getDate()}
                {count > 0 && (
                  <span className={`text-[0.55rem] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-text text-paper' : 'bg-border text-text-muted'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Calendar grid (week/dag only) */}
      {(view === 'week' || view === 'dag') && (
      <div className="overflow-auto flex-1">
        <div className="flex min-w-0" style={{ minWidth: view === 'week' ? '700px' : '400px' }}>
          {/* Time axis */}
          <div className="shrink-0 w-14 border-r border-border-subtle">
            {/* Header spacer to match day header */}
            <div className="h-[52px] border-b border-border" />
            {/* Time labels */}
            <div style={{ height: `${TOTAL_HEIGHT}px`, position: 'relative' }}>
              {TIME_LABELS.map((label, i) => {
                const top = i * 30 * PX_PER_MIN;
                return (
                  <div
                    key={label}
                    style={{ position: 'absolute', top: `${top}px`, left: 0, right: 0 }}
                    className="flex items-start justify-end pr-2"
                  >
                    <span className="font-mono text-[0.58rem] text-text-faint leading-none -translate-y-[50%]">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Day columns */}
          {view === 'week' ? (
            weekDates.map((date, i) => (
              <DayColumn
                key={isoDate(date)}
                date={date}
                entries={entriesByDate[isoDate(date)] ?? []}
                dayIndex={i}
                onEntryClick={handleEntryClick}
                dayView={false}
              />
            ))
          ) : (
            <DayColumn
              key={isoDate(dayViewDate)}
              date={dayViewDate}
              entries={dayViewEntries}
              dayIndex={selectedDayIndex}
              onEntryClick={handleEntryClick}
              dayView={true}
            />
          )}
        </div>
      </div>
      )}
    </div>
  );
}
