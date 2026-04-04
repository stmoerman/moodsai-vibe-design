# Team & Rapportage Tabs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the two remaining placeholder tabs (Team, Rapportage) in the admin dashboard.

**Architecture:** Two new component files (`team.tsx`, `rapportage.tsx`) following the same pattern as `hr-verlof.tsx` — client components that fetch from existing API endpoints, export named components, dynamically imported in `page.tsx`. No new APIs or dependencies.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, Radix UI DropdownMenu (already installed)

**Spec:** `docs/superpowers/specs/2026-04-02-team-rapportage-tabs-design.md`

---

### Task 1: Build TeamTab Component — Data Fetching & KPI Strip

**Files:**
- Create: `app/(dashboard)/admin/team.tsx`

- [ ] **Step 1: Create team.tsx with types and data fetching**

```tsx
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
// Main Component (placeholder render for now — cards/table in next tasks)
// ---------------------------------------------------------------------------

export function TeamTab() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<HrStats | null>(null);
  const [sickNames, setSickNames] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

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
      <div className="px-5 py-12 text-center font-serif text-sm text-text-faint">
        {employees.length} medewerkers geladen
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add app/\(dashboard\)/admin/team.tsx
git commit -m "feat(team): add TeamTab component with data fetching and KPI strip"
```

---

### Task 2: Wire TeamTab into page.tsx

**Files:**
- Modify: `app/(dashboard)/admin/page.tsx`

- [ ] **Step 1: Add dynamic import for TeamTab**

Add after the `HrVerlofTab` dynamic import (around line 60):

```tsx
const TeamTab = dynamic(
  () => import('./team').then((m) => ({ default: m.TeamTab })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-12">
        <span className="font-mono text-[0.7rem] text-text-faint animate-pulse">Team laden...</span>
      </div>
    ),
  },
);
```

- [ ] **Step 2: Replace team placeholder with TeamTab**

Replace:
```tsx
        {/* ════ Team Tab (placeholder) ════ */}
        {activeTab === 'team' && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="font-display text-xl text-text-muted mb-2">Team</div>
            <div className="font-serif text-sm text-text-faint">Binnenkort beschikbaar</div>
          </div>
        )}
```

With:
```tsx
        {/* ════ Team Tab ════ */}
        {activeTab === 'team' && <TeamTab />}
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/\(dashboard\)/admin/page.tsx
git commit -m "feat(team): wire TeamTab into admin dashboard tabs"
```

---

### Task 3: Add Filter Bar and View Toggle to TeamTab

**Files:**
- Modify: `app/(dashboard)/admin/team.tsx`

- [ ] **Step 1: Add filter state and filter bar UI**

Add these state variables inside `TeamTab()`, after the `loading` state:

```tsx
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [locatieFilter, setLocatieFilter] = useState<string | null>(null);
  const [teamFilter, setTeamFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>(() => {
    if (typeof window === 'undefined') return 'cards';
    return (localStorage.getItem('moods-team-view') as 'cards' | 'table') ?? 'cards';
  });

  useEffect(() => { localStorage.setItem('moods-team-view', viewMode); }, [viewMode]);
```

Add derived data after the state declarations:

```tsx
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
```

- [ ] **Step 2: Add CheckIcon and ChevronDown helpers**

Add above the `TeamTab` export (reuse the same pattern from planning.tsx):

```tsx
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
```

- [ ] **Step 3: Replace the placeholder render with filter bar + placeholder content area**

Replace the return statement in `TeamTab` with:

```tsx
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
```

