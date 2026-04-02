'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import s from './page.module.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  function: string | null;
  isActive: boolean;
  contractType: string | null;
  contractStart: string | null;
  contractEnd: string | null;
  locatie: string | null;
  team: string | null;
  functieCode: string | null;
  doelstellingProcent: number | null;
}

interface HrStats {
  activeEmployees: number;
  inactiveEmployees: number;
  currentlySick: number;
  onLeaveToday: number;
  contractsExpiring90d: number;
}

interface SickEntry {
  firstName: string;
  lastName: string;
  percentage: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function nameHash(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

const AVATAR_COLORS = [
  '#6b8f71', '#8a7196', '#c4924a', '#5a8aaa', '#b85c3a',
  '#7a6e5d', '#5e8c6a', '#9a6b8a', '#b0885a', '#4a7a9a',
];

function avatarColor(firstName: string, lastName: string): string {
  return AVATAR_COLORS[nameHash(firstName + lastName) % AVATAR_COLORS.length];
}

// ---------------------------------------------------------------------------
// KPI Strip
// ---------------------------------------------------------------------------

function KpiStrip({ stats, employees }: { stats: HrStats | null; employees: Employee[] }) {
  const locatieCount = useMemo(
    () => new Set(employees.map((e) => e.locatie).filter(Boolean)).size,
    [employees],
  );
  const teamCount = useMemo(
    () => new Set(employees.map((e) => e.team).filter(Boolean)).size,
    [employees],
  );

  return (
    <div className={`${s.widgetCard} ${s.gridFull}`} style={{ marginBottom: 0 }}>
      <div className={s.kpiRow}>
        <div className={s.kpi}>
          <div className={s.kpiValue}>{stats?.activeEmployees ?? '—'}</div>
          <div className={s.kpiLabel}>Medewerkers</div>
        </div>
        <div className={s.kpi}>
          <div className={s.kpiValue}>{locatieCount || '—'}</div>
          <div className={s.kpiLabel}>Locaties</div>
        </div>
        <div className={s.kpi}>
          <div className={s.kpiValue}>{stats?.currentlySick ?? '—'}</div>
          <div className={s.kpiLabel}>Ziek gemeld</div>
        </div>
        <div className={s.kpi}>
          <div className={s.kpiValue}>{teamCount || '—'}</div>
          <div className={s.kpiLabel}>Teams</div>
        </div>
        <div className={s.kpi}>
          <div className={s.kpiValue}>{stats?.onLeaveToday ?? '—'}</div>
          <div className={s.kpiLabel}>Verlof vandaag</div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Icon Helpers
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

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function TeamTab() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<HrStats | null>(null);
  const [sickNames, setSickNames] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [locatieFilter, setLocatieFilter] = useState<string | null>(null);
  const [teamFilter, setTeamFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>(() => {
    if (typeof window === 'undefined') return 'cards';
    return (localStorage.getItem('moods-team-view') as 'cards' | 'table') ?? 'cards';
  });

  useEffect(() => { localStorage.setItem('moods-team-view', viewMode); }, [viewMode]);

  useEffect(() => {
    Promise.all([
      fetch('/api/hr/employees?active=true').then((r) => r.json()).catch(() => ({ employees: [] })),
      fetch('/api/hr/stats').then((r) => r.json()).catch(() => null),
      fetch('/api/hr/sick-leave').then((r) => r.json()).catch(() => ({ currentlySick: [] })),
    ]).then(([empRes, statsRes, sickRes]) => {
      setEmployees(empRes.employees ?? []);
      if (statsRes && !statsRes.error) setStats(statsRes);
      const names = new Set<string>(
        (sickRes.currentlySick ?? []).map((e: SickEntry) => `${e.firstName} ${e.lastName}`),
      );
      setSickNames(names);
    }).finally(() => setLoading(false));
  }, []);

  const allLocaties = useMemo(
    () => Array.from(new Set(employees.map((e) => e.locatie).filter(Boolean))).sort() as string[],
    [employees],
  );
  const allTeams = useMemo(
    () => Array.from(new Set(employees.map((e) => e.team).filter(Boolean))).sort() as string[],
    [employees],
  );

  const filteredEmployees = useMemo(() => {
    let result = employees;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((e) => `${e.firstName} ${e.lastName}`.toLowerCase().includes(q));
    }
    if (statusFilter === 'active') result = result.filter((e) => e.isActive);
    if (statusFilter === 'inactive') result = result.filter((e) => !e.isActive);
    if (locatieFilter) result = result.filter((e) => e.locatie === locatieFilter);
    if (teamFilter) result = result.filter((e) => e.team === teamFilter);
    return result;
  }, [employees, search, statusFilter, locatieFilter, teamFilter]);

  const hasFilters = search !== '' || statusFilter !== 'all' || locatieFilter !== null || teamFilter !== null;

  const clearFilters = useCallback(() => {
    setSearch('');
    setStatusFilter('all');
    setLocatieFilter(null);
    setTeamFilter(null);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="font-mono text-[0.7rem] text-text-faint animate-pulse">Team laden...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      <KpiStrip stats={stats} employees={employees} />

      {/* Filter bar */}
      <div className="flex items-center gap-2 px-5 py-3 bg-paper border-b border-border flex-wrap">
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Zoeken..."
          className="font-mono text-[0.68rem] px-3 py-1.5 border border-border bg-paper text-text placeholder:text-text-faint outline-none focus:border-text transition-colors w-48"
        />

        {/* Status filter */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className={`font-mono text-[0.68rem] uppercase tracking-wide px-3 py-1.5 border flex items-center gap-2 cursor-pointer transition-colors ${statusFilter !== 'all' ? 'border-warm text-warm bg-surface' : 'border-border text-text-muted bg-paper hover:bg-surface-hover'}`}>
              Status {statusFilter !== 'all' && <span className="text-warm text-[0.6rem]">1</span>}
              <ChevronDown />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="bg-surface border border-border py-1 min-w-[160px] z-50 shadow-sm" sideOffset={4} align="start">
              {(['all', 'active', 'inactive'] as const).map((val) => (
                <DropdownMenu.Item
                  key={val}
                  className="flex items-center gap-2.5 px-3 py-2 cursor-pointer outline-none hover:bg-surface-hover transition-colors"
                  onSelect={(e) => { e.preventDefault(); setStatusFilter(val); }}
                >
                  <span className={`w-4 h-4 border shrink-0 flex items-center justify-center transition-colors ${statusFilter === val ? 'border-text bg-text text-paper' : 'border-border'}`}>
                    {statusFilter === val && <CheckIcon />}
                  </span>
                  <span className="font-serif text-sm text-text">{val === 'all' ? 'Alle' : val === 'active' ? 'Actief' : 'Inactief'}</span>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Locatie filter (hidden if <2 locations) */}
        {allLocaties.length >= 2 && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className={`font-mono text-[0.68rem] uppercase tracking-wide px-3 py-1.5 border flex items-center gap-2 cursor-pointer transition-colors ${locatieFilter ? 'border-warm text-warm bg-surface' : 'border-border text-text-muted bg-paper hover:bg-surface-hover'}`}>
                Locatie {locatieFilter && <span className="text-warm text-[0.6rem]">1</span>}
                <ChevronDown />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-surface border border-border py-1 min-w-[200px] z-50 shadow-sm max-h-64 overflow-y-auto" sideOffset={4} align="start">
                <DropdownMenu.Item
                  className="flex items-center gap-2.5 px-3 py-2 cursor-pointer outline-none hover:bg-surface-hover transition-colors"
                  onSelect={(e) => { e.preventDefault(); setLocatieFilter(null); }}
                >
                  <span className={`w-4 h-4 border shrink-0 flex items-center justify-center transition-colors ${!locatieFilter ? 'border-text bg-text text-paper' : 'border-border'}`}>
                    {!locatieFilter && <CheckIcon />}
                  </span>
                  <span className="font-serif text-sm text-text">Alle locaties</span>
                </DropdownMenu.Item>
                {allLocaties.map((loc) => (
                  <DropdownMenu.Item
                    key={loc}
                    className="flex items-center gap-2.5 px-3 py-2 cursor-pointer outline-none hover:bg-surface-hover transition-colors"
                    onSelect={(e) => { e.preventDefault(); setLocatieFilter(loc); }}
                  >
                    <span className={`w-4 h-4 border shrink-0 flex items-center justify-center transition-colors ${locatieFilter === loc ? 'border-text bg-text text-paper' : 'border-border'}`}>
                      {locatieFilter === loc && <CheckIcon />}
                    </span>
                    <span className="font-serif text-sm text-text truncate max-w-[160px]">{loc}</span>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        )}

        {/* Team filter (hidden if <2 teams) */}
        {allTeams.length >= 2 && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className={`font-mono text-[0.68rem] uppercase tracking-wide px-3 py-1.5 border flex items-center gap-2 cursor-pointer transition-colors ${teamFilter ? 'border-warm text-warm bg-surface' : 'border-border text-text-muted bg-paper hover:bg-surface-hover'}`}>
                Team {teamFilter && <span className="text-warm text-[0.6rem]">1</span>}
                <ChevronDown />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-surface border border-border py-1 min-w-[200px] z-50 shadow-sm max-h-64 overflow-y-auto" sideOffset={4} align="start">
                <DropdownMenu.Item
                  className="flex items-center gap-2.5 px-3 py-2 cursor-pointer outline-none hover:bg-surface-hover transition-colors"
                  onSelect={(e) => { e.preventDefault(); setTeamFilter(null); }}
                >
                  <span className={`w-4 h-4 border shrink-0 flex items-center justify-center transition-colors ${!teamFilter ? 'border-text bg-text text-paper' : 'border-border'}`}>
                    {!teamFilter && <CheckIcon />}
                  </span>
                  <span className="font-serif text-sm text-text">Alle teams</span>
                </DropdownMenu.Item>
                {allTeams.map((t) => (
                  <DropdownMenu.Item
                    key={t}
                    className="flex items-center gap-2.5 px-3 py-2 cursor-pointer outline-none hover:bg-surface-hover transition-colors"
                    onSelect={(e) => { e.preventDefault(); setTeamFilter(t); }}
                  >
                    <span className={`w-4 h-4 border shrink-0 flex items-center justify-center transition-colors ${teamFilter === t ? 'border-text bg-text text-paper' : 'border-border'}`}>
                      {teamFilter === t && <CheckIcon />}
                    </span>
                    <span className="font-serif text-sm text-text truncate max-w-[160px]">{t}</span>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        )}

        {hasFilters && (
          <button onClick={clearFilters} className="font-mono text-[0.6rem] text-warm underline cursor-pointer hover:text-text transition-colors">Wissen</button>
        )}

        <div className="flex-1" />

        {/* View toggle */}
        <div className="flex">
          <button
            onClick={() => setViewMode('cards')}
            className={`font-mono text-[0.65rem] uppercase tracking-wide px-3 py-1.5 border-t border-b border-l border-r border-border cursor-pointer transition-colors ${viewMode === 'cards' ? 'bg-text text-paper' : 'bg-paper text-text-muted hover:bg-surface-hover'}`}
          >Kaarten</button>
          <button
            onClick={() => setViewMode('table')}
            className={`font-mono text-[0.65rem] uppercase tracking-wide px-3 py-1.5 border-t border-b border-r border-border cursor-pointer transition-colors ${viewMode === 'table' ? 'bg-text text-paper' : 'bg-paper text-text-muted hover:bg-surface-hover'}`}
          >Lijst</button>
        </div>
      </div>

      {/* Content area */}
      {filteredEmployees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="font-serif text-sm text-text-faint">Geen medewerkers gevonden</div>
        </div>
      ) : (
        <div className="px-5 py-4 text-center font-mono text-[0.65rem] text-text-faint">
          {filteredEmployees.length} medewerkers — view: {viewMode}
        </div>
      )}
    </div>
  );
}
