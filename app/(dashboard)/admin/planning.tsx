'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
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
  behandeling: '#2d9e47',
  workshop: '#7c3aed',
  diagnostiek: '#e68a00',
  evaluatie: '#2577b5',
  intake: '#dc4323',
  reserved: '#78716c',
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

// System/non-therapist accounts to exclude from the therapist dropdown
const SYSTEM_ACCOUNTS = new Set([
  'Admin A', 'Workshops W', 'ADHD A', 'Intake I',
  'RB Intake RB', 'Planning P', 'Dekker F',
]);

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

interface StatsData {
  totalEntries: number;
  period: string;
  byType: Record<string, { count: number; avgDuration: number; withClient: number }>;
}

function StatsBar({ stats }: { stats: StatsData }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3 bg-surface border-b border-border">
      <span className="font-mono text-[0.68rem] text-text-muted uppercase tracking-wide">
        {stats.totalEntries} afspraken · {stats.period}
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
  locations: AgendaLocation[];
  selectedLocations: Set<string>;
  onToggle: (loc: string) => void;
}

function LocationFilter({ locations: rawLocations, selectedLocations, onToggle }: LocationFilterProps) {
  const locations = rawLocations ?? [];
  const allLocNames = locations.map((l) => l.name);
  const hasFilter = selectedLocations.size < allLocNames.length && selectedLocations.size > 0;
  // group by type
  const physical = locations.filter((l) => l.type === 'physical');
  const online = locations.filter((l) => l.type === 'online');
  const other = locations.filter((l) => l.type === 'home' || l.type === 'phone');

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

function TherapistFilter({ allTherapists = [], selectedTherapists, onToggle }: TherapistFilterProps) {
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
    borderLeft: `4px solid ${color}`,
    borderTop: isOpen ? `1px dashed ${color}` : `1px solid transparent`,
    borderRight: isOpen ? `1px dashed ${color}` : '1px solid transparent',
    borderBottom: isOpen ? `1px dashed ${color}` : `1px solid transparent`,
    backgroundColor: isOpen
      ? `${color}18`
      : `${color}20`,
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
  // --- Data state (fetched from API, fallback to mock) ---
  const [allEntries, setAllEntries] = useState<AgendaEntry[]>(mockAgendaEntries);
  const [locations, setLocations] = useState<AgendaLocation[]>(mockLocations);
  const [stats, setStats] = useState<StatsData>({
    totalEntries: mockAgendaStats.totalEntries,
    period: mockAgendaStats.period.replace(' to ', ' – '),
    byType: mockAgendaStats.byType,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState<'mock' | 'live'>('mock');
  const [showWeekends, setShowWeekends] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('moods-planning-weekends') === 'true';
  });

  useEffect(() => { localStorage.setItem('moods-planning-weekends', String(showWeekends)); }, [showWeekends]);

  const allTherapists = useMemo(
    () => Array.from(new Set(allEntries.map((e) => e.therapistName)))
      .filter((name) => !SYSTEM_ACCOUNTS.has(name))
      .sort(),
    [allEntries]
  );

  // --- View state (persisted to localStorage) ---
  const [view, setView] = useState<'maand' | 'week' | 'dag'>(() => {
    if (typeof window === 'undefined') return 'maand';
    return (localStorage.getItem('moods-planning-view') as 'maand' | 'week' | 'dag') ?? 'maand';
  });
  const monthParam = searchParams.get('month'); // e.g. "2026-06"
  const [calMonth, setCalMonth] = useState(() => {
    // URL param takes priority (from forecast card click)
    if (monthParam) {
      const [y, m] = monthParam.split('-').map(Number);
      if (y && m) return { year: y, month: m - 1 };
    }
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('moods-planning-month');
        if (saved) return JSON.parse(saved) as { year: number; month: number };
      } catch {}
    }
    const n = new Date(); return { year: n.getFullYear(), month: n.getMonth() };
  });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [drawerTimeFilter, setDrawerTimeFilter] = useState<'alle' | 'ochtend' | 'middag' | 'avond'>('alle');
  const [weekStart, setWeekStart] = useState<Date>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('moods-planning-week');
        if (saved) return new Date(saved);
      } catch {}
    }
    return DEFAULT_WEEK_START;
  });
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // Persist view state
  useEffect(() => { localStorage.setItem('moods-planning-view', view); }, [view]);
  useEffect(() => { localStorage.setItem('moods-planning-month', JSON.stringify(calMonth)); }, [calMonth]);
  useEffect(() => { localStorage.setItem('moods-planning-week', weekStart.toISOString()); }, [weekStart]);

  // --- Filter state (persisted to localStorage) ---
  const [activeTypes, setActiveTypes] = useState<Set<AgendaActivityType>>(() => {
    if (typeof window === 'undefined') return new Set(ALL_TYPES);
    try {
      const saved = localStorage.getItem('moods-planning-types');
      if (saved) return new Set(JSON.parse(saved) as AgendaActivityType[]);
    } catch {}
    return new Set(ALL_TYPES);
  });
  const [activeLocations, setActiveLocations] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set(mockLocations.map((l: AgendaLocation) => l.name));
    try {
      const saved = localStorage.getItem('moods-planning-locations');
      if (saved) return new Set(JSON.parse(saved) as string[]);
    } catch {}
    return new Set(mockLocations.map((l: AgendaLocation) => l.name));
  });
  const [activeTherapists, setActiveTherapists] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set(allTherapists);
    try {
      const saved = localStorage.getItem('moods-planning-therapists');
      if (saved) return new Set(JSON.parse(saved) as string[]);
    } catch {}
    return new Set(allTherapists);
  });

  // Persist filters to localStorage
  useEffect(() => {
    localStorage.setItem('moods-planning-types', JSON.stringify(Array.from(activeTypes)));
  }, [activeTypes]);
  useEffect(() => {
    localStorage.setItem('moods-planning-locations', JSON.stringify(Array.from(activeLocations)));
  }, [activeLocations]);
  useEffect(() => {
    localStorage.setItem('moods-planning-therapists', JSON.stringify(Array.from(activeTherapists)));
  }, [activeTherapists]);

  // --- Fetch data from API when date range changes ---
  const dateRange = useMemo(() => {
    if (view === 'maand') {
      const start = `${calMonth.year}-${String(calMonth.month + 1).padStart(2, '0')}-01`;
      const lastDay = new Date(calMonth.year, calMonth.month + 1, 0).getDate();
      const end = `${calMonth.year}-${String(calMonth.month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      return { start, end };
    }
    const start = isoDate(weekStart);
    const endDate = new Date(weekStart);
    endDate.setDate(endDate.getDate() + 6);
    return { start, end: isoDate(endDate) };
  }, [view, calMonth, weekStart]);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    fetch(`/api/agenda/entries?start=${dateRange.start}&end=${dateRange.end}&limit=2000`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        if (data.entries?.length > 0) {
          setAllEntries(data.entries);
          setDataSource(data.mock ? 'mock' : 'live');
          // Update therapist filter with new data
          const newTherapists = Array.from(new Set(data.entries.map((e: AgendaEntry) => e.therapistName))).sort() as string[];
          setActiveTherapists(new Set(newTherapists));
        } else {
          // No data from API for this range — keep existing
          setDataSource('mock');
        }
      })
      .catch(() => {
        // API unreachable, keep mock data
        setDataSource('mock');
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [dateRange.start, dateRange.end]);

  // --- Fetch locations once on mount ---
  useEffect(() => {
    fetch('/api/agenda/locations')
      .then((r) => r.json())
      .then((data) => {
        if (data.locations?.length > 0) {
          setLocations(data.locations);
          setActiveLocations(new Set(data.locations.map((l: AgendaLocation) => l.name)));
        }
      })
      .catch(() => { /* keep mock locations */ });
  }, []);

  // --- Fetch stats when date range changes ---
  useEffect(() => {
    fetch(`/api/agenda/stats?start=${dateRange.start}&end=${dateRange.end}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.totalEntries != null) {
          setStats({
            totalEntries: data.totalEntries,
            period: `${dateRange.start} – ${dateRange.end}`,
            byType: data.byType ?? {},
          });
        }
      })
      .catch(() => { /* keep current stats */ });
  }, [dateRange.start, dateRange.end]);

  // --- Derived: is any filter active ---
  const hasActiveFilters = useMemo(
    () =>
      activeTypes.size < ALL_TYPES.length ||
      activeLocations.size < locations.length ||
      activeTherapists.size < allTherapists.length,
    [activeTypes, activeLocations, activeTherapists, allTherapists, locations]
  );

  // --- Filter toggle handlers ---
  const toggleType = useCallback((type: AgendaActivityType) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }, []);

  const toggleLocation = useCallback((loc: string) => {
    setActiveLocations((prev) => {
      const next = new Set(prev);
      if (next.has(loc)) next.delete(loc);
      else next.add(loc);
      return next;
    });
  }, []);

  const toggleTherapist = useCallback((name: string) => {
    setActiveTherapists((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setActiveTypes(new Set(ALL_TYPES));
    setActiveLocations(new Set(locations.map((l) => l.name)));
    setActiveTherapists(new Set(allTherapists));
    localStorage.removeItem('moods-planning-types');
    localStorage.removeItem('moods-planning-locations');
    localStorage.removeItem('moods-planning-therapists');
  }, [allTherapists, locations]);

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
      allEntries.filter(
        (e) =>
          activeTypes.has(e.activityType) &&
          activeTherapists.has(e.therapistName) &&
          // Location matching: check if entry location contains any selected location name
          Array.from(activeLocations).some((loc) =>
            e.location.toLowerCase().includes(loc.toLowerCase()) ||
            loc.toLowerCase().includes(e.location.toLowerCase())
          )
      ),
    [activeTypes, activeTherapists, activeLocations, allEntries]
  );

  // Counts per activity type (from all entries, ignoring type filter)
  const activityCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const t of ALL_TYPES) c[t] = 0;
    for (const e of allEntries) c[e.activityType] = (c[e.activityType] ?? 0) + 1;
    return c as Record<AgendaActivityType, number>;
  }, [allEntries]);

  // --- Entries grouped by date ---
  const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart]);

  const entriesByDate = useMemo(() => {
    const map: Record<string, AgendaEntry[]> = {};
    for (const entry of filteredEntries) {
      if (!map[entry.date]) map[entry.date] = [];
      map[entry.date].push(entry);
    }
    return map;
  }, [filteredEntries]);

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
      {view !== 'maand' && <StatsBar stats={stats} />}

      {/* (data source shown inline in filter row) */}

      {/* Toolbar — single row */}
      <div className="flex items-center gap-2 px-5 py-3 bg-paper border-b border-border">
        <ActivityFilter selected={activeTypes} onChange={toggleType} counts={activityCounts} />
        <LocationFilter locations={locations} selectedLocations={activeLocations} onToggle={toggleLocation} />
        <TherapistFilter allTherapists={allTherapists} selectedTherapists={activeTherapists} onToggle={toggleTherapist} />

        {hasActiveFilters && (
          <button onClick={clearFilters} className="font-mono text-[0.6rem] text-warm underline cursor-pointer hover:text-text transition-colors">Wissen</button>
        )}

        <div className="flex-1" />

        {/* Navigation */}
        <button
          onClick={view === 'maand' ? () => setCalMonth((m) => m.month === 0 ? { year: m.year - 1, month: 11 } : { ...m, month: m.month - 1 }) : goToPrevWeek}
          className="w-7 h-7 border border-border flex items-center justify-center text-text-muted font-mono text-sm cursor-pointer hover:bg-surface-hover transition-colors"
        >←</button>
        <span className="font-display text-sm text-text min-w-[140px] text-center">
          {view === 'maand' ? `${MONTH_NAMES[calMonth.month]} ${calMonth.year}` : formatWeekLabel(weekStart)}
        </span>
        <button
          onClick={view === 'maand' ? () => setCalMonth((m) => m.month === 11 ? { year: m.year + 1, month: 0 } : { ...m, month: m.month + 1 }) : goToNextWeek}
          className="w-7 h-7 border border-border flex items-center justify-center text-text-muted font-mono text-sm cursor-pointer hover:bg-surface-hover transition-colors"
        >→</button>
        <button
          onClick={() => { const n = new Date(); setCalMonth({ year: n.getFullYear(), month: n.getMonth() }); setWeekStart(DEFAULT_WEEK_START); }}
          className="font-mono text-[0.65rem] text-text-muted border border-border px-2.5 py-1 uppercase tracking-wide cursor-pointer hover:bg-text hover:text-paper transition-colors"
        >Vandaag</button>

        <div className="w-px h-5 bg-border-subtle mx-1" />

        {/* Weekend toggle */}
        <button
          onClick={() => setShowWeekends((v) => !v)}
          className={`font-mono text-[0.65rem] uppercase tracking-wide px-3 py-1.5 border border-border cursor-pointer transition-colors ${showWeekends ? 'bg-text text-paper' : 'bg-paper text-text-muted hover:bg-surface-hover'}`}
        >Za/Zo</button>

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

            <div className={`grid ${showWeekends ? 'grid-cols-7' : 'grid-cols-5'}`}>
              {(showWeekends ? MONTH_DAY_HEADERS : MONTH_DAY_HEADERS.slice(0, 5)).map((d) => (
                <div key={d} className="font-mono text-[0.7rem] text-text-muted uppercase tracking-wider text-center py-2.5">{d}</div>
              ))}
              {grid.map((gd, i) => {
                const colIndex = i % 7;
                if (!showWeekends && colIndex >= 5) return null;
                const dk = gd.current ? `${calMonth.year}-${String(calMonth.month + 1).padStart(2, '0')}-${String(gd.day).padStart(2, '0')}` : null;
                const dayEntries = dk ? (entriesByDate[dk] ?? []) : [];
                const isToday = dk === todayKey;
                const isSelected = dk === selectedDay;
                return (
                  <div
                    key={i}
                    className={[
                      'min-h-[130px] p-2 overflow-hidden transition-colors bg-surface',
                      gd.current ? 'border-t border-border-subtle/60 cursor-pointer hover:bg-surface-hover' : 'opacity-40',
                      isSelected ? 'ring-1 ring-warm/40 ring-inset' : '',
                    ].join(' ')}
                    onClick={() => gd.current && dk && setSelectedDay(selectedDay === dk ? null : dk)}
                  >
                    <span className={`inline-flex items-center justify-center font-mono text-xs mb-1.5 ${gd.current && isToday ? 'bg-warm text-paper font-bold w-6 h-6 rounded-full' : gd.current ? 'text-text' : 'text-text'}`}>{gd.day}</span>
                    {dayEntries.slice(0, 3).map((ev, j) => (
                      <div key={j} className="flex gap-1 items-baseline py-0.5 pl-2 mb-0.5 border-l-4 rounded-r-sm" style={{ borderLeftColor: ACTIVITY_COLORS[ev.activityType], backgroundColor: `${ACTIVITY_COLORS[ev.activityType]}12` }}>
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
                  <div className="px-6 py-4 border-b border-border-subtle">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-display text-lg text-text capitalize">
                        {new Date(selectedDay + 'T00:00').toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </h3>
                      <button className="font-mono text-xs text-text-muted border border-border px-3 py-1 uppercase tracking-wide hover:bg-text hover:text-paper transition-colors cursor-pointer" onClick={() => setSelectedDay(null)}>Sluiten</button>
                    </div>
                    <div className="flex gap-1">
                      {([['alle', 'Alle'], ['ochtend', '08:00–12:00'], ['middag', '12:00–17:00'], ['avond', '17:00+']] as const).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => setDrawerTimeFilter(key)}
                          className={`font-mono text-[0.6rem] uppercase tracking-wide px-2.5 py-1 border cursor-pointer transition-colors ${drawerTimeFilter === key ? 'bg-text text-paper border-text' : 'border-border text-text-muted hover:bg-surface-hover'}`}
                        >{label}</button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-3">
                    {entriesByDate[selectedDay]
                      .filter((entry) => {
                        if (drawerTimeFilter === 'alle') return true;
                        const mins = parseInt(entry.startTime.split(':')[0]) * 60 + parseInt(entry.startTime.split(':')[1]);
                        if (drawerTimeFilter === 'ochtend') return mins < 720;
                        if (drawerTimeFilter === 'middag') return mins >= 720 && mins < 1020;
                        return mins >= 1020; // 17:00+
                      })
                      .map((entry) => (
                      <div
                        key={entry.id}
                        className="border-l-4 rounded-r-sm p-4 cursor-pointer hover:brightness-95 transition-all"
                        style={{ borderLeftColor: ACTIVITY_COLORS[entry.activityType], borderLeftStyle: entry.clientName ? 'solid' : 'dashed', backgroundColor: `${ACTIVITY_COLORS[entry.activityType]}12` }}
                        onClick={() => console.log('Clicked:', entry.id)}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: ACTIVITY_COLORS[entry.activityType] }} />
                          <span className="font-mono text-[0.8rem] text-text-muted">{entry.startTime} – {entry.endTime}</span>
                          <span className="font-mono text-[0.65rem] text-text-faint">({entry.duration} min)</span>
                          <span className="font-mono text-[0.7rem] font-semibold ml-auto" style={{ color: ACTIVITY_COLORS[entry.activityType] }}>{ACTIVITY_LABELS[entry.activityType]}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-base text-text font-medium">{entry.therapistName}</span>
                          {entry.status && <span className="font-mono text-[0.6rem] uppercase tracking-wide px-1.5 py-0.5 border border-border text-text-muted">{entry.status}</span>}
                        </div>
                        <div className="font-serif text-[0.95rem] text-text">{entry.clientName ?? 'Beschikbaar'}</div>
                        <div className="font-mono text-[0.75rem] text-text-muted mt-1">{entry.location}</div>
                        {entry.description && <div className="font-serif text-[0.85rem] text-text-muted mt-1 italic">{entry.description}</div>}
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