- [ ] **Step 4: Verify it compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add app/\(dashboard\)/admin/team.tsx
git commit -m "feat(team): add filter bar with search, status, locatie, team dropdowns and view toggle"
```

---

### Task 4: Add Card Grid View to TeamTab

**Files:**
- Modify: `app/(dashboard)/admin/team.tsx`

- [ ] **Step 1: Add EmployeeCard component**

Add above the `TeamTab` export:

```tsx
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
      {/* Avatar + Name */}
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

      {/* Details */}
      <div className="flex flex-col gap-0.5 mt-1">
        <div className="font-mono text-[0.65rem] text-text-faint truncate">
          {employee.locatie ?? '—'}
        </div>
        <div className="font-mono text-[0.65rem] text-text-faint truncate">
          {employee.team ?? '—'}
        </div>
      </div>

      {/* Status badge */}
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
```

- [ ] **Step 2: Replace content area placeholder with card grid rendering**

In the `TeamTab` return, replace the content area block (after the filter bar closing `</div>`) with:

```tsx
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
        <div className="px-5 py-4 text-center font-mono text-[0.65rem] text-text-faint">
          Tabel weergave — komt in de volgende stap
        </div>
      )}
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/\(dashboard\)/admin/team.tsx
git commit -m "feat(team): add employee card grid view with avatars, status badges"
```

---

### Task 5: Add Table View to TeamTab

**Files:**
- Modify: `app/(dashboard)/admin/team.tsx`

- [ ] **Step 1: Add sort state and EmployeeTable component**

Add sort state inside `TeamTab`, after the `viewMode` state:

```tsx
  const [sortCol, setSortCol] = useState<'naam' | 'functie' | 'locatie' | 'team' | 'contract'>('naam');
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
```

Add above the `TeamTab` export:

```tsx
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
```

- [ ] **Step 2: Add sort toggle handler inside TeamTab**

```tsx
  const handleSort = useCallback((col: SortCol) => {
    if (col === sortCol) {
      setSortAsc((prev) => !prev);
    } else {
      setSortCol(col);
      setSortAsc(true);
    }
  }, [sortCol]);
```

- [ ] **Step 3: Replace the table placeholder with the actual table**

In the content area, replace the `else` branch (`Tabel weergave — komt in de volgende stap`) with:

```tsx
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
```

- [ ] **Step 4: Verify it compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add app/\(dashboard\)/admin/team.tsx
git commit -m "feat(team): add sortable table view with employee rows and status badges"
```

---

### Task 6: Build RapportageTab Component — KPIs + Period Selector

**Files:**
- Create: `app/(dashboard)/admin/rapportage.tsx`

- [ ] **Step 1: Create rapportage.tsx with types, period logic, and KPI cards**

