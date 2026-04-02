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
// Employee Card
// ---------------------------------------------------------------------------

interface EmployeeCardProps {
  employee: Employee;
  isSick: boolean;
  onClick: () => void;
}

function EmployeeCard({ employee, isSick, onClick }: EmployeeCardProps) {
  const initials = getInitials(employee.firstName, employee.lastName);
  const color = avatarColor(employee.firstName, employee.lastName);
  const status = isSick ? 'sick' : employee.isActive ? 'active' : 'inactive';

  return (
    <div
      onClick={onClick}
      className="bg-surface border border-border p-4 cursor-pointer hover:bg-surface-hover transition-colors flex flex-col gap-2"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-paper font-mono text-[0.7rem] font-bold shrink-0"
          style={{ backgroundColor: color }}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <div className="font-serif text-[0.95rem] text-text font-medium truncate">
            {employee.firstName} {employee.lastName}
          </div>
          <div className="font-mono text-[0.65rem] text-text-muted uppercase tracking-wide truncate">
            {employee.function ?? '—'}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-0.5 mt-1">
        <div className="font-mono text-[0.65rem] text-text-faint truncate">
          {employee.locatie ?? '—'}
        </div>
        <div className="font-mono text-[0.65rem] text-text-faint truncate">
          {employee.team ?? '—'}
        </div>
      </div>
      <div className="mt-auto pt-2">
        <span className={`font-mono text-[0.6rem] uppercase tracking-wide px-2 py-0.5 border inline-block ${
          status === 'sick'
            ? 'border-[#c47050] text-[#c47050] bg-[#c47050]/5'
            : status === 'active'
              ? 'border-[#5a9a60] text-[#5a9a60] bg-[#5a9a60]/5'
              : 'border-border text-text-faint bg-surface'
        }`}>
          {status === 'sick' ? 'Ziek' : status === 'active' ? 'Actief' : 'Inactief'}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Table Sort Header
// ---------------------------------------------------------------------------

type SortCol = 'naam' | 'functie' | 'locatie' | 'team' | 'contract';

function SortHeader({ label, col, activeCol, asc, onSort }: {
  label: string; col: SortCol; activeCol: SortCol; asc: boolean; onSort: (col: SortCol) => void;
}) {
  const isActive = col === activeCol;
  return (
    <th
      className="font-mono text-[0.6rem] uppercase tracking-wider text-text-muted text-left py-2.5 px-3 cursor-pointer hover:text-text transition-colors select-none whitespace-nowrap"
      onClick={() => onSort(col)}
    >
      {label} {isActive ? (asc ? '↑' : '↓') : ''}
    </th>
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

  const [sortCol, setSortCol] = useState<SortCol>('naam');
  const [sortAsc, setSortAsc] = useState(true);

  const sortedEmployees = useMemo(() => {
    const sorted = [...filteredEmployees];
    sorted.sort((a, b) => {
      let aVal = '';
      let bVal = '';
      switch (sortCol) {
        case 'naam': aVal = `${a.lastName} ${a.firstName}`; bVal = `${b.lastName} ${b.firstName}`; break;
        case 'functie': aVal = a.function ?? ''; bVal = b.function ?? ''; break;
        case 'locatie': aVal = a.locatie ?? ''; bVal = b.locatie ?? ''; break;
        case 'team': aVal = a.team ?? ''; bVal = b.team ?? ''; break;
        case 'contract': aVal = a.contractType ?? ''; bVal = b.contractType ?? ''; break;
      }
      const cmp = aVal.localeCompare(bVal, 'nl');
      return sortAsc ? cmp : -cmp;
    });
    return sorted;
  }, [filteredEmployees, sortCol, sortAsc]);

  const handleSort = useCallback((col: SortCol) => {
    if (col === sortCol) {
      setSortAsc((prev) => !prev);
    } else {
      setSortCol(col);
      setSortAsc(true);
    }
  }, [sortCol]);

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
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-5">
          {filteredEmployees.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              isSick={sickNames.has(`${emp.firstName} ${emp.lastName}`)}
              onClick={() => console.log('Clicked employee:', emp.id)}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-surface sticky top-0">
              <tr>
                <SortHeader label="Naam" col="naam" activeCol={sortCol} asc={sortAsc} onSort={handleSort} />
                <SortHeader label="Functie" col="functie" activeCol={sortCol} asc={sortAsc} onSort={handleSort} />
                <SortHeader label="Locatie" col="locatie" activeCol={sortCol} asc={sortAsc} onSort={handleSort} />
                <SortHeader label="Team" col="team" activeCol={sortCol} asc={sortAsc} onSort={handleSort} />
                <th className="font-mono text-[0.6rem] uppercase tracking-wider text-text-muted text-left py-2.5 px-3">Status</th>
                <SortHeader label="Contract" col="contract" activeCol={sortCol} asc={sortAsc} onSort={handleSort} />
              </tr>
            </thead>
            <tbody>
              {sortedEmployees.map((emp) => {
                const isSick = sickNames.has(`${emp.firstName} ${emp.lastName}`);
                const status = isSick ? 'sick' : emp.isActive ? 'active' : 'inactive';
                return (
                  <tr
                    key={emp.id}
                    className="border-b border-border-subtle/60 hover:bg-surface-hover transition-colors cursor-pointer"
                    onClick={() => console.log('Clicked employee:', emp.id)}
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-paper font-mono text-[0.55rem] font-bold shrink-0"
                          style={{ backgroundColor: avatarColor(emp.firstName, emp.lastName) }}
                        >
                          {getInitials(emp.firstName, emp.lastName)}
                        </div>
                        <span className="font-serif text-[0.9rem] text-text font-medium">{emp.firstName} {emp.lastName}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[0.7rem] text-text-muted">{emp.function ?? '—'}</td>
                    <td className="py-2.5 px-3 font-mono text-[0.7rem] text-text-muted">{emp.locatie ?? '—'}</td>
                    <td className="py-2.5 px-3 font-mono text-[0.7rem] text-text-muted">{emp.team ?? '—'}</td>
                    <td className="py-2.5 px-3">
                      <span className={`font-mono text-[0.6rem] uppercase tracking-wide px-2 py-0.5 border inline-block ${
                        status === 'sick'
                          ? 'border-[#c47050] text-[#c47050] bg-[#c47050]/5'
                          : status === 'active'
                            ? 'border-[#5a9a60] text-[#5a9a60] bg-[#5a9a60]/5'
                            : 'border-border text-text-faint bg-surface'
                      }`}>
                        {status === 'sick' ? 'Ziek' : status === 'active' ? 'Actief' : 'Inactief'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[0.7rem] text-text-muted">{emp.contractType ?? '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