```tsx
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import s from './page.module.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StatsResponse {
  totalEntries: number;
  byType: Record<string, { count: number; avgDuration: number; withClient: number }>;
  byMonth: { year: number; month: number; total: number; therapists: number }[];
}

interface TherapistEntry {
  name: string;
  entryCount: number;
  activityTypes: string[];
}

// ---------------------------------------------------------------------------
// Activity colors (shared with planning.tsx)
// ---------------------------------------------------------------------------

const ACTIVITY_COLORS: Record<string, string> = {
  behandeling: '#2d9e47',
  workshop: '#7c3aed',
  diagnostiek: '#e68a00',
  evaluatie: '#2577b5',
  intake: '#dc4323',
  reserved: '#78716c',
};

const ACTIVITY_LABELS: Record<string, string> = {
  behandeling: 'Behandeling',
  workshop: 'Workshop',
  diagnostiek: 'Diagnostiek',
  evaluatie: 'Evaluatie',
  intake: 'Intake',
  reserved: 'Gereserveerd',
};

// ---------------------------------------------------------------------------
// Period helpers
// ---------------------------------------------------------------------------

type PeriodType = 'week' | 'maand' | 'kwartaal' | 'jaar';

const PERIOD_LABELS: Record<PeriodType, string> = {
  week: 'Deze week',
  maand: 'Deze maand',
  kwartaal: 'Dit kwartaal',
  jaar: 'Dit jaar',
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];

function getPeriodRange(type: PeriodType, offset: number): { start: string; end: string; label: string } {
  const now = new Date();
  let start: Date;
  let end: Date;
  let label: string;

  switch (type) {
    case 'week': {
      const d = new Date(now);
      d.setDate(d.getDate() + offset * 7);
      const day = d.getDay();
      const monday = new Date(d);
      monday.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
      const friday = new Date(monday);
      friday.setDate(monday.getDate() + 6);
      start = monday;
      end = friday;
      label = `Week ${Math.ceil((monday.getDate() + new Date(monday.getFullYear(), monday.getMonth(), 1).getDay()) / 7)}, ${MONTH_NAMES[monday.getMonth()]} ${monday.getFullYear()}`;
      break;
    }
    case 'maand': {
      const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      start = d;
      end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      label = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
      break;
    }
    case 'kwartaal': {
      const currentQ = Math.floor(now.getMonth() / 3);
      const q = currentQ + offset;
      const year = now.getFullYear() + Math.floor(q / 4);
      const qIdx = ((q % 4) + 4) % 4;
      start = new Date(year, qIdx * 3, 1);
      end = new Date(year, qIdx * 3 + 3, 0);
      label = `Q${qIdx + 1} ${year}`;
      break;
    }
    case 'jaar': {
      const year = now.getFullYear() + offset;
      start = new Date(year, 0, 1);
      end = new Date(year, 11, 31);
      label = `${year}`;
      break;
    }
  }

  const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return { start: fmt(start), end: fmt(end), label };
}

function getChartRange(): { start: string; end: string } {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return { start: fmt(startDate), end: fmt(endDate) };
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function RapportageTab() {
  const [periodType, setPeriodType] = useState<PeriodType>(() => {
    if (typeof window === 'undefined') return 'maand';
    return (localStorage.getItem('moods-rapport-period') as PeriodType) ?? 'maand';
  });
  const [periodOffset, setPeriodOffset] = useState(0);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [chartStats, setChartStats] = useState<StatsResponse | null>(null);
  const [therapists, setTherapists] = useState<TherapistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { localStorage.setItem('moods-rapport-period', periodType); }, [periodType]);

  const period = useMemo(() => getPeriodRange(periodType, periodOffset), [periodType, periodOffset]);
  const chartRange = useMemo(() => getChartRange(), []);

  // Fetch KPI stats + therapists for selected period
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/agenda/stats?start=${period.start}&end=${period.end}`).then((r) => r.json()).catch(() => null),
      fetch(`/api/agenda/therapists?start=${period.start}&end=${period.end}`).then((r) => r.json()).catch(() => ({ therapists: [] })),
    ]).then(([statsRes, thRes]) => {
      if (statsRes && !statsRes.error) setStats(statsRes);
      setTherapists(thRes.therapists ?? []);
    }).finally(() => setLoading(false));
  }, [period.start, period.end]);

  // Fetch chart data (6-month range, once)
  useEffect(() => {
    fetch(`/api/agenda/stats?start=${chartRange.start}&end=${chartRange.end}`)
      .then((r) => r.json())
      .then((data) => { if (data && !data.error) setChartStats(data); })
      .catch(() => {});
  }, [chartRange.start, chartRange.end]);

  // Computed KPIs
  const kpis = useMemo(() => {
    if (!stats) return null;
    const byType = stats.byType ?? {};
    const declarable = (byType.behandeling?.count ?? 0) + (byType.diagnostiek?.count ?? 0);
    const total = stats.totalEntries || 1;
    const declPct = Math.round((declarable / total) * 100);

    let totalDuration = 0;
    let totalCount = 0;
    for (const t of Object.values(byType)) {
      totalDuration += t.avgDuration * t.count;
      totalCount += t.count;
    }
    const avgDuration = totalCount > 0 ? Math.round(totalDuration / totalCount) : 0;

    let withClient = 0;
    for (const t of Object.values(byType)) withClient += t.withClient;

    const therapistCount = stats.byMonth?.length > 0
      ? Math.max(...stats.byMonth.map((m) => m.therapists))
      : 0;

    return { total: stats.totalEntries, declPct, therapistCount, avgDuration, withClient };
  }, [stats]);

  return (
    <div className="flex flex-col gap-0">
      {/* KPI Cards */}
      <div className={`${s.widgetCard} ${s.gridFull}`} style={{ marginBottom: 0 }}>
        <div className={s.kpiRow}>
          <div className={s.kpi}>
            <div className={s.kpiValue}>{loading ? '—' : kpis?.total ?? '—'}</div>
            <div className={s.kpiLabel}>Sessies</div>
          </div>
          <div className={s.kpi}>
            <div className={s.kpiValue}>{loading ? '—' : kpis ? `${kpis.declPct}%` : '—'}</div>
            <div className={s.kpiLabel}>Declarabiliteit</div>
            {kpis && (
              <div className="w-full h-1.5 bg-border mt-1.5 relative">
                <div className="absolute inset-y-0 left-0 bg-[#5a9a60] transition-all" style={{ width: `${Math.min(kpis.declPct, 100)}%` }} />
                <div className="absolute inset-y-0 left-[75%] w-px bg-text/30" title="Target: 75%" />
              </div>
            )}
          </div>
          <div className={s.kpi}>
            <div className={s.kpiValue}>{loading ? '—' : kpis?.therapistCount ?? '—'}</div>
            <div className={s.kpiLabel}>Therapeuten actief</div>
          </div>
          <div className={s.kpi}>
            <div className={s.kpiValue}>{loading ? '—' : kpis ? `${kpis.avgDuration} min` : '—'}</div>
            <div className={s.kpiLabel}>Gem. duur per sessie</div>
          </div>
          <div className={s.kpi}>
            <div className={s.kpiValue}>{loading ? '—' : kpis?.withClient ?? '—'}</div>
            <div className={s.kpiLabel}>Met cliënt</div>
          </div>
        </div>
      </div>

      {/* Period selector */}
      <div className="flex items-center gap-2 px-5 py-3 bg-paper border-b border-border">
        <select
          value={periodType}
          onChange={(e) => { setPeriodType(e.target.value as PeriodType); setPeriodOffset(0); }}
          className="font-mono text-[0.68rem] uppercase tracking-wide px-3 py-1.5 border border-border bg-paper text-text-muted cursor-pointer outline-none"
        >
          {(Object.keys(PERIOD_LABELS) as PeriodType[]).map((p) => (
            <option key={p} value={p}>{PERIOD_LABELS[p]}</option>
          ))}
        </select>

        <button
          onClick={() => setPeriodOffset((o) => o - 1)}
          className="w-7 h-7 border border-border flex items-center justify-center text-text-muted font-mono text-sm cursor-pointer hover:bg-surface-hover transition-colors"
        >←</button>
        <span className="font-display text-sm text-text min-w-[120px] text-center">{period.label}</span>
        <button
          onClick={() => setPeriodOffset((o) => o + 1)}
          className="w-7 h-7 border border-border flex items-center justify-center text-text-muted font-mono text-sm cursor-pointer hover:bg-surface-hover transition-colors"
        >→</button>
        <button
          onClick={() => setPeriodOffset(0)}
          className="font-mono text-[0.65rem] text-text-muted border border-border px-2.5 py-1 uppercase tracking-wide cursor-pointer hover:bg-text hover:text-paper transition-colors"
        >Nu</button>
      </div>

      {/* Chart placeholder — next task */}
      <div className="px-5 py-8 text-center font-mono text-[0.65rem] text-text-faint">
        Grafiek komt in de volgende stap
      </div>

      {/* Top therapists placeholder — task after chart */}
      <div className="px-5 py-4 text-center font-mono text-[0.65rem] text-text-faint">
        Top therapeuten tabel komt hierna
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add app/\(dashboard\)/admin/rapportage.tsx
git commit -m "feat(rapportage): add RapportageTab with KPI cards and period selector"
```

---

### Task 7: Wire RapportageTab into page.tsx

**Files:**
- Modify: `app/(dashboard)/admin/page.tsx`

- [ ] **Step 1: Add dynamic import for RapportageTab**

Add after the `TeamTab` dynamic import:

```tsx
const RapportageTab = dynamic(
  () => import('./rapportage').then((m) => ({ default: m.RapportageTab })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-12">
        <span className="font-mono text-[0.7rem] text-text-faint animate-pulse">Rapportage laden...</span>
      </div>
    ),
  },
);
```

- [ ] **Step 2: Replace rapportage placeholder with RapportageTab**

Replace:
```tsx
        {/* ════ Rapportage Tab (placeholder) ════ */}
        {activeTab === 'rapportage' && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="font-display text-xl text-text-muted mb-2">Rapportage</div>
            <div className="font-serif text-sm text-text-faint">Binnenkort beschikbaar</div>
          </div>
        )}
```

With:
```tsx
        {/* ════ Rapportage Tab ════ */}
        {activeTab === 'rapportage' && <RapportageTab />}
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/\(dashboard\)/admin/page.tsx
git commit -m "feat(rapportage): wire RapportageTab into admin dashboard tabs"
```

---

### Task 8: Add CSS Bar Chart to RapportageTab

**Files:**
- Modify: `app/(dashboard)/admin/rapportage.tsx`

- [ ] **Step 1: Add BarChart component**

Add above the `RapportageTab` export:

```tsx
const CHART_TYPES = ['behandeling', 'intake', 'diagnostiek', 'workshop', 'evaluatie', 'reserved'] as const;

function MonthlyChart({ data }: { data: StatsResponse | null }) {
  if (!data?.byMonth || data.byMonth.length === 0) {
    return (
      <div className="px-5 py-12 text-center font-serif text-sm text-text-faint">
        Geen data beschikbaar voor grafiek
      </div>
    );
  }

  // Build per-month breakdown from byType (we only have totals per month, so show total bars)
  const months = data.byMonth.sort((a, b) => a.year - b.year || a.month - b.month);
  const maxTotal = Math.max(...months.map((m) => m.total), 1);
  const chartHeight = 200;

  return (
    <div className="px-5 py-6">
      <div className="font-mono text-[0.65rem] text-text-muted uppercase tracking-wide mb-4">Sessies per maand</div>

      {/* Bars */}
      <div className="flex items-end gap-2" style={{ height: `${chartHeight}px` }}>
        {months.map((m) => {
          const pct = (m.total / maxTotal) * 100;
          return (
            <div key={`${m.year}-${m.month}`} className="flex-1 flex flex-col items-center gap-1">
              <span className="font-mono text-[0.6rem] text-text-muted">{m.total}</span>
              <div className="w-full relative" style={{ height: `${(pct / 100) * (chartHeight - 30)}px`, minHeight: '4px' }}>
                <div
                  className="absolute inset-0 transition-all"
                  style={{ backgroundColor: ACTIVITY_COLORS.behandeling, opacity: 0.85 }}
                />
              </div>
              <span className="font-mono text-[0.6rem] text-text-faint">{MONTH_NAMES[m.month - 1]}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 flex-wrap">
        {CHART_TYPES.map((type) => {
          const count = data.byType?.[type]?.count ?? 0;
          if (count === 0) return null;
          return (
            <div key={type} className="flex items-center gap-1.5">
              <span className="w-2 h-2 shrink-0" style={{ background: ACTIVITY_COLORS[type] }} />
              <span className="font-mono text-[0.6rem] text-text-muted">{ACTIVITY_LABELS[type]} <span className="text-text font-medium">{count}</span></span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Replace chart placeholder with MonthlyChart**

Replace:
```tsx
      {/* Chart placeholder — next task */}
      <div className="px-5 py-8 text-center font-mono text-[0.65rem] text-text-faint">
        Grafiek komt in de volgende stap
      </div>
```

With:
```tsx
      {/* Monthly trend chart */}
      <MonthlyChart data={chartStats} />
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/\(dashboard\)/admin/rapportage.tsx
git commit -m "feat(rapportage): add CSS-only monthly bar chart with activity breakdown"
```

---

### Task 9: Add Top Therapeuten Table to RapportageTab

**Files:**
- Modify: `app/(dashboard)/admin/rapportage.tsx`

- [ ] **Step 1: Add TopTherapists component**

Add above the `RapportageTab` export:

```tsx
function TopTherapists({ therapists }: { therapists: TherapistEntry[] }) {
  if (therapists.length === 0) {
    return (
      <div className="px-5 py-8 text-center font-serif text-sm text-text-faint">
        Geen therapeuten in deze periode
      </div>
    );
  }

  const top5 = therapists.slice(0, 5);

  return (
    <div className="px-5 pb-6">
      <div className="font-mono text-[0.65rem] text-text-muted uppercase tracking-wide mb-3">Top therapeuten</div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="font-mono text-[0.6rem] uppercase tracking-wider text-text-muted text-left py-2 px-2">Therapeut</th>
            <th className="font-mono text-[0.6rem] uppercase tracking-wider text-text-muted text-left py-2 px-2">Sessies</th>
            <th className="font-mono text-[0.6rem] uppercase tracking-wider text-text-muted text-left py-2 px-2">Activiteiten</th>
          </tr>
        </thead>
        <tbody>
          {top5.map((t) => (
            <tr key={t.name} className="border-b border-border-subtle/60 hover:bg-surface-hover transition-colors">
              <td className="py-2.5 px-2 font-serif text-[0.9rem] text-text font-medium">{t.name}</td>
              <td className="py-2.5 px-2 font-mono text-[0.75rem] text-text">{t.entryCount}</td>
              <td className="py-2.5 px-2">
                <div className="flex gap-1 flex-wrap">
                  {t.activityTypes.map((at) => (
                    <span
                      key={at}
                      className="font-mono text-[0.55rem] uppercase tracking-wide px-1.5 py-0.5 border"
                      style={{ borderColor: ACTIVITY_COLORS[at] ?? '#999', color: ACTIVITY_COLORS[at] ?? '#999' }}
                    >
                      {ACTIVITY_LABELS[at] ?? at}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: Replace therapists placeholder with TopTherapists**

Replace:
```tsx
      {/* Top therapists placeholder — task after chart */}
      <div className="px-5 py-4 text-center font-mono text-[0.65rem] text-text-faint">
        Top therapeuten tabel komt hierna
      </div>
```

With:
```tsx
      {/* Top therapists */}
      <TopTherapists therapists={therapists} />
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/\(dashboard\)/admin/rapportage.tsx
git commit -m "feat(rapportage): add top 5 therapists table with activity type badges"
```

---

### Task 10: Final Verification

**Files:** None (verification only)

- [ ] **Step 1: Type-check entire project**

Run: `npx tsc --noEmit --pretty 2>&1 | head -30`
Expected: no errors

- [ ] **Step 2: Verify all 5 admin tabs render**

Run: `npx next dev` and check:
1. `/admin` — Overzicht tab loads with widgets
2. `/admin?tab=planning` — Planning calendar loads
3. `/admin?tab=team` — Team tab shows KPIs, filters, card grid
4. `/admin?tab=hr` — HR & Verlof tab loads
5. `/admin?tab=rapportage` — Rapportage tab shows KPIs, period selector, chart, table

- [ ] **Step 3: Verify Team tab view toggle**

On Team tab:
1. Click "Lijst" — switches to table view with sortable columns
2. Click "Kaarten" — switches back to card grid
3. Refresh page — view mode persists (localStorage)

- [ ] **Step 4: Verify Rapportage period navigation**

On Rapportage tab:
1. Change dropdown to "Dit kwartaal" — KPIs and table update
2. Click ← arrow — moves to previous quarter
3. Click "Nu" — resets to current period
4. Refresh — period type persists

- [ ] **Step 5: Commit all remaining changes**

```bash
git add -A
git status
git commit -m "feat: complete admin dashboard — all 5 tabs functional (overzicht, planning, team, hr, rapportage)"
```
